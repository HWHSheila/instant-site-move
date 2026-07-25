// Stripe Billing Portal Session Creator
// Implements [API s7] -- create-portal-session for subscription management

import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireOwnSubscriber, authErrorResponse } from "../_shared/clerk-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    const { subscriber_id: claimedId, return_url } = await req.json();

    let caller;
    try {
      caller = await requireOwnSubscriber(req, supabase, claimedId);
    } catch (err) {
      const denied = authErrorResponse(err, corsHeaders);
      if (denied) return denied;
      throw err;
    }

    const { data: sub } = await supabase
      .from("subscribers")
      .select("stripe_customer_id")
      .eq("id", caller.id)
      .single();

    if (!sub?.stripe_customer_id) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "NO_CUSTOMER", message: "No Stripe customer found for this subscriber" },
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: return_url || `${req.headers.get("origin")}/portal/account`,
    });

    return new Response(
      JSON.stringify({ data: { url: session.url } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Portal session error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "PORTAL_SESSION_FAILED", message: "Failed to create billing portal session" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
