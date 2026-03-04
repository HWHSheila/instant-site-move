import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DIGESTIVE_SYMPTOMS = [
  "Bloating", "Gas", "Constipation", "Loose stools", "Diarrhea",
  "Alternating constipation and diarrhea", "Reflux or heartburn", "Nausea",
  "Abdominal pain or cramping", "Feeling overly full quickly", "Burping after meals",
  "Undigested food in stool", "Mucus in stool", "Dark stools", "Light-colored stools",
  "Foul-smelling gas", "Food sensitivities", "None of the above",
];

const TIMING_PATTERNS = [
  "Immediately after eating", "30–60 minutes after eating", "2–3 hours after eating",
  "Late at night", "Mostly in the morning", "Mostly in the evening", "Random or unpredictable",
];

const FOOD_TRIGGERS = [
  "High fat meals", "Protein-heavy meals", "Carbohydrates", "Sugary foods",
  "Fiber", "Raw vegetables", "Dairy", "Gluten", "Large meals", "I'm unsure",
];

const BOWEL_FREQUENCY = [
  "Daily", "Every other day", "2–3 times per week", "Less than 2 times per week", "Multiple times per day",
];

const STOOL_CONSISTENCY = [
  "Hard / pellet-like", "Normal / formed", "Loose", "Watery", "Alternating",
];

const ENERGY_PATTERNS = [
  "Wake up tired", "Afternoon crash", "Need caffeine to function", "Brain fog",
  "Low stamina", "Shakiness between meals", "Feel worse if I skip meals",
  "Irritable when hungry", "Headaches when hungry", "Energy improves after eating",
  "Energy crashes after eating", "None of the above",
];

const CRAVING_TYPES = [
  "Sugar", "Carbs", "Salty foods", "Fatty foods", "Chocolate", "Late-night snacking",
];

const CRAVING_TIMING = [
  "Mid-morning", "Afternoon", "Evening", "Late night", "No consistent pattern",
];

const WEIGHT_PATTERNS = [
  "Unexplained weight gain", "Difficulty losing weight", "Weight fluctuates easily",
  "Swelling / puffiness", "Belly weight", "None of the above",
];

const CYCLE_PATTERNS = [
  "Regular cycles", "Irregular cycles", "Painful cycles", "Heavy cycles",
  "Light cycles", "Severe PMS", "Mood swings before cycle", "No cycle / post-menopausal",
];

const HORMONAL_SYMPTOMS = [
  "Hair thinning", "Acne", "Low libido", "Hot flashes", "Night sweats",
  "Sleep disruption", "Breast tenderness", "Mood instability", "None of the above",
];

