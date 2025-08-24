/*
  # Populate categories table with initial data

  1. Categories
    - Insert predefined categories for campaign organization
    - Each category has name, description, and icon
  
  2. Security
    - Public read access for all users
    - No insert/update permissions for regular users
*/

-- Insert initial categories
INSERT INTO categories (name, description, icon) VALUES
  ('Animal Welfare', 'Supporting animals in need and wildlife conservation', '🐾'),
  ('Education', 'Educational initiatives, scholarships, and learning programs', '📚'),
  ('Health & Medical', 'Medical research, healthcare, and wellness initiatives', '🏥'),
  ('Environment', 'Environmental conservation and sustainability projects', '🌱'),
  ('Community Development', 'Local community projects and neighborhood improvements', '🏘️'),
  ('Arts & Culture', 'Arts, culture, and creative expression initiatives', '🎨'),
  ('Sports & Recreation', 'Sports teams, recreational activities, and fitness programs', '⚽'),
  ('Emergency Relief', 'Disaster response and emergency assistance programs', '🚨'),
  ('Youth Programs', 'Programs and activities for children and young adults', '👶'),
  ('Senior Care', 'Support and care for elderly community members', '👴'),
  ('Technology', 'Technology education and digital literacy programs', '💻'),
  ('Food Security', 'Food banks, nutrition programs, and hunger relief', '🍽️')
ON CONFLICT (name) DO NOTHING;