import { describe, it, expect } from "vitest";
import {
  getDueAssessment,
  getMemberDayNumber,
  hasCompletedType,
} from "../mini-assessment-schedule";

describe("mini-assessment-schedule", () => {
  it("computes day number from assessment date", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString();
    expect(getMemberDayNumber(null, twoDaysAgo, null)).toBe(3);
  });

  it("returns day_11 when day >= 11 and baseline done", () => {
    const due = getDueAssessment(
      11,
      [{ assessment_type: "baseline", completed_at: new Date().toISOString(), day_number: 1 }],
      true
    );
    expect(due).toBe("day_11");
  });

  it("returns null when day_11 already completed", () => {
    expect(
      hasCompletedType(
        [
          { assessment_type: "baseline", completed_at: "", day_number: 1 },
          { assessment_type: "day_11", completed_at: "", day_number: 11 },
        ],
        "day_11"
      )
    ).toBe(true);
  });

  it("returns semi_monthly after day 21 when 15+ days since last check-in", () => {
    const old = new Date(Date.now() - 16 * 86_400_000).toISOString();
    const due = getDueAssessment(
      40,
      [
        { assessment_type: "baseline", completed_at: old, day_number: 1 },
        { assessment_type: "day_11", completed_at: old, day_number: 11 },
        { assessment_type: "day_21", completed_at: old, day_number: 21 },
      ],
      true
    );
    expect(due).toBe("semi_monthly");
  });
});
