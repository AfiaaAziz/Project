import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Donation } from '../types';
import toast from 'react-hot-toast';

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donationData: Partial<Donation>) => {
      const { data, error } = await supabase
        .from('donations')
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.campaign_id] });
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Thank you for your donation!');
    },
    onError: () => {
      toast.error('Failed to process donation');
    },
  });
};

export const useCampaignDonations = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-donations', campaignId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Donation[];

      } catch (error) {
        console.error('Campaign donations error:', error);
        return [];
      }
    },
    enabled: !!campaignId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useRecentDonations = (limit = 10) => {
  return useQuery({
    queryKey: ['recent-donations', limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            campaigns(title, id)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data;

      } catch (error) {
        console.error('Recent donations error:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};