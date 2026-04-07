import { useLocation, useNavigate } from "react-router-dom";
import { useSubscriber, usePatternMap } from "@/hooks/use-subscriber";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Eye,
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const TIER_INFO: Record<
  string,
  { name: string; price: string; tagline: string; description: string }
> = {
  awareness: {
    name: "Root-Cause Pattern Awareness",
    price: "$9/mo",
    tagline: "I can see my patterns",
    description:
      "Observe and validate your patterns. Includes pattern results, personalized roadmap, and symptom tracking tools.",
  },
  foundation: {
    name: "Foundation",
    price: "$29/mo",
    tagline: "I understand my patterns",
    description:
      "Educational clarity around your highest-priority issues. Core modules within your assigned pathway.",
  },
  guided: {
    name: "Guided",
    price: "$69/mo",
    tagline: "I'm starting to apply this",
    description:
      "Begin applying what you're learning with practical direction and light sequencing guidance.",
  },
  restoration: {
    name: "Restoration",
    price: "$119/mo",
    tagline: "I'm being guided through this",
    description:
      "Full guided pathway with structured sequencing, ongoing prioritization, and adaptive check-ins.",
  },
  integration: {
    name: "Integration",
    price: "$299/mo",
    tagline: "This is being interpreted for me",
    description:
      "The closest experience to 1:1 coaching. Full access, deepest personalization, highest-touch support.",
  },
};

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        colors[severity] || colors.low
      }`}
    >
      {severity}
    </span>
  );
}

function PatternSection({
  title,
  icon: Icon,
  patterns,
  color,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  patterns: Array<{ issue: string; severity: string; rank: number }>;
  color: string;
}) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {patterns.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-5">
                  #{p.rank}
                </span>
                <span className="text-sm font-medium">{p.issue}</span>
              </div>
              <SeverityBadge severity={p.severity} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortalResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriber } = useSubscriber();
  const { data: savedMap } = usePatternMap(subscriber?.id);

  const patternResult = location.state?.patternResult || savedMap;

  if (!patternResult) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-display font-bold">No Results Found</h1>
        <p className="text-muted-foreground">
          Complete the wellness assessment first to see your personalized pattern analysis.
        </p>
        <Button onClick={() => navigate("/portal/intake")}>Take Assessment</Button>
      </div>
    );
  }

  const recommended = patternResult.recommended_tier || "awareness";
  const tier = TIER_INFO[recommended] || TIER_INFO.awareness;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <Badge
          variant="secondary"
          className="text-xs uppercase tracking-wider"
        >
          Your Personalized Analysis
        </Badge>
        <h1 className="text-3xl font-display font-bold">
          Your Body Is Telling a Story
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Based on your assessment, we've identified the patterns your body is
          communicating. These aren't random symptoms -- they're connected
          signals.
        </p>
      </div>

      {/* Focus Areas */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-4">
            Your Current Focus
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Primary Focus
                </p>
                <p className="font-semibold text-lg">
                  {patternResult.primary_focus}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Secondary Focus
                </p>
                <p className="font-semibold">
                  {patternResult.secondary_focus}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Watch Area
                </p>
                <p className="font-medium text-muted-foreground">
                  {patternResult.watch_area}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Details */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Identified Patterns</h2>
        <PatternSection
          title="Gut Patterns"
          icon={Sparkles}
          patterns={patternResult.gut_patterns}
          color="text-purple-600"
        />
        <PatternSection
          title="Metabolic Patterns"
          icon={TrendingUp}
          patterns={patternResult.metabolic_patterns}
          color="text-amber-600"
        />
        <PatternSection
          title="Hormonal Patterns"
          icon={Shield}
          patterns={patternResult.hormonal_patterns}
          color="text-pink-600"
        />
      </div>

      {/* Roadmap Explanation */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-semibold">Why This Order Matters</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {patternResult.ai_reasoning}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Her Wellness Harmony follows a{" "}
            <strong>Gut → Metabolism → Hormones</strong> framework because gut
            health is foundational. When the gut signals are addressed first,
            metabolic and hormonal patterns often improve as downstream effects
            resolve.
          </p>
        </CardContent>
      </Card>

      {/* Tier Recommendation */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-center">
          Your Recommended Path
        </h2>

        <Card className="border-primary border-2">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2">Recommended for You</Badge>
                <h3 className="font-bold text-xl">{tier.name}</h3>
                <p className="text-sm text-muted-foreground italic">
                  "{tier.tagline}"
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{tier.price}</p>
                <p className="text-xs text-muted-foreground">21-day free trial</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
            <Button className="w-full" size="lg" onClick={() => navigate("/portal/coaching")}>
              Start at {tier.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {recommended !== "awareness" && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {TIER_INFO.awareness.name}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    "{TIER_INFO.awareness.tagline}"
                  </p>
                </div>
                <p className="font-bold text-lg">{TIER_INFO.awareness.price}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {TIER_INFO.awareness.description}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/portal/coaching")}
              >
                Start with Pattern Awareness
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        All tiers include a 21-day free trial. You can upgrade or change your
        tier at any time.
      </p>
    </div>
  );
}
