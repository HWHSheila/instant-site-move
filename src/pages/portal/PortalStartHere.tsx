import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useSubscriber, useJourneyProgress } from "@/hooks/use-subscriber";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardList, CalendarDays } from "lucide-react";

const pillars = [
  {
    step: "1",
    title: "Gut",
    description:
      "Digestion is the foundation. How your body breaks down, absorbs, and eliminates nutrients shapes everything downstream...from energy to mood to hormone signaling.",
  },
  {
    step: "2",
    title: "Metabolism",
    description:
      "Your metabolic rhythm determines how efficiently your body converts food into fuel. When digestion is disrupted, metabolic stability often follows.",
  },
  {
    step: "3",
    title: "Hormones",
    description:
      "Hormonal patterns are often the last system to respond...and the first system women notice. Understanding what drives those patterns is where root-cause coaching begins.",
  },
];

const PHASE_LABELS: Record<string, string> = {
  clarity: "Immediate Clarity (Days 1-5)",
  pattern_recognition: "Pattern Recognition (Days 6-12)",
  friction: "Understanding Your Patterns (Days 13-17)",
  guided_preview: "Guided Experience Preview (Days 18-21)",
  complete: "Journey Complete",
};

export default function PortalStartHere() {
  const navigate = useNavigate();
  const { subscriber, isLoading } = useSubscriber();
  const { data: progress } = useJourneyProgress(subscriber?.id);

  const hasIntake = subscriber?.intake_completed;
  const dayNumber = progress?.day_number;
  const phase = progress?.current_phase;

  return (
    <>
      <SEO title="Start Here" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Start Here</h1>
          <p className="text-muted-foreground mt-1">
            The core framework behind everything inside this portal.
          </p>
        </div>

        {/* Journey Entry Point */}
        {!isLoading && !hasIntake && (
          <Card className="border-primary border-2 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h2 className="font-display text-lg font-semibold">
                    Your First Step: Take the Wellness Assessment
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Before diving into the framework below, let's identify <em>your</em> unique patterns.
                    The AI-powered assessment takes about 5 minutes and creates a personalized roadmap
                    based on your symptoms and history.
                  </p>
                  <Button onClick={() => navigate("/portal/intake")}>
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journey Progress */}
        {hasIntake && dayNumber != null && dayNumber > 0 && dayNumber <= 21 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">
                    Day {dayNumber} — {PHASE_LABELS[phase || ""] || phase}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your 21-day journey is designed to help you move from awareness to action.
                    Each phase builds on the last.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            This portal is designed to help you understand how your digestion patterns, metabolic rhythm, stress signals, and hormone responses are all connected — and why addressing them in the right order matters.
          </p>
          <p>
            Instead of chasing individual symptoms, you'll learn to read your body's patterns and follow a structured path toward stability. Everything inside this portal is built on that principle.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 md:p-6 space-y-2">
          <p className="font-display text-lg font-medium text-foreground">The Root-Cause Framework</p>
          <p className="text-sm text-muted-foreground">
            Gut → Metabolism → Hormones. This is the order your body processes information, and the order we follow inside this portal.
          </p>
        </div>

        <div className="space-y-4">
          {pillars.map((p) => (
            <div key={p.step} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm shrink-0">
                {p.step}
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
