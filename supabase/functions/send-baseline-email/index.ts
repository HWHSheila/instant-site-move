import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATINGS: { key: string; label: string }[] = [
  { key: "energy", label: "Energy" },
  { key: "digestion", label: "Digestion" },
  { key: "sleep", label: "Sleep" },
  { key: "mood", label: "Mood" },
  { key: "bloating", label: "Bloating" },
  { key: "cravings", label: "Cravings" },
  { key: "bowel_regularity", label: "Bowel Regularity" },
  { key: "brain_fog", label: "Brain Fog" },
  { key: "joint_pain", label: "Joint Pain" },
  { key: "muscle_body_aches", label: "Muscle or Body Aches" },
  { key: "stress_level", label: "Stress Level" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const data = await req.json();
    const subject = `HWH Gut Reset Baseline — ${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

    const ratingsBlock = RATINGS.map(
      (r) => `${r.label.padEnd(24, " ")}: ${data[r.key] ?? "—"} / 10`
    ).join("\n");

    const body = `
HWH 30-DAY GUT RESET — BASELINE SUBMISSION
===========================================

First Name: ${data.first_name ?? ""}
Last Name:  ${data.last_name ?? ""}
Email:      ${data.email ?? ""}

RATINGS (1–10)
---------------
${ratingsBlock}

TOP 3 SYMPTOMS
---------------
${data.top_3_symptoms || "Not provided"}

Submitted: ${new Date().toISOString()}
    `.trim();

    // Try Lovable's transactional email pipeline if it has been set up.
    // Falls back to logging if the function is not available yet.
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({
          to: "support@herwellnessharmony.com",
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        console.warn(
          "send-transactional-email not available or failed:",
          res.status,
          await res.text().catch(() => "")
        );
      }
    } catch (e) {
      console.warn("Email send skipped:", e);
    }

    console.log("=== BASELINE SUBMISSION ===");
    console.log("Subject:", subject);
    console.log(body);
    console.log("=== END BASELINE ===");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-baseline-email error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
