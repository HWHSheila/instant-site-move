// Stripe Webhook Handler
// Implements [API s7] -- handles 4 subscription lifecycle events

import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
    });
  }

  console.log(`Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriberId = subscription.metadata.subscriber_id;
        const tier = subscription.metadata.tier;

        if (subscriberId) {
          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null;
          const trialStart = subscription.trial_start
            ? new Date(subscription.trial_start * 1000).toISOString()
            : null;

          await supabase
            .from("subscribers")
            .update({
              tier,
              payment_status: subscription.status === "trialing" ? "trial" : "active",
              stripe_subscription_id: subscription.id,
              trial_start_date: trialStart,
              trial_end_date: trialEnd,
            })
            .eq("id", subscriberId);

          // Start the 21-day journey
          await supabase.from("subscriber_progress").upsert(
            {
              subscriber_id: subscriberId,
              day_number: 1,
              current_phase: "clarity",
            },
            { onConflict: "subscriber_id" }
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriberId = subscription.metadata.subscriber_id;

        if (subscriberId) {
          let paymentStatus = "active";
          if (subscription.status === "trialing") paymentStatus = "trial";
          else if (subscription.status === "past_due") paymentStatus = "past_due";
          else if (subscription.status === "canceled") paymentStatus = "cancelled";

          const updates: Record<string, unknown> = {
            payment_status: paymentStatus,
          };

          if (subscription.metadata.tier) {
            updates.tier = subscription.metadata.tier;
          }

          await supabase
            .from("subscribers")
            .update(updates)
            .eq("id", subscriberId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriberId = subscription.metadata.subscriber_id;

        if (subscriberId) {
          await supabase
            .from("subscribers")
            .update({
              payment_status: "cancelled",
              stripe_subscription_id: null,
            })
            .eq("id", subscriberId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;

        if (subscriptionId) {
          await supabase
            .from("subscribers")
            .update({ payment_status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error processing ${event.type}:`, err);
    return new Response(JSON.stringify({ error: "Processing failed" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
