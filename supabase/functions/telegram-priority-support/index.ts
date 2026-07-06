/**
 * Priority Support → Telegram delivery (Q2B shell).
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (Sheila's chat) in Supabase secrets.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Telegram webhook: Sheila replies via Reply-to-message
  if (req.method === "POST" && url.searchParams.get("webhook") === "1") {
    try {
      const update = await req.json();
      const reply = update?.message?.reply_to_message;
      const text = update?.message?.text;
      const replyToTelegramId = reply?.message_id;

      if (!replyToTelegramId || !text) {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: original } = await supabase
        .from("priority_support_messages")
        .select("id, subscriber_id, billing_month")
        .eq("telegram_message_id", replyToTelegramId)
        .maybeSingle();

      if (!original) {
        console.warn("No matching portal message for telegram reply", replyToTelegramId);
        return new Response(JSON.stringify({ ok: true }));
      }

      await supabase.from("priority_support_messages").insert({
        subscriber_id: original.subscriber_id,
        direction: "sheila_to_member",
        message_text: text,
        billing_month: original.billing_month,
        parent_message_id: original.id,
      });

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("telegram webhook error:", err);
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }
  }

  // Outbound: member message → Telegram
  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    const { message_id, subscriber_id } = await req.json();
    if (!message_id || !subscriber_id) {
      return new Response(JSON.stringify({ error: "message_id and subscriber_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: msg } = await supabase
      .from("priority_support_messages")
      .select("message_text")
      .eq("id", message_id)
      .single();

    const { data: sub } = await supabase
      .from("subscribers")
      .select("email")
      .eq("id", subscriber_id)
      .single();

    if (!token || !chatId) {
      console.log("Telegram not configured — message saved in portal only");
      return new Response(
        JSON.stringify({ success: true, telegram_status: "skipped_no_config" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const telegramText =
      `Priority Support from ${sub?.email ?? "member"}:\n\n${msg?.message_text ?? ""}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: telegramText }),
    });

    const tgData = await tgRes.json();
    const telegramMessageId = tgData?.result?.message_id;

    if (telegramMessageId) {
      await supabase
        .from("priority_support_messages")
        .update({ telegram_message_id: telegramMessageId })
        .eq("id", message_id);
    }

    return new Response(
      JSON.stringify({ success: true, telegram_status: tgRes.ok ? "sent" : "failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("telegram-priority-support error:", err);
    return new Response(JSON.stringify({ error: "Failed to send" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
