/**
 * Daily MailerLite scheduled triggers (Phase B).
 * Selection + idempotency here; delivery always via fire-mailerlite-trigger.
 *
 * Jobs: assessment reminders, day 11/21 + semi-monthly reminders,
 * inactivity 3/7/10, cancellation win-back.
 */
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

async function hasTriggerLog(
  supabase: SupabaseClient,
  subscriberId: string,
  triggerName: string,
  sinceIso?: string
): Promise<boolean> {
  let q = supabase
    .from("mailer_lite_trigger_log")
    .select("id")
    .eq("subscriber_id", subscriberId)
    .eq("trigger_name", triggerName)
    .limit(1);
  if (sinceIso) q = q.gte("fired_at", sinceIso);
  const { data } = await q;
  return !!(data && data.length > 0);
}

async function fireTrigger(
  supabaseUrl: string,
  serviceRoleKey: string,
  triggerName: string,
  subscriberId: string,
  email: string,
  firstName: string | null | undefined,
  triggerData: Record<string, unknown> = {}
) {
  const res = await fetch(`${supabaseUrl}/functions/v1/fire-mailerlite-trigger`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trigger_name: triggerName,
      subscriber_id: subscriberId,
      email,
      first_name: firstName ?? undefined,
      trigger_data: triggerData,
    }),
  });
  if (!res.ok) {
    console.error(`fire ${triggerName} failed:`, await res.text());
  }
}

function ageMs(from: string | null | undefined, now: number): number | null {
  if (!from) return null;
  const t = new Date(from).getTime();
  if (Number.isNaN(t)) return null;
  return now - t;
}

function portalOrigin(): string {
  return Deno.env.get("PUBLIC_SITE_URL") || "https://instant-site-move.vercel.app";
}

async function runAssessmentReminders(
  supabase: SupabaseClient,
  supabaseUrl: string,
  serviceRoleKey: string,
  now: number,
  results: Record<string, number>
) {
  const { data: subs, error } = await supabase
    .from("subscribers")
    .select("id, email, trial_start_date, created_at, assessment_completed, payment_status, tier")
    .or("assessment_completed.is.null,assessment_completed.eq.false");

  if (error) throw error;

  for (const sub of subs ?? []) {
    const start = sub.trial_start_date || sub.created_at;
    const age = ageMs(start, now);
    if (age == null || !sub.email) continue;

    const assessmentUrl = `${portalOrigin()}/portal/intake`;
    const baseData = {
      assessment_url: assessmentUrl,
      payment_status: sub.payment_status,
      tier: sub.tier,
    };

    if (age >= DAY && age < 3 * DAY) {
      if (!(await hasTriggerLog(supabase, sub.id, "wellness_assessment_reminder_1"))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "wellness_assessment_reminder_1",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.wellness_assessment_reminder_1 =
          (results.wellness_assessment_reminder_1 ?? 0) + 1;
      }
    } else if (age >= 3 * DAY && age < 6 * DAY) {
      if (
        (await hasTriggerLog(supabase, sub.id, "wellness_assessment_reminder_1")) &&
        !(await hasTriggerLog(supabase, sub.id, "wellness_assessment_reminder_2"))
      ) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "wellness_assessment_reminder_2",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.wellness_assessment_reminder_2 =
          (results.wellness_assessment_reminder_2 ?? 0) + 1;
      }
    } else if (age >= 6 * DAY) {
      if (
        (await hasTriggerLog(supabase, sub.id, "wellness_assessment_reminder_2")) &&
        !(await hasTriggerLog(supabase, sub.id, "wellness_assessment_reminder_3"))
      ) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "wellness_assessment_reminder_3",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.wellness_assessment_reminder_3 =
          (results.wellness_assessment_reminder_3 ?? 0) + 1;
      }
    }
  }
}

async function runCheckinReminders(
  supabase: SupabaseClient,
  supabaseUrl: string,
  serviceRoleKey: string,
  now: number,
  results: Record<string, number>
) {
  const { data: progress, error } = await supabase
    .from("subscriber_progress")
    .select("subscriber_id, day_number")
    .gte("day_number", 11);

  if (error) throw error;

  for (const row of progress ?? []) {
    const { data: sub } = await supabase
      .from("subscribers")
      .select("id, email, payment_status, tier")
      .eq("id", row.subscriber_id)
      .maybeSingle();
    if (!sub?.email) continue;

    const { data: minis } = await supabase
      .from("mini_assessments")
      .select("assessment_type, completed_at")
      .eq("subscriber_id", sub.id);

    const types = new Set((minis ?? []).map((m) => m.assessment_type));
    const baseData = { payment_status: sub.payment_status, tier: sub.tier };

    if (row.day_number >= 11 && !types.has("day_11")) {
      if (!(await hasTriggerLog(supabase, sub.id, "day_11_mini_assessment_reminder"))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "day_11_mini_assessment_reminder",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.day_11_mini_assessment_reminder =
          (results.day_11_mini_assessment_reminder ?? 0) + 1;
      }
    }

    if (row.day_number >= 21 && !types.has("day_21")) {
      if (!(await hasTriggerLog(supabase, sub.id, "day_21_final_assessment_reminder"))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "day_21_final_assessment_reminder",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.day_21_final_assessment_reminder =
          (results.day_21_final_assessment_reminder ?? 0) + 1;
      }
    }

    // Semi-monthly reminder: past day 21, active/trial, ≥15d since last mini
    if (
      row.day_number > 21 &&
      (sub.payment_status === "active" || sub.payment_status === "trial")
    ) {
      const latest = (minis ?? [])
        .map((m) => m.completed_at)
        .filter(Boolean)
        .sort()
        .reverse()[0] as string | undefined;
      const sinceLast = latest ? ageMs(latest, now) : null;
      const due = sinceLast == null || sinceLast >= 15 * DAY;
      const since15 = new Date(now - 15 * DAY).toISOString();
      if (
        due &&
        !(await hasTriggerLog(supabase, sub.id, "semi_monthly_check_in_reminder", since15))
      ) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "semi_monthly_check_in_reminder",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.semi_monthly_check_in_reminder =
          (results.semi_monthly_check_in_reminder ?? 0) + 1;
      }
    }
  }
}

