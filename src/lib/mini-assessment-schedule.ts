/**
 * Mini assessment schedule per HWH_Mini_Assessment_Schedule_Structure.md
 * Assessments unlock by day number, NOT by lesson progress.
 */

export type AssessmentType = "baseline" | "day_11" | "day_21" | "semi_monthly";

export interface CompletedAssessment {
  assessment_type: AssessmentType;
  completed_at: string;
  day_number: number | null;
}

const ASSESSMENT_LABELS: Record<AssessmentType, string> = {
  baseline: "Day 1 Baseline",
  day_11: "Day 11 Mid-Point Check-In",
  day_21: "Day 21 Final Assessment",
  semi_monthly: "Progress Check-In",
};

export function assessmentLabel(type: AssessmentType): string {
  return ASSESSMENT_LABELS[type];
}

/** Compute member day from journey progress or signup/assessment date. */
export function getMemberDayNumber(
  journeyDay: number | null | undefined,
  assessmentCompletedAt: string | null | undefined,
  trialStartDate: string | null | undefined
): number {
  if (journeyDay != null && journeyDay > 0) return journeyDay;

  const start = trialStartDate || assessmentCompletedAt;
  if (!start) return 0;

  const ms = Date.now() - new Date(start).getTime();
  return Math.max(1, Math.floor(ms / 86_400_000) + 1);
}

export function hasCompletedType(
  completed: CompletedAssessment[],
  type: AssessmentType
): boolean {
  return completed.some((a) => a.assessment_type === type);
}

export function getLastSemiMonthly(completed: CompletedAssessment[]): CompletedAssessment | null {
  const semi = completed
    .filter((a) => a.assessment_type === "semi_monthly")
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  return semi[0] ?? null;
}

/** Returns the next assessment type the member should complete, if any. */
export function getDueAssessment(
  dayNumber: number,
  completed: CompletedAssessment[],
  isPaidOrTrial: boolean
): AssessmentType | null {
  if (dayNumber < 1) return null;
  if (!hasCompletedType(completed, "baseline")) return null;

  if (dayNumber >= 11 && !hasCompletedType(completed, "day_11")) {
    return "day_11";
  }
  if (dayNumber >= 21 && !hasCompletedType(completed, "day_21")) {
    return "day_21";
  }

  if (dayNumber > 21 && isPaidOrTrial) {
    const lastSemi = getLastSemiMonthly(completed);
    const anchor =
      lastSemi?.completed_at ??
      completed.find((a) => a.assessment_type === "day_21")?.completed_at;
    if (!anchor) return "semi_monthly";

    const daysSince = Math.floor(
      (Date.now() - new Date(anchor).getTime()) / 86_400_000
    );
    if (daysSince >= 15) return "semi_monthly";
  }

  return null;
}

export function dayNumberForType(type: AssessmentType, currentDay: number): number {
  if (type === "baseline") return 1;
  if (type === "day_11") return 11;
  if (type === "day_21") return 21;
  return currentDay;
}
