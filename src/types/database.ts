export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          role: 'photographer' | 'organizer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'photographer' | 'organizer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'photographer' | 'organizer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          title: string;
          description: string;
          cause_type: string | null;
          charity_name: string | null;
          event_date: string | null;
          goal_amount: number;
          raised_amount: number;
          photo_count: number;
          photographer_id: string | null;
          organizer_id: string;
          visibility: 'public' | 'private';
          status: 'draft' | 'active' | 'completed' | 'paused';
          photo_price: number;
          platform_fee: number;
          photographer_fee: number;
          charity_fee: number;
          fundraiser_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          cause_type?: string | null;
          charity_name?: string | null;
          event_date?: string | null;
          goal_amount?: number;
          raised_amount?: number;
          photo_count?: number;
          photographer_id?: string | null;
          organizer_id: string;
          visibility?: 'public' | 'private';
          status?: 'draft' | 'active' | 'completed' | 'paused';
          photo_price?: number;
          platform_fee?: number;
          photographer_fee?: number;
          charity_fee?: number;
          fundraiser_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          cause_type?: string | null;
          charity_name?: string | null;
          event_date?: string | null;
          goal_amount?: number;
          raised_amount?: number;
          photo_count?: number;
          photographer_id?: string | null;
          organizer_id?: string;
          visibility?: 'public' | 'private';
          status?: 'draft' | 'active' | 'completed' | 'paused';
          photo_price?: number;
          platform_fee?: number;
          photographer_fee?: number;
          charity_fee?: number;
          fundraiser_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          campaign_id: string;
          donor_email: string;
          donor_name: string | null;
          amount: number;
          stripe_payment_id: string | null;
          photo_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          donor_email: string;
          donor_name?: string | null;
          amount: number;
          stripe_payment_id?: string | null;
          photo_ids?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          donor_email?: string;
          donor_name?: string | null;
          amount?: number;
          stripe_payment_id?: string | null;
          photo_ids?: string[];
          created_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          campaign_id: string;
          url: string;
          thumbnail_url: string | null;
          watermark_url: string | null;
          filename: string;
          file_size: number;
          width: number;
          height: number;
          uploaded_by: string;
          moderation_status: 'pending' | 'approved' | 'rejected';
          tags: string[];
          bib_number: string | null;
          upload_date: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          url: string;
          thumbnail_url?: string | null;
          watermark_url?: string | null;
          filename: string;
          file_size?: number;
          width?: number;
          height?: number;
          uploaded_by: string;
          moderation_status?: 'pending' | 'approved' | 'rejected';
          tags?: string[];
          bib_number?: string | null;
          upload_date?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          url?: string;
          thumbnail_url?: string | null;
          watermark_url?: string | null;
          filename?: string;
          file_size?: number;
          width?: number;
          height?: number;
          uploaded_by?: string;
          moderation_status?: 'pending' | 'approved' | 'rejected';
          tags?: string[];
          bib_number?: string | null;
          upload_date?: string;
        };
      };
    };
  };
}