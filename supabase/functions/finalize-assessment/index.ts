// Finalize assessment: create member roadmap + content progress (service role)
// Bypasses member RLS until INSERT policies are applied on member_roadmaps

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

  try {
    const body = await req.json();
    const {
      subscriber_id,
      assessment_id,
      slotting,
      tierRec,
      progress_rows,
    } = body;

    if (!subscriber_id || !assessment_id || !slotting || !tierRec) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roadmap, error: roadmapErr } = await supabase
      .from("member_roadmaps")
      .insert({
        subscriber_id,
        assessment_id,
        phase_sequence: slotting.phase_sequence,
        included_subcategories: slotting.included_subcategories,
        primary_pattern: slotting.primary_pattern,
        secondary_pattern: slotting.secondary_pattern,
        atm_reasoning: slotting.atm_reasoning,
        recommended_tier: tierRec.recommended_tier,
        tier_reasoning: tierRec.tier_reasoning,
        current_phase: slotting.current_phase,
        current_subcategory: slotting.current_subcategory,
      })
      .select()
      .single();

    if (roadmapErr) throw roadmapErr;

    if (Array.isArray(progress_rows) && progress_rows.length > 0) {
      const rows = progress_rows.map((row: Record<string, unknown>) => ({
        subscriber_id,
        video_code: row.video_code,
        content_type: row.content_type ?? "lesson",
        status: row.status ?? "locked",
      }));

      const { error: progressErr } = await supabase
        .from("member_content_progress")
        .upsert(rows, { onConflict: "subscriber_id,video_code,content_type" });

      if (progressErr) {
        console.error("Progress init error:", progressErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, roadmap }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("finalize-assessment error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
