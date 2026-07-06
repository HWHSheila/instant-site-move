import { describe, it, expect } from "vitest";
import { BASELINE_RATING_ITEMS, MEDICAL_CONDITIONS } from "../assessment-data";

describe("assessment-data", () => {
  it("has exactly 29 baseline rating items", () => {
    const keys = BASELINE_RATING_ITEMS.flatMap((c) => c.items.map((i) => i.key));
    expect(keys).toHaveLength(29);
    expect(new Set(keys).size).toBe(29);
  });

  it("includes PMOS and not legacy PCOS label in conditions", () => {
    const joined = MEDICAL_CONDITIONS.join(" ");
    expect(joined).toMatch(/PMOS/i);
    expect(joined).not.toMatch(/PCOS \(Polycystic/i);
  });

  it("includes Sheila-approved overall wellbeing items", () => {
    const keys = BASELINE_RATING_ITEMS.flatMap((c) => c.items.map((i) => i.key));
    expect(keys).toContain("overall_joint_pain");
    expect(keys).toContain("overall_muscle_aches");
    expect(keys).toContain("hormone_mood_fluctuations");
    expect(keys).toContain("brain_fog");
  });
});
