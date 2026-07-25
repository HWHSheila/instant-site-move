import { describe, it, expect } from "vitest";
import { resolveEffectiveTier, trialDayNumber, tierMeets } from "../effective-tier";

const TRIAL_START = "2026-07-01T00:00:00Z";
const on = (isoDate: string) => new Date(isoDate);

describe("trialDayNumber", () => {
  it("counts the start date as day 1", () => {
    expect(trialDayNumber(TRIAL_START, on("2026-07-01T23:00:00Z"))).toBe(1);
  });

  it("counts whole days elapsed", () => {
    expect(trialDayNumber(TRIAL_START, on("2026-07-19T06:00:00Z"))).toBe(19);
    expect(trialDayNumber(TRIAL_START, on("2026-07-21T23:59:00Z"))).toBe(21);
  });

  it("returns null when there is no trial", () => {
    expect(trialDayNumber(null)).toBeNull();
  });
});

describe("resolveEffectiveTier", () => {
  const trial = (now: string, tier: string | null = null) =>
    resolveEffectiveTier({
      tier,
      paymentStatus: "trial",
      trialStartDate: TRIAL_START,
      now: on(now),
    });

  it("gives Foundation on days 1 to 18", () => {
    expect(trial("2026-07-01T00:00:00Z")).toBe("foundation");
    expect(trial("2026-07-18T00:00:00Z")).toBe("foundation");
  });

  it("opens Restoration on day 19 through 21", () => {
    expect(trial("2026-07-19T00:00:00Z")).toBe("restoration");
    expect(trial("2026-07-21T00:00:00Z")).toBe("restoration");
  });

  it("ignores a tier chosen during the trial, which must not grant early access", () => {
    expect(trial("2026-07-02T00:00:00Z", "integration")).toBe("foundation");
  });

  it("gives a free account no tier", () => {
    expect(
      resolveEffectiveTier({ tier: null, paymentStatus: "none", trialStartDate: null })
    ).toBeNull();
  });

  it("ignores a stale tier on an unpaid row", () => {
    expect(
      resolveEffectiveTier({ tier: "restoration", paymentStatus: "none", trialStartDate: null })
    ).toBeNull();
  });

  it("honours the billed tier once active", () => {
    expect(
      resolveEffectiveTier({ tier: "guided", paymentStatus: "active", trialStartDate: TRIAL_START })
    ).toBe("guided");
  });

  it("keeps access while past due and removes it once cancelled", () => {
    expect(
      resolveEffectiveTier({ tier: "guided", paymentStatus: "past_due", trialStartDate: null })
    ).toBe("guided");
    expect(
      resolveEffectiveTier({ tier: "guided", paymentStatus: "cancelled", trialStartDate: null })
    ).toBeNull();
  });
});

describe("tierMeets", () => {
  it("is cumulative upward", () => {
    expect(tierMeets("restoration", "foundation")).toBe(true);
    expect(tierMeets("foundation", "restoration")).toBe(false);
    expect(tierMeets(null, "awareness")).toBe(false);
  });
});
