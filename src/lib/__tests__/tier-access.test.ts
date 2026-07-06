import { describe, it, expect } from "vitest";
import { canAccessSymptomLog } from "../tier-access";
import { isAiCoachAvailable } from "../ai-coach-config";

describe("tier-access", () => {
  it("allows symptom log for paid tiers", () => {
    expect(canAccessSymptomLog("awareness", "active", null)).toBe(true);
    expect(canAccessSymptomLog("foundation", "active", null)).toBe(true);
  });

  it("blocks symptom log for free accounts", () => {
    expect(canAccessSymptomLog(null, "none", null)).toBe(false);
  });

  it("allows trial via payment_status", () => {
    expect(canAccessSymptomLog(null, "trial", null)).toBe(true);
  });
});

describe("ai-coach-config", () => {
  it("allows all paid tiers for AI coach", () => {
    expect(isAiCoachAvailable("awareness", "active", null)).toBe(true);
    expect(isAiCoachAvailable("integration", "active", null)).toBe(true);
  });
});
