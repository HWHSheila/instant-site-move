/**
 * MailerLite trigger dispatcher — logs all triggers to Supabase and
 * forwards to MailerLite when MAILERLITE_API_KEY is configured.
 * Sheila builds email content in MailerLite; this function only fires events.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api";

const TIER_GROUPS: Record<string, string> = {
  free: "HWH Free Members",
  trial: "HWH Trial Members",
  awareness: "HWH Tier 1 Members",
  foundation: "HWH Tier 2 Members",
  guided: "HWH Tier 3 Members",
  restoration: "HWH Tier 4 Members",
  integration: "HWH Tier 5 Members",
  cancelled: "HWH Cancelled Members",
};

interface TriggerRequest {
  trigger_name: string;
  subscriber_id: string;
  email: string;
  first_name?: string;
  trigger_data?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body: TriggerRequest = await req.json();
    const { trigger_name, subscriber_id, email, first_name, trigger_data } = body;

    if (!trigger_name || !subscriber_id || !email) {
      return new Response(
        JSON.stringify({ error: "trigger_name, subscriber_id, and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Always log to Supabase (audit trail per spec)
    const { error: logErr } = await supabase.from("mailer_lite_trigger_log").insert({
      subscriber_id,
      trigger_name,
      trigger_data: {
        email,
        first_name: first_name ?? null,
        ...(trigger_data ?? {}),
      },
    });

    if (logErr) {
      console.error("Trigger log insert failed:", logErr);
      throw logErr;
    }

    const apiKey = Deno.env.get("MAILERLITE_API_KEY");
    let mailerLiteStatus = "skipped_no_api_key";

    if (apiKey) {
      try {
        // Upsert subscriber with custom fields for automation triggers
        const subscriberRes = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            fields: {
              name: first_name ?? "",
              last_trigger: trigger_name,
              ...(trigger_data ?? {}),
            },
          }),
        });

        if (!subscriberRes.ok) {
          console.error("MailerLite subscriber upsert failed:", await subscriberRes.text());
          mailerLiteStatus = "subscriber_upsert_failed";
        } else {
          mailerLiteStatus = "logged_and_upserted";
        }

        // Move to appropriate group if tier info present
        const tier = trigger_data?.tier as string | undefined;
        const paymentStatus = trigger_data?.payment_status as string | undefined;
        let groupName = TIER_GROUPS.free;
        if (paymentStatus === "cancelled") groupName = TIER_GROUPS.cancelled;
        else if (paymentStatus === "trial") groupName = TIER_GROUPS.trial;
        else if (tier && TIER_GROUPS[tier]) groupName = TIER_GROUPS[tier];

        if (trigger_data?.group_override) {
          groupName = trigger_data.group_override as string;
        }

        const groupsRes = await fetch(
          `${MAILERLITE_API_BASE}/groups?filter[name]=${encodeURIComponent(groupName)}&limit=100`,
          { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } }
        );

        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          const group = groupsData.data?.find((g: { name: string }) => g.name === groupName);
          if (group) {
            await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ email, groups: [group.id] }),
            });
          }
        }
      } catch (mlErr) {
        console.error("MailerLite API error:", mlErr);
        mailerLiteStatus = "api_error";
      }
    }

    return new Response(
      JSON.stringify({ success: true, trigger_name, mailer_lite_status: mailerLiteStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("fire-mailerlite-trigger error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fire trigger" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
