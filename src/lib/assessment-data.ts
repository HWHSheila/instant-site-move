/**
 * Assessment data constants for the 13-step Wellness Assessment.
 *
 * Updated from Sheila's planning responses (HWH_Planning_Questions_For_Sheila_COMPLETED.md):
 *   Q4 → MEDICAL_CONDITIONS
 *   Q5 → BASELINE_RATING_ITEMS (29 items)
 */

// ── Q4: Medical conditions checklist (Sheila-approved, May 2026) ──
export const MEDICAL_CONDITIONS_BY_CATEGORY = [
  {
    category: "Digestive / Gut",
    conditions: [
      "IBS",
      "IBD (Crohn's or Ulcerative Colitis)",
      "Celiac disease",
      "SIBO",
      "GERD / acid reflux",
      "Gallbladder disease or removal",
      "Diverticulitis",
    ],
  },
  {
    category: "Metabolic / Blood Sugar",
    conditions: [
      "Type 2 diabetes",
      "Type 1 diabetes",
      "Pre-diabetes / insulin resistance",
      "Metabolic syndrome",
      "Non-alcoholic fatty liver disease",
    ],
  },
  {
    category: "Thyroid",
    conditions: [
      "Hashimoto's thyroiditis",
      "Hypothyroidism",
      "Hyperthyroidism / Graves' disease",
      "Thyroid nodules or goiter",
    ],
  },
  {
    category: "Hormonal / Reproductive",
    conditions: [
      "PMOS (Polyendocrine Metabolic Ovarian Syndrome)",
      "Endometriosis",
      "Uterine fibroids",
      "Infertility",
      "Perimenopause / menopause related conditions",
      "Premenstrual Dysphoric Disorder (PMDD)",
    ],
  },
  {
    category: "Autoimmune",
    conditions: [
      "Rheumatoid arthritis",
      "Lupus",
      "Psoriasis / psoriatic arthritis",
      "Multiple sclerosis",
    ],
  },
  {
    category: "Mental Health / Nervous System",
    conditions: [
      "Anxiety",
      "Depression",
      "ADHD",
      "Chronic stress / burnout diagnosis",
    ],
  },
  {
    category: "Chronic Pain / Fatigue",
    conditions: [
      "Fibromyalgia",
      "Chronic fatigue syndrome / ME",
      "Chronic migraines",
    ],
  },
  {
    category: "Cardiovascular / Other",
    conditions: [
      "High blood pressure",
      "High cholesterol",
      "Anemia",
      "Sleep apnea",
    ],
  },
  {
    category: "Cancer",
    conditions: ["Any cancer diagnosis"],
  },
] as const;

export const MEDICAL_CONDITIONS = MEDICAL_CONDITIONS_BY_CATEGORY.flatMap(
  (group) => group.conditions
);

