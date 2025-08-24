/*
  # Complete GoodPix Fundraising Platform Schema

  1. New Tables
    - `profiles` - User profiles with roles
    - `campaigns` - Fundraising campaigns
    - `photos` - Campaign photos with moderation
    - `donations` - Donation records with Stripe integration
    - `categories` - Campaign categories
    - `comments` - Campaign comments/updates

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Secure payment processing integration

  3. Real-time Features
    - Triggers for automatic updates
    - Functions for campaign statistics
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
  ('Animal Welfare', 'Supporting animal rescue and welfare organizations', 'heart'),
  ('Education', 'Educational programs and scholarships', 'book-open'),
  ('Health & Medical', 'Medical research and healthcare initiatives', 'heart-pulse'),
  ('Environment', 'Environmental conservation and sustainability', 'leaf'),
  ('Community Development', 'Local community improvement projects', 'users'),
  ('Arts & Culture', 'Supporting arts, culture, and creative programs', 'palette'),
  ('Sports & Recreation', 'Sports programs and recreational activities', 'trophy'),
  ('Emergency Relief', 'Disaster relief and emergency assistance', 'shield'),
  ('Children & Youth', 'Programs supporting children and young people', 'baby'),
  ('Senior Citizens', 'Programs supporting elderly community members', 'user-check')
ON CONFLICT (name) DO NOTHING;

-- Create comments table for campaign updates
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_update boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create payment_intents table for tracking Stripe payments
CREATE TABLE IF NOT EXISTS payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id text UNIQUE NOT NULL,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL,
  donor_email text NOT NULL,
  donor_name text,
  photo_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Comments policies
CREATE POLICY "Anyone can read comments on public campaigns"
  ON comments
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = comments.campaign_id 
      AND campaigns.visibility = 'public'
    )
  );

CREATE POLICY "Authenticated users can read comments on their campaigns"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = comments.campaign_id 
      AND (campaigns.organizer_id = auth.uid() OR campaigns.photographer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create comments on campaigns they have access to"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = comments.campaign_id 
      AND (
        campaigns.visibility = 'public' OR 
        campaigns.organizer_id = auth.uid() OR 
        campaigns.photographer_id = auth.uid()
      )
    )
  );

-- Payment intents policies
CREATE POLICY "Users can read their own payment intents"
  ON payment_intents
  FOR SELECT
  TO authenticated
  USING (donor_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service role can manage payment intents"
  ON payment_intents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to calculate campaign statistics
CREATE OR REPLACE FUNCTION calculate_campaign_stats(campaign_uuid uuid)
RETURNS json AS $$
DECLARE
  stats json;
BEGIN
  SELECT json_build_object(
    'total_raised', COALESCE(SUM(d.amount), 0),
    'donor_count', COUNT(DISTINCT d.donor_email),
    'recent_donations', json_agg(
      json_build_object(
        'amount', d.amount,
        'donor_name', d.donor_name,
        'created_at', d.created_at
      ) ORDER BY d.created_at DESC
    ) FILTER (WHERE d.created_at >= NOW() - INTERVAL '7 days')
  )
  INTO stats
  FROM donations d
  WHERE d.campaign_id = campaign_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending campaigns
CREATE OR REPLACE FUNCTION get_trending_campaigns(limit_count integer DEFAULT 10)
RETURNS TABLE (
  campaign_id uuid,
  title text,
  raised_amount numeric,
  goal_amount numeric,
  recent_donations_count bigint,
  trend_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.raised_amount,
    c.goal_amount,
    COUNT(d.id) FILTER (WHERE d.created_at >= NOW() - INTERVAL '7 days') as recent_donations_count,
    (
      COUNT(d.id) FILTER (WHERE d.created_at >= NOW() - INTERVAL '7 days') * 0.4 +
      COALESCE(c.raised_amount / NULLIF(c.goal_amount, 0), 0) * 0.6
    ) as trend_score
  FROM campaigns c
  LEFT JOIN donations d ON c.id = d.campaign_id
  WHERE c.status = 'active' AND c.visibility = 'public'
  GROUP BY c.id, c.title, c.raised_amount, c.goal_amount
  ORDER BY trend_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_campaign_created ON donations(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status_visibility ON campaigns(status, visibility);
CREATE INDEX IF NOT EXISTS idx_photos_campaign_moderation ON photos(campaign_id, moderation_status);
CREATE INDEX IF NOT EXISTS idx_comments_campaign_created ON comments(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_intents_stripe_id ON payment_intents(stripe_payment_intent_id);

-- Function to update campaign raised amount (enhanced)
CREATE OR REPLACE FUNCTION update_campaign_raised_amount()
RETURNS trigger AS $$
BEGIN
  UPDATE campaigns 
  SET 
    raised_amount = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM donations 
      WHERE campaign_id = NEW.campaign_id
    ),
    updated_at = now()
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Enhanced trigger for donation updates
DROP TRIGGER IF EXISTS on_donation_created ON donations;
CREATE TRIGGER on_donation_created
  AFTER INSERT ON donations
  FOR EACH ROW EXECUTE FUNCTION update_campaign_raised_amount();

-- Function to handle campaign completion
CREATE OR REPLACE FUNCTION check_campaign_completion()
RETURNS trigger AS $$
BEGIN
  -- Check if campaign has reached its goal
  IF NEW.goal_amount > 0 AND NEW.raised_amount >= NEW.goal_amount THEN
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to automatically complete campaigns when goal is reached
DROP TRIGGER IF EXISTS on_campaign_goal_reached ON campaigns;
CREATE TRIGGER on_campaign_goal_reached
  BEFORE UPDATE ON campaigns
  FOR EACH ROW 
  WHEN (OLD.raised_amount IS DISTINCT FROM NEW.raised_amount)
  EXECUTE FUNCTION check_campaign_completion();