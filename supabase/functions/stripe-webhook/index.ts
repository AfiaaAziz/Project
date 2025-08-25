
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); 
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY || !STRIPE_WEBHOOK_SECRET) {
  console.error("CRITICAL ERROR: Missing one or more required environment variables in Supabase Edge Function Secrets.");
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
    const supabaseClient = createClient(SUPABASE_URL || '', SERVICE_ROLE_KEY || '', { auth: { persistSession: false } });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature!, STRIPE_WEBHOOK_SECRET || '');
      console.log("Webhook event constructed successfully:", event.type);
    } catch (err) {
      console.error(`Webhook signature verification failed.`, err.message);
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { campaignId, donorEmail, donorName, photoIds } = paymentIntent.metadata;

      console.log(`Processing successful payment: ${paymentIntent.id} for campaign: ${campaignId}`);

      if (!campaignId) {
        throw new Error("Missing campaignId in payment intent metadata.");
      }

      const donationData = {
        campaign_id: campaignId,
        donor_email: donorEmail,
        donor_name: donorName || null,
        amount: paymentIntent.amount / 100,
        stripe_payment_id: paymentIntent.id,
        photo_ids: photoIds ? JSON.parse(photoIds) : [],
      };

      console.log("Attempting to insert donation:", donationData);

      const { data, error: donationError } = await supabaseClient
        .from('donations')
        .insert([donationData])
        .select();

      if (donationError) {
        console.error('DATABASE ERROR creating donation:', donationError);
        throw donationError;
      }

      console.log('SUCCESS: Payment succeeded and donation recorded:', data);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('FATAL WEBHOOK ERROR:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});