import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  MEDICAL_CONDITIONS,
  SYMPTOM_CATEGORIES,
  DIETS_TRIED,
  STRESS_SOURCES,
  COPING_MECHANISMS,
  MOVEMENT_BARRIERS,
  BASELINE_RATING_ITEMS,
} from "@/lib/assessment-data";
import { slotAssessment, countRoadmapSubcategories } from "@/lib/atm-slotting";
import { recommendTier } from "@/lib/tier-recommendation";
import {
  buildOrderedLessonList,
  buildInitialProgressRows,
  getInitialUnlockedCodes,
} from "@/lib/content-locking";

const TOTAL_STEPS = 13;

const STEP_TITLES = [
  "About You & Your Goals",
  "Medical History",
  "Medications & Supplements",
  "Family Health History",
  "Early Life & Birth History",
  "Symptom Inventory",
  "Diet & Nutrition",
  "Sleep Patterns",
  "Stress & Mental Health",
  "Movement & Exercise",
  "Environmental Exposures",
  "Lab & Test Results",
  "Day 1 Baseline Ratings",
];

const CONSENT_TEXT =
  "I understand that the information I provide in this assessment will be used to generate a personalized educational wellness pattern summary. I understand that this is not a medical assessment, diagnosis, or treatment plan. I consent to Her Wellness Harmony collecting and storing this information for the purpose of personalizing my educational experience within the portal. Her Wellness Harmony will never sell, share, or disclose my personal information to any third party. I have read and agree to the Her Wellness Harmony Terms of Service and Privacy Policy.";

type FormData = Record<string, any>;

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <Label htmlFor={htmlFor} className="text-sm font-medium">{children}</Label>;
}