// ── Symptom Inventory (Step 6) — from spec sections 6.1-6.8 ──
export const SYMPTOM_CATEGORIES = [
  {
    key: "symptoms_gut",
    label: "Gut & Digestive Symptoms",
    subcategories: [
      {
        label: "Digestive & GI",
        symptoms: [
          "Bloating especially after meals",
          "Abdominal distension",
          "Excessive or painful gas",
          "Burping",
          "Acid reflux or heartburn",
          "Nausea",
          "Early satiety (getting full quickly)",
          "Delayed stomach emptying",
          "Constipation",
          "Diarrhea",
          "Alternating constipation and diarrhea",
          "Loose stools",
          "Pale stools",
          "Floating stools",
          "Undigested food in stool",
          "Mucus in stool",
          "Foul-smelling stool",
          "Incomplete bowel movements",
          "Urgency to use the bathroom",
          "IBS-type symptoms",
        ],
      },
      {
        label: "Gut Barrier & Immune",
        symptoms: [
          "Food sensitivities or reactions",
          "New food intolerances",
          "Worsening symptoms with healthy foods",
          "Histamine reactions",
          "Hives or rashes after eating",
          "Flushing",
          "Itching",
          "Sinus congestion after meals",
          "Frequent infections",
          "Autoimmune flares",
          "Elevated inflammation markers on labs",
          "Leaky gut type symptoms",
        ],
      },
      {
        label: "Nutrient Absorption",
        symptoms: [
          "Iron deficiency (diagnosed or suspected)",
          "B12 deficiency (diagnosed or suspected)",
          "Folate deficiency (diagnosed or suspected)",
          "Magnesium deficiency (diagnosed or suspected)",
          "Fat-soluble vitamin deficiencies (A, D, E, K)",
          "Easy bruising",
          "Brittle nails",
          "Hair thinning or hair loss",
          "Dry skin",
          "Cracks at corners of mouth",
          "Burning tongue",
          "Glossitis (inflamed tongue)",
        ],
      },
    ],
  },
  {
    key: "symptoms_metabolic",
    label: "Metabolic Symptoms",
    subcategories: [
      {
        label: "Blood Sugar Instability",
        symptoms: [
          "Reactive hypoglycemia",
          "Blood sugar crashes",
          "Shakiness between meals",
          "Dizziness",
          "Lightheadedness",
          "Sweating not related to temperature",
          "Anxiety after meals",
          "Irritability when hungry",
          "Hangry episodes",
          "Needing to eat frequently to feel okay",
          "Nighttime hunger",
          "Waking between 2-4am",
          "Sugar cravings",
          "Carbohydrate cravings",
          "Salt cravings",
        ],
      },
      {
        label: "Energy & Weight",
        symptoms: [
          "Chronic fatigue",
          "Post-meal fatigue",
          "Afternoon energy crashes",
          "Exercise intolerance",
          "Poor recovery from workouts",
          "Feeling worse with calorie restriction",
          "Weight gain despite dieting",
          "Weight gain concentrated in abdomen",
          "Inability to lose weight",
          "Rapid weight gain",
          "Weight cycling (losing and regaining repeatedly)",
          "Loss of lean muscle",
          "Increased fat storage under stress",
        ],
      },
      {
        label: "Metabolic Stress Signals",
        symptoms: [
          "Cold intolerance",
          "Heat intolerance",
          "Low body temperature",
          "Cold hands and feet",
          "Elevated resting heart rate",
          "Blood pressure swings",
          "Elevated fasting insulin on labs",
          "Elevated triglycerides on labs",
          "Elevated fasting glucose on labs",
          "Elevated A1C or normal A1C but still symptomatic",
        ],
      },
    ],
  },
  {
    key: "symptoms_hormonal",
    label: "Hormone-Related Symptoms",
    subcategories: [
      {
        label: "Menstrual & Reproductive",
        symptoms: [
          "Irregular cycles",
          "Short cycles (less than 24 days)",
          "Long cycles (more than 35 days)",
          "Missed periods",
          "Heavy periods",
          "Painful periods",
          "Clotting",
          "Spotting between periods",
          "PMS symptoms",
          "PMDD symptoms",
          "Ovulation pain",
          "Infertility",
          "Recurrent miscarriage",
          "Perimenopause symptoms",
          "Early menopause",
        ],
      },
      {
        label: "Estrogen & Progesterone Imbalance",
        symptoms: [
          "Breast tenderness",
          "Fibrocystic breasts",
          "Migraines especially hormonal",
          "Fluid retention",
          "Swelling",
          "Endometriosis symptoms",
          "Fibroids",
          "Mood swings",
          "Anxiety",
          "Depression",
          "Low stress tolerance",
          "Insomnia especially in the second half of the cycle",
        ],
      },
      {
        label: "Cortisol & Stress Hormones",
        symptoms: [
          "Wired but tired feeling",
          "Anxiety without a clear cause",
          "Panic attacks",
          "Poor stress resilience",
          "Crashing after stressful events",
          "Feeling on edge",
          "Burnout",
          "Sleep disruption",
          "Early morning waking",
          "Difficulty falling asleep",
          "Night sweats",
        ],
      },
      {
        label: "Thyroid-Related",
        symptoms: [
          "Fatigue",
          "Brain fog",
          "Hair thinning",
          "Hair loss including outer eyebrows",
          "Dry skin",
          "Constipation",
          "Cold intolerance",
          "Hoarseness",
          "Puffy face",
          "Swollen neck sensation",
          "Difficulty swallowing that comes and goes",
          "Low motivation",
          "Depression",
          "Menstrual irregularities",
        ],
      },
    ],
  },
  {
    key: "symptoms_neuro",
    label: "Neurological & Cognitive Symptoms",
    subcategories: [
      {
        label: "Neurological & Cognitive",
        symptoms: [
          "Brain fog",
          "Poor concentration",
          "Memory issues",
          "Word-finding difficulty",
          "ADHD-like symptoms",
          "Anxiety",
          "Depression",
          "Mood instability",
          "Irritability",
          "Low motivation",
          "Emotional reactivity",
          "Feeling overwhelmed easily",
          "Dissociation",
          "Panic symptoms",
        ],
      },
    ],
  },
  {
    key: "symptoms_skin",
    label: "Skin, Hair & Connective Tissue",
    subcategories: [
      {
        label: "Skin, Hair & Connective Tissue",
        symptoms: [
          "Acne especially along the jawline",
          "Adult-onset acne",
          "Rosacea",
          "Eczema",
          "Psoriasis",
          "Rashes",
          "Hives",
          "Itching",
          "Dry skin",
          "Oily skin",
          "Hair thinning",
          "Hair shedding",
          "Brittle nails",
          "Ridged nails",
          "Slow wound healing",
          "Easy bruising",
          "Stretch marks",
          "Cellulite changes",
        ],
      },
    ],
  },
  {
    key: "symptoms_cardio",
    label: "Cardiovascular & Fluid Regulation",
    subcategories: [
      {
        label: "Cardiovascular & Fluid Regulation",
        symptoms: [
          "Palpitations",
          "Tachycardia (racing heart)",
          "Blood pressure swings",
          "Orthostatic hypotension (dizziness on standing)",
          "Dizziness on standing",
          "Swelling in ankles or hands",
          "Water retention",
          "Puffy face",
          "Head pressure",
          "Exercise intolerance",
        ],
      },
    ],
  },
  {
    key: "symptoms_sexual",
    label: "Sexual Health & Libido",
    subcategories: [
      {
        label: "Sexual Health & Libido",
        symptoms: [
          "Low libido",
          "Vaginal dryness",
          "Pain with intercourse",
          "Recurrent UTIs",
          "Recurrent yeast infections",
          "Recurrent bacterial vaginosis",
          "Pelvic discomfort",
        ],
      },
    ],
  },
  {
    key: "symptoms_systemic",
    label: "Systemic & Unexplained Symptoms",
    subcategories: [
      {
        label: "Systemic & Unexplained",
        symptoms: [
          "Feeling off but labs are normal",
          "Symptoms that do not fit one diagnosis",
          "Symptoms that worsen with dieting",
          "Feeling worse with fasting",
          "Feeling worse with intense exercise",
          "Feeling worse under stress",
          "Symptoms that come and go",
          "Symptoms that worsen cyclically with the menstrual cycle",
          "Being told it is just anxiety",
          "Being told results are normal despite feeling unwell",
        ],
      },
    ],
  },
];

