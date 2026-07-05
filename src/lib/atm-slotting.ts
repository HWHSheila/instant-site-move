/**
 * ATM (Antecedents, Triggers, Mediators) pattern slotting.
 *
 * Q6 SEAM: Sub-category selection uses "all subcategories in assigned phases" (dev default).
 * When Sheila answers Q6, swap selectSubcategories() only — phase logic stays.
 */

import {
  NS_FOUNDATION_PHASE,
  PHASE_ORDER,
  SUBCATEGORIES_BY_PHASE,
} from "./roadmap-catalog";

export type SlottingMode = "all_in_phase" | "symptom_matched" | "packages";

export interface AssessmentSlottingInput {
  symptoms_gut: Array<{ symptom: string; frequency: string }>;
  symptoms_metabolic: Array<{ symptom: string; frequency: string }>;
  symptoms_hormonal: Array<{ symptom: string; frequency: string }>;
  past_diagnoses: string[];
  chronic_conditions: string[];
  lab_fasting_insulin?: string | null;
  lab_hba1c?: string | null;
  lab_fasting_glucose?: string | null;
}

export interface SlottingResult {
  slotting_mode: SlottingMode;
  phase_sequence: string[];
  included_subcategories: Record<string, string[]>;
  primary_pattern: string;
  secondary_pattern: string;
  atm_reasoning: string;
  current_phase: string;
  current_subcategory: string;
}

const METABOLIC_DIAGNOSES = [
  "PCOS",
  "PMOS",
  "Type 2 Diabetes",
  "Pre-diabetes",
  "Insulin Resistance",
  "Metabolic Syndrome",
];

const HORMONAL_DIAGNOSES = [
  "Hashimoto",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Endometriosis",
  "PCOS",
  "PMOS",
];

function symptomCount(items: Array<{ symptom: string; frequency: string }>): number {
  return items.length;
}

function hasDiagnosisMatch(diagnoses: string[], keywords: string[]): boolean {
  const lower = diagnoses.map((d) => d.toLowerCase());
  return keywords.some((kw) => lower.some((d) => d.includes(kw.toLowerCase())));
}

function hasLabMetabolicSignal(input: AssessmentSlottingInput): boolean {
  const labs = [input.lab_fasting_insulin, input.lab_hba1c, input.lab_fasting_glucose]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return labs.length > 0 && !labs.includes("not") && !labs.includes("normal");
}

/** Q6 seam — default: every sub-category in each assigned phase */
export function selectSubcategories(
  phases: string[],
  _input: AssessmentSlottingInput,
  mode: SlottingMode = "all_in_phase"
): Record<string, string[]> {
  if (mode !== "all_in_phase") {
    // Placeholder for Sheila's Q6 answer — symptom_matched or packages
    mode = "all_in_phase";
  }

  const result: Record<string, string[]> = {};
  result[NS_FOUNDATION_PHASE] = [...SUBCATEGORIES_BY_PHASE[NS_FOUNDATION_PHASE]];

  for (const phase of phases) {
    result[phase] = [...(SUBCATEGORIES_BY_PHASE[phase] ?? [])];
  }
  return result;
}

export function slotAssessment(
  input: AssessmentSlottingInput,
  mode: SlottingMode = "all_in_phase"
): SlottingResult {
  const gutCount = symptomCount(input.symptoms_gut);
  const metabolicCount = symptomCount(input.symptoms_metabolic);
  const hormonalCount = symptomCount(input.symptoms_hormonal);
  const allDiagnoses = [...input.past_diagnoses, ...input.chronic_conditions];

  const phases: string[] = ["Gut Function"];

  const includeMetabolic =
    metabolicCount >= 3 ||
    gutCount >= 1 ||
    hasDiagnosisMatch(allDiagnoses, METABOLIC_DIAGNOSES) ||
    hasLabMetabolicSignal(input);

  const includeHormonal =
    hormonalCount >= 3 ||
    hasDiagnosisMatch(allDiagnoses, HORMONAL_DIAGNOSES) ||
    (includeMetabolic && hasDiagnosisMatch(allDiagnoses, ["PCOS", "PMOS"]));

  if (includeMetabolic && !phases.includes("Metabolic Repair")) {
    phases.push("Metabolic Repair");
  }
  if (includeHormonal && !phases.includes("Hormonal Balancing")) {
    phases.push("Hormonal Balancing");
  }

  const included_subcategories = selectSubcategories(phases, input, mode);

  let primary_pattern = "Gut Function";
  let secondary_pattern = "Metabolic Repair";
  if (hormonalCount > gutCount && hormonalCount > metabolicCount) {
    primary_pattern = "Gut Function";
    secondary_pattern = "Hormonal Balancing";
  } else if (metabolicCount > gutCount) {
    primary_pattern = "Gut Function";
    secondary_pattern = "Metabolic Repair";
  }

  const subCategoryCount = Object.values(included_subcategories).flat().length;

  const atm_reasoning =
    `Based on your symptom patterns (${gutCount} gut-related, ${metabolicCount} metabolic, ${hormonalCount} hormone-related), ` +
    `your educational roadmap follows the Gut → Metabolism → Hormone order of operations. ` +
    `Nervous System Foundation runs in parallel from Day 1 because it supports all three systems. ` +
    `Your pathway includes ${phases.join(", ")} (${subCategoryCount} focus areas). ` +
    `This is an educational pattern summary, not a diagnosis.`;

  const current_phase = "Gut Function";
  const current_subcategory =
    included_subcategories["Gut Function"]?.[0] ?? "Introduction to Gut Health";

  return {
    slotting_mode: mode,
    phase_sequence: phases,
    included_subcategories,
    primary_pattern,
    secondary_pattern,
    atm_reasoning,
    current_phase,
    current_subcategory,
  };
}

export function countRoadmapSubcategories(
  included: Record<string, string[]>
): number {
  return Object.values(included).flat().length;
}
