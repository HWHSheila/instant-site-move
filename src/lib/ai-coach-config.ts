/**
 * AI Coach configuration — Sheila's Q7 answers.
 */

export const AI_COACH_MONTHLY_LIMITS: Record<string, number | null> = {
  awareness: 10,
  foundation: 35,
  guided: 100,
  restoration: 150,
  integration: null, // unlimited
};

export function getMonthlyLimit(tier: string | null | undefined): number | null {
  if (!tier) return null;
  return AI_COACH_MONTHLY_LIMITS[tier] ?? null;
}

export function isAiCoachAvailable(
  tier: string | null | undefined,
  paymentStatus: string | null | undefined,
  trialStartDate: string | null | undefined
): boolean {
  if (!tier) {
    return paymentStatus === "trial" || paymentStatus === "active" || !!trialStartDate;
  }
  return tier in AI_COACH_MONTHLY_LIMITS;
}

export function currentBillingMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const AI_COACH_SYSTEM_PROMPT = `You are Sheila McFarland's AI Coaching Assistant for Her Wellness Harmony members.

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

You will receive the member's progress context (completed lessons, current phase, assessment summary). Use it to personalize responses.

Keep responses concise (2-4 paragraphs max unless they ask for detail). No markdown headers.`;

export const PRIORITY_SUPPORT_CALENDLY_URL =
  "https://calendly.com/herwellnessharmony-support/priority-support-strategy-session";

export const PRIORITY_SUPPORT_LIMITS: Record<string, number> = {
  restoration: 12,
  integration: 20,
};
