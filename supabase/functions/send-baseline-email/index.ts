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

    const ratings = RATINGS.map((r) => ({
      label: r.label,
      value: data[r.key] ?? "—",
    }));

    const templateData = {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      email: data.email ?? "",
      ratings,
      topSymptoms: data.top_3_symptoms || "Not provided",
      submittedAt: new Date().toISOString(),
    };

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        templateName: "baseline-notification",
        idempotencyKey: `baseline-${data.email ?? "unknown"}-${Date.now()}`,
        templateData,
      }),
    });

    const responseText = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("send-transactional-email failed:", res.status, responseText);
      return new Response(
        JSON.stringify({ success: false, error: `Email send failed: ${res.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Baseline notification enqueued:", responseText);
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
