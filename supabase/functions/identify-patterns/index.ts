// AI Pattern Identification Engine
// Implements exact Claude prompt contract from HWH_API_Interface_Contract.md Section 5

import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireOwnSubscriber, authErrorResponse } from "../_shared/clerk-auth.ts";
import {
  applyDomainSeverities,
  recommendTier,
  ratingsForPrefixes,
} from "../_shared/assessment-scoring.ts";

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
4. Set a provisional severity on each pattern using the baseline ratings
   (scale 1 = severe symptoms, 10 = no symptoms):
   - rating 8 to 10 → "low"
   - rating 5 to 7 → "medium"
   - rating 1 to 4 → "high"
   Mild ratings must produce low labels. Do not invent high severity for
   mild presentations.
5. Provide a brief reasoning explanation in plain language

Do NOT invent a membership tier. recommended_tier is set by a separate
deterministic rule after you respond; return "foundation" as a placeholder.

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
    const { subscriber_id: claimedId, intake_response_id } = await req.json();

    if (!intake_response_id) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "intake_response_id is required",
          },
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let caller;
    try {
      caller = await requireOwnSubscriber(req, supabase, claimedId);
    } catch (err) {
      const denied = authErrorResponse(err, corsHeaders);
      if (denied) return denied;
      throw err;
    }
    const subscriber_id = caller.id;

    // Scoped to the caller, so one member cannot analyse another's intake
    const { data: intake, error: intakeErr } = await supabase
      .from("intake_responses")
      .select("*")
      .eq("id", intake_response_id)
      .eq("subscriber_id", subscriber_id)
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

    const rawForm = (intake.raw_form_data ?? {}) as Record<string, unknown>;
    const baselineRatings = (rawForm.baseline_ratings ?? {}) as Record<
      string,
      number
    >;

    // Prefer the subcategory count already written to the member roadmap
    let subcategoryCount = 0;
    const { data: roadmap } = await supabase
      .from("member_roadmaps")
      .select("recommended_tier, included_subcategories")
      .eq("subscriber_id", subscriber_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (roadmap?.included_subcategories) {
      const included = roadmap.included_subcategories as Record<string, string[]>;
      subcategoryCount = Object.values(included).reduce(
        (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
        0
      );
    }

    const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
    if (!claudeApiKey) {
      console.error("CLAUDE_API_KEY not set, using fallback");
      const fallback = fallbackResult();
      fallback.recommended_tier =
        roadmap?.recommended_tier ||
        recommendTier(subcategoryCount, baselineRatings);
      fallback.gut_patterns = applyDomainSeverities(
        fallback.gut_patterns,
        ratingsForPrefixes(baselineRatings, ["gut_"]),
        baselineRatings
      );

      await supabase.from("pattern_maps").insert({
        subscriber_id,
        ...fallback,
      });

      // Tier is what the member pays for. The assessment only recommends,
      // and the recommendation lives on pattern_maps.recommended_tier.
      await supabase
        .from("subscribers")
        .update({ intake_completed: true })
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
      baseline_ratings: baselineRatings,
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

    // Deterministic severity from the 1-10 ratings (Sheila-approved bands).
    // Claude's labels are provisional; ratings win.
    result.gut_patterns = applyDomainSeverities(
      result.gut_patterns ?? [],
      ratingsForPrefixes(baselineRatings, ["gut_"]),
      baselineRatings
    );
    result.metabolic_patterns = applyDomainSeverities(
      result.metabolic_patterns ?? [],
      ratingsForPrefixes(baselineRatings, ["energy_"]),
      baselineRatings
    );
    result.hormonal_patterns = applyDomainSeverities(
      result.hormonal_patterns ?? [],
      ratingsForPrefixes(baselineRatings, ["hormone_"]),
      baselineRatings
    );

    // Prefer the roadmap tier already computed by recommendTier on the client.
    // Fall back to the same deterministic rule using ratings + subcategory count.
    if (
      roadmap?.recommended_tier &&
      ["awareness", "foundation", "guided", "restoration", "integration"].includes(
        roadmap.recommended_tier
      )
    ) {
      result.recommended_tier = roadmap.recommended_tier;
    } else {
      result.recommended_tier = recommendTier(
        subcategoryCount,
        baselineRatings
      );
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

    // Deliberately does not write `tier`. Membership comes from payment only;
    // the recommendation is already stored on pattern_maps.recommended_tier.
    await supabase
      .from("subscribers")
      .update({
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
