import { describe, it, expect } from "vitest";
import { slotAssessment, selectSubcategories } from "../atm-slotting";
import { SUBCATEGORIES_BY_PHASE } from "../roadmap-catalog";

describe("atm-slotting", () => {
  it("uses symptom_matched mode by default and does not include all subcategories", () => {
    const result = slotAssessment({
      symptoms_gut: [{ symptom: "Bloating after meals", frequency: "Daily" }],
      symptoms_metabolic: [],
      symptoms_hormonal: [],
      past_diagnoses: [],
      chronic_conditions: [],
      baseline_ratings: { gut_bloating_frequency: 2 },
    });

    expect(result.slotting_mode).toBe("symptom_matched");
    const gutSubs = result.included_subcategories["Gut Function"] ?? [];
    const allGut = SUBCATEGORIES_BY_PHASE["Gut Function"];
    expect(gutSubs.length).toBeLessThan(allGut.length);
    expect(gutSubs.length).toBeGreaterThanOrEqual(2); // intro + at least one
  });

  it("includes at least one non-intro subcategory per assigned phase", () => {
    const result = slotAssessment({
      symptoms_gut: [{ symptom: "Constipation", frequency: "Daily" }],
      symptoms_metabolic: [{ symptom: "Sugar cravings", frequency: "Daily" }],
      symptoms_hormonal: [],
      past_diagnoses: [],
      chronic_conditions: [],
      baseline_ratings: {
        gut_bowel_regularity: 3,
        energy_cravings: 3,
      },
    });

    for (const phase of result.phase_sequence) {
      const subs = result.included_subcategories[phase] ?? [];
      expect(subs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("preserves phase order Gut then Metabolic then Hormonal", () => {
    const result = slotAssessment({
      symptoms_gut: [{ symptom: "Bloating", frequency: "Daily" }],
      symptoms_metabolic: [{ symptom: "Cravings", frequency: "Daily" }],
      symptoms_hormonal: [{ symptom: "PMS", frequency: "Daily" }],
      past_diagnoses: [],
      chronic_conditions: [],
      baseline_ratings: {
        gut_bloating_frequency: 2,
        energy_cravings: 2,
        hormone_pms_severity: 2,
      },
    });

    expect(result.phase_sequence[0]).toBe("Gut Function");
    if (result.phase_sequence.includes("Metabolic Repair")) {
      expect(result.phase_sequence.indexOf("Metabolic Repair")).toBeGreaterThan(
        result.phase_sequence.indexOf("Gut Function")
      );
    }
  });

  it("all_in_phase mode includes every subcategory", () => {
    const subs = selectSubcategories(
      ["Gut Function"],
      {
        symptoms_gut: [],
        symptoms_metabolic: [],
        symptoms_hormonal: [],
        past_diagnoses: [],
        chronic_conditions: [],
      },
      "all_in_phase"
    );
    expect(subs["Gut Function"].length).toBe(SUBCATEGORIES_BY_PHASE["Gut Function"].length);
  });
});
