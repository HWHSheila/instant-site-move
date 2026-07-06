/**
 * ATM (Antecedents, Triggers, Mediators) pattern slotting.
 *
 * Q6 (Sheila): Option B — targeted sub-categories based on symptoms, baseline
 * severity (29 ratings), lab results, and ATM/diagnosis signals. Severity wins
 * when it conflicts with consciously selected symptom categories.
 */

import {
  NS_FOUNDATION_PHASE,
  SUBCATEGORIES_BY_PHASE,
} from "./roadmap-catalog";

export type SlottingMode = "all_in_phase" | "symptom_matched" | "packages";

/** Rating <= this threshold counts as significant severity (1 = worst, 10 = best). */
const SEVERITY_THRESHOLD = 4;

export interface AssessmentSlottingInput {
  symptoms_gut: Array<{ symptom: string; frequency: string }>;
  symptoms_metabolic: Array<{ symptom: string; frequency: string }>;
  symptoms_hormonal: Array<{ symptom: string; frequency: string }>;
  symptoms_neuro?: Array<{ symptom: string; frequency: string }>;
  symptoms_systemic?: Array<{ symptom: string; frequency: string }>;
  past_diagnoses: string[];
  chronic_conditions: string[];
  family_conditions?: string[];
  baseline_ratings?: Record<string, number>;
  lab_fasting_insulin?: string | null;
  lab_hba1c?: string | null;
  lab_fasting_glucose?: string | null;
  lab_sibo?: string | null;
  lab_gi_map?: string | null;
  lab_tsh?: string | null;
  lab_free_t3?: string | null;
  lab_cortisol?: string | null;
  /** ATM antecedents — early antibiotic use, birth history, etc. */
  early_antibiotic_use?: boolean;
  chronic_stress_history?: boolean;
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
  "PMOS",
  "Type 2 diabetes",
  "Type 1 diabetes",
  "Pre-diabetes",
  "Insulin resistance",
  "Metabolic syndrome",
  "NAFLD",
  "fatty liver",
];

const HORMONAL_DIAGNOSES = [
  "Hashimoto",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Graves",
  "Endometriosis",
  "PMOS",
  "PMDD",
  "Perimenopause",
  "menopause",
  "fibroids",
];

const GUT_DIAGNOSES = ["IBS", "IBD", "Crohn", "Celiac", "SIBO", "GERD", "Diverticulitis"];

/** Sub-category keyword + rating signals for targeted slotting. */
const SUBCATEGORY_SIGNALS: Record<string, { keywords: string[]; ratingKeys: string[] }> = {
  "Introduction to Gut Health": { keywords: [], ratingKeys: [] },
  "Gut Lining Permeability": {
    keywords: ["food sensitiv", "leaky gut", "histamine", "intoleranc", "barrier", "nutrient"],
    ratingKeys: ["gut_food_sensitivity"],
  },
  "Gut Microbiome and Dysbiosis": {
    keywords: ["bloat", "gas", "dysbiosis", "microbiome", "infection", "dysbiosis"],
    ratingKeys: ["gut_bloating_frequency", "gut_abdominal_discomfort"],
  },
  "Digestive Dysfunction": {
    keywords: ["reflux", "heartburn", "nausea", "digest", "enzyme", "stomach", "emptying"],
    ratingKeys: ["gut_digestive_comfort"],
  },
  "Bowel Health": {
    keywords: ["constipat", "diarrhea", "bowel", "stool", "ibs", "urgency", "regularity"],
    ratingKeys: ["gut_bowel_regularity"],
  },
  SIBO: {
    keywords: ["sibo", "bloat", "after meals", "breath test"],
    ratingKeys: ["gut_bloating_frequency", "gut_abdominal_discomfort"],
  },
  "Introduction to Metabolic Health": { keywords: [], ratingKeys: [] },
  "Blood Sugar and Insulin Resistance": {
    keywords: ["blood sugar", "hypoglycemia", "crash", "craving", "insulin", "glucose", "hangry"],
    ratingKeys: ["energy_cravings", "energy_post_meal", "energy_afternoon"],
  },
  "GLP-1 and Natural Metabolic Hormones": {
    keywords: ["glp", "incretin", "satiety", "appetite", "metabolic signal"],
    ratingKeys: ["energy_cravings", "energy_post_meal"],
  },
  "Metabolic Rate and Body Composition": {
    keywords: ["weight", "fatigue", "exercise", "muscle", "metabolic rate", "body composition"],
    ratingKeys: ["energy_morning", "energy_exercise_recovery", "overall_daily_function"],
  },
  PMOS: {
    keywords: ["pmos", "pcos", "ovary", "androgen", "cycle irregular"],
    ratingKeys: ["hormone_cycle_regularity", "hormone_pms_severity"],
  },
  "Introduction to Hormonal Balancing": { keywords: [], ratingKeys: [] },
  "Estrogen and Progesterone Balance": {
    keywords: ["pms", "pmdd", "estrogen", "progesterone", "cycle", "period", "luteal", "breast"],
    ratingKeys: ["hormone_pms_severity", "hormone_mood_cycle", "hormone_mood_fluctuations"],
  },
  "Thyroid Function": {
    keywords: ["thyroid", "hashimoto", "hypothyroid", "hyperthyroid", "tsh", "cold intoler"],
    ratingKeys: ["energy_morning", "brain_fog"],
  },
  "Cortisol and Adrenal Function": {
    keywords: ["cortisol", "stress", "adrenal", "burnout", "wired", "overwhelm", "anxiety"],
    ratingKeys: ["ns_stress_response", "ns_overwhelm", "ns_ability_relax"],
  },
  Perimenopause: {
    keywords: ["perimenopause", "peri-menopause", "transition"],
    ratingKeys: ["hormone_hot_flashes", "hormone_mood_fluctuations"],
  },
  Menopause: {
    keywords: ["menopause", "hot flash", "night sweat", "postmenopausal"],
    ratingKeys: ["hormone_hot_flashes"],
  },
};

