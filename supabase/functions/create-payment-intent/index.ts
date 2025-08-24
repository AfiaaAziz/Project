import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { campaignId, amount, donorEmail, donorName, photoIds } = await req.json();

    if (!campaignId || !amount || !donorEmail) {
      throw new Error('Missing required payment data');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      throw new Error('Invalid campaign ID format');
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('Stripe is not configured. Please set up your Stripe keys.');
    }

    // Initialize Stripe with live account
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });

    const supabaseClient = createClient(
  Deno.env.get('PROJECT_URL') ?? '',
  Deno.env.get('SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } } // <-- YEH OPTION ADD KAREIN
);

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('id, title, status')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active');
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        campaignId,
        donorEmail,
        donorName: donorName || '',
        photoIds: JSON.stringify(photoIds || []),
      },
      description: `Donation to campaign: ${campaign.title}`,
      receipt_email: donorEmail,
    });

    // Store payment intent in database
    const { error: paymentError } = await supabaseClient
      .from('payment_intents')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        campaign_id: campaignId,
        amount: amount,
        currency: 'usd',
        status: paymentIntent.status,
        donor_email: donorEmail,
        donor_name: donorName || null,
        photo_ids: photoIds || [],
      });

    if (paymentError) {
      console.error('Error storing payment intent:', paymentError);
      throw paymentError;
    }

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});