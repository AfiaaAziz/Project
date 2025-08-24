
index.ts
export interface Campaign {
  id: string;
  title: string;
  photographer_name: string; // <-- ADD THIS LINE
  description: string;
  cause_type: string;
  charity_name?: string;
  event_date: string;
  goal_amount: number;
  raised_amount: number;
  photo_count: number;
  photos: Photo[];
  photographer_id: string;
  organizer_id: string;
  visibility: 'public' | 'private';
  status: 'draft' | 'active' | 'completed';
  photo_price: number;
  platform_fee: number;
  photographer_fee: number;
  charity_fee: number;
  created_at: string;
  updated_at: string;
  fundraiser_url?: string;

}

export interface Photo {
  id: string;
  campaign_id: string;
  url: string;
  thumbnail_url: string;
  watermark_url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  uploaded_by: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  bib_number?: string;
  upload_date: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'photographer' | 'organizer' | 'admin';
  created_at: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_email: string;
  donor_name?: string;
  amount: number;
  stripe_payment_id: string;
  photo_ids: string[];
  created_at: string;
}

export interface CartItem {
  photo_id: string;
  photo_url: string;
  campaign_id: string;
  campaign_title: string;
  price: number;
}