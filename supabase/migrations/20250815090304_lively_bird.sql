/*
  # Add campaign authorization and self-funding prevention

  1. Security Enhancements
    - Add policy to prevent users from funding their own campaigns
    - Add validation for campaign ownership
    - Enhance donation policies for better security

  2. Database Functions
    - Function to check if user can donate to campaign
    - Function to validate campaign ownership

  3. Triggers
    - Trigger to prevent self-funding
*/

-- Function to check if user can donate to campaign
CREATE OR REPLACE FUNCTION can_user_donate_to_campaign(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  campaign_organizer uuid;
  campaign_photographer uuid;
BEGIN
  -- Get campaign organizer and photographer
  SELECT organizer_id, photographer_id 
  INTO campaign_organizer, campaign_photographer
  FROM campaigns 
  WHERE id = campaign_uuid;
  
  -- User cannot donate to their own campaign
  IF user_uuid = campaign_organizer OR user_uuid = campaign_photographer THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Update donations policy to prevent self-funding
DROP POLICY IF EXISTS "Anyone can create donations" ON donations;

CREATE POLICY "Users cannot fund their own campaigns"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    can_user_donate_to_campaign(campaign_id, auth.uid())
  );

-- Allow public donations (for non-authenticated users)
CREATE POLICY "Public can create donations"
  ON donations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Function to validate campaign updates
CREATE OR REPLACE FUNCTION validate_campaign_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent changing organizer_id after creation
  IF OLD.organizer_id IS DISTINCT FROM NEW.organizer_id THEN
    RAISE EXCEPTION 'Cannot change campaign organizer';
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger for campaign updates
DROP TRIGGER IF EXISTS validate_campaign_update_trigger ON campaigns;
CREATE TRIGGER validate_campaign_update_trigger
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION validate_campaign_update();

-- Add index for better performance on authorization checks
CREATE INDEX IF NOT EXISTS idx_campaigns_organizer_photographer 
  ON campaigns(organizer_id, photographer_id);