// ── Q5: Baseline rating items (29 items — Sheila-approved) ──
export const BASELINE_RATING_ITEMS = [
  {
    category: "Gut Health",
    items: [
      { key: "gut_bloating_frequency", label: "Bloating frequency" },
      { key: "gut_bowel_regularity", label: "Bowel regularity" },
      { key: "gut_digestive_comfort", label: "Digestive comfort after meals" },
      { key: "gut_food_sensitivity", label: "Food sensitivity reactions" },
      { key: "gut_abdominal_discomfort", label: "Abdominal discomfort" },
    ],
  },
  {
    category: "Energy & Metabolism",
    items: [
      { key: "energy_morning", label: "Morning energy" },
      { key: "energy_afternoon", label: "Afternoon energy" },
      { key: "energy_post_meal", label: "Post-meal energy stability" },
      { key: "energy_cravings", label: "Cravings intensity" },
      { key: "energy_exercise_recovery", label: "Exercise recovery" },
    ],
  },
  {
    category: "Hormonal Health",
    items: [
      { key: "hormone_cycle_regularity", label: "Cycle regularity (if applicable)" },
      { key: "hormone_pms_severity", label: "PMS severity (if applicable)" },
      { key: "hormone_hot_flashes", label: "Hot flash / night sweat frequency (if applicable)" },
      { key: "hormone_mood_cycle", label: "Mood stability across cycle" },
      { key: "hormone_skin_hair", label: "Skin / hair quality" },
      { key: "hormone_mood_fluctuations", label: "Mood fluctuations" },
    ],
  },
  {
    category: "Nervous System",
    items: [
      { key: "ns_sleep_quality", label: "Sleep quality" },
      { key: "ns_time_to_sleep", label: "Time to fall asleep" },
      { key: "ns_stress_response", label: "Stress response" },
      { key: "ns_ability_relax", label: "Ability to relax" },
      { key: "ns_overwhelm", label: "Overwhelm frequency" },
    ],
  },
  {
    category: "Brain & Cognitive",
    items: [
      { key: "brain_fog", label: "Brain fog" },
      { key: "brain_focus", label: "Focus duration" },
      { key: "brain_memory", label: "Memory recall" },
    ],
  },
  {
    category: "Overall Wellbeing",
    items: [
      { key: "overall_symptom_burden", label: "Overall symptom burden" },
      { key: "overall_daily_function", label: "Daily function" },
      { key: "overall_quality_of_life", label: "Quality of life" },
      { key: "overall_joint_pain", label: "Joint pain" },
      { key: "overall_muscle_aches", label: "Muscle / body aches" },
    ],
  },
];

// ── Step 7 options ──
export const DIETS_TRIED = [
  "Keto",
  "Intermittent Fasting",
  "Low Fat",
  "Vegan",
  "Elimination",
  "Gluten Free",
  "Dairy Free",
  "Other",
];

// ── Step 9 options ──
export const STRESS_SOURCES = [
  "Work",
  "Finances",
  "Relationships",
  "Health",
  "Family",
  "Other",
];

export const COPING_MECHANISMS = [
  "Exercise",
  "Meditation",
  "Therapy",
  "Journaling",
  "None",
  "Other",
];

// ── Step 10 options ──
export const MOVEMENT_BARRIERS = [
  "Time",
  "Energy",
  "Pain",
  "Motivation",
  "Access",
  "None",
];
