
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Campaign } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
export const useCampaigns = (filters?: {
  category?: string;
  search?: string;
  status?: string;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('campaigns')
          .select(
            `*, organizer: profiles!campaigns_organizer_id_fkey(id, full_name, avatar_url, role), photographer: profiles!campaigns_photographer_id_fkey(id, full_name, avatar_url, role), photos(id, url, thumbnail_url, moderation_status, tags, bib_number), donations(id, amount, donor_name, created_at)
            `);

        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        } else {
          query = query.eq('status', 'active').eq('visibility', 'public');
        }

        if (filters?.category && filters.category !== 'all') {
          query = query.eq('cause_type', filters.category);
        }

        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,charity_name.ilike.%${filters.search}%`);
        }

        if (filters?.userId) {
          query = query.eq('organizer_id', filters.userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(campaign => ({
          ...campaign,
          photo_count: campaign.photos?.filter(p => p.moderation_status === 'approved').length || 0,
          total_donations: campaign.donations?.reduce((sum, d) => sum + d.amount, 0) || 0,
          donor_count: campaign.donations?.length || 0,
        })) as Campaign[];

      } catch (error) {
        console.error('Database error:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error('Campaign ID is required');
      
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select(`
        *,
        organizer:profiles!campaigns_organizer_id_fkey(id, full_name, avatar_url, role),
        photographer:profiles!campaigns_photographer_id_fkey(id, full_name, avatar_url, role),
        photos(id, url, thumbnail_url, watermark_url, filename, tags, bib_number, moderation_status, upload_date),
        donations(id, amount, donor_name, donor_email, created_at, photo_ids),
        comments(id, content, is_update, created_at, user:profiles(full_name, avatar_url)),
        location
      `)
          .eq('id', id)
          .single();

        if (error) throw error;

        return {
          ...data,
          photos: data.photos || [],
          photo_count: data.photos?.filter(p => p.moderation_status === 'approved').length || 0,
          total_donations: data.donations?.reduce((sum, d) => sum + d.amount, 0) || 0,
          donor_count: data.donations?.length || 0,
        } as Campaign;

      } catch (error) {
        console.error('Campaign fetch error:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (campaignData: Partial<Campaign>) => {
      console.log('useCampaigns mutationFn called with:', campaignData);
      
      if (!user) throw new Error('User must be authenticated');


      const { photos, ...cleanCampaignData } = campaignData;

      const finalData = {
        ...cleanCampaignData,
        organizer_id: user.id,
        raised_amount: 0,
        photo_count: 0,
      };

      console.log('Inserting campaign data:', finalData);

      const { data, error } = await supabase
        .from('campaigns')
        .insert([finalData])
        .select(`
      *,
      organizer:profiles!campaigns_organizer_id_fkey(id, full_name, avatar_url, role)
    `)
        .single();

      if (error) {
        console.error('Campaign creation error:', error);
        throw error;
      }

      console.log('Campaign created:', data);


      if (photos && photos.length > 0) {
        console.log('Creating photo records for:', photos);

        const photoRecords = photos.map((photoUrl: string) => ({
          campaign_id: data.id,
          url: photoUrl,
          thumbnail_url: photoUrl,
          filename: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
          uploaded_by: user.id,
          moderation_status: 'approved' as const,
        }));

        const { error: photoError } = await supabase
          .from('photos')
          .insert(photoRecords);

        if (photoError) {
          console.error('Error uploading photos:', photoError);
        } else {
          await supabase
            .from('campaigns')
            .update({ photo_count: photos.length })
            .eq('id', data.id);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['user-campaigns'] });
      toast.success('Campaign created successfully!');
    },
    onError: (error: any) => {
      console.error('Campaign creation error:', error);
      toast.error(error.message || 'Failed to create campaign');
    },
  });
};
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Campaign> & { id: string }) => {
      const { id, ...updateData } = updates;
    
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['user-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
      toast.success('Campaign updated successfully!');
    },
    onError: (error: any) => {
      console.error('Campaign update error:', error);
      toast.error(error.message || 'Failed to update campaign');
    },
  });
};
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);
    
      if (error) throw error;
      return campaignId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['user-campaigns', user.id] });
      }

      toast.success('Campaign created successfully!');
    },
    onError: (error: any) => {
      console.error('Campaign deletion error:', error);
      toast.error(error.message || 'Failed to delete campaign');
    },
  });
};
export const useUserCampaigns = (userId?: string) => {
  return useQuery({
    queryKey: ['user-campaigns', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('useUserCampaigns hook ko User ID mili:', userId);
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select(
            `*, page_views, organizer: profiles!campaigns_organizer_id_fkey(id, full_name, avatar_url, role), photographer: profiles!campaigns_photographer_id_fkey(id, full_name, avatar_url, role), photos(id, moderation_status), donations(id, amount, created_at, donor_name)
            `)
          .eq('organizer_id', userId)
          .order('created_at', { ascending: false });
        console.log('Supabase se data wapis aaya:', data);
        console.log('Supabase se error wapis aaya:', error);

        if (error) throw error;

        return (data || []).map(campaign => ({
          ...campaign,
          photo_count: campaign.photos?.filter(p => p.moderation_status === 'approved').length || 0,
          total_donations: campaign.donations?.reduce((sum, d) => sum + d.amount, 0) || 0,
          donor_count: campaign.donations?.length || 0,
        })) as Campaign[];

      } catch (error) {
        console.error('User campaigns error:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      campaignId,
      content,
    }: {
      campaignId: string;
      content: string;
    }) => {
      if (!user) throw new Error("You must be logged in to comment.");
      if (!content.trim()) throw new Error("Comment cannot be empty.");
    
      const newComment = {
        campaign_id: campaignId,
        user_id: user.id,
        content: content.trim(),
      };

      const { data, error } = await supabase
        .from("comments")
        .insert(newComment)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {

      queryClient.invalidateQueries({ queryKey: ["campaign", data.campaign_id] });
      toast.success("Comment posted!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to post comment.");
    },
  });
};
