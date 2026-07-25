import { describe, it, expect } from "vitest";
import {
  recommendTier,
  labelPatternSeverity,
  labelPatternSeverityFromAverage,
} from "../tier-recommendation";

function mildRatings(n = 20): Record<string, number> {
  const out: Record<string, number> = {};
  for (let i = 0; i < n; i++) out[`r_${i}`] = 8;
  return out;
}

describe("recommendTier (Sheila-approved 25 July 2026)", () => {
  it("returns Awareness for averages 8.0+ even with many focus areas", () => {
    // Was Integration under the old OR-breadth rule
    const rec = recommendTier(9, mildRatings());
    expect(rec.recommended_tier).toBe("awareness");
    expect(rec.average_baseline).toBeGreaterThanOrEqual(8);
  });

  it("returns Foundation for mild-but-not-quiet averages (6.5–7.9) even with breadth 6+", () => {
    const ratings: Record<string, number> = {};
    for (let i = 0; i < 10; i++) ratings[`r_${i}`] = 7;
    const rec = recommendTier(9, ratings);
    expect(rec.recommended_tier).toBe("foundation");
  });

  it("does not lift Awareness or Foundation when breadth is 6+", () => {
    expect(recommendTier(8, mildRatings()).recommended_tier).toBe("awareness");
    const mostlyMild: Record<string, number> = {};
    for (let i = 0; i < 10; i++) mostlyMild[`r_${i}`] = 7;
    expect(recommendTier(8, mostlyMild).recommended_tier).toBe("foundation");
  });

  it("lifts Guided by one step when breadth is 6+", () => {
    // average 5.5 -> Guided start, breadth 7 -> Restoration
    const ratings: Record<string, number> = {};
    for (let i = 0; i < 10; i++) ratings[`r_${i}`] = 5.5;
    const rec = recommendTier(7, ratings);
    expect(rec.recommended_tier).toBe("restoration");
  });

  it("returns Integration for severe averages", () => {
    const ratings: Record<string, number> = {};
    for (let i = 0; i < 10; i++) ratings[`r_${i}`] = 2;
    expect(recommendTier(3, ratings).recommended_tier).toBe("integration");
  });
});

describe("labelPatternSeverity", () => {
  it("maps 8-10 to low, 5-7 to medium, 1-4 to high", () => {
    expect(labelPatternSeverity(10)).toBe("low");
    expect(labelPatternSeverity(8)).toBe("low");
    expect(labelPatternSeverity(7)).toBe("medium");
    expect(labelPatternSeverity(5)).toBe("medium");
    expect(labelPatternSeverity(4)).toBe("high");
    expect(labelPatternSeverity(1)).toBe("high");
  });

  it("labels a mild domain average as low", () => {
    expect(
      labelPatternSeverityFromAverage({ a: 8, b: 9, c: 8 })
    ).toBe("low");
  });
});
