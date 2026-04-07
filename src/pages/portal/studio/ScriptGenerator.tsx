import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/hooks/use-supabase";
import { useClerkUserId } from "@/hooks/use-supabase";
import { toast } from "sonner";

const POST_TYPES = [
  { id: "authority", name: "Authority", description: "Educational content (50%)", color: "#3B82F6" },
  { id: "sales", name: "Sales", description: "Conversion-focused (30%)", color: "#10B981" },
  { id: "engagement", name: "Engagement", description: "Community building (20%)", color: "#8B5CF6" },
];

const HOOK_STYLES = [
  { id: "symptom", name: "Symptom Recognition", example: "Have you ever noticed your body..." },
  { id: "pattern", name: "Pattern Recognition", example: "The body usually communicates through patterns..." },
  { id: "false_belief", name: "False Belief", example: "Many women are told that..." },
  { id: "confusion", name: "Confusion", example: "Have you ever felt like something isn't right..." },
  { id: "observation", name: "Observation", example: "One thing I see women experience..." },
];

interface DbPillar { id: string; code: string; name: string; description: string; color: string }
interface DbPainPoint { id: string; title: string; pillar_id: string }
interface DbFalseBelief { id: string; title: string; correct_framing: string; pillar_id: string }
interface DbStrength { id: string; name: string; best_for: string[] }

type WizardStep = "pillar" | "painPoint" | "falseBelief" | "postType" | "strength" | "hookStyle" | "generate";

const STEPS: { id: WizardStep; title: string }[] = [
  { id: "pillar", title: "Pillar" },
  { id: "painPoint", title: "Pain Point" },
  { id: "falseBelief", title: "False Belief" },
  { id: "postType", title: "Post Type" },
  { id: "strength", title: "Strength" },
  { id: "hookStyle", title: "Hook Style" },
  { id: "generate", title: "Generate" },
];

