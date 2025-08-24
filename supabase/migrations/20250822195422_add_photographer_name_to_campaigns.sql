-- Add a new text column to the campaigns table to store the photographer's name
ALTER TABLE public.campaigns
ADD COLUMN photographer_name TEXT;