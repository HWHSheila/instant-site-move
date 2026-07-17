/**
 * MailerLite trigger catalog — see HWH_MailerLite_Trigger_Sequence.md
 * Edge function handles actual API calls; this module defines names + groups.
 */

export const MAILERLITE_GROUPS: Record<string, string> = {
  free: "HWH Free Members",
  trial: "HWH Trial Members",
  awareness: "HWH Tier 1 Members",
  foundation: "HWH Tier 2 Members",
  guided: "HWH Tier 3 Members",
  restoration: "HWH Tier 4 Members",
  integration: "HWH Tier 5 Members",
  cancelled: "HWH Cancelled Members",
};

export type MailerLiteTriggerName =
  | "trial_started"
  | "portal_subscriber_created"
  | "wellness_assessment_reminder_1"
  | "wellness_assessment_reminder_2"
  | "wellness_assessment_reminder_3"
  | "day_11_mini_assessment"
  | "day_11_mini_assessment_reminder"
  | "day_21_mini_assessment"
  | "day_21_final_assessment_reminder"
  | "semi_monthly_check_in"
  | "semi_monthly_check_in_reminder"
  | "day_18_restoration_preview"
  | "day_19_restoration_unlocked"
  | "day_21_billing_reminder"
  | "phase_completed"
  | "full_roadmap_completed"
  | "maintenance_phase_entered"
  | "inactivity_3_day"
  | "inactivity_7_day"
  | "inactivity_10_day"
  | "tier_upgrade"
  | "tier_downgrade_scheduled"
  | "cancellation_confirmed"
  | "cancellation_win_back"
  | "auto_billing_confirmed"
  | "payment_failed";

export function groupForTier(
  tier: string | null,
  paymentStatus: string | null
): string {
  if (paymentStatus === "cancelled") return MAILERLITE_GROUPS.cancelled;
  if (paymentStatus === "trial") return MAILERLITE_GROUPS.trial;
  if (tier && MAILERLITE_GROUPS[tier]) return MAILERLITE_GROUPS[tier];
  return MAILERLITE_GROUPS.free;
}

export interface TriggerPayload {
  trigger_name: MailerLiteTriggerName;
  subscriber_id: string;
  email: string;
  first_name?: string;
  trigger_data?: Record<string, unknown>;
}
