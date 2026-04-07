import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const GUT_SYMPTOMS = [
  "Bloating after meals",
  "Constipation",
  "Diarrhea or loose stools",
  "Acid reflux or heartburn",
  "Food sensitivities",
  "Gut-driven inflammation",
  "Nausea",
  "Abdominal pain or cramping",
  "Excessive gas",
  "Feeling of fullness quickly",
];

const METABOLIC_SYMPTOMS = [
  "Energy crashes (mid-afternoon)",
  "Blood sugar instability",
  "Insulin resistance patterns",
  "Stress and cortisol rhythm disruption",
  "Metabolic adaptation / slowed output",
  "Unexplained weight fluctuations",
  "Stubborn belly fat",
  "Feeling cold all the time",
  "Difficulty losing weight despite effort",
  "Cravings that feel uncontrollable",
];

const HORMONAL_SYMPTOMS = [
  "Estrogen/progesterone imbalance",
  "Thyroid signaling issues",
  "Cycle dysregulation",
  "Hormone-related inflammation",
  "Perimenopausal signaling shifts",
  "Mood swings tied to cycle",
  "Hot flashes or night sweats",
  "Hair thinning or loss",
  "Skin changes (acne, dryness)",
  "Low libido",
];

const STEPS = [
  { title: "Gut Symptoms", description: "Select the gut-related symptoms you experience" },
  { title: "Metabolic Symptoms", description: "Select the metabolic symptoms you experience" },
  { title: "Hormonal Symptoms", description: "Select the hormonal symptoms you experience" },
  { title: "Lab & Test Results", description: "Share any relevant lab work or test results" },
  { title: "Health History", description: "Tell us about your health journey" },
  { title: "Your Goals", description: "What do you want to achieve?" },
];

