// Stripe Checkout Session Creator
// Implements [API s7] -- create-checkout-session with 21-day trial

import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TIER_PRICE_MAP: Record<string, string> = {
  awareness: Deno.env.get("STRIPE_PRICE_AWARENESS") || "",
  foundation: Deno.env.get("STRIPE_PRICE_FOUNDATION") || "",
  guided: Deno.env.get("STRIPE_PRICE_GUIDED") || "",
  restoration: Deno.env.get("STRIPE_PRICE_RESTORATION") || "",
  integration: Deno.env.get("STRIPE_PRICE_INTEGRATION") || "",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { subscriber_id, tier, success_url, cancel_url } = await req.json();

    if (!subscriber_id || !tier) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "VALIDATION_ERROR", message: "subscriber_id and tier are required" },
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const priceId = TIER_PRICE_MAP[tier];
    if (!priceId) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "INVALID_TIER", message: `No price configured for tier: ${tier}` },
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: sub } = await supabase
      .from("subscribers")
      .select("email, stripe_customer_id")
      .eq("id", subscriber_id)
      .single();

    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: sub?.email,
        metadata: { subscriber_id },
      });
      customerId = customer.id;

      await supabase
        .from("subscribers")
        .update({ stripe_customer_id: customerId })
        .eq("id", subscriber_id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 21,
        metadata: { subscriber_id, tier },
      },
      success_url: success_url || `${req.headers.get("origin")}/portal?checkout=success`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/portal/coaching?checkout=cancelled`,
      metadata: { subscriber_id, tier },
    });

    return new Response(
      JSON.stringify({ data: { session_id: session.id, url: session.url } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Checkout session error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "CHECKOUT_FAILED", message: "Failed to create checkout session" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
