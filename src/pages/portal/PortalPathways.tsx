import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useRoadmapWithProgress } from "@/hooks/use-member-roadmap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Loader2,
  ArrowRight,
  Route,
} from "lucide-react";
import { getLessonStatus } from "@/lib/content-locking";
import { NS_FOUNDATION_PHASE } from "@/lib/roadmap-catalog";

export default function PortalPathways() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const { roadmap, orderedLessons, progress, stats, isLoading } =
    useRoadmapWithProgress(subscriber?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <>
        <SEO title="Guided Pathways" noindex />
        <div className="space-y-6 text-center max-w-lg mx-auto py-12">
          <Route className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Your Roadmap Awaits</h1>
          <p className="text-muted-foreground">
            Complete the Wellness Assessment to receive your personalized guided pathway.
          </p>
          <Button onClick={() => navigate("/portal/intake")}>
            Take Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </>
    );
  }

  const phases = [
    { key: NS_FOUNDATION_PHASE, label: "Nervous System Foundation", parallel: true },
    ...(roadmap.phase_sequence as string[]).map((p) => ({
      key: p,
      label: p,
      parallel: false,
    })),
  ];

  return (
    <>
      <SEO title="My Guided Roadmap" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            My Guided Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            Follow your personalized pathway — each lesson unlocks as you complete the previous one.
          </p>
        </div>

        {/* Progress bar */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">
                {stats.completed} of {stats.total} lessons ({stats.percent}%)
              </span>
            </div>
            <Progress value={stats.percent} />
            {roadmap.current_subcategory && (
              <p className="text-sm text-muted-foreground">
                Current focus: <strong>{roadmap.current_subcategory}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {phases.map(({ key, label, parallel }) => {
          const subcategories = roadmap.included_subcategories[key] ?? [];
          if (subcategories.length === 0) return null;

          return (
            <div key={key} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold">{label}</h2>
                {parallel && (
                  <Badge variant="secondary" className="text-xs">
                    Parallel — available from Day 1
                  </Badge>
                )}
              </div>

              {subcategories.map((sub) => {
                const lessons = orderedLessons.filter(
                  (v) => v.phase === key && v.sub_category === sub
                );
                if (lessons.length === 0) return null;

                const subCompleted = lessons.filter(
                  (v) => getLessonStatus(v.video_code, progress) === "completed"
                ).length;

                return (
                  <div key={sub} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary">{sub}</p>
                      <span className="text-xs text-muted-foreground">
                        {subCompleted}/{lessons.length} complete
                      </span>
                    </div>
                    <div className="space-y-2">
                      {lessons.map((lesson) => {
                        const status = getLessonStatus(lesson.video_code, progress);
                        const isLocked = status === "locked";
                        const isComplete = status === "completed";

                        return (
                          <button
                            key={lesson.video_code}
                            type="button"
                            disabled={isLocked}
                            onClick={() =>
                              !isLocked &&
                              navigate(`/portal/pathways/lesson/${lesson.video_code}`)
                            }
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                              isLocked
                                ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                                : isComplete
                                ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className="shrink-0">
                              {isComplete ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-mono text-muted-foreground">
                                {lesson.video_code}
                              </p>
                              <p className="text-sm font-medium truncate">{lesson.title}</p>
                            </div>
                            {!isLocked && !isComplete && (
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
