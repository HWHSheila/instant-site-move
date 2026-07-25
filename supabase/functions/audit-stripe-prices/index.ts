// One-shot price audit for Batch 1. Returns amount + nickname for each
// configured STRIPE_PRICE_* secret. No secret values are returned.
import Stripe from "npm:stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EXPECTED: Record<string, { cents: number; label: string }> = {
  awareness: { cents: 900, label: "Awareness $9" },
  foundation: { cents: 2900, label: "Foundation $29" },
  guided: { cents: 6900, label: "Guided $69" },
  restoration: { cents: 11900, label: "Restoration $119" },
  integration: { cents: 29900, label: "Integration $299" },
};

const ENV_KEYS: Record<string, string> = {
  awareness: "STRIPE_PRICE_AWARENESS",
  foundation: "STRIPE_PRICE_FOUNDATION",
  guided: "STRIPE_PRICE_GUIDED",
  restoration: "STRIPE_PRICE_RESTORATION",
  integration: "STRIPE_PRICE_INTEGRATION",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const rows = [];

  for (const [tier, envName] of Object.entries(ENV_KEYS)) {
    const priceId = Deno.env.get(envName) || "";
    const expected = EXPECTED[tier];
    if (!priceId) {
      rows.push({
        tier,
        env: envName,
        status: "MISSING_SECRET",
        expected: expected.label,
      });
      continue;
    }
    try {
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount ?? null;
      const ok = amount === expected.cents;
      rows.push({
        tier,
        env: envName,
        status: ok ? "OK" : "MISMATCH",
        expected_cents: expected.cents,
        actual_cents: amount,
        currency: price.currency,
        nickname: price.nickname,
        livemode: price.livemode,
        active: price.active,
      });
    } catch (err) {
      rows.push({
        tier,
        env: envName,
        status: "LOOKUP_FAILED",
        expected: expected.label,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return new Response(JSON.stringify({ data: rows }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