function symptomTexts(input: AssessmentSlottingInput): string[] {
  const all = [
    ...input.symptoms_gut,
    ...input.symptoms_metabolic,
    ...input.symptoms_hormonal,
    ...(input.symptoms_neuro ?? []),
    ...(input.symptoms_systemic ?? []),
  ];
  return all.map((s) => s.symptom.toLowerCase());
}

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

function hasLabGutSignal(input: AssessmentSlottingInput): boolean {
  if (input.lab_sibo?.toLowerCase() === "positive") return true;
  const giMap = (input.lab_gi_map ?? "").toLowerCase();
  return giMap.length > 0 && !giMap.includes("normal") && !giMap.includes("not tested");
}

function hasLabThyroidSignal(input: AssessmentSlottingInput): boolean {
  const labs = [input.lab_tsh, input.lab_free_t3].filter(Boolean).join(" ").toLowerCase();
  return labs.length > 0 && !labs.includes("normal") && !labs.includes("not tested");
}

function isSevere(ratings: Record<string, number>, keys: string[]): boolean {
  return keys.some((k) => {
    const v = ratings[k];
    return typeof v === "number" && v <= SEVERITY_THRESHOLD;
  });
}

function scoreSubcategory(
  subCategory: string,
  symptomText: string[],
  diagnoses: string[],
  ratings: Record<string, number>
): number {
  const signals = SUBCATEGORY_SIGNALS[subCategory];
  if (!signals) return 0;

  let score = 0;

  for (const kw of signals.keywords) {
    if (symptomText.some((s) => s.includes(kw))) score += 2;
    if (diagnoses.some((d) => d.includes(kw))) score += 3;
  }

  if (isSevere(ratings, signals.ratingKeys)) {
    score += 5; // Severity is the deciding factor per Sheila
  }

  return score;
}

