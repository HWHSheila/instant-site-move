/**
 * AI Coaching Assistant — Sheila's Q7 spec.
 * Available at all paid tiers with monthly question limits.
 */
import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireOwnSubscriber, authErrorResponse } from "../_shared/clerk-auth.ts";
import { resolveEffectiveTier } from "../_shared/effective-tier.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Sheila McFarland's AI Coaching Assistant for Her Wellness Harmony members.

PERSONALITY: Sound like Sheila — warm, direct, pattern-based, and grounded in root-cause thinking. Use the Gut → Metabolism → Hormones (GMH) cascade framework.

YOU HELP WITH:
- Explaining lesson concepts from the member's roadmap
- Helping members interpret their symptom patterns (educational, not diagnostic)
- Suggesting which lesson to watch next based on their progress
- General wellness guidance within the HWH educational framework

HARD BOUNDARIES — NEVER CROSS THESE:
- Never give medical advice
- Never recommend supplements or specific products
- Never diagnose conditions
- Never recommend treatments or medication changes
- Always redirect to their licensed healthcare provider for medical decisions

When a member asks something medical, respond with empathy and clearly state you cannot provide medical advice, then suggest they discuss it with their licensed provider.

You will receive the member's progress context. Use it to personalize responses.

Keep responses concise (2-4 paragraphs max unless they ask for detail). No markdown headers.`;

const TIER_LIMITS: Record<string, number | null> = {
  awareness: 10,
  foundation: 35,
  guided: 100,
  restoration: 150,
  integration: null,
};

function billingMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
    if (!CLAUDE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI Coach is not configured yet." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { subscriber_id: claimedId, question, history = [] } = await req.json();

    if (!question?.trim()) {
      return new Response(
        JSON.stringify({ error: "question is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subscriber;
    try {
      subscriber = await requireOwnSubscriber(req, supabase, claimedId);
    } catch (err) {
      const denied = authErrorResponse(err, corsHeaders);
      if (denied) return denied;
      throw err;
    }
    const subscriber_id = subscriber.id;

    // Trial members have no billed tier, so the limit has to come from the
    // effective tier or an unlimited allowance leaks out during every trial
    const tier = resolveEffectiveTier(subscriber);

    if (!tier) {
      return new Response(
        JSON.stringify({ error: "AI Coach requires a paid membership tier." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const limit = TIER_LIMITS[tier];
    const month = billingMonth();

    if (limit != null) {
      const { count } = await supabase
        .from("ai_coach_usage")
        .select("id", { count: "exact", head: true })
        .eq("subscriber_id", subscriber_id)
        .eq("billing_month", month);

      if ((count ?? 0) >= limit) {
        return new Response(
          JSON.stringify({
            error: `You've reached your ${limit} questions for this month. Your limit resets next month.`,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data: roadmap } = await supabase
      .from("member_roadmaps")
      .select("phase_sequence, current_phase, current_subcategory, primary_pattern, secondary_pattern")
      .eq("subscriber_id", subscriber_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: progress } = await supabase
      .from("member_content_progress")
      .select("video_code, status, completed_at")
      .eq("subscriber_id", subscriber_id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5);

    const { data: assessment } = await supabase
      .from("wellness_assessments")
      .select("primary_health_goal, baseline_ratings")
      .eq("subscriber_id", subscriber_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const contextBlock = [
      roadmap
        ? `Roadmap phases: ${(roadmap.phase_sequence as string[]).join(" → ")}. Current: ${roadmap.current_phase} — ${roadmap.current_subcategory}. Primary pattern: ${roadmap.primary_pattern}. Secondary: ${roadmap.secondary_pattern}.`
        : "No roadmap assigned yet.",
      progress?.length
        ? `Recently completed lessons: ${progress.map((p) => p.video_code).join(", ")}.`
        : "No lessons completed yet.",
      assessment?.primary_health_goal
        ? `Member's primary health goal: ${assessment.primary_health_goal}.`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY });

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...(history as Array<{ role: "user" | "assistant"; content: string }>).slice(-6),
      { role: "user", content: question.trim() },
    ];

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: `${SYSTEM_PROMPT}\n\n--- MEMBER CONTEXT ---\n${contextBlock}`,
      messages,
    });

    const responseText =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    await supabase.from("ai_coach_usage").insert({
      subscriber_id,
      question: question.trim(),
      response: responseText,
      billing_month: month,
    });

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ai-coach error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to get a response. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