const NERVOUS_SYSTEM = [
  "Anxiety", "Heart racing", "Burnout", "Irritability", "Trouble falling asleep",
  "Wake between 2–4am", "Easily overwhelmed", "None of the above",
];

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };
  return (
    <div className="mb-6">
      <p className="text-base font-semibold text-primary-foreground/90 mb-3">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-start gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
          >
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => toggle(opt)}
              className="mt-0.5 border-primary-foreground/40 data-[state=checked]:bg-wellness-gold data-[state=checked]:border-wellness-gold"
            />
            <span className="text-sm text-primary-foreground/80">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroupField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-base font-semibold text-primary-foreground/90 mb-3">{label}</p>
      <RadioGroup value={value} onValueChange={onChange} className="gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
          >
            <RadioGroupItem
              value={opt}
              className="border-primary-foreground/40 text-wellness-gold"
            />
            <span className="text-sm text-primary-foreground/80">{opt}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function FreeStrategyIntake() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Section 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [callDateTime, setCallDateTime] = useState("");

  // Section 2
  const [digestiveSymptoms, setDigestiveSymptoms] = useState<string[]>([]);
  const [digestiveOther, setDigestiveOther] = useState("");
  const [timingPattern, setTimingPattern] = useState<string[]>([]);
  const [foodTriggers, setFoodTriggers] = useState<string[]>([]);
  const [bowelFrequency, setBowelFrequency] = useState("");
  const [stoolConsistency, setStoolConsistency] = useState("");

  // Section 3
  const [energyPatterns, setEnergyPatterns] = useState<string[]>([]);
  const [hasCravings, setHasCravings] = useState("");
  const [cravingTypes, setCravingTypes] = useState<string[]>([]);
  const [cravingTiming, setCravingTiming] = useState<string[]>([]);
  const [weightPatterns, setWeightPatterns] = useState<string[]>([]);

  // Section 4
  const [cyclePatterns, setCyclePatterns] = useState<string[]>([]);
  const [hormonalSymptoms, setHormonalSymptoms] = useState<string[]>([]);

  // Section 5
  const [nervousSystem, setNervousSystem] = useState<string[]>([]);

  // Section 6
  const [hasRecentLabs, setHasRecentLabs] = useState("");
  const [labDetails, setLabDetails] = useState("");
  const [diagnoses, setDiagnoses] = useState("");
  const [medicationsSupplements, setMedicationsSupplements] = useState("");

  // Section 7
  const [triedApproaches, setTriedApproaches] = useState("");
  const [whatHelped, setWhatHelped] = useState("");
  const [whatWorsened, setWhatWorsened] = useState("");

  // Section 8
  const [desiredOutcomes, setDesiredOutcomes] = useState("");
  const [desiredClarity, setDesiredClarity] = useState("");
  const [openToCoaching, setOpenToCoaching] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !callDateTime.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name, email, and scheduled call date/time.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        call_date_time: callDateTime.trim(),
        digestive_symptoms: digestiveSymptoms,
        digestive_other: digestiveOther.trim(),
        timing_pattern: timingPattern,
        food_triggers: foodTriggers,
        bowel_frequency: bowelFrequency,
        stool_consistency: stoolConsistency,
        energy_patterns: energyPatterns,
        has_cravings: hasCravings,
        craving_types: cravingTypes,
        craving_timing: cravingTiming,
        weight_fluid_patterns: weightPatterns,
        cycle_patterns: cyclePatterns,
        hormonal_symptoms: hormonalSymptoms,
        nervous_system: nervousSystem,
        has_recent_labs: hasRecentLabs,
        lab_details: labDetails.trim(),
        diagnoses: diagnoses.trim(),
        medications_supplements: medicationsSupplements.trim(),
        tried_approaches: triedApproaches.trim(),
        what_helped: whatHelped.trim(),
        what_worsened: whatWorsened.trim(),
        desired_outcomes: desiredOutcomes.trim(),
        desired_clarity: desiredClarity.trim(),
        open_to_coaching: openToCoaching,
      };

      const { error } = await supabase.functions.invoke("send-intake-email", {
        body: payload,
      });

      if (error) throw error;

      navigate("/strategy-intake-thankyou");
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support@herwellnessharmony.com.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sectionLabelClass = "section-label text-wellness-gold mb-4";
  const sectionHeadingClass = "font-display text-2xl md:text-3xl font-medium mb-5 text-primary-foreground";
  const inputClass =
    "bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-wellness-gold focus:ring-wellness-gold/30";
  const textareaClass =
    "bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-wellness-gold focus:ring-wellness-gold/30 min-h-[100px]";

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Free Strategy Call Intake Form | Her Wellness Harmony"
        description="Complete this intake form before your free 15-minute root cause strategy call so we can focus on strategy and next steps."
      />

      <div
        className="flex-1 relative"
        style={{
          background: `
            linear-gradient(
              175deg,
              hsl(150 40% 18%) 0%,
              hsl(150 35% 24%) 12%,
              hsl(150 28% 32%) 30%,
              hsl(145 22% 42%) 50%,
              hsl(145 20% 38%) 65%,
              hsl(150 28% 28%) 80%,
              hsl(150 38% 18%) 100%
            )
          `,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(42 75% 55% / 0.03) 0%, transparent 55%),
              radial-gradient(ellipse at 70% 80%, hsl(150 35% 15% / 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(150 20% 40% / 0.06) 0%, transparent 70%)
            `,
          }}
        />

        <Header />

        <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          {/* Hero */}
          <div className="text-center mb-12">
            <p className={sectionLabelClass}>Strategy Call Intake</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-primary-foreground leading-tight mb-4">
              Free Strategy Call Intake Form
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              This intake allows me to review your symptom patterns and history before our call so we can focus on strategy and next steps rather than collecting basic information.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* SECTION 1 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 1</p>
              <h2 className={sectionHeadingClass}>Call & Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                    Full Name <span className="text-wellness-gold">*</span>
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                    Email Used to Book Your Strategy Call <span className="text-wellness-gold">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={inputClass}
                  />
                  <p className="text-xs text-primary-foreground/50 mt-1">
                    Please use the same email address you used to book your call.
                  </p>
                </div>

                <div>
                  <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                    Phone Number <span className="text-primary-foreground/40">(optional)</span>
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>

                <div>
                  <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                    Date and Time of Scheduled Call <span className="text-wellness-gold">*</span>
                  </Label>
                  <Input
                    value={callDateTime}
                    onChange={(e) => setCallDateTime(e.target.value)}
                    placeholder="e.g. March 15, 2026 at 2:00 PM EST"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div
                className="mt-6 rounded-xl px-5 py-4"
                style={{
                  background: "hsl(42 75% 55% / 0.12)",
                  border: "1px solid hsl(42 75% 55% / 0.25)",
                }}
              >
                <p className="text-sm text-wellness-gold font-medium leading-relaxed">
                  ⚠ Your intake form must be completed at least 48 hours before your scheduled call time. Calls without a completed intake form may be canceled.
                </p>
              </div>
            </div>

            {/* SECTION 2 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 2</p>
              <h2 className={sectionHeadingClass}>Digestive / Gut Patterns</h2>

              <CheckboxGroup
                label="A. Digestive Symptoms (Select all that apply)"
                options={DIGESTIVE_SYMPTOMS}
                selected={digestiveSymptoms}
                onChange={setDigestiveSymptoms}
              />
              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  Other (please describe)
                </Label>
                <Input
                  value={digestiveOther}
                  onChange={(e) => setDigestiveOther(e.target.value)}
                  placeholder="Any other symptoms..."
                  className={inputClass}
                />
              </div>

              <CheckboxGroup
                label="B. Timing Pattern (When do symptoms typically occur)"
                options={TIMING_PATTERNS}
                selected={timingPattern}
                onChange={setTimingPattern}
              />

              <CheckboxGroup
                label="C. Food Trigger Pattern (Symptoms worse after)"
                options={FOOD_TRIGGERS}
                selected={foodTriggers}
                onChange={setFoodTriggers}
              />

              <RadioGroupField
                label="D. How often do you have bowel movements?"
                options={BOWEL_FREQUENCY}
                value={bowelFrequency}
                onChange={setBowelFrequency}
              />

              <RadioGroupField
                label="Stool consistency is typically:"
                options={STOOL_CONSISTENCY}
                value={stoolConsistency}
                onChange={setStoolConsistency}
              />
            </div>

            {/* SECTION 3 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 3</p>
              <h2 className={sectionHeadingClass}>Metabolic / Energy Regulation</h2>

              <CheckboxGroup
                label="A. Energy Pattern (Select all that apply)"
                options={ENERGY_PATTERNS}
                selected={energyPatterns}
                onChange={setEnergyPatterns}
              />

              <RadioGroupField
                label="B. Do you experience cravings?"
                options={["Yes", "No"]}
                value={hasCravings}
                onChange={setHasCravings}
              />

              {hasCravings === "Yes" && (
                <>
                  <CheckboxGroup
                    label="Cravings are mostly for (select all):"
                    options={CRAVING_TYPES}
                    selected={cravingTypes}
                    onChange={setCravingTypes}
                  />
                  <CheckboxGroup
                    label="When do cravings hit?"
                    options={CRAVING_TIMING}
                    selected={cravingTiming}
                    onChange={setCravingTiming}
                  />
                </>
              )}

              <CheckboxGroup
                label="C. Weight / Fluid Pattern (Select all that apply)"
                options={WEIGHT_PATTERNS}
                selected={weightPatterns}
                onChange={setWeightPatterns}
              />
            </div>

            {/* SECTION 4 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 4</p>
              <h2 className={sectionHeadingClass}>Hormonal Patterns</h2>

              <CheckboxGroup
                label="A. Cycle Pattern (If applicable)"
                options={CYCLE_PATTERNS}
                selected={cyclePatterns}
                onChange={setCyclePatterns}
              />

              <CheckboxGroup
                label="B. Hormonal Symptoms (Select all that apply)"
                options={HORMONAL_SYMPTOMS}
                selected={hormonalSymptoms}
                onChange={setHormonalSymptoms}
              />
            </div>

            {/* SECTION 5 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 5</p>
              <h2 className={sectionHeadingClass}>Nervous System / Stress Load</h2>

              <CheckboxGroup
                label="Select all that apply:"
                options={NERVOUS_SYSTEM}
                selected={nervousSystem}
                onChange={setNervousSystem}
              />
            </div>

            {/* SECTION 6 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 6</p>
              <h2 className={sectionHeadingClass}>History and Labs</h2>

              <RadioGroupField
                label="Have you had lab work in the last 12 months?"
                options={["Yes", "No"]}
                value={hasRecentLabs}
                onChange={setHasRecentLabs}
              />

              {hasRecentLabs === "Yes" && (
                <div className="mb-6">
                  <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                    What labs were run and what were the key findings?
                  </Label>
                  <Textarea
                    value={labDetails}
                    onChange={(e) => setLabDetails(e.target.value)}
                    placeholder="Describe your lab results and findings..."
                    className={textareaClass}
                  />
                </div>
              )}

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  Any diagnoses I should know about?
                </Label>
                <Textarea
                  value={diagnoses}
                  onChange={(e) => setDiagnoses(e.target.value)}
                  placeholder="List any relevant diagnoses..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  Current medications or supplements?
                </Label>
                <Textarea
                  value={medicationsSupplements}
                  onChange={(e) => setMedicationsSupplements(e.target.value)}
                  placeholder="List current medications and supplements..."
                  className={textareaClass}
                />
              </div>
            </div>

            {/* SECTION 7 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 7</p>
              <h2 className={sectionHeadingClass}>What You Have Tried</h2>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  What approaches have you tried so far?
                </Label>
                <Textarea
                  value={triedApproaches}
                  onChange={(e) => setTriedApproaches(e.target.value)}
                  placeholder="Describe approaches you've tried..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  What helped temporarily?
                </Label>
                <Textarea
                  value={whatHelped}
                  onChange={(e) => setWhatHelped(e.target.value)}
                  placeholder="What has provided temporary relief..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  What made things worse?
                </Label>
                <Textarea
                  value={whatWorsened}
                  onChange={(e) => setWhatWorsened(e.target.value)}
                  placeholder="What has made symptoms worse..."
                  className={textareaClass}
                />
              </div>
            </div>

            {/* SECTION 8 */}
            <div className="mb-12">
              <p className={sectionLabelClass}>Section 8</p>
              <h2 className={sectionHeadingClass}>Desired Results and Fit</h2>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  What outcomes are you hoping to achieve in the next 30–90 days?
                </Label>
                <Textarea
                  value={desiredOutcomes}
                  onChange={(e) => setDesiredOutcomes(e.target.value)}
                  placeholder="Describe your desired outcomes..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-6">
                <Label className="text-primary-foreground/90 mb-1.5 block text-sm font-medium">
                  If this call were successful, what clarity would you want by the end?
                </Label>
                <Textarea
                  value={desiredClarity}
                  onChange={(e) => setDesiredClarity(e.target.value)}
                  placeholder="What clarity are you looking for..."
                  className={textareaClass}
                />
              </div>

              <RadioGroupField
                label="Are you open to structured coaching support if it is a fit?"
                options={["Yes", "Possibly", "Not at this time"]}
                value={openToCoaching}
                onChange={setOpenToCoaching}
              />
            </div>

            {/* Submit */}
            <div className="text-center mb-12">
              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Intake Form"}
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-xs text-primary-foreground/50 leading-relaxed text-center max-w-2xl mx-auto">
                This strategy call is for educational and informational purposes only. It does not include medical diagnosis, treatment, or individualized supplement prescriptions. The purpose of this call is to review patterns and discuss strategic next steps.
              </p>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
