// 21-Day Journey Advancement (Cron)
// Implements [TECH s5.3], [API s6] -- advance-journey-day
// Run daily via Supabase CRON or external scheduler
//
// Phase map:
//   Days 1-5:   clarity
//   Days 6-12:  pattern_recognition
//   Days 13-17: friction
//   Days 18-21: guided_preview
//   Day 22+:    complete

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function getPhase(day: number): string {
  if (day <= 5) return "clarity";
  if (day <= 12) return "pattern_recognition";
  if (day <= 17) return "friction";
  if (day <= 21) return "guided_preview";
  return "complete";
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

    const { data: activeJourneys, error: fetchErr } = await supabase
      .from("subscriber_progress")
      .select("id, subscriber_id, day_number, current_phase")
      .lt("day_number", 22)
      .gt("day_number", 0);

    if (fetchErr) throw fetchErr;

    if (!activeJourneys || activeJourneys.length === 0) {
      return new Response(
        JSON.stringify({ data: { advanced: 0, message: "No active journeys" } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let advanced = 0;
    const day18Prompts: string[] = [];
    const postDay21: string[] = [];

    for (const journey of activeJourneys) {
      const newDay = journey.day_number + 1;
      const newPhase = getPhase(newDay);

      await supabase
        .from("subscriber_progress")
        .update({
          day_number: newDay,
          current_phase: newPhase,
        })
        .eq("id", journey.id);

      advanced++;

      if (newDay === 18) {
        day18Prompts.push(journey.subscriber_id);
      }

      if (newDay === 22) {
        postDay21.push(journey.subscriber_id);
      }
    }

    // Day 18: "You've been experiencing the guided tier preview..."
    // In production, this would trigger an email via Resend/SendGrid.
    // For POC, we log it and the FE checks day_number to display the prompt.
    if (day18Prompts.length > 0) {
      console.log(
        `Day 18 prompt triggered for ${day18Prompts.length} subscriber(s):`,
        day18Prompts
      );
    }

    // Post-Day 21: upgrade prompt
    if (postDay21.length > 0) {
      console.log(
        `Post-Day 21 upgrade prompt for ${postDay21.length} subscriber(s):`,
        postDay21
      );
    }

    return new Response(
      JSON.stringify({
        data: {
          advanced,
          day18Prompts: day18Prompts.length,
          postDay21: postDay21.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Journey advance error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "JOURNEY_ADVANCE_FAILED", message: "Failed to advance journeys" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