function FrequencyChip({
  symptom,
  frequency,
  onSelect,
}: {
  symptom: string;
  frequency: string | null;
  onSelect: (s: string, f: string | null) => void;
}) {
  const isSelected = frequency !== null;
  const freqs = ["Occasionally", "Often", "Always"];
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onSelect(symptom, isSelected ? null : "Occasionally")}
        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all text-sm w-full ${
          isSelected
            ? "border-primary bg-primary/10 text-primary"
            : "border-border hover:border-primary/50 hover:bg-muted"
        }`}
      >
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
        }`}>
          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <span className="flex-1">{symptom}</span>
      </button>
      {isSelected && (
        <div className="flex gap-1 ml-6">
          {freqs.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onSelect(symptom, f)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                frequency === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionMultiSelect({
  conditions,
  selected,
  onToggle,
}: {
  conditions: string[];
  selected: string[];
  onToggle: (c: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {conditions.map((c) => (
        <label key={c} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
          <Checkbox checked={selected.includes(c)} onCheckedChange={() => onToggle(c)} />
          <span>{c}</span>
        </label>
      ))}
    </div>
  );
}

function RadioSelect({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
          <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
          <span>{opt.label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

function RatingSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2 p-3 rounded-lg border border-border">
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-semibold text-primary w-8 text-center">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 = Severe</span>
        <span>10 = None</span>
      </div>
    </div>
  );
}

export default function PortalIntake() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const supabase = useSupabase();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [form, setForm] = useState<FormData>({
    // Step 1
    first_name: "", age: "", location: "", primary_health_goal: "", why_now: "",
    // Step 2
    past_diagnoses: [], past_diagnoses_other: "",
    surgeries_hospitalizations: false, surgeries_detail: "",
    chronic_conditions: [], chronic_conditions_other: "",
    pregnancy_count: "", delivery_count: "", miscarriage_count: "",
    head_injury_history: false,
    // Step 3
    current_rx: "", current_otc: "", current_supplements: "",
    past_rx: "", past_otc: "", past_supplements: "",
    childhood_antibiotics: "", adult_antibiotics: "", adult_antibiotics_detail: "",
    ppi_history: "", hormonal_contraceptive_history: false, hormonal_contraceptive_detail: "",
    // Step 4
    family_conditions: [],
    family_autoimmune: "", family_thyroid: "", family_metabolic: "",
    // Step 5
    birth_type: "", infant_feeding: "", childhood_antibiotics_early: "",
    childhood_illness: false, childhood_illness_detail: "",
    childhood_trauma: false, childhood_trauma_detail: "",
    // Step 6 — symptoms stored as { symptom: frequency } objects
    symptoms_gut: {} as Record<string, string>,
    symptoms_metabolic: {} as Record<string, string>,
    symptoms_hormonal: {} as Record<string, string>,
    symptoms_neuro: {} as Record<string, string>,
    symptoms_skin: {} as Record<string, string>,
    symptoms_cardio: {} as Record<string, string>,
    symptoms_sexual: {} as Record<string, string>,
    symptoms_systemic: {} as Record<string, string>,
    // Step 7
    meals_per_day: "", meal_timing: "", water_intake: "", caffeine_intake: "",
    alcohol_intake: "", food_sensitivities: "", diets_tried: [] as string[],
    food_relationship: "", eating_causes_symptoms: "",
    // Step 8
    avg_bedtime: "", avg_wake_time: "", avg_sleep_hours: "", sleep_quality: "",
    trouble_falling_asleep: "", trouble_staying_asleep: "",
    wake_to_urinate: "", feel_rested: "", shift_work: false,
    // Step 9
    stress_level: 5, stress_sources: [] as string[],
    anxiety_depression_history: "", trauma_history: "",
    coping_mechanisms: [] as string[], support_system: "", sense_of_purpose: "",
    // Step 10
    activity_level: "", exercise_type: "", exercise_frequency: "",
    sitting_hours: "", movement_barriers: [] as string[],
    // Step 11
    mold_exposure: "", chemical_exposure: false, water_source: "",
    personal_care: "", travel_exposure: false,
    // Step 12
    lab_tsh: "", lab_free_t3: "", lab_free_t4: "", lab_tpo_antibodies: "", lab_thyroid_diagnosis: "",
    lab_fasting_glucose: "", lab_fasting_insulin: "", lab_hba1c: "", lab_triglycerides: "",
    lab_hdl: "", lab_alt_ast: "",
    lab_estrogen: "", lab_progesterone: "", lab_cortisol: "", lab_dheas: "", lab_testosterone: "",
    lab_crp: "", lab_esr: "", lab_homocysteine: "",
    lab_gi_map: "", lab_sibo: "", lab_food_sensitivity: "",
    lab_ferritin: "", lab_vitamin_d: "", lab_b12: "", lab_magnesium: "", lab_other: "",
    // Step 13 — baseline ratings (initialized to 5 for all 29 items)
    baseline_ratings: Object.fromEntries(
      BASELINE_RATING_ITEMS.flatMap((cat) => cat.items.map((item) => [item.key, 5]))
    ),
    baseline_open_improved: "", baseline_open_challenging: "", baseline_open_note: "",
  });

  const set = useCallback((key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  const toggleArray = useCallback((key: string, item: string) => {
    setForm((prev) => {
      const arr: string[] = prev[key] || [];
      return { ...prev, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
  }, []);

  const setSymptomFrequency = useCallback((category: string, symptom: string, freq: string | null) => {
    setForm((prev) => {
      const current = { ...prev[category] };
      if (freq === null) {
        delete current[symptom];
      } else {
        current[symptom] = freq;
      }
      return { ...prev, [category]: current };
    });
  }, []);

  const setRating = useCallback((key: string, val: number) => {
    setForm((prev) => ({
      ...prev,
      baseline_ratings: { ...prev.baseline_ratings, [key]: val },
    }));
  }, []);

  async function handleSubmit() {
    if (!subscriber || !consentChecked) return;
    setSubmitting(true);

    try {
      const symptomsToArray = (obj: Record<string, string>) =>
        Object.entries(obj).map(([symptom, frequency]) => ({ symptom, frequency }));

      const { data: assessment, error: insertErr } = await supabase
        .from("wellness_assessments" as any)
        .insert({
          subscriber_id: subscriber.id,
          status: "completed",
          current_step: 13,
          first_name: form.first_name,
          age: form.age ? parseInt(form.age) : null,
          location: form.location,
          primary_health_goal: form.primary_health_goal,
          why_now: form.why_now,
          past_diagnoses: form.past_diagnoses,
          past_diagnoses_other: form.past_diagnoses_other,
          surgeries_hospitalizations: form.surgeries_hospitalizations,
          surgeries_detail: form.surgeries_detail,
          chronic_conditions: form.chronic_conditions,
          chronic_conditions_other: form.chronic_conditions_other,
          pregnancy_count: form.pregnancy_count ? parseInt(form.pregnancy_count) : null,
          delivery_count: form.delivery_count ? parseInt(form.delivery_count) : null,
          miscarriage_count: form.miscarriage_count ? parseInt(form.miscarriage_count) : null,
          head_injury_history: form.head_injury_history,
          current_rx: form.current_rx,
          current_otc: form.current_otc,
          current_supplements: form.current_supplements,
          past_rx: form.past_rx,
          past_otc: form.past_otc,
          past_supplements: form.past_supplements,
          childhood_antibiotics: form.childhood_antibiotics || null,
          adult_antibiotics: form.adult_antibiotics || null,
          adult_antibiotics_detail: form.adult_antibiotics_detail,
          ppi_history: form.ppi_history || null,
          hormonal_contraceptive_history: form.hormonal_contraceptive_history,
          hormonal_contraceptive_detail: form.hormonal_contraceptive_detail,
          family_conditions: form.family_conditions,
          family_autoimmune: form.family_autoimmune || null,
          family_thyroid: form.family_thyroid || null,
          family_metabolic: form.family_metabolic || null,
          birth_type: form.birth_type || null,
          infant_feeding: form.infant_feeding || null,
          childhood_antibiotics_early: form.childhood_antibiotics_early || null,
          childhood_illness: form.childhood_illness,
          childhood_illness_detail: form.childhood_illness_detail,
          childhood_trauma: form.childhood_trauma,
          childhood_trauma_detail: form.childhood_trauma_detail,
          symptoms_gut: symptomsToArray(form.symptoms_gut),
          symptoms_metabolic: symptomsToArray(form.symptoms_metabolic),
          symptoms_hormonal: symptomsToArray(form.symptoms_hormonal),
          symptoms_neuro: symptomsToArray(form.symptoms_neuro),
          symptoms_skin: symptomsToArray(form.symptoms_skin),
          symptoms_cardio: symptomsToArray(form.symptoms_cardio),
          symptoms_sexual: symptomsToArray(form.symptoms_sexual),
          symptoms_systemic: symptomsToArray(form.symptoms_systemic),
          meals_per_day: form.meals_per_day,
          meal_timing: form.meal_timing,
          water_intake: form.water_intake,
          caffeine_intake: form.caffeine_intake,
          alcohol_intake: form.alcohol_intake,
          food_sensitivities: form.food_sensitivities,
          diets_tried: form.diets_tried,
          food_relationship: form.food_relationship,
          eating_causes_symptoms: form.eating_causes_symptoms,
          avg_bedtime: form.avg_bedtime,
          avg_wake_time: form.avg_wake_time,
          avg_sleep_hours: form.avg_sleep_hours,
          sleep_quality: form.sleep_quality,
          trouble_falling_asleep: form.trouble_falling_asleep,
          trouble_staying_asleep: form.trouble_staying_asleep,
          wake_to_urinate: form.wake_to_urinate,
          feel_rested: form.feel_rested,
          shift_work: form.shift_work,
          stress_level: form.stress_level,
          stress_sources: form.stress_sources,
          anxiety_depression_history: form.anxiety_depression_history,
          trauma_history: form.trauma_history,
          coping_mechanisms: form.coping_mechanisms,
          support_system: form.support_system,
          sense_of_purpose: form.sense_of_purpose,
          activity_level: form.activity_level,
          exercise_type: form.exercise_type,
          exercise_frequency: form.exercise_frequency,
          sitting_hours: form.sitting_hours,
          movement_barriers: form.movement_barriers,
          mold_exposure: form.mold_exposure || null,
          chemical_exposure: form.chemical_exposure,
          water_source: form.water_source,
          personal_care: form.personal_care,
          travel_exposure: form.travel_exposure,
          lab_tsh: form.lab_tsh, lab_free_t3: form.lab_free_t3, lab_free_t4: form.lab_free_t4,
          lab_tpo_antibodies: form.lab_tpo_antibodies, lab_thyroid_diagnosis: form.lab_thyroid_diagnosis,
          lab_fasting_glucose: form.lab_fasting_glucose, lab_fasting_insulin: form.lab_fasting_insulin,
          lab_hba1c: form.lab_hba1c, lab_triglycerides: form.lab_triglycerides,
          lab_hdl: form.lab_hdl, lab_alt_ast: form.lab_alt_ast,
          lab_estrogen: form.lab_estrogen, lab_progesterone: form.lab_progesterone,
          lab_cortisol: form.lab_cortisol, lab_dheas: form.lab_dheas,
          lab_testosterone: form.lab_testosterone,
          lab_crp: form.lab_crp, lab_esr: form.lab_esr, lab_homocysteine: form.lab_homocysteine,
          lab_gi_map: form.lab_gi_map, lab_sibo: form.lab_sibo || null,
          lab_food_sensitivity: form.lab_food_sensitivity,
          lab_ferritin: form.lab_ferritin, lab_vitamin_d: form.lab_vitamin_d,
          lab_b12: form.lab_b12, lab_magnesium: form.lab_magnesium, lab_other: form.lab_other,
          baseline_ratings: form.baseline_ratings,
          baseline_open_text: {
            improved: form.baseline_open_improved,
            challenging: form.baseline_open_challenging,
            note_to_sheila: form.baseline_open_note,
          },
          completed_at: new Date().toISOString(),
        } as any)
        .select()
        .single();

      if (insertErr) throw insertErr;

      const assessmentId = (assessment as any).id;

      // ATM slotting + tier recommendation
      const slotting = slotAssessment({
        symptoms_gut: symptomsToArray(form.symptoms_gut),
        symptoms_metabolic: symptomsToArray(form.symptoms_metabolic),
        symptoms_hormonal: symptomsToArray(form.symptoms_hormonal),
        symptoms_neuro: symptomsToArray(form.symptoms_neuro),
        symptoms_systemic: symptomsToArray(form.symptoms_systemic),
        past_diagnoses: form.past_diagnoses,
        chronic_conditions: form.chronic_conditions,
        family_conditions: form.family_conditions,
        baseline_ratings: form.baseline_ratings,
        lab_fasting_insulin: form.lab_fasting_insulin,
        lab_hba1c: form.lab_hba1c,
        lab_fasting_glucose: form.lab_fasting_glucose,
        lab_sibo: form.lab_sibo,
        lab_gi_map: form.lab_gi_map,
        lab_tsh: form.lab_tsh,
        lab_free_t3: form.lab_free_t3,
        lab_cortisol: form.lab_cortisol,
        early_antibiotic_use:
          form.childhood_antibiotics === "yes" ||
          form.adult_antibiotics === "yes" ||
          form.childhood_antibiotics_early === "yes",
        chronic_stress_history: form.stress_level >= 7,
      });

      const tierRec = recommendTier(
        countRoadmapSubcategories(slotting.included_subcategories),
        form.baseline_ratings
      );

      // Initialize sequential content progress (videos fetched for ordering)
      const { data: allVideos, error: videosErr } = await supabase
        .from("portal_videos" as any)
        .select("video_code, title, phase, sub_category, sequence_order, is_foundation_layer, video_url, production_status")
        .order("sequence_order", { ascending: true });

      if (videosErr) throw videosErr;

      const orderedLessons = buildOrderedLessonList(
        (allVideos ?? []) as any[],
        slotting.included_subcategories
      );
      const unlockedCodes = getInitialUnlockedCodes(orderedLessons);
      const progressRows = buildInitialProgressRows(orderedLessons, unlockedCodes).map((row) => ({
        subscriber_id: subscriber.id,
        ...row,
      }));

      const { data: roadmap, error: roadmapErr } = await supabase
        .from("member_roadmaps" as any)
        .insert({
          subscriber_id: subscriber.id,
          assessment_id: assessmentId,
          phase_sequence: slotting.phase_sequence,
          included_subcategories: slotting.included_subcategories,
          primary_pattern: slotting.primary_pattern,
          secondary_pattern: slotting.secondary_pattern,
          atm_reasoning: slotting.atm_reasoning,
          recommended_tier: tierRec.recommended_tier,
          tier_reasoning: tierRec.tier_reasoning,
          current_phase: slotting.current_phase,
          current_subcategory: slotting.current_subcategory,
        } as any)
        .select()
        .single();

      if (roadmapErr) {
        console.error("Roadmap creation failed:", roadmapErr);
        throw roadmapErr;
      }

      if (progressRows.length > 0) {
        const { error: progressErr } = await supabase
          .from("member_content_progress" as any)
          .upsert(progressRows as any, { onConflict: "subscriber_id,video_code,content_type" });
        if (progressErr) {
          console.error("Progress init failed:", progressErr);
        }
      }

      // Log consent
      await supabase.from("assessment_consents" as any).insert({
        subscriber_id: subscriber.id,
        assessment_id: assessmentId,
        consent_text: CONSENT_TEXT,
      } as any);

      // Also insert the Day 1 baseline into mini_assessments for comparison view
      await supabase.from("mini_assessments" as any).insert({
        subscriber_id: subscriber.id,
        assessment_type: "baseline",
        day_number: 1,
        ratings: form.baseline_ratings,
        open_text_improved: form.baseline_open_improved,
        open_text_challenging: form.baseline_open_challenging,
        open_text_note_to_sheila: form.baseline_open_note,
      } as any);

      // Mark assessment complete on subscriber
      await supabase
        .from("subscribers" as any)
        .update({
          assessment_completed: true,
          assessment_completed_at: new Date().toISOString(),
          intake_completed: true,
        } as any)
        .eq("id", subscriber.id);

      // Also backward-compat: insert into intake_responses
      const totalSymptoms = (obj: Record<string, string>) => Object.keys(obj).length;
      const { data: intakeRow } = await supabase.from("intake_responses" as any).insert({
        subscriber_id: subscriber.id,
        gut_symptoms: Object.keys(form.symptoms_gut),
        metabolic_symptoms: Object.keys(form.symptoms_metabolic),
        hormonal_symptoms: Object.keys(form.symptoms_hormonal),
        test_results: {
          thyroid: [form.lab_tsh, form.lab_free_t3, form.lab_free_t4].filter(Boolean).join("; "),
          hormones: [form.lab_estrogen, form.lab_progesterone, form.lab_cortisol].filter(Boolean).join("; "),
          gut_panel: [form.lab_gi_map, form.lab_sibo].filter(Boolean).join("; "),
          other: form.lab_other,
        },
        health_history: form.primary_health_goal,
        goals: form.why_now,
        raw_form_data: form,
      } as any).select("id").single();

      const intakeResponseId = (intakeRow as any)?.id;

      // Call identify-patterns for backward compat (generates pattern_maps)
      if (intakeResponseId) {
        const { data: patternResult } = await supabase.functions.invoke("identify-patterns", {
          body: { subscriber_id: subscriber.id, intake_response_id: intakeResponseId },
        });
        navigate("/portal/results", {
          state: {
            patternResult: patternResult?.data,
            roadmap,
            tierRec,
            slotting,
          },
        });
      } else {
        navigate("/portal/results", {
          state: { roadmap, tierRec, slotting },
        });
      }
    } catch (err) {
      console.error("Assessment submission failed:", err);
      toast.error("Failed to submit assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (subscriber?.assessment_completed || subscriber?.intake_completed) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Assessment Already Completed</h2>
            <p className="text-muted-foreground">
              You've already completed your wellness assessment. View your results on the dashboard.
            </p>
            <Button onClick={() => navigate("/portal")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">Wellness Assessment</h1>
        <p className="text-muted-foreground mt-1">
          This assessment helps us identify your unique patterns and create a personalized roadmap. It is not a medical assessment or diagnosis.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{STEP_TITLES[step]}</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEP_TITLES[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Let's start with some basics about you and what brought you here."}
            {step === 1 && "Share your medical background so we can identify relevant patterns."}
            {step === 2 && "Current and past medications can reveal important patterns."}
            {step === 3 && "Genetic predispositions help us understand which patterns to watch."}
            {step === 4 && "Early life factors shape the foundation of your health patterns."}
            {step === 5 && "Select every symptom or pattern you have been experiencing. Don't filter yourself — include anything that feels relevant even if you have been told it is normal or unrelated. The more complete this picture is, the more personalized your roadmap will be."}
            {step === 6 && "Your diet and eating patterns tell us about your metabolic rhythm."}
            {step === 7 && "Sleep quality deeply impacts gut function and hormone balance."}
            {step === 8 && "Stress and emotional health affect every system in your body."}
            {step === 9 && "Movement and activity patterns affect metabolism and recovery."}
            {step === 10 && "Environmental factors can disrupt gut and hormone function."}
            {step === 11 && "Sharing your lab results is completely optional. If you have recent lab work, entering it here can help identify patterns and ensure your roadmap reflects the most complete picture. This information is used for educational pattern awareness only."}
            {step === 12 && "Rate how you have been experiencing each of the following patterns over the past week, from 1 (severe or constant) to 10 (none or resolved). This is not a clinical evaluation — it is your personal baseline so you can see your own progress over time."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Identifying Information & Chief Concerns */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="first_name">First name</FieldLabel>
                <Input id="first_name" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="Your first name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <Input id="age" type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 38" />
                </div>
                <div>
                  <FieldLabel htmlFor="location">Location (city/state)</FieldLabel>
                  <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Austin, TX" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="primary_health_goal">Primary health goal</FieldLabel>
                <Textarea id="primary_health_goal" value={form.primary_health_goal} onChange={(e) => set("primary_health_goal", e.target.value)} placeholder="What's the main thing you want to understand or improve?" rows={3} />
              </div>
              <div>
                <FieldLabel htmlFor="why_now">What prompted you to seek help now?</FieldLabel>
                <Textarea id="why_now" value={form.why_now} onChange={(e) => set("why_now", e.target.value)} placeholder="What changed or what is happening that brought you here at this point?" rows={3} />
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <FieldLabel>Past diagnoses (select all that apply)</FieldLabel>
                <ConditionMultiSelect conditions={MEDICAL_CONDITIONS} selected={form.past_diagnoses} onToggle={(c) => toggleArray("past_diagnoses", c)} />
                <div className="mt-2">
                  <FieldLabel htmlFor="past_diagnoses_other">Other diagnoses not listed above</FieldLabel>
                  <Input id="past_diagnoses_other" value={form.past_diagnoses_other} onChange={(e) => set("past_diagnoses_other", e.target.value)} placeholder="Anything else..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.surgeries_hospitalizations} onCheckedChange={(v) => set("surgeries_hospitalizations", !!v)} />
                  I've had surgeries or hospitalizations
                </label>
                {form.surgeries_hospitalizations && (
                  <Textarea value={form.surgeries_detail} onChange={(e) => set("surgeries_detail", e.target.value)} placeholder="Describe surgeries/hospitalizations with approximate year..." rows={2} />
                )}
              </div>
              <div>
                <FieldLabel>Chronic conditions currently managed</FieldLabel>
                <ConditionMultiSelect conditions={MEDICAL_CONDITIONS} selected={form.chronic_conditions} onToggle={(c) => toggleArray("chronic_conditions", c)} />
                <div className="mt-2">
                  <Input value={form.chronic_conditions_other} onChange={(e) => set("chronic_conditions_other", e.target.value)} placeholder="Other conditions not listed..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FieldLabel htmlFor="pregnancy_count">Pregnancies</FieldLabel>
                  <Input id="pregnancy_count" type="number" value={form.pregnancy_count} onChange={(e) => set("pregnancy_count", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <FieldLabel htmlFor="delivery_count">Deliveries</FieldLabel>
                  <Input id="delivery_count" type="number" value={form.delivery_count} onChange={(e) => set("delivery_count", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <FieldLabel htmlFor="miscarriage_count">Miscarriages</FieldLabel>
                  <Input id="miscarriage_count" type="number" value={form.miscarriage_count} onChange={(e) => set("miscarriage_count", e.target.value)} placeholder="0" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.head_injury_history} onCheckedChange={(v) => set("head_injury_history", !!v)} />
                History of head injury or concussion
              </label>
            </div>
          )}

          {/* Step 3: Medications & Supplements */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary">Current Medications & Supplements</p>
              <div>
                <FieldLabel htmlFor="current_rx">Prescription medications currently taking</FieldLabel>
                <Textarea id="current_rx" value={form.current_rx} onChange={(e) => set("current_rx", e.target.value)} placeholder="Name, dose, how long..." rows={2} />
              </div>
              <div>
                <FieldLabel htmlFor="current_otc">Over-the-counter medications used regularly</FieldLabel>
                <Textarea id="current_otc" value={form.current_otc} onChange={(e) => set("current_otc", e.target.value)} placeholder="Name, dose, how long..." rows={2} />
              </div>
              <div>
                <FieldLabel htmlFor="current_supplements">Supplements currently taking</FieldLabel>
                <Textarea id="current_supplements" value={form.current_supplements} onChange={(e) => set("current_supplements", e.target.value)} placeholder="Name, dose, how long..." rows={2} />
              </div>
              <p className="text-sm font-medium text-primary pt-2">Past Medications & Supplements</p>
              <div>
                <FieldLabel htmlFor="past_rx">Prescription medications taken in the past</FieldLabel>
                <Textarea id="past_rx" value={form.past_rx} onChange={(e) => set("past_rx", e.target.value)} placeholder="Name, approximate duration, when stopped..." rows={2} />
              </div>
              <div>
                <FieldLabel htmlFor="past_otc">OTC medications used regularly in the past</FieldLabel>
                <Textarea id="past_otc" value={form.past_otc} onChange={(e) => set("past_otc", e.target.value)} rows={2} />
              </div>
              <div>
                <FieldLabel htmlFor="past_supplements">Supplements taken in the past</FieldLabel>
                <Textarea id="past_supplements" value={form.past_supplements} onChange={(e) => set("past_supplements", e.target.value)} rows={2} />
              </div>
              <div>
                <FieldLabel>Frequent antibiotic use in childhood</FieldLabel>
                <RadioSelect name="childhood_antibiotics" value={form.childhood_antibiotics} onChange={(v) => set("childhood_antibiotics", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div>
                <FieldLabel>Frequent antibiotic use in adulthood</FieldLabel>
                <RadioSelect name="adult_antibiotics" value={form.adult_antibiotics} onChange={(v) => set("adult_antibiotics", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
                {form.adult_antibiotics === "yes" && (
                  <Textarea className="mt-2" value={form.adult_antibiotics_detail} onChange={(e) => set("adult_antibiotics_detail", e.target.value)} placeholder="Approximate frequency and duration..." rows={2} />
                )}
              </div>
              <div>
                <FieldLabel>History of long-term PPI use (omeprazole, pantoprazole, etc.)</FieldLabel>
                <RadioSelect name="ppi_history" value={form.ppi_history} onChange={(v) => set("ppi_history", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.hormonal_contraceptive_history} onCheckedChange={(v) => set("hormonal_contraceptive_history", !!v)} />
                  History of hormonal contraceptive use
                </label>
                {form.hormonal_contraceptive_history && (
                  <Input value={form.hormonal_contraceptive_detail} onChange={(e) => set("hormonal_contraceptive_detail", e.target.value)} placeholder="Type and duration..." />
                )}
              </div>
            </div>
          )}

          {/* Step 4: Family Health History */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <FieldLabel>Health conditions in immediate family (parents, grandparents, siblings)</FieldLabel>
                <ConditionMultiSelect conditions={MEDICAL_CONDITIONS} selected={form.family_conditions} onToggle={(c) => toggleArray("family_conditions", c)} />
              </div>
              <div>
                <FieldLabel>Family history of autoimmune conditions</FieldLabel>
                <RadioSelect name="family_autoimmune" value={form.family_autoimmune} onChange={(v) => set("family_autoimmune", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div>
                <FieldLabel>Family history of thyroid conditions</FieldLabel>
                <RadioSelect name="family_thyroid" value={form.family_thyroid} onChange={(v) => set("family_thyroid", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div>
                <FieldLabel>Family history of metabolic conditions (diabetes, PMOS, obesity)</FieldLabel>
                <RadioSelect name="family_metabolic" value={form.family_metabolic} onChange={(v) => set("family_metabolic", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
            </div>
          )}

          {/* Step 5: Early Life & Birth History */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <FieldLabel>Birth type</FieldLabel>
                <RadioSelect name="birth_type" value={form.birth_type} onChange={(v) => set("birth_type", v)} options={[{value:"vaginal",label:"Vaginal"},{value:"c_section",label:"C-section"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div>
                <FieldLabel>Feeding as infant</FieldLabel>
                <RadioSelect name="infant_feeding" value={form.infant_feeding} onChange={(v) => set("infant_feeding", v)} options={[{value:"breastfed",label:"Breastfed"},{value:"formula",label:"Formula"},{value:"combination",label:"Combination"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div>
                <FieldLabel>Frequent antibiotic use in childhood</FieldLabel>
                <RadioSelect name="childhood_antibiotics_early" value={form.childhood_antibiotics_early} onChange={(v) => set("childhood_antibiotics_early", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.childhood_illness} onCheckedChange={(v) => set("childhood_illness", !!v)} />
                  History of significant childhood illness
                </label>
                {form.childhood_illness && (
                  <Textarea value={form.childhood_illness_detail} onChange={(e) => set("childhood_illness_detail", e.target.value)} placeholder="Describe..." rows={2} />
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.childhood_trauma} onCheckedChange={(v) => set("childhood_trauma", !!v)} />
                  History of childhood trauma or chronic stress
                </label>
                {form.childhood_trauma && (
                  <Textarea value={form.childhood_trauma_detail} onChange={(e) => set("childhood_trauma_detail", e.target.value)} placeholder="Brief description (optional)..." rows={2} />
                )}
              </div>
            </div>
          )}

          {/* Step 6: Symptom Inventory */}
          {step === 5 && (
            <div className="space-y-6">
              {SYMPTOM_CATEGORIES.map((cat) => (
                <div key={cat.key} className="space-y-2">
                  <p className="text-sm font-semibold text-primary">{cat.label}</p>
                  {cat.subcategories.map((sub) => (
                    <div key={sub.label} className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{sub.label}</p>
                      <div className="grid grid-cols-1 gap-1">
                        {sub.symptoms.map((s) => (
                          <FrequencyChip
                            key={s}
                            symptom={s}
                            frequency={form[cat.key]?.[s] ?? null}
                            onSelect={(sym, freq) => setSymptomFrequency(cat.key, sym, freq)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Step 7: Diet & Nutrition */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <FieldLabel>Typical meals per day</FieldLabel>
                <RadioSelect name="meals_per_day" value={form.meals_per_day} onChange={(v) => set("meals_per_day", v)} options={[{value:"1",label:"1"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4+",label:"4+"},{value:"irregular",label:"Irregular"}]} />
              </div>
              <div>
                <FieldLabel>Meal timing consistency</FieldLabel>
                <RadioSelect name="meal_timing" value={form.meal_timing} onChange={(v) => set("meal_timing", v)} options={[{value:"very_consistent",label:"Very consistent"},{value:"somewhat_consistent",label:"Somewhat consistent"},{value:"inconsistent",label:"Inconsistent"}]} />
              </div>
              <div>
                <FieldLabel>Water intake per day</FieldLabel>
                <RadioSelect name="water_intake" value={form.water_intake} onChange={(v) => set("water_intake", v)} options={[{value:"<4",label:"Less than 4 cups"},{value:"4-6",label:"4-6 cups"},{value:"6-8",label:"6-8 cups"},{value:"8+",label:"8+ cups"}]} />
              </div>
              <div>
                <FieldLabel>Caffeine intake</FieldLabel>
                <RadioSelect name="caffeine_intake" value={form.caffeine_intake} onChange={(v) => set("caffeine_intake", v)} options={[{value:"none",label:"None"},{value:"1",label:"1 cup"},{value:"2-3",label:"2-3 cups"},{value:"4+",label:"4+ cups"}]} />
              </div>
              <div>
                <FieldLabel>Alcohol intake</FieldLabel>
                <RadioSelect name="alcohol_intake" value={form.alcohol_intake} onChange={(v) => set("alcohol_intake", v)} options={[{value:"none",label:"None"},{value:"occasional",label:"Occasional"},{value:"weekly",label:"Weekly"},{value:"daily",label:"Daily"}]} />
              </div>
              <div>
                <FieldLabel htmlFor="food_sensitivities">Food sensitivities or known allergies</FieldLabel>
                <Input id="food_sensitivities" value={form.food_sensitivities} onChange={(e) => set("food_sensitivities", e.target.value)} placeholder="List any known food sensitivities or allergies..." />
              </div>
              <div>
                <FieldLabel>Diets tried in the past</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {DIETS_TRIED.map((d) => (
                    <label key={d} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
                      <Checkbox checked={form.diets_tried.includes(d)} onCheckedChange={() => toggleArray("diets_tried", d)} />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Current relationship with food</FieldLabel>
                <RadioSelect name="food_relationship" value={form.food_relationship} onChange={(v) => set("food_relationship", v)} options={[{value:"healthy",label:"Healthy and flexible"},{value:"somewhat_restrictive",label:"Somewhat restrictive"},{value:"very_restrictive",label:"Very restrictive"},{value:"emotionally_complicated",label:"Emotionally complicated"}]} />
              </div>
              <div>
                <FieldLabel>Does eating cause digestive symptoms?</FieldLabel>
                <RadioSelect name="eating_causes_symptoms" value={form.eating_causes_symptoms} onChange={(v) => set("eating_causes_symptoms", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"sometimes",label:"Sometimes"}]} />
              </div>
            </div>
          )}

          {/* Step 8: Sleep Patterns */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="avg_bedtime">Average bedtime</FieldLabel>
                  <Input id="avg_bedtime" type="time" value={form.avg_bedtime} onChange={(e) => set("avg_bedtime", e.target.value)} />
                </div>
                <div>
                  <FieldLabel htmlFor="avg_wake_time">Average wake time</FieldLabel>
                  <Input id="avg_wake_time" type="time" value={form.avg_wake_time} onChange={(e) => set("avg_wake_time", e.target.value)} />
                </div>
              </div>
              <div>
                <FieldLabel>Average hours of sleep per night</FieldLabel>
                <RadioSelect name="avg_sleep_hours" value={form.avg_sleep_hours} onChange={(v) => set("avg_sleep_hours", v)} options={[{value:"<5",label:"Less than 5"},{value:"5-6",label:"5-6"},{value:"6-7",label:"6-7"},{value:"7-8",label:"7-8"},{value:"8+",label:"8+"}]} />
              </div>
              <div>
                <FieldLabel>Sleep quality</FieldLabel>
                <RadioSelect name="sleep_quality" value={form.sleep_quality} onChange={(v) => set("sleep_quality", v)} options={[{value:"poor",label:"Poor"},{value:"fair",label:"Fair"},{value:"good",label:"Good"},{value:"excellent",label:"Excellent"}]} />
              </div>
              {[
                { key: "trouble_falling_asleep", label: "Trouble falling asleep" },
                { key: "trouble_staying_asleep", label: "Trouble staying asleep" },
                { key: "wake_to_urinate", label: "Wake to urinate" },
                { key: "feel_rested", label: "Feel rested upon waking" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <RadioSelect name={key} value={form[key]} onChange={(v) => set(key, v)} options={[{value:"never",label:"Never"},{value:"sometimes",label:"Sometimes"},{value:"often",label:"Often"},{value:"always",label:"Always"}]} />
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.shift_work} onCheckedChange={(v) => set("shift_work", !!v)} />
                Shift work or irregular schedule
              </label>
            </div>
          )}

          {/* Step 9: Stress & Mental/Emotional Health */}
          {step === 8 && (
            <div className="space-y-4">
              <div>
                <FieldLabel>Current stress level (1-10)</FieldLabel>
                <div className="flex items-center gap-4">
                  <Slider value={[form.stress_level]} onValueChange={([v]) => set("stress_level", v)} min={1} max={10} step={1} className="flex-1" />
                  <span className="text-lg font-semibold text-primary w-8 text-center">{form.stress_level}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 = Minimal</span>
                  <span>10 = Extreme</span>
                </div>
              </div>
              <div>
                <FieldLabel>Primary sources of stress</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {STRESS_SOURCES.map((s) => (
                    <label key={s} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
                      <Checkbox checked={form.stress_sources.includes(s)} onCheckedChange={() => toggleArray("stress_sources", s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>History of anxiety or depression</FieldLabel>
                <RadioSelect name="anxiety_depression_history" value={form.anxiety_depression_history} onChange={(v) => set("anxiety_depression_history", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"prefer_not_to_say",label:"Prefer not to say"}]} />
              </div>
              <div>
                <FieldLabel>History of significant trauma</FieldLabel>
                <RadioSelect name="trauma_history" value={form.trauma_history} onChange={(v) => set("trauma_history", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"prefer_not_to_say",label:"Prefer not to say"}]} />
              </div>
              <div>
                <FieldLabel>Current coping mechanisms</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {COPING_MECHANISMS.map((c) => (
                    <label key={c} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
                      <Checkbox checked={form.coping_mechanisms.includes(c)} onCheckedChange={() => toggleArray("coping_mechanisms", c)} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Support system</FieldLabel>
                <RadioSelect name="support_system" value={form.support_system} onChange={(v) => set("support_system", v)} options={[{value:"strong",label:"Strong"},{value:"moderate",label:"Moderate"},{value:"limited",label:"Limited"},{value:"none",label:"None"}]} />
              </div>
              <div>
                <FieldLabel>Sense of purpose or meaning in daily life</FieldLabel>
                <RadioSelect name="sense_of_purpose" value={form.sense_of_purpose} onChange={(v) => set("sense_of_purpose", v)} options={[{value:"strong",label:"Strong"},{value:"moderate",label:"Moderate"},{value:"low",label:"Low"}]} />
              </div>
            </div>
          )}

          {/* Step 10: Movement & Exercise */}
          {step === 9 && (
            <div className="space-y-4">
              <div>
                <FieldLabel>Current activity level</FieldLabel>
                <RadioSelect name="activity_level" value={form.activity_level} onChange={(v) => set("activity_level", v)} options={[{value:"sedentary",label:"Sedentary"},{value:"lightly_active",label:"Lightly active"},{value:"moderately_active",label:"Moderately active"},{value:"very_active",label:"Very active"}]} />
              </div>
              <div>
                <FieldLabel>Primary exercise type</FieldLabel>
                <RadioSelect name="exercise_type" value={form.exercise_type} onChange={(v) => set("exercise_type", v)} options={[{value:"none",label:"None"},{value:"walking",label:"Walking"},{value:"strength",label:"Strength training"},{value:"cardio",label:"Cardio"},{value:"yoga",label:"Yoga"},{value:"mixed",label:"Mixed"}]} />
              </div>
              <div>
                <FieldLabel>Exercise frequency per week</FieldLabel>
                <RadioSelect name="exercise_frequency" value={form.exercise_frequency} onChange={(v) => set("exercise_frequency", v)} options={[{value:"0",label:"0 days"},{value:"1-2",label:"1-2 days"},{value:"3-4",label:"3-4 days"},{value:"5+",label:"5+ days"}]} />
              </div>
              <div>
                <FieldLabel>Hours of sitting per day</FieldLabel>
                <RadioSelect name="sitting_hours" value={form.sitting_hours} onChange={(v) => set("sitting_hours", v)} options={[{value:"<4",label:"Less than 4"},{value:"4-6",label:"4-6"},{value:"6-8",label:"6-8"},{value:"8+",label:"8+"}]} />
              </div>
              <div>
                <FieldLabel>Barriers to movement</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {MOVEMENT_BARRIERS.map((b) => (
                    <label key={b} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted cursor-pointer text-sm">
                      <Checkbox checked={form.movement_barriers.includes(b)} onCheckedChange={() => toggleArray("movement_barriers", b)} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 11: Environmental Exposures */}
          {step === 10 && (
            <div className="space-y-4">
              <div>
                <FieldLabel>Known mold exposure in home or workplace</FieldLabel>
                <RadioSelect name="mold_exposure" value={form.mold_exposure} onChange={(v) => set("mold_exposure", v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.chemical_exposure} onCheckedChange={(v) => set("chemical_exposure", !!v)} />
                Occupation with chemical or toxin exposure
              </label>
              <div>
                <FieldLabel>Water source</FieldLabel>
                <RadioSelect name="water_source" value={form.water_source} onChange={(v) => set("water_source", v)} options={[{value:"tap",label:"Tap"},{value:"filtered",label:"Filtered"},{value:"bottled",label:"Bottled"},{value:"well",label:"Well"}]} />
              </div>
              <div>
                <FieldLabel>Personal care products</FieldLabel>
                <RadioSelect name="personal_care" value={form.personal_care} onChange={(v) => set("personal_care", v)} options={[{value:"conventional",label:"Conventional"},{value:"mostly_natural",label:"Mostly natural"},{value:"entirely_natural",label:"Entirely natural"}]} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.travel_exposure} onCheckedChange={(v) => set("travel_exposure", !!v)} />
                History of significant travel to areas with different water or food sources
              </label>
            </div>
          )}

          {/* Step 12: Lab & Test Results */}
          {step === 11 && (
            <div className="space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                All lab results are optional. Always consult your licensed healthcare provider regarding your lab results.
              </div>
              {[
                { title: "Thyroid Labs", fields: [
                  { key: "lab_tsh", label: "TSH (value and date)" },
                  { key: "lab_free_t3", label: "Free T3 (value and date)" },
                  { key: "lab_free_t4", label: "Free T4 (value and date)" },
                  { key: "lab_tpo_antibodies", label: "TPO antibodies" },
                  { key: "lab_thyroid_diagnosis", label: "Thyroid diagnosis noted by provider" },
                ]},
                { title: "Metabolic & Blood Sugar", fields: [
                  { key: "lab_fasting_glucose", label: "Fasting glucose (value and date)" },
                  { key: "lab_fasting_insulin", label: "Fasting insulin (value and date)" },
                  { key: "lab_hba1c", label: "HbA1c (value and date)" },
                  { key: "lab_triglycerides", label: "Triglycerides (value and date)" },
                  { key: "lab_hdl", label: "HDL (value and date)" },
                  { key: "lab_alt_ast", label: "ALT/AST liver enzymes (value and date)" },
                ]},
                { title: "Hormone Panels", fields: [
                  { key: "lab_estrogen", label: "Estrogen/Estradiol (value and date)" },
                  { key: "lab_progesterone", label: "Progesterone (value and date)" },
                  { key: "lab_cortisol", label: "Cortisol morning (value and date)" },
                  { key: "lab_dheas", label: "DHEA-S (value and date)" },
                  { key: "lab_testosterone", label: "Testosterone total and free (value and date)" },
                ]},
                { title: "Inflammatory Markers", fields: [
                  { key: "lab_crp", label: "CRP (value and date)" },
                  { key: "lab_esr", label: "ESR (value and date)" },
                  { key: "lab_homocysteine", label: "Homocysteine (value and date)" },
                ]},
                { title: "Gut & Nutrient Labs", fields: [
                  { key: "lab_gi_map", label: "GI-MAP or stool test findings" },
                  { key: "lab_food_sensitivity", label: "Food sensitivity panel results" },
                  { key: "lab_ferritin", label: "Ferritin (value and date)" },
                  { key: "lab_vitamin_d", label: "Vitamin D (value and date)" },
                  { key: "lab_b12", label: "B12 (value and date)" },
                  { key: "lab_magnesium", label: "Magnesium (value and date)" },
                ]},
              ].map((section) => (
                <div key={section.title} className="space-y-2">
                  <p className="text-sm font-semibold text-primary">{section.title}</p>
                  {section.fields.map(({ key, label }) => (
                    <div key={key}>
                      <FieldLabel htmlFor={key}>{label}</FieldLabel>
                      <Input id={key} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder="e.g. 2.1, June 2026" />
                    </div>
                  ))}
                </div>
              ))}
              <div>
                <FieldLabel>SIBO breath test result</FieldLabel>
                <RadioSelect name="lab_sibo" value={form.lab_sibo} onChange={(v) => set("lab_sibo", v)} options={[{value:"positive",label:"Positive"},{value:"negative",label:"Negative"},{value:"not_tested",label:"Not tested"}]} />
              </div>
              <div>
                <FieldLabel htmlFor="lab_other">Any other relevant lab work</FieldLabel>
                <Textarea id="lab_other" value={form.lab_other} onChange={(e) => set("lab_other", e.target.value)} rows={3} placeholder="Anything else you'd like to share..." />
              </div>
            </div>
          )}

          {/* Step 13: Day 1 Baseline Ratings */}
          {step === 12 && (
            <div className="space-y-6">
              {BASELINE_RATING_ITEMS.map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <p className="text-sm font-semibold text-primary">{cat.category}</p>
                  {cat.items.map((item) => (
                    <RatingSlider
                      key={item.key}
                      label={item.label}
                      value={form.baseline_ratings[item.key] ?? 5}
                      onChange={(v) => setRating(item.key, v)}
                    />
                  ))}
                </div>
              ))}

              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-semibold">Open-ended reflections</p>
                <div>
                  <FieldLabel htmlFor="baseline_open_improved">What has felt different or improved recently?</FieldLabel>
                  <Textarea id="baseline_open_improved" value={form.baseline_open_improved} onChange={(e) => set("baseline_open_improved", e.target.value)} rows={2} />
                </div>
                <div>
                  <FieldLabel htmlFor="baseline_open_challenging">What is still present or challenging?</FieldLabel>
                  <Textarea id="baseline_open_challenging" value={form.baseline_open_challenging} onChange={(e) => set("baseline_open_challenging", e.target.value)} rows={2} />
                </div>
                <div>
                  <FieldLabel htmlFor="baseline_open_note">Is there anything you want Sheila to know about where you are right now?</FieldLabel>
                  <Textarea id="baseline_open_note" value={form.baseline_open_note} onChange={(e) => set("baseline_open_note", e.target.value)} rows={2} />
                </div>
              </div>

              {/* Consent */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 border">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{CONSENT_TEXT}</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Checkbox checked={consentChecked} onCheckedChange={(v) => setConsentChecked(!!v)} />
                  I have read and agree to the above
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        {step < TOTAL_STEPS - 1 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || !consentChecked}>
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing your patterns...</>
            ) : (
              "Submit Assessment"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
