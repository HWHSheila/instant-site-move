import { describe, it, expect } from "vitest";
import { canAccessSymptomLog } from "../tier-access";
import { isAiCoachAvailable } from "../ai-coach-config";
import { resolveEffectiveTier } from "../effective-tier";

describe("tier-access", () => {
  it("allows symptom log for paid tiers", () => {
    expect(canAccessSymptomLog("awareness")).toBe(true);
    expect(canAccessSymptomLog("foundation")).toBe(true);
  });

  it("blocks symptom log for free accounts", () => {
    expect(canAccessSymptomLog(null)).toBe(false);
  });

  it("allows trial through the effective tier rather than a payment flag", () => {
    const trialTier = resolveEffectiveTier({
      tier: null,
      paymentStatus: "trial",
      trialStartDate: "2026-07-01T00:00:00Z",
      now: new Date("2026-07-03T00:00:00Z"),
    });
    expect(canAccessSymptomLog(trialTier)).toBe(true);
  });
});

describe("ai-coach-config", () => {
  it("allows all paid tiers for AI coach", () => {
    expect(isAiCoachAvailable("awareness", "active", null)).toBe(true);
    expect(isAiCoachAvailable("integration", "active", null)).toBe(true);
  });
});
