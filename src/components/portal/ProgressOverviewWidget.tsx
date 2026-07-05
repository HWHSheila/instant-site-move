import { Link } from "react-router-dom";
import { useSubscriber, useJourneyProgress } from "@/hooks/use-subscriber";
import { useRoadmapWithProgress } from "@/hooks/use-member-roadmap";
import {
  useMiniAssessments,
  useAssessmentSchedule,
} from "@/hooks/use-mini-assessments";
import { useSymptomLogs } from "@/hooks/use-symptom-logs";
import { assessmentLabel } from "@/lib/mini-assessment-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ClipboardCheck,
  Flame,
  Loader2,
  PlayCircle,
  Route,
} from "lucide-react";

function computeStreak(
  lessonDates: string[],
  logDates: string[],
  assessmentDates: string[]
): number {
  const days = new Set<string>();
  for (const iso of [...lessonDates, ...logDates, ...assessmentDates]) {
    if (!iso) continue;
    days.add(iso.slice(0, 10));
  }
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function ProgressOverviewWidget() {
  const { subscriber } = useSubscriber();
  const { data: journeyProgress } = useJourneyProgress(subscriber?.id);
  const { roadmap, orderedLessons, progress, stats, isLoading: roadmapLoading } =
    useRoadmapWithProgress(subscriber?.id);
  const { data: assessments = [], isLoading: assessmentsLoading } =
    useMiniAssessments(subscriber?.id);
  const { data: symptomLogs = [] } = useSymptomLogs(subscriber?.id);
  const { dayNumber, dueType } = useAssessmentSchedule(
    subscriber,
    journeyProgress,
    assessments
  );

  if (!subscriber?.assessment_completed) return null;

  if (roadmapLoading || assessmentsLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const nextLesson = orderedLessons.find(
    (l) => progress.find((p) => p.video_code === l.video_code)?.status === "unlocked"
  );

  const completedDates = progress
    .filter((p) => p.status === "completed" && p.completed_at)
    .map((p) => p.completed_at!);
  const logDates = symptomLogs.map((l) => l.logged_at);
  const assessmentDates = assessments.map((a) => a.completed_at);
  const streak = computeStreak(completedDates, logDates, assessmentDates);

  const pathwayLabel = roadmap
    ? roadmap.phase_sequence.join(" → ")
    : "Personalized Roadmap";

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              My Guided Roadmap
            </p>
            <p className="font-semibold mt-1">{pathwayLabel}</p>
            {roadmap?.current_subcategory && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Currently in: {roadmap.current_phase} — {roadmap.current_subcategory}
              </p>
            )}
          </div>
          {dayNumber > 0 && (
            <Badge variant="secondary">Day {dayNumber}</Badge>
          )}
        </div>

        {stats.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{stats.percent}% Complete</span>
              <span className="text-muted-foreground">
                {stats.completed}/{stats.total} lessons
              </span>
            </div>
            <Progress value={stats.percent} className="h-2" />
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>
              <strong>{streak}</strong> day streak
            </span>
          </div>
        </div>

        {nextLesson && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-start gap-2 min-w-0">
              <PlayCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Up next</p>
                <p className="text-sm font-medium truncate">{nextLesson.title}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/portal/pathways/lesson/${nextLesson.video_code}`}>
                Continue
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}

        {dueType && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-start gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{assessmentLabel(dueType)} is ready</p>
                <p className="text-xs text-muted-foreground">
                  Takes about 5 minutes — unlocks by day, not lesson progress.
                </p>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link to={`/portal/mini-assessment?type=${dueType}`}>Start</Link>
            </Button>
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link to="/portal/progress">
            <Route className="w-4 h-4 mr-2" />
            View full progress & comparison
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
