// --- YEH SAHI CODE HAI functions/stripe-webhook/index.ts KE LIYE ---

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-06-20',
    });

    const supabaseClient = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature!,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { campaignId, donorEmail, donorName, photoIds } = paymentIntent.metadata;

        console.log('Processing successful payment:', paymentIntent.id);

        // Create donation record
        const { error: donationError } = await supabaseClient
          .from('donations')
          .insert([
            {
              campaign_id: campaignId,
              donor_email: donorEmail,
              donor_name: donorName || null,
              amount: paymentIntent.amount / 100, // Convert from cents
              stripe_payment_id: paymentIntent.id,
              photo_ids: photoIds ? JSON.parse(photoIds) : [],
            },
          ]);

        if (donationError) {
          console.error('Error creating donation:', donationError);
          throw donationError;
        }

        console.log('Payment succeeded and donation recorded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});