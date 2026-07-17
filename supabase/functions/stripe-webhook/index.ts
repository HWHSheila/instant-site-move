// Stripe Webhook Handler
// Implements [API s7] -- handles 4 subscription lifecycle events
// Fires MailerLite triggers for trial_started, tier changes, cancellation, payment_failed

import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function fireMailerLiteTrigger(
  supabaseUrl: string,
  serviceRoleKey: string,
  triggerName: string,
  subscriberId: string,
  email: string,
  triggerData: Record<string, unknown> = {}
) {
  try {
    await fetch(`${supabaseUrl}/functions/v1/fire-mailerlite-trigger`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trigger_name: triggerName,
        subscriber_id: subscriberId,
        email,
        trigger_data: triggerData,
      }),
    });
  } catch (err) {
    console.error(`Non-blocking MailerLite trigger ${triggerName} failed:`, err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
  });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

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

          await supabase.from("subscriber_progress").upsert(
            {
              subscriber_id: subscriberId,
              day_number: 1,
              current_phase: "clarity",
            },
            { onConflict: "subscriber_id" }
          );

          const { data: sub } = await supabase
            .from("subscribers")
            .select("email")
            .eq("id", subscriberId)
            .single();

          if (sub?.email) {
            await fireMailerLiteTrigger(supabaseUrl, serviceRoleKey, "trial_started", subscriberId, sub.email, {
              tier,
              payment_status: subscription.status === "trialing" ? "trial" : "active",
              trial_start_date: trialStart,
            });
          }
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

          const { data: existingSub } = await supabase
            .from("subscribers")
            .select("email, tier")
            .eq("id", subscriberId)
            .single();

          const newTier = subscription.metadata.tier;
          const oldTier = existingSub?.tier;

          const updates: Record<string, unknown> = {
            payment_status: paymentStatus,
          };

          if (newTier) {
            updates.tier = newTier;
          }

          await supabase
            .from("subscribers")
            .update(updates)
            .eq("id", subscriberId);

          if (existingSub?.email && newTier && oldTier && newTier !== oldTier) {
            const tierOrder = ["awareness", "foundation", "guided", "restoration", "integration"];
            const isUpgrade = tierOrder.indexOf(newTier) > tierOrder.indexOf(oldTier);
            const triggerName = isUpgrade ? "tier_upgrade" : "tier_downgrade_scheduled";

            await fireMailerLiteTrigger(supabaseUrl, serviceRoleKey, triggerName, subscriberId, existingSub.email, {
              tier: newTier,
              old_tier: oldTier,
              new_tier: newTier,
              payment_status: paymentStatus,
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriberId = subscription.metadata.subscriber_id;

        if (subscriberId) {
          const { data: sub } = await supabase
            .from("subscribers")
            .select("email, tier")
            .eq("id", subscriberId)
            .single();

          await supabase
            .from("subscribers")
            .update({
              payment_status: "cancelled",
              stripe_subscription_id: null,
              cancelled_at: new Date().toISOString(),
            })
            .eq("id", subscriberId);

          if (sub?.email) {
            await fireMailerLiteTrigger(supabaseUrl, serviceRoleKey, "cancellation_confirmed", subscriberId, sub.email, {
              tier: sub.tier,
              payment_status: "cancelled",
            });
          }
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
          const { data: sub } = await supabase
            .from("subscribers")
            .select("id, email, tier")
            .eq("stripe_subscription_id", subscriptionId)
            .single();

          await supabase
            .from("subscribers")
            .update({ payment_status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId);

          if (sub?.email) {
            await fireMailerLiteTrigger(supabaseUrl, serviceRoleKey, "payment_failed", sub.id, sub.email, {
              tier: sub.tier,
              payment_status: "past_due",
            });
          }
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