function selectForPhase(
  phase: string,
  allSubs: string[],
  symptomText: string[],
  diagnoses: string[],
  ratings: Record<string, number>
): string[] {
  const intro = allSubs[0];
  const candidates = allSubs.slice(1);
  const selected: string[] = [intro];

  const scored = candidates
    .map((sub) => ({
      sub,
      score: scoreSubcategory(sub, symptomText, diagnoses, ratings),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const { sub } of scored) {
    if (!selected.includes(sub)) selected.push(sub);
  }

  // Minimum 1 non-intro sub-category when phase is assigned
  if (selected.length === 1 && candidates.length > 0) {
    const best =
      scored[0]?.sub ??
      candidates.find((c) => scoreSubcategory(c, symptomText, diagnoses, ratings) >= 0) ??
      candidates[0];
    selected.push(best);
  }

  return selected;
}

/** Q6: targeted sub-categories per phase (Option B). */
export function selectSubcategories(
  phases: string[],
  input: AssessmentSlottingInput,
  mode: SlottingMode = "symptom_matched"
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  result[NS_FOUNDATION_PHASE] = [...SUBCATEGORIES_BY_PHASE[NS_FOUNDATION_PHASE]];

  if (mode === "all_in_phase") {
    for (const phase of phases) {
      result[phase] = [...(SUBCATEGORIES_BY_PHASE[phase] ?? [])];
    }
    return result;
  }

  const symptomText = symptomTexts(input);
  const diagnoses = [
    ...input.past_diagnoses,
    ...input.chronic_conditions,
    ...(input.family_conditions ?? []),
  ].map((d) => d.toLowerCase());
  const ratings = input.baseline_ratings ?? {};

  for (const phase of phases) {
    const allSubs = SUBCATEGORIES_BY_PHASE[phase] ?? [];
    result[phase] = selectForPhase(phase, allSubs, symptomText, diagnoses, ratings);
  }

  return result;
}

export function slotAssessment(
  input: AssessmentSlottingInput,
  mode: SlottingMode = "symptom_matched"
): SlottingResult {
  const ratings = input.baseline_ratings ?? {};
  const gutCount = symptomCount(input.symptoms_gut);
  const metabolicCount = symptomCount(input.symptoms_metabolic);
  const hormonalCount = symptomCount(input.symptoms_hormonal);
  const allDiagnoses = [
    ...input.past_diagnoses,
    ...input.chronic_conditions,
    ...(input.family_conditions ?? []),
  ];

  const gutSeverity = isSevere(ratings, [
    "gut_bloating_frequency",
    "gut_bowel_regularity",
    "gut_digestive_comfort",
    "gut_food_sensitivity",
    "gut_abdominal_discomfort",
  ]);
  const metabolicSeverity = isSevere(ratings, [
    "energy_morning",
    "energy_afternoon",
    "energy_post_meal",
    "energy_cravings",
    "energy_exercise_recovery",
  ]);
  const hormonalSeverity = isSevere(ratings, [
    "hormone_cycle_regularity",
    "hormone_pms_severity",
    "hormone_hot_flashes",
    "hormone_mood_cycle",
    "hormone_skin_hair",
    "hormone_mood_fluctuations",
  ]);

  const phases: string[] = ["Gut Function"];

  const includeMetabolic =
    metabolicCount >= 2 ||
    gutCount >= 1 ||
    metabolicSeverity ||
    hasDiagnosisMatch(allDiagnoses, METABOLIC_DIAGNOSES) ||
    hasLabMetabolicSignal(input);

  const includeHormonal =
    hormonalCount >= 2 ||
    hormonalSeverity ||
    hasDiagnosisMatch(allDiagnoses, HORMONAL_DIAGNOSES) ||
    hasLabThyroidSignal(input) ||
    (input.lab_cortisol && !input.lab_cortisol.toLowerCase().includes("normal"));

  if (includeMetabolic && !phases.includes("Metabolic Repair")) {
    phases.push("Metabolic Repair");
  }
  if (includeHormonal && !phases.includes("Hormonal Balancing")) {
    phases.push("Hormonal Balancing");
  }

  // Gut severity alone keeps Gut Function even without many selected symptoms
  if (gutSeverity || hasDiagnosisMatch(allDiagnoses, GUT_DIAGNOSES) || hasLabGutSignal(input)) {
    if (!phases.includes("Gut Function")) phases.unshift("Gut Function");
  }

  const included_subcategories = selectSubcategories(phases, input, mode);

  let primary_pattern = "Gut Function";
  let secondary_pattern = "Metabolic Repair";
  if (hormonalSeverity && hormonalCount >= metabolicCount) {
    secondary_pattern = "Hormonal Balancing";
  } else if (metabolicSeverity || metabolicCount > gutCount) {
    secondary_pattern = "Metabolic Repair";
  }

  const subCategoryCount = Object.values(included_subcategories).flat().length;

  const atm_reasoning =
    `Based on your symptom patterns, baseline severity ratings, and health history ` +
    `(${gutCount} gut-related symptoms, ${metabolicCount} metabolic, ${hormonalCount} hormone-related), ` +
    `your educational roadmap follows the Gut → Metabolism → Hormone order of operations. ` +
    `Nervous System Foundation runs in parallel from Day 1. ` +
    `Your targeted pathway includes ${phases.join(", ")} (${subCategoryCount} focus areas). ` +
    `You will complete all relevant areas in each phase before moving to the next. ` +
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