function SymptomGrid({
  symptoms,
  selected,
  onToggle,
}: {
  symptoms: string[];
  selected: string[];
  onToggle: (s: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {symptoms.map((symptom) => {
        const isSelected = selected.includes(symptom);
        return (
          <button
            key={symptom}
            type="button"
            onClick={() => onToggle(symptom)}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all text-sm ${
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50 hover:bg-muted"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
              }`}
            >
              {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            {symptom}
          </button>
        );
      })}
    </div>
  );
}

export default function PortalIntake() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const supabase = useSupabase();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [gutSymptoms, setGutSymptoms] = useState<string[]>([]);
  const [metabolicSymptoms, setMetabolicSymptoms] = useState<string[]>([]);
  const [hormonalSymptoms, setHormonalSymptoms] = useState<string[]>([]);
  const [testResults, setTestResults] = useState({
    thyroid: "",
    hormones: "",
    gut_panel: "",
    other: "",
  });
  const [healthHistory, setHealthHistory] = useState("");
  const [goals, setGoals] = useState("");

  function toggleSymptom(
    list: string[],
    setList: (v: string[]) => void,
    symptom: string
  ) {
    setList(
      list.includes(symptom) ? list.filter((s) => s !== symptom) : [...list, symptom]
    );
  }

  async function handleSubmit() {
    if (!subscriber) return;
    setSubmitting(true);

    try {
      const { data: intake, error: insertErr } = await supabase
        .from("intake_responses")
        .insert({
          subscriber_id: subscriber.id,
          gut_symptoms: gutSymptoms,
          metabolic_symptoms: metabolicSymptoms,
          hormonal_symptoms: hormonalSymptoms,
          test_results: testResults,
          health_history: healthHistory,
          goals,
          raw_form_data: {
            gutSymptoms,
            metabolicSymptoms,
            hormonalSymptoms,
            testResults,
            healthHistory,
            goals,
          },
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      const { data: patternResult, error: patternErr } = await supabase.functions.invoke(
        "identify-patterns",
        {
          body: {
            subscriber_id: subscriber.id,
            intake_response_id: intake.id,
          },
        }
      );

      if (patternErr) {
        console.error("Pattern identification error:", patternErr);
        toast.error("Pattern analysis encountered an issue. Defaulting to awareness tier.");
      }

      navigate("/portal/results", {
        state: { patternResult: patternResult?.data },
      });
    } catch (err) {
      console.error("Intake submission failed:", err);
      toast.error("Failed to submit intake form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (subscriber?.intake_completed) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Intake Already Completed</h2>
            <p className="text-muted-foreground">
              You've already completed your wellness assessment. View your results on the dashboard.
            </p>
            <Button onClick={() => navigate("/portal")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">Wellness Assessment</h1>
        <p className="text-muted-foreground mt-1">
          This assessment helps us identify your unique patterns and create a personalized roadmap.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step].title}</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step].title}</CardTitle>
          <CardDescription>{STEPS[step].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <SymptomGrid
                symptoms={GUT_SYMPTOMS}
                selected={gutSymptoms}
                onToggle={(s) => toggleSymptom(gutSymptoms, setGutSymptoms, s)}
              />
              {gutSymptoms.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: {gutSymptoms.length} symptom{gutSymptoms.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <SymptomGrid
                symptoms={METABOLIC_SYMPTOMS}
                selected={metabolicSymptoms}
                onToggle={(s) => toggleSymptom(metabolicSymptoms, setMetabolicSymptoms, s)}
              />
              {metabolicSymptoms.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: {metabolicSymptoms.length} symptom{metabolicSymptoms.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <SymptomGrid
                symptoms={HORMONAL_SYMPTOMS}
                selected={hormonalSymptoms}
                onToggle={(s) =>
                  toggleSymptom(hormonalSymptoms, setHormonalSymptoms, s)
                }
              />
              {hormonalSymptoms.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: {hormonalSymptoms.length} symptom{hormonalSymptoms.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you have lab results, share what you know. This is optional but helps the AI
                identify deeper patterns.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Thyroid labs</label>
                  <Textarea
                    placeholder="TSH, T3, T4 values or general findings..."
                    value={testResults.thyroid}
                    onChange={(e) =>
                      setTestResults({ ...testResults, thyroid: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hormone panels</label>
                  <Textarea
                    placeholder="Estrogen, progesterone, cortisol, etc..."
                    value={testResults.hormones}
                    onChange={(e) =>
                      setTestResults({ ...testResults, hormones: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gut panel / stool test</label>
                  <Textarea
                    placeholder="GI-MAP, SIBO, food sensitivity results..."
                    value={testResults.gut_panel}
                    onChange={(e) =>
                      setTestResults({ ...testResults, gut_panel: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Other tests</label>
                  <Textarea
                    placeholder="Any other relevant lab work or test results..."
                    value={testResults.other}
                    onChange={(e) =>
                      setTestResults({ ...testResults, other: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Share your health journey -- diagnoses, treatments tried, how long you've
                been experiencing these symptoms, and anything else that feels relevant.
              </p>
              <Textarea
                placeholder="I've been dealing with digestive issues for about 3 years. I've tried elimination diets, probiotics, and saw a GI specialist who said everything was 'normal'..."
                value={healthHistory}
                onChange={(e) => setHealthHistory(e.target.value)}
                rows={8}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                What does wellness look like for you? What do you want to understand, change,
                or achieve?
              </p>
              <Textarea
                placeholder="I want to understand why I feel so exhausted despite sleeping 8 hours. I want to stop guessing and start addressing the root cause..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={6}
              />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Summary</h4>
                <div className="flex flex-wrap gap-2">
                  {gutSymptoms.length > 0 && (
                    <Badge variant="secondary">
                      {gutSymptoms.length} gut symptom{gutSymptoms.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {metabolicSymptoms.length > 0 && (
                    <Badge variant="secondary">
                      {metabolicSymptoms.length} metabolic symptom{metabolicSymptoms.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {hormonalSymptoms.length > 0 && (
                    <Badge variant="secondary">
                      {hormonalSymptoms.length} hormonal symptom{hormonalSymptoms.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing your patterns...
              </>
            ) : (
              "Submit Assessment"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
