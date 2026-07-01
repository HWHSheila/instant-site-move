// AI Pattern Identification Engine
// Implements exact Claude prompt contract from HWH_API_Interface_Contract.md Section 5

import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a root-cause wellness pattern analyst for Her Wellness Harmony.
Her Wellness Harmony uses an integrative health and functional medicine approach.
Symptoms are signals, not random problems. The goal is identifying what the
body is communicating through patterns. Real change requires order of operations.

Given the subscriber's intake data, you must:
1. Identify and RANK all gut, metabolic, and hormonal patterns present
2. Apply a prioritization model based on: severity, centrality, downstream
   impact, readiness for intervention, and symptom burden
3. Determine primary_focus, secondary_focus, and watch_area
4. Recommend a tier using these rules:
   - awareness:    1-2 low-severity patterns; user needs observation only
   - foundation:   2-3 patterns, primarily gut-focused; needs understanding
   - guided:       3-4 patterns with some metabolic overlap; ready to apply
   - restoration:  4-6 patterns across multiple systems; needs structured guidance
   - integration:  6+ patterns or high complexity overlap; needs high-touch support
5. Provide a brief reasoning explanation in plain language

Respond ONLY with valid JSON — no preamble, no markdown:
{
  "gut_patterns": [{ "issue": string, "severity": "high|medium|low", "rank": number }],
  "metabolic_patterns": [{ "issue": string, "severity": "high|medium|low", "rank": number }],
  "hormonal_patterns": [{ "issue": string, "severity": "high|medium|low", "rank": number }],
  "primary_focus": string,
  "secondary_focus": string,
  "watch_area": string,
  "recommended_tier": string,
  "ai_reasoning": string
}`;

interface PatternResult {
  gut_patterns: Array<{ issue: string; severity: string; rank: number }>;
  metabolic_patterns: Array<{ issue: string; severity: string; rank: number }>;
  hormonal_patterns: Array<{ issue: string; severity: string; rank: number }>;
  primary_focus: string;
  secondary_focus: string;
  watch_area: string;
  recommended_tier: string;
  ai_reasoning: string;
}

function fallbackResult(): PatternResult {
  return {
    gut_patterns: [
      { issue: "General Assessment Needed", severity: "low", rank: 1 },
    ],
    metabolic_patterns: [],
    hormonal_patterns: [],
    primary_focus: "General Assessment Needed",
    secondary_focus: "Observation",
    watch_area: "To be determined after further assessment",
    recommended_tier: "awareness",
    ai_reasoning:
      "Unable to complete full pattern analysis. Defaulting to awareness tier for initial observation and manual review.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { subscriber_id, intake_response_id } = await req.json();

    if (!subscriber_id || !intake_response_id) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "subscriber_id and intake_response_id are required",
          },
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: intake, error: intakeErr } = await supabase
      .from("intake_responses")
      .select("*")
      .eq("id", intake_response_id)
      .single();

    if (intakeErr || !intake) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "INTAKE_NOT_FOUND", message: "Intake response not found" },
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
    if (!claudeApiKey) {
      console.error("CLAUDE_API_KEY not set, using fallback");
      const fallback = fallbackResult();

      await supabase.from("pattern_maps").insert({
        subscriber_id,
        ...fallback,
      });

      await supabase
        .from("subscribers")
        .update({ tier: "awareness", intake_completed: true })
        .eq("id", subscriber_id);

      return new Response(
        JSON.stringify({ data: { subscriber_id, ...fallback } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: claudeApiKey });

    const intakePayload = {
      gut_symptoms: intake.gut_symptoms,
      metabolic_symptoms: intake.metabolic_symptoms,
      hormonal_symptoms: intake.hormonal_symptoms,
      test_results: intake.test_results,
      health_history: intake.health_history,
      goals: intake.goals,
    };

    let result: PatternResult;
    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Intake data: ${JSON.stringify(intakePayload)}`,
          },
        ],
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";

      try {
        result = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          console.error("Failed to parse Claude response:", text);
          result = fallbackResult();
        }
      }
    } catch (apiError) {
      console.error("Claude API error:", apiError);
      result = fallbackResult();
    }

    const validTiers = [
      "awareness",
      "foundation",
      "guided",
      "restoration",
      "integration",
    ];
    if (!validTiers.includes(result.recommended_tier)) {
      result.recommended_tier = "awareness";
    }

    const { error: mapErr } = await supabase.from("pattern_maps").insert({
      subscriber_id,
      gut_patterns: result.gut_patterns,
      metabolic_patterns: result.metabolic_patterns,
      hormonal_patterns: result.hormonal_patterns,
      primary_focus: result.primary_focus,
      secondary_focus: result.secondary_focus,
      watch_area: result.watch_area,
      recommended_tier: result.recommended_tier,
      ai_reasoning: result.ai_reasoning,
    });

    if (mapErr) {
      console.error("Failed to insert pattern_map:", mapErr);
    }

    const totalPatterns =
      result.gut_patterns.length +
      result.metabolic_patterns.length +
      result.hormonal_patterns.length;

    let track = "gut_focused";
    if (
      result.metabolic_patterns.length >= result.gut_patterns.length &&
      result.metabolic_patterns.length >= result.hormonal_patterns.length
    ) {
      track = "metabolic";
    } else if (
      result.hormonal_patterns.length >= result.gut_patterns.length
    ) {
      track = "hormonal";
    }
    if (totalPatterns >= 5) {
      track = "comprehensive";
    }

    await supabase
      .from("subscribers")
      .update({
        tier: result.recommended_tier,
        track,
        intake_completed: true,
      })
      .eq("id", subscriber_id);

    await supabase.from("subscriber_progress").upsert(
      {
        subscriber_id,
        day_number: 0,
        current_phase: "clarity",
      },
      { onConflict: "subscriber_id" }
    );

    return new Response(
      JSON.stringify({
        data: {
          subscriber_id,
          ...result,
          track,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: {
          code: "PATTERN_ENGINE_FAILED",
          message: "An unexpected error occurred during pattern identification",
        },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
