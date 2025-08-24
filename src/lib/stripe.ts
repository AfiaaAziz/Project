import { loadStripe, Stripe } from '@stripe/stripe-js';


const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('Stripe publishable key is missing. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

const stripePromise = loadStripe(stripePublishableKey || '');

export { stripePromise };

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface DonationData {
  campaignId: string;
  amount: number;
  donorEmail: string;
  donorName?: string;
  photoIds?: string[];
}

export const createPaymentIntent = async (donationData: DonationData): Promise<PaymentIntent> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please connect to Supabase first.');
  }

  if (supabaseUrl.includes('placeholder')) {
    throw new Error('Please connect to Supabase to enable payments');
  }

  if (!donationData.campaignId || !donationData.amount || !donationData.donorEmail) {
    throw new Error('Missing required payment information');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(donationData.donorEmail)) {
    throw new Error('Please enter a valid email address');
  }

  if (donationData.amount <= 0) {
    throw new Error('Payment amount must be greater than $0');
  }

  if (donationData.amount > 10000) {
    throw new Error('Payment amount cannot exceed $10,000');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify(donationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment intent');
  }

  return response.json();
};

export const confirmPayment = async (
  stripe: Stripe,
  clientSecret: string,
  paymentMethod: any
) => {
  return await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  });
};