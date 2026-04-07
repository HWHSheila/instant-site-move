// Admin Analytics Endpoint
// Implements [API s11] -- aggregate metrics for admin dashboard

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const [
      totalSubs,
      tierBreakdown,
      activeJourneys,
      pendingDrafts,
      totalContent,
      paymentBreakdown,
    ] = await Promise.all([
      supabase.from("subscribers").select("id", { count: "exact", head: true }),
      supabase.from("subscribers").select("tier"),
      supabase
        .from("subscriber_progress")
        .select("id", { count: "exact", head: true })
        .lt("day_number", 22)
        .gt("day_number", 0),
      supabase
        .from("content_drafts")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("content_items").select("id", { count: "exact", head: true }),
      supabase.from("subscribers").select("payment_status"),
    ]);

    const tiers: Record<string, number> = {};
    (tierBreakdown.data || []).forEach((s: { tier: string }) => {
      const t = s.tier || "none";
      tiers[t] = (tiers[t] || 0) + 1;
    });

    const payments: Record<string, number> = {};
    (paymentBreakdown.data || []).forEach((s: { payment_status: string }) => {
      const p = s.payment_status || "none";
      payments[p] = (payments[p] || 0) + 1;
    });

    return new Response(
      JSON.stringify({
        data: {
          total_subscribers: totalSubs.count || 0,
          tier_breakdown: tiers,
          active_journeys: activeJourneys.count || 0,
          pending_drafts: pendingDrafts.count || 0,
          total_content_items: totalContent.count || 0,
          payment_breakdown: payments,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Analytics error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "ANALYTICS_FAILED", message: "Failed to fetch analytics" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
