// Journey Content Endpoint
// Implements [API s6] -- returns tier-gated, phase-appropriate content
// for the current subscriber's journey day

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TIER_ORDER = ["awareness", "foundation", "guided", "restoration", "integration"];

function tierIncludes(subscriberTier: string, contentTierList: string[]): boolean {
  const subscriberRank = TIER_ORDER.indexOf(subscriberTier);
  return contentTierList.some(
    (t) => TIER_ORDER.indexOf(t) <= subscriberRank
  );
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

    const { subscriber_id } = await req.json();

    if (!subscriber_id) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "VALIDATION_ERROR", message: "subscriber_id is required" },
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: sub } = await supabase
      .from("subscribers")
      .select("tier, track")
      .eq("id", subscriber_id)
      .single();

    const { data: progress } = await supabase
      .from("subscriber_progress")
      .select("day_number, current_phase")
      .eq("subscriber_id", subscriber_id)
      .single();

    if (!sub || !progress) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "NOT_FOUND", message: "Subscriber or progress not found" },
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscriberTier = sub.tier || "awareness";
    const phase = progress.current_phase;
    const dayNumber = progress.day_number;

    // Fetch all approved content items
    const { data: allContent } = await supabase
      .from("content_items")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: true });

    const items = (allContent || []).filter((item: Record<string, unknown>) =>
      tierIncludes(subscriberTier, (item.tier_access as string[]) || [])
    );

    // Day 18 prompt
    let day18Prompt: string | null = null;
    if (dayNumber === 18) {
      day18Prompt =
        "You've been experiencing the guided tier. In 3 days, your experience may change based on your current tier. Consider upgrading to keep your full guided access.";
    }

    // Post-Day 21 upgrade prompt
    let upgradePrompt: string | null = null;
    if (dayNumber > 21 && subscriberTier === "awareness") {
      upgradePrompt =
        "Your 21-day journey is complete. Upgrade your tier to continue with structured guidance and deeper support.";
    }

    // Phase-locked content preview
    const phaseLocked: Record<string, boolean> = {
      clarity: true,
      pattern_recognition: ["pattern_recognition", "friction", "guided_preview", "complete"].includes(phase),
      friction: ["friction", "guided_preview", "complete"].includes(phase),
      guided_preview: ["guided_preview", "complete"].includes(phase),
    };

    return new Response(
      JSON.stringify({
        data: {
          subscriber_id,
          day_number: dayNumber,
          current_phase: phase,
          tier: subscriberTier,
          content_items: items,
          phase_access: phaseLocked,
          day18_prompt: day18Prompt,
          upgrade_prompt: upgradePrompt,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Journey content error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "JOURNEY_CONTENT_FAILED", message: "Failed to load journey content" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
