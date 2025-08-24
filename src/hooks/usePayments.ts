import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPaymentIntent, DonationData } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    queryClient.invalidateQueries({ queryKey: ['donations'] });
    queryClient.invalidateQueries({ queryKey: ['recent-donations'] });
    queryClient.invalidateQueries({ queryKey: ['user-campaigns'] });
    queryClient.invalidateQueries({ queryKey: ['campaign-donations'] });
  };

  const processPayment = async (paymentData: DonationData) => {
    try {
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        throw new Error('Please connect to Supabase first to enable payments');
      }

      
      const paymentIntent = await createPaymentIntent(paymentData);

      invalidateQueries();
      return { success: true, paymentIntent };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment failed');
      return { success: false, error: error.message };
    }
  };

  return {
    processPayment,
    invalidateQueries,
  };
};

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (paymentData: DonationData) => {
      
      if (!paymentData.campaignId || !paymentData.amount || !paymentData.donorEmail) {
        throw new Error('Missing required payment information');
      }

      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(paymentData.campaignId)) {
        throw new Error('Invalid campaign ID format');
      }

      return await createPaymentIntent(paymentData);
    },
    onError: (error: any) => {
      console.error('Payment intent creation failed:', error);
      toast.error(error.message || 'Failed to initialize payment');
    },
  });
};