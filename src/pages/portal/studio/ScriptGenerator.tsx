import { useState } from "react";
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
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Blueprint Data (from Appendix A)
const PILLARS = [
  { id: "P1", name: "Gut Function", description: "Digestive health and microbiome", color: "#8B5CF6" },
  { id: "P2", name: "Blood Sugar", description: "Glucose regulation and energy", color: "#F59E0B" },
  { id: "P3", name: "Inflammation", description: "Immune response and recovery", color: "#EF4444" },
  { id: "P4", name: "Metabolic Instability", description: "Metabolic signaling and adaptation", color: "#10B981" },
  { id: "P5", name: "Chronic Fatigue", description: "Energy patterns and recovery", color: "#3B82F6" },
];

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

const GALLUP_STRENGTHS = [
  { name: "Analytical", bestFor: ["authority"] },
  { name: "Learner", bestFor: ["authority"] },
  { name: "Strategic", bestFor: ["authority"] },
  { name: "Restorative", bestFor: ["authority", "sales"] },
  { name: "Intellection", bestFor: ["authority"] },
  { name: "Relator", bestFor: ["engagement"] },
  { name: "Responsibility", bestFor: ["engagement"] },
  { name: "Significance", bestFor: ["engagement"] },
  { name: "Command", bestFor: ["sales"] },
  { name: "Focus", bestFor: ["sales"] },
  { name: "Futuristic", bestFor: ["sales"] },
  { name: "Competition", bestFor: ["engagement", "sales"] },
];

const PAIN_POINTS = [
  "Weight fluctuates despite consistent eating",
  "Afternoon energy crashes",
  "Bloating after most meals",
  "Brain fog that won't lift",
  "Sleep issues despite feeling exhausted",
  "Feeling cold all the time",
  "Stubborn belly fat",
  "Mood swings before period",
  "Cravings that feel uncontrollable",
  "Feeling puffy or inflamed",
];

type WizardStep = "pillar" | "painPoint" | "postType" | "strength" | "hookStyle" | "generate";

const STEPS: { id: WizardStep; title: string }[] = [
  { id: "pillar", title: "Choose Pillar" },
  { id: "painPoint", title: "Select Pain Point" },
  { id: "postType", title: "Post Type" },
  { id: "strength", title: "Gallup Strength" },
  { id: "hookStyle", title: "Hook Style" },
  { id: "generate", title: "Generate Script" },
];

export default function ScriptGenerator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>("pillar");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selections, setSelections] = useState({
    pillar: null as typeof PILLARS[0] | null,
    painPoint: "",
    customPainPoint: "",
    postType: null as typeof POST_TYPES[0] | null,
    strength: null as typeof GALLUP_STRENGTHS[0] | null,
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

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "pillar": return !!selections.pillar;
      case "painPoint": return !!selections.painPoint || !!selections.customPainPoint;
      case "postType": return !!selections.postType;
      case "strength": return !!selections.strength;
      case "hookStyle": return !!selections.hookStyle;
      default: return true;
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const generateScript = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: {
          pillar: selections.pillar,
          painPoint: selections.customPainPoint || selections.painPoint,
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
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedScript?.full_script) {
      await navigator.clipboard.writeText(generatedScript.full_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const recommendedStrengths = GALLUP_STRENGTHS.filter(s => 
    selections.postType ? s.bestFor.includes(selections.postType.id) : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Script Generator</h1>
        <p className="text-muted-foreground">
          Create AI-powered content scripts using your brand voice
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 md:w-20 h-1 mx-1",
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {STEPS.map((step) => (
          <span key={step.id} className="text-center w-16 md:w-auto">{step.title}</span>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStepIndex].title}</CardTitle>
          <CardDescription>
            {currentStep === "pillar" && "Select the content pillar for your script"}
            {currentStep === "painPoint" && "Choose or describe the pain point to address"}
            {currentStep === "postType" && "What type of post is this?"}
            {currentStep === "strength" && "Select your primary Gallup strength for tone"}
            {currentStep === "hookStyle" && "How do you want to open the script?"}
            {currentStep === "generate" && "Review your selections and generate the script"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Pillar */}
          {currentStep === "pillar" && (
            <div className="grid gap-3 md:grid-cols-2">
              {PILLARS.map((pillar) => (
                <button
                  key={pillar.id}
                  onClick={() => setSelections({ ...selections, pillar })}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    selections.pillar?.id === pillar.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <span className="font-medium">{pillar.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Pain Point */}
          {currentStep === "painPoint" && (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                {PAIN_POINTS.map((point) => (
                  <button
                    key={point}
                    onClick={() => setSelections({ ...selections, painPoint: point, customPainPoint: "" })}
                    className={cn(
                      "p-3 rounded-lg border text-left text-sm transition-all",
                      selections.painPoint === point
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {point}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Or describe your own:</label>
                <Textarea
                  placeholder="Describe the pain point or symptom..."
                  value={selections.customPainPoint}
                  onChange={(e) => setSelections({ ...selections, customPainPoint: e.target.value, painPoint: "" })}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Post Type */}
          {currentStep === "postType" && (
            <div className="grid gap-3 md:grid-cols-3">
              {POST_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelections({ ...selections, postType: type })}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    selections.postType?.id === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Gallup Strength */}
          {currentStep === "strength" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Recommended for {selections.postType?.name} posts:
              </p>
              <div className="grid gap-2 md:grid-cols-3">
                {recommendedStrengths.map((strength) => (
                  <button
                    key={strength.name}
                    onClick={() => setSelections({ ...selections, strength })}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selections.strength?.name === strength.name
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="font-medium">{strength.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">All strengths:</p>
              <div className="flex flex-wrap gap-2">
                {GALLUP_STRENGTHS.filter(s => !recommendedStrengths.includes(s)).map((strength) => (
                  <button
                    key={strength.name}
                    onClick={() => setSelections({ ...selections, strength })}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-sm transition-all",
                      selections.strength?.name === strength.name
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {strength.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Hook Style */}
          {currentStep === "hookStyle" && (
            <div className="space-y-3">
              {HOOK_STYLES.map((hook) => (
                <button
                  key={hook.id}
                  onClick={() => setSelections({ ...selections, hookStyle: hook })}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    selections.hookStyle?.id === hook.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="font-medium">{hook.name}</span>
                  <p className="text-sm text-muted-foreground mt-1 italic">"{hook.example}"</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 6: Generate */}
          {currentStep === "generate" && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="space-y-3">
                <h3 className="font-medium">Your Selections:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selections.pillar?.name}</Badge>
                  <Badge variant="secondary">{selections.postType?.name}</Badge>
                  <Badge variant="secondary">{selections.hookStyle?.name}</Badge>
                  <Badge variant="secondary">{selections.strength?.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pain Point: {selections.customPainPoint || selections.painPoint}
                </p>
              </div>

              {!generatedScript ? (
                <Button
                  onClick={generateScript}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Script
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Generated Script:</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">HOOK</p>
                      <p>{generatedScript.hook}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">BRIDGE</p>
                      <p>{generatedScript.bridge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">AUTHORITY ANCHOR</p>
                      <p className="italic">{generatedScript.authority_anchor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">EDUCATION</p>
                      <p>{generatedScript.education}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">PATTERN EXPANSION</p>
                      <p>{generatedScript.pattern_expansion}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">CTA</p>
                      <p className="font-medium">{generatedScript.cta}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">CAPTION</p>
                    <p className="text-sm">{generatedScript.caption}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {generatedScript.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button onClick={generateScript} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep !== "generate" && (
          <Button
            onClick={goNext}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
