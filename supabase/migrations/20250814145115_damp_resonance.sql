/*
  # Create GoodPix Database Schema

  1. New Tables
    - `profiles` 
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `role` (text) - photographer, organizer, admin
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `campaigns`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cause_type` (text)
      - `charity_name` (text)
      - `event_date` (date)
      - `goal_amount` (numeric)
      - `raised_amount` (numeric, default 0)
      - `photo_count` (integer, default 0)
      - `photographer_id` (uuid, references profiles)
      - `organizer_id` (uuid, references profiles)
      - `visibility` (text, default 'public')
      - `status` (text, default 'draft')
      - `photo_price` (numeric, default 10.00)
      - `platform_fee` (numeric, default 7.00)
      - `photographer_fee` (numeric, default 50.00)
      - `charity_fee` (numeric, default 43.00)
      - `fundraiser_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `photos`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references campaigns)
      - `url` (text)
      - `thumbnail_url` (text)
      - `watermark_url` (text)
      - `filename` (text)
      - `file_size` (bigint)
      - `width` (integer)
      - `height` (integer)
      - `uploaded_by` (uuid, references profiles)
      - `moderation_status` (text, default 'pending')
      - `tags` (text[])
      - `bib_number` (text)
      - `upload_date` (timestamp)

    - `donations`
      - `id` (uuid, primary key)  
      - `campaign_id` (uuid, references campaigns)
      - `donor_email` (text)
      - `donor_name` (text)
      - `amount` (numeric)
      - `stripe_payment_id` (text)
      - `photo_ids` (text[])
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to public campaigns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'organizer' CHECK (role IN ('photographer', 'organizer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  cause_type text,
  charity_name text,
  event_date date,
  goal_amount numeric DEFAULT 0,
  raised_amount numeric DEFAULT 0,
  photo_count integer DEFAULT 0,
  photographer_id uuid REFERENCES profiles(id),
  organizer_id uuid REFERENCES profiles(id) NOT NULL,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  photo_price numeric DEFAULT 10.00,
  platform_fee numeric DEFAULT 7.00,
  photographer_fee numeric DEFAULT 50.00,
  charity_fee numeric DEFAULT 43.00,
  fundraiser_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  watermark_url text,
  filename text NOT NULL,
  file_size bigint DEFAULT 0,
  width integer DEFAULT 0,
  height integer DEFAULT 0,
  uploaded_by uuid REFERENCES profiles(id) NOT NULL,
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  tags text[] DEFAULT '{}',
  bib_number text,
  upload_date timestamptz DEFAULT now()
);

-- Create donations table  
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  donor_email text NOT NULL,
  donor_name text,
  amount numeric NOT NULL,
  stripe_payment_id text UNIQUE,
  photo_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Anyone can read public campaigns"
  ON campaigns
  FOR SELECT
  TO public
  USING (visibility = 'public' AND status = 'active');

CREATE POLICY "Authenticated users can read all campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create campaigns"
  ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id OR auth.uid() = photographer_id);

-- Photos policies
CREATE POLICY "Anyone can read approved photos from public campaigns"
  ON photos
  FOR SELECT
  TO public
  USING (
    moderation_status = 'approved' AND
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = photos.campaign_id 
      AND campaigns.visibility = 'public' 
      AND campaigns.status = 'active'
    )
  );

CREATE POLICY "Authenticated users can read photos from their campaigns"
  ON photos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = photos.campaign_id 
      AND (campaigns.organizer_id = auth.uid() OR campaigns.photographer_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload photos to their campaigns"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = photos.campaign_id 
      AND (campaigns.organizer_id = auth.uid() OR campaigns.photographer_id = auth.uid())
    )
  );

-- Donations policies
CREATE POLICY "Authenticated users can read donations for their campaigns"
  ON donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = donations.campaign_id 
      AND (campaigns.organizer_id = auth.uid() OR campaigns.photographer_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can create donations"
  ON donations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_visibility ON campaigns(visibility);
CREATE INDEX IF NOT EXISTS idx_campaigns_organizer ON campaigns(organizer_id);
CREATE INDEX IF NOT EXISTS idx_photos_campaign ON photos(campaign_id);
CREATE INDEX IF NOT EXISTS idx_photos_moderation ON photos(moderation_status);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'role', 'organizer')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update campaign raised amount
CREATE OR REPLACE FUNCTION update_campaign_raised_amount()
RETURNS trigger AS $$
BEGIN
  UPDATE campaigns 
  SET raised_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM donations 
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to automatically update raised amount
DROP TRIGGER IF EXISTS on_donation_created ON donations;
CREATE TRIGGER on_donation_created
  AFTER INSERT ON donations
  FOR EACH ROW EXECUTE FUNCTION update_campaign_raised_amount();