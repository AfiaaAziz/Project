
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
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL'); 
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); 

    if (!stripeSecretKey || !supabaseUrl || !serviceRoleKey) {
      throw new Error('One or more environment variables are not set in Supabase secrets.');
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('id, title, status')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or Supabase connection failed.');
    }

    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        campaignId,
        donorEmail,
        donorName: donorName || '',
        photoIds: JSON.stringify(photoIds || []),
      },
      description: `Donation to campaign: ${campaign.title}`,
      receipt_email: donorEmail,
    });

    await supabaseClient
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

    return new Response(
      JSON.stringify({ client_secret: paymentIntent.client_secret }),
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