async function lastLessonTitle(
  supabase: SupabaseClient,
  subscriberId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("member_content_progress")
    .select("video_code, completed_at")
    .eq("subscriber_id", subscriberId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data?.video_code) return null;
  const { data: video } = await supabase
    .from("portal_videos")
    .select("title")
    .eq("video_code", data.video_code)
    .maybeSingle();
  return (video?.title as string) ?? data.video_code;
}

async function runInactivity(
  supabase: SupabaseClient,
  supabaseUrl: string,
  serviceRoleKey: string,
  now: number,
  results: Record<string, number>
) {
  const { data: subs, error } = await supabase
    .from("subscribers")
    .select("id, email, last_login_at, payment_status, tier")
    .not("last_login_at", "is", null);

  if (error) throw error;

  for (const sub of subs ?? []) {
    const idle = ageMs(sub.last_login_at, now);
    if (idle == null || !sub.email) continue;

    const sinceLogin = sub.last_login_at as string;
    const lastLesson = await lastLessonTitle(supabase, sub.id);
    const baseData = {
      last_lesson: lastLesson,
      payment_status: sub.payment_status,
      tier: sub.tier,
    };

    // 3-day: idle > 3d and <= 7d
    if (idle > 3 * DAY && idle <= 7 * DAY) {
      if (!(await hasTriggerLog(supabase, sub.id, "inactivity_3_day", sinceLogin))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "inactivity_3_day",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.inactivity_3_day = (results.inactivity_3_day ?? 0) + 1;
      }
    } else if (idle > 7 * DAY && idle <= 10 * DAY) {
      if (!(await hasTriggerLog(supabase, sub.id, "inactivity_7_day", sinceLogin))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "inactivity_7_day",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.inactivity_7_day = (results.inactivity_7_day ?? 0) + 1;
      }
    } else if (idle > 10 * DAY) {
      if (!(await hasTriggerLog(supabase, sub.id, "inactivity_10_day", sinceLogin))) {
        await fireTrigger(
          supabaseUrl,
          serviceRoleKey,
          "inactivity_10_day",
          sub.id,
          sub.email,
          null,
          baseData
        );
        results.inactivity_10_day = (results.inactivity_10_day ?? 0) + 1;
      }
    }
  }
}

async function runWinBack(
  supabase: SupabaseClient,
  supabaseUrl: string,
  serviceRoleKey: string,
  now: number,
  results: Record<string, number>
) {
  const cutoff = new Date(now - 30 * DAY).toISOString();
  const { data: subs, error } = await supabase
    .from("subscribers")
    .select("id, email, cancelled_at, payment_status, tier")
    .eq("payment_status", "cancelled")
    .lte("cancelled_at", cutoff);

  if (error) throw error;

  for (const sub of subs ?? []) {
    if (!sub.email) continue;
    if (await hasTriggerLog(supabase, sub.id, "cancellation_win_back")) continue;
    await fireTrigger(
      supabaseUrl,
      serviceRoleKey,
      "cancellation_win_back",
      sub.id,
      sub.email,
      null,
      { payment_status: "cancelled", tier: sub.tier }
    );
    results.cancellation_win_back = (results.cancellation_win_back ?? 0) + 1;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const now = Date.now();
    const results: Record<string, number> = {};

    // Optional body: { "jobs": ["assessment","checkin","inactivity","winback"] }
    let jobs = ["assessment", "checkin", "inactivity", "winback"];
    try {
      const body = await req.json();
      if (Array.isArray(body?.jobs) && body.jobs.length) jobs = body.jobs;
    } catch {
      /* empty body ok */
    }

    if (jobs.includes("assessment")) {
      await runAssessmentReminders(supabase, supabaseUrl, serviceRoleKey, now, results);
    }
    if (jobs.includes("checkin")) {
      await runCheckinReminders(supabase, supabaseUrl, serviceRoleKey, now, results);
    }
    if (jobs.includes("inactivity")) {
      await runInactivity(supabase, supabaseUrl, serviceRoleKey, now, results);
    }
    if (jobs.includes("winback")) {
      await runWinBack(supabase, supabaseUrl, serviceRoleKey, now, results);
    }

    return new Response(JSON.stringify({ ok: true, fired: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mailerlite-scheduled-triggers error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
