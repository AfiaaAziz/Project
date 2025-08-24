import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { campaign_id, photo_ids, amount, donor_email, donor_name, stripe_payment_id } = await req.json()

    // Create donation record
    const { data: donation, error: donationError } = await supabaseClient
      .from('donations')
      .insert({
        campaign_id,
        photo_ids,
        amount,
        donor_email,
        donor_name,
        stripe_payment_id
      })
      .select()
      .single()

    if (donationError) {
      throw donationError
    }

    return new Response(
      JSON.stringify({ donation }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})