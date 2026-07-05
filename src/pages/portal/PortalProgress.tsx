import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useSubscriber, useJourneyProgress } from "@/hooks/use-subscriber";
import { useRoadmapWithProgress } from "@/hooks/use-member-roadmap";
import {
  useMiniAssessments,
  useAssessmentSchedule,
} from "@/hooks/use-mini-assessments";
import { useContentProgress } from "@/hooks/use-member-roadmap";
import { buildComparisonRows, averageRating } from "@/lib/mini-assessment-comparison";
import { assessmentLabel, type AssessmentType } from "@/lib/mini-assessment-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ClipboardCheck,
  Loader2,
  Minus,
  CheckCircle2,
} from "lucide-react";

const TYPE_ORDER: AssessmentType[] = ["baseline", "day_11", "day_21", "semi_monthly"];

function DirectionIcon({ direction }: { direction: "improved" | "unchanged" | "needs_attention" | null }) {
  if (direction === "improved") return <ArrowUp className="w-4 h-4 text-green-600" />;
  if (direction === "needs_attention") return <ArrowDown className="w-4 h-4 text-amber-600" />;
  if (direction === "unchanged") return <Minus className="w-4 h-4 text-muted-foreground" />;
  return null;
}

export default function PortalProgress() {
  const { subscriber } = useSubscriber();
  const { data: journeyProgress } = useJourneyProgress(subscriber?.id);
  const { data: assessments = [], isLoading: assessmentsLoading } =
    useMiniAssessments(subscriber?.id);
  const { dueType, dayNumber } = useAssessmentSchedule(
    subscriber,
    journeyProgress,
    assessments
  );
  const { roadmap, orderedLessons, progress, stats, isLoading: roadmapLoading } =
    useRoadmapWithProgress(subscriber?.id);
  const { data: contentProgress = [] } = useContentProgress(subscriber?.id);

  const comparisonRows = buildComparisonRows(
    assessments.map((a) => ({
      assessment_type: a.assessment_type,
      completed_at: a.completed_at,
      ratings: a.ratings,
    }))
  );

  const completedLessons = contentProgress
    .filter((p) => p.status === "completed" && p.completed_at)
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
    )
    .slice(0, 10);

  const showComparison = assessments.length >= 2;
  const presentTypes = TYPE_ORDER.filter((t) =>
    assessments.some((a) => a.assessment_type === t)
  );

  if (assessmentsLoading || roadmapLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscriber?.assessment_completed) {
    return (
      <>
        <SEO title="My Progress" noindex />
        <div className="space-y-4 text-center max-w-lg mx-auto py-12">
          <h1 className="font-display text-2xl font-semibold">My Progress</h1>
          <p className="text-muted-foreground">
            Complete your Wellness Assessment to unlock progress tracking.
          </p>
          <Button asChild>
            <Link to="/portal/intake">Take Assessment</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="My Progress" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">My Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track your roadmap, check-ins, and before-and-after ratings.
          </p>
        </div>

        {dueType && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">{assessmentLabel(dueType)} is ready</p>
                  <p className="text-sm text-muted-foreground">
                    Day {dayNumber} — check-ins unlock by schedule, not lesson progress.
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to={`/portal/mini-assessment?type=${dueType}`}>Start Check-In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Roadmap stats */}
        {roadmap && stats.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roadmap Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Pathway: </span>
                {roadmap.phase_sequence.join(" → ")}
              </p>
              <p>
                <span className="text-muted-foreground">Progress: </span>
                {stats.completed} of {stats.total} lessons ({stats.percent}%)
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/portal/pathways">Go to My Guided Roadmap</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mini assessment comparison */}
        {showComparison ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating Comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Symptom</th>
                    {presentTypes.map((t) => (
                      <th key={t} className="text-center py-2 px-2 font-medium whitespace-nowrap">
                        {assessmentLabel(t).replace(" Assessment", "").replace(" Check-In", "")}
                      </th>
                    ))}
                    <th className="text-center py-2 pl-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => {
                    const hasAnyValue = presentTypes.some((t) => row.values[t] != null);
                    if (!hasAnyValue) return null;
                    return (
                      <tr key={row.key} className="border-b border-border/50">
                        <td className="py-2 pr-4">
                          <span className="text-xs text-muted-foreground block">{row.category}</span>
                          {row.label}
                        </td>
                        {presentTypes.map((t) => (
                          <td key={t} className="text-center py-2 px-2 tabular-nums">
                            {row.values[t] ?? "—"}
                          </td>
                        ))}
                        <td className="text-center py-2 pl-2">
                          <DirectionIcon direction={row.direction} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-green-600" /> Improved
                </span>
                <span className="flex items-center gap-1">
                  <Minus className="w-3 h-3" /> Unchanged
                </span>
                <span className="flex items-center gap-1">
                  <ArrowDown className="w-3 h-3 text-amber-600" /> Needs attention
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Complete your next check-in to unlock the before-and-after comparison view.
              {assessments.length === 1 && (
                <span className="block mt-1">
                  Baseline average:{" "}
                  <strong>{averageRating(assessments[0].ratings) ?? "—"}</strong> / 10
                </span>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assessment history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Check-In History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No check-ins recorded yet.</p>
            ) : (
              assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{assessmentLabel(a.assessment_type)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      avg {averageRating(a.ratings) ?? "—"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent lesson completions */}
        {completedLessons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedLessons.map((p) => {
                const lesson = orderedLessons.find((l) => l.video_code === p.video_code);
                return (
                  <div key={p.video_code} className="flex justify-between text-sm py-1">
                    <span>{lesson?.title ?? p.video_code}</span>
                    <span className="text-muted-foreground text-xs">
                      {p.completed_at
                        ? new Date(p.completed_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/portal/symptom-log">Symptom Log</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
