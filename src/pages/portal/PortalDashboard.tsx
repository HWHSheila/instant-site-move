import { SEO } from "@/components/SEO";
import {
  Compass,
  BookOpen,
  Route,
  Bot,
  Target,
  Shield,
  Eye,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSubscriber, usePatternMap, useJourneyProgress } from "@/hooks/use-subscriber";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  { label: "Start Here", description: "Begin your root-cause journey", to: "/portal/start-here", icon: Compass },
  { label: "Pattern Library", description: "Explore common body patterns", to: "/portal/patterns", icon: BookOpen },
  { label: "Guided Pathways", description: "Follow step-by-step coaching", to: "/portal/pathways", icon: Route },
  { label: "Ask the HWH Coach", description: "Ask your coaching assistant", to: "/portal/HWHcoach", icon: Bot },
];

const PHASE_LABELS: Record<string, string> = {
  clarity: "Immediate Clarity",
  pattern_recognition: "Pattern Recognition",
  friction: "Understanding Your Patterns",
  guided_preview: "Guided Experience Preview",
  complete: "Journey Complete",
};

const TIER_LABELS: Record<string, string> = {
  awareness: "Root-Cause Pattern Awareness",
  foundation: "Foundation",
  guided: "Guided",
  restoration: "Restoration",
  integration: "Integration",
};

function PatternDisplayComponent({
  primaryFocus,
  secondaryFocus,
  watchArea,
}: {
  primaryFocus: string;
  secondaryFocus: string;
  watchArea: string;
}) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-5 space-y-4">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-primary">
          Your Current Focus
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Primary Focus
              </p>
              <p className="font-semibold">{primaryFocus}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Secondary Focus
              </p>
              <p className="font-medium">{secondaryFocus}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Watch Area
              </p>
              <p className="text-sm text-muted-foreground">{watchArea}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortalDashboard() {
  const navigate = useNavigate();
  const { subscriber, isLoading } = useSubscriber();
  const { data: patternMap } = usePatternMap(subscriber?.id);
  const { data: progress } = useJourneyProgress(subscriber?.id);

  const hasIntake = subscriber?.intake_completed;
  const tier = subscriber?.tier;
  const dayNumber = progress?.day_number;
  const phase = progress?.current_phase;

  return (
    <>
      <SEO title="Member Dashboard" noindex />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Her Wellness Harmony
          </h1>
          <p className="text-muted-foreground mt-1">
            {tier
              ? `${TIER_LABELS[tier] || tier} Member`
              : "Root-Cause Guided Coaching + Support"}
          </p>
        </div>

        {/* Journey Status Bar */}
        {hasIntake && dayNumber != null && dayNumber > 0 && dayNumber <= 21 && (
          <Card>
            <CardContent className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  21-Day Journey
                </p>
                <p className="font-semibold">
                  Day {dayNumber}{" "}
                  <span className="text-muted-foreground font-normal">
                    — {PHASE_LABELS[phase || ""] || phase}
                  </span>
                </p>
              </div>
              <Badge variant="secondary">
                {dayNumber}/21
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Intake CTA (if not completed) */}
        {!isLoading && !hasIntake && (
          <Card className="border-primary border-2 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h2 className="font-display text-lg font-semibold">
                    Complete Your Wellness Assessment
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Take the free intake assessment to discover your unique gut,
                    metabolic, and hormonal patterns. The AI will analyze your
                    symptoms and create a personalized roadmap.
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

        {/* Pattern Display (if intake completed) */}
        {hasIntake && patternMap && (
          <PatternDisplayComponent
            primaryFocus={patternMap.primary_focus}
            secondaryFocus={patternMap.secondary_focus}
            watchArea={patternMap.watch_area}
          />
        )}

        {/* Upgrade Prompt (for lower tiers) */}
        {hasIntake && tier === "awareness" && (
          <Card className="bg-muted/50">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Ready for guided support?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade to unlock structured sequencing and coaching.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/portal/coaching")}
                >
                  View Tiers
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="font-display text-lg font-medium text-foreground mb-4">
            {hasIntake ? "Continue Your Journey" : "Start Your Coaching Journey"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
