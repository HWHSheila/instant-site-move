/**
 * Clerk account lifecycle.
 *
 * Subscriber rows were created once by the browser on first portal visit and
 * then never reconciled with Clerk. A changed email address was never picked
 * up, and a deleted Clerk account left the subscriber row behind, still holding
 * a tier and still receiving email.
 *
 * Handles:
 *   user.created  create the subscriber row, so it no longer depends on the
 *                 browser reaching the portal
 *   user.updated  keep the email address current
 *   user.deleted  revoke access and record the deletion, keeping the history
 *
 * Required secret: CLERK_WEBHOOK_SECRET, from the Clerk dashboard endpoint.
 * Configure with verify_jwt = false, since Clerk signs with Svix headers
 * rather than a bearer token.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { Webhook } from "npm:svix@1.24.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, svix-id, svix-timestamp, svix-signature",
};

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserEvent {
  type: string;
  data: {
    id: string;
    primary_email_address_id?: string | null;
    email_addresses?: ClerkEmailAddress[];
    deleted?: boolean;
  };
}

function primaryEmail(data: ClerkUserEvent["data"]): string | null {
  const addresses = data.email_addresses ?? [];
  if (addresses.length === 0) return null;
  const primary = addresses.find((a) => a.id === data.primary_email_address_id);
  return (primary ?? addresses[0]).email_address ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const secret = Deno.env.get("CLERK_WEBHOOK_SECRET");
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response(JSON.stringify({ error: "Webhook not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: ClerkUserEvent;
  try {
    event = new Webhook(secret).verify(payload, headers) as ClerkUserEvent;
  } catch (err) {
    console.error("Clerk webhook signature rejected:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const clerkUserId = event.data.id;

  try {
    switch (event.type) {
      case "user.created": {
        const email = primaryEmail(event.data);
        if (!email) break;
        // clerk_user_id is unique, so a row the browser already created wins
        // on conflict and is simply refreshed rather than duplicated
        await supabase
          .from("subscribers")
          .upsert(
            { clerk_user_id: clerkUserId, email },
            { onConflict: "clerk_user_id", ignoreDuplicates: false }
          );
        break;
      }

      case "user.updated": {
        const email = primaryEmail(event.data);
        if (!email) break;
        await supabase
          .from("subscribers")
          .update({ email })
          .eq("clerk_user_id", clerkUserId);
        break;
      }

      case "user.deleted": {
        await supabase
          .from("subscribers")
          .update({
            clerk_deleted_at: new Date().toISOString(),
            payment_status: "cancelled",
          })
          .eq("clerk_user_id", clerkUserId);
        break;
      }

      default:
        // Clerk sends many event types; anything else is deliberately ignored
        break;
    }
  } catch (err) {
    console.error(`Failed to handle ${event.type} for ${clerkUserId}:`, err);
    // 500 makes Clerk retry, which is what we want for a transient failure
    return new Response(JSON.stringify({ error: "Handler failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
