/*
  # Add campaign authorization functions

  1. Functions
    - can_user_donate_to_campaign: Prevents users from funding their own campaigns
    - validate_campaign_update: Ensures only authorized users can update campaigns
    - check_campaign_completion: Automatically marks campaigns as completed when goal is reached
    - update_campaign_raised_amount: Updates campaign totals when donations are made

  2. Triggers
    - Validation triggers for campaign updates
    - Automatic campaign completion checking
    - Real-time campaign statistics updates
*/

-- Function to check if user can donate to campaign
CREATE OR REPLACE FUNCTION can_user_donate_to_campaign(campaign_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is the organizer or photographer of the campaign
  RETURN NOT EXISTS (
    SELECT 1 FROM campaigns 
    WHERE id = campaign_uuid 
    AND (organizer_id = user_uuid OR photographer_id = user_uuid)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate campaign updates
CREATE OR REPLACE FUNCTION validate_campaign_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow organizer or photographer to update campaign
  IF NOT (
    NEW.organizer_id = auth.uid() OR 
    NEW.photographer_id = auth.uid() OR
    OLD.organizer_id = auth.uid() OR 
    OLD.photographer_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only campaign organizer or photographer can update this campaign';
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check campaign completion
CREATE OR REPLACE FUNCTION check_campaign_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If goal is reached and campaign is active, mark as completed
  IF NEW.goal_amount > 0 AND NEW.raised_amount >= NEW.goal_amount AND NEW.status = 'active' THEN
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update campaign raised amount
CREATE OR REPLACE FUNCTION update_campaign_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the campaign's raised amount
  UPDATE campaigns 
  SET raised_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM donations 
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS validate_campaign_update_trigger ON campaigns;
CREATE TRIGGER validate_campaign_update_trigger
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION validate_campaign_update();

DROP TRIGGER IF EXISTS on_campaign_goal_reached ON campaigns;
CREATE TRIGGER on_campaign_goal_reached
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  WHEN (OLD.raised_amount IS DISTINCT FROM NEW.raised_amount)
  EXECUTE FUNCTION check_campaign_completion();

DROP TRIGGER IF EXISTS on_donation_created ON donations;
CREATE TRIGGER on_donation_created
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_raised_amount();