export default function ScriptGenerator() {
  const navigate = useNavigate();
  const supabase = useSupabase();
  const userId = useClerkUserId();
  const [currentStep, setCurrentStep] = useState<WizardStep>("pillar");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [pillars, setPillars] = useState<DbPillar[]>([]);
  const [painPoints, setPainPoints] = useState<DbPainPoint[]>([]);
  const [falseBeliefs, setFalseBeliefs] = useState<DbFalseBelief[]>([]);
  const [strengths, setStrengths] = useState<DbStrength[]>([]);

  const [selections, setSelections] = useState({
    pillar: null as DbPillar | null,
    painPoint: "",
    painPointId: null as string | null,
    customPainPoint: "",
    falseBelief: null as DbFalseBelief | null,
    postType: null as typeof POST_TYPES[0] | null,
    strength: null as DbStrength | null,
    hookStyle: null as typeof HOOK_STYLES[0] | null,
  });

  const [generatedScript, setGeneratedScript] = useState<{
    hook: string;
    bridge: string;
    authority_anchor: string;
    education: string;
    pattern_expansion: string;
    cta: string;
    full_script: string;
    caption: string;
    hashtags: string[];
  } | null>(null);

  useEffect(() => {
    async function loadDropdowns() {
      const [pillarsRes, painRes, beliefsRes, strengthsRes] = await Promise.all([
        supabase.from("pillars").select("*").order("code"),
        supabase.from("pain_points").select("id, title, pillar_id"),
        supabase.from("false_beliefs").select("id, title, correct_framing, pillar_id"),
        supabase.from("gallup_strengths").select("*"),
      ]);
      if (pillarsRes.data) setPillars(pillarsRes.data);
      if (painRes.data) setPainPoints(painRes.data);
      if (beliefsRes.data) setFalseBeliefs(beliefsRes.data);
      if (strengthsRes.data) setStrengths(strengthsRes.data);
    }
    loadDropdowns();
  }, [supabase]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const filteredPainPoints = selections.pillar
    ? painPoints.filter((p) => p.pillar_id === selections.pillar!.id)
    : painPoints;

  const filteredFalseBeliefs = selections.pillar
    ? falseBeliefs.filter((b) => b.pillar_id === selections.pillar!.id)
    : falseBeliefs;

  const recommendedStrengths = selections.postType
    ? strengths.filter((s) => s.best_for?.includes(selections.postType!.id))
    : strengths;

  const otherStrengths = selections.postType
    ? strengths.filter((s) => !s.best_for?.includes(selections.postType!.id))
    : [];

  const canProceed = () => {
    switch (currentStep) {
      case "pillar": return !!selections.pillar;
      case "painPoint": return !!selections.painPoint || !!selections.customPainPoint;
      case "falseBelief": return true;
      case "postType": return !!selections.postType;
      case "strength": return !!selections.strength;
      case "hookStyle": return !!selections.hookStyle;
      default: return true;
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) setCurrentStep(STEPS[nextIndex].id);
  };
  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) setCurrentStep(STEPS[prevIndex].id);
  };

  const generateScript = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: {
          pillar: selections.pillar,
          painPoint: selections.customPainPoint || selections.painPoint,
          falseBelief: selections.falseBelief?.title,
          postType: selections.postType?.id,
          hookStyle: selections.hookStyle?.id,
          primaryStrength: selections.strength?.name,
        },
      });
      if (error) throw error;
      if (data?.success && data?.script) {
        setGeneratedScript(data.script);
      } else {
        throw new Error(data?.error || "Failed to generate script");
      }
    } catch (err) {
      console.error("Script generation error:", err);
      toast.error("Failed to generate script. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveScript = async () => {
    if (!generatedScript || !selections.pillar) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("content_pieces").insert({
        title: generatedScript.hook.substring(0, 100),
        pillar_id: selections.pillar.id,
        pain_point_id: selections.painPointId,
        false_belief_id: selections.falseBelief?.id || null,
        post_type: selections.postType?.id,
        hook_style: selections.hookStyle?.id,
        primary_strength: selections.strength?.name,
        script_hook: generatedScript.hook,
        script_bridge: generatedScript.bridge,
        script_authority_anchor: generatedScript.authority_anchor,
        script_education: generatedScript.education,
        script_pattern_expansion: generatedScript.pattern_expansion,
        script_cta: generatedScript.cta,
        full_script: generatedScript.full_script,
        caption: generatedScript.caption,
        hashtags: generatedScript.hashtags,
        status: "draft",
        user_id: userId,
      });
      if (error) throw error;
      toast.success("Script saved to library!");
      navigate("/portal/studio/library");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save script.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedScript?.full_script) {
      await navigator.clipboard.writeText(generatedScript.full_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Script Generator</h1>
        <p className="text-muted-foreground">Create AI-powered content scripts using your brand voice</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
              index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("w-8 md:w-14 h-1 mx-0.5", index < currentStepIndex ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStepIndex].title}</CardTitle>
          <CardDescription>
            {currentStep === "pillar" && "Select the content pillar for your script"}
            {currentStep === "painPoint" && "Choose or describe the pain point to address"}
            {currentStep === "falseBelief" && "Optionally select a false belief to debunk (skip if none)"}
            {currentStep === "postType" && "What type of post is this?"}
            {currentStep === "strength" && "Select your primary Gallup strength for tone"}
            {currentStep === "hookStyle" && "How do you want to open the script?"}
            {currentStep === "generate" && "Review your selections and generate the script"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "pillar" && (
            <div className="grid gap-3 md:grid-cols-2">
              {pillars.map((pillar) => (
                <button key={pillar.id} onClick={() => setSelections({ ...selections, pillar })}
                  className={cn("p-4 rounded-lg border text-left transition-all",
                    selections.pillar?.id === pillar.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
                    <span className="font-medium">{pillar.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                </button>
              ))}
            </div>
          )}

          {currentStep === "painPoint" && (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                {filteredPainPoints.map((point) => (
                  <button key={point.id}
                    onClick={() => setSelections({ ...selections, painPoint: point.title, painPointId: point.id, customPainPoint: "" })}
                    className={cn("p-3 rounded-lg border text-left text-sm transition-all",
                      selections.painPoint === point.title ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}>
                    {point.title}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Or describe your own:</label>
                <Textarea placeholder="Describe the pain point or symptom..."
                  value={selections.customPainPoint}
                  onChange={(e) => setSelections({ ...selections, customPainPoint: e.target.value, painPoint: "", painPointId: null })}
                  rows={3} />
              </div>
            </div>
          )}

          {currentStep === "falseBelief" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Optional: Selecting a false belief adds a "myth-busting" element to your script.</p>
              <button onClick={() => setSelections({ ...selections, falseBelief: null })}
                className={cn("w-full p-3 rounded-lg border text-left text-sm transition-all",
                  selections.falseBelief === null ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}>
                Skip — no false belief
              </button>
              {filteredFalseBeliefs.map((belief) => (
                <button key={belief.id} onClick={() => setSelections({ ...selections, falseBelief: belief })}
                  className={cn("w-full p-4 rounded-lg border text-left transition-all",
                    selections.falseBelief?.id === belief.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}>
                  <span className="font-medium text-sm">{belief.title}</span>
                  <p className="text-xs text-muted-foreground mt-1 italic">{belief.correct_framing}</p>
                </button>
              ))}
            </div>
          )}

          {currentStep === "postType" && (
            <div className="grid gap-3 md:grid-cols-3">
              {POST_TYPES.map((type) => (
                <button key={type.id} onClick={() => setSelections({ ...selections, postType: type })}
                  className={cn("p-4 rounded-lg border text-left transition-all",
                    selections.postType?.id === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          )}

          {currentStep === "strength" && (
            <div className="space-y-4">
              {recommendedStrengths.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground">Recommended for {selections.postType?.name} posts:</p>
                  <div className="grid gap-2 md:grid-cols-3">
                    {recommendedStrengths.map((s) => (
                      <button key={s.id} onClick={() => setSelections({ ...selections, strength: s })}
                        className={cn("p-3 rounded-lg border text-left transition-all",
                          selections.strength?.id === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}>
                        <span className="font-medium">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {otherStrengths.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground mt-4">All strengths:</p>
                  <div className="flex flex-wrap gap-2">
                    {otherStrengths.map((s) => (
                      <button key={s.id} onClick={() => setSelections({ ...selections, strength: s })}
                        className={cn("px-3 py-1.5 rounded-full border text-sm transition-all",
                          selections.strength?.id === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === "hookStyle" && (
            <div className="space-y-3">
              {HOOK_STYLES.map((hook) => (
                <button key={hook.id} onClick={() => setSelections({ ...selections, hookStyle: hook })}
                  className={cn("w-full p-4 rounded-lg border text-left transition-all",
                    selections.hookStyle?.id === hook.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}>
                  <span className="font-medium">{hook.name}</span>
                  <p className="text-sm text-muted-foreground mt-1 italic">"{hook.example}"</p>
                </button>
              ))}
            </div>
          )}

          {currentStep === "generate" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Your Selections:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selections.pillar?.name}</Badge>
                  <Badge variant="secondary">{selections.postType?.name}</Badge>
                  <Badge variant="secondary">{selections.hookStyle?.name}</Badge>
                  <Badge variant="secondary">{selections.strength?.name}</Badge>
                  {selections.falseBelief && <Badge variant="outline">+ False Belief</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pain Point: {selections.customPainPoint || selections.painPoint}
                </p>
                {selections.falseBelief && (
                  <p className="text-sm text-muted-foreground">
                    False Belief: {selections.falseBelief.title}
                  </p>
                )}
              </div>

              {!generatedScript ? (
                <Button onClick={generateScript} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Generate Script</>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Generated Script:</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
                      </Button>
                      <Button variant="outline" size="sm" onClick={saveScript} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-4 text-sm">
                    {[
                      ["HOOK", generatedScript.hook],
                      ["BRIDGE", generatedScript.bridge],
                      ["AUTHORITY ANCHOR", generatedScript.authority_anchor],
                      ["EDUCATION", generatedScript.education],
                      ["PATTERN EXPANSION", generatedScript.pattern_expansion],
                      ["CTA", generatedScript.cta],
                    ].map(([label, text]) => (
                      <div key={label}>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                        <p className={label === "AUTHORITY ANCHOR" ? "italic" : label === "CTA" ? "font-medium" : ""}>{text}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">CAPTION</p>
                    <p className="text-sm">{generatedScript.caption}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {generatedScript.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  <Button onClick={generateScript} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />Regenerate
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goBack} disabled={currentStepIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />Back
        </Button>
        {currentStep !== "generate" && (
          <Button onClick={goNext} disabled={!canProceed()}>
            Next<ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
