import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useRoadmapWithProgress, useCompleteLesson } from "@/hooks/use-member-roadmap";
import { useSupabase } from "@/hooks/use-supabase";
import { usePreviewTier } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
} from "lucide-react";
import { canAccessLesson, getLessonStatus } from "@/lib/content-locking";
import { toast } from "sonner";

const TIER_FEATURES: Record<string, { actionItems: boolean; reflections: boolean }> = {
  admin: { actionItems: true, reflections: true },
  integration: { actionItems: true, reflections: true },
  restoration: { actionItems: true, reflections: true },
  guided: { actionItems: true, reflections: true },
  foundation: { actionItems: true, reflections: true },
  awareness: { actionItems: false, reflections: false },
};

const SCRIPT_SECTIONS = [
  { key: "learning_objective", label: "Learning Objective" },
  { key: "introduction", label: "Introduction" },
  { key: "core_educational_content", label: "Core Educational Content" },
  { key: "practical_application", label: "Practical Application" },
  { key: "gmh_cascade_connection", label: "GMH Cascade Connection" },
  { key: "transition", label: "Transition" },
] as const;

export default function PortalLesson() {
  const { videoCode } = useParams<{ videoCode: string }>();
  const navigate = useNavigate();
  const supabase = useSupabase();
  const { subscriber } = useSubscriber();
  const { previewTier, isAdmin } = usePreviewTier();
  const { orderedLessons, progress, isLoading } = useRoadmapWithProgress(subscriber?.id);
  const completeLesson = useCompleteLesson(subscriber?.id);

  const [scriptOpen, setScriptOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [video, setVideo] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const effectiveTier =
    isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier ?? "awareness";
  const features = TIER_FEATURES[effectiveTier] ?? TIER_FEATURES.awareness;

  const lesson = orderedLessons.find((v) => v.video_code === videoCode);
  const hasAccess = lesson && canAccessLesson(videoCode!, orderedLessons, progress);
  const status = videoCode ? getLessonStatus(videoCode, progress) : "locked";
  const isComplete = status === "completed";

  useEffect(() => {
    if (!videoCode) return;
    let cancelled = false;
    (async () => {
      setLoadingContent(true);
      const { data: v } = await supabase
        .from("portal_videos" as any)
        .select("*")
        .eq("video_code", videoCode)
        .maybeSingle();
      const { data: s } = await supabase
        .from("portal_video_scripts" as any)
        .select("*")
        .eq("video_code", videoCode)
        .maybeSingle();
      if (!cancelled) {
        setVideo(v);
        setScript(s);
        setLoadingContent(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoCode, supabase]);

  const actionItems: string[] = Array.isArray(script?.action_items)
    ? script.action_items
    : typeof script?.action_items === "object" && script?.action_items
    ? Object.values(script.action_items).filter((v): v is string => typeof v === "string")
    : [];

  async function handleMarkComplete() {
    if (!videoCode || !subscriber) return;

    if (features.reflections && reflection.trim()) {
      await supabase.from("member_content_progress" as any).upsert(
        {
          subscriber_id: subscriber.id,
          video_code: videoCode,
          content_type: "reflection",
          status: "completed",
          reflection_response: reflection.trim(),
          completed_at: new Date().toISOString(),
        } as any,
        { onConflict: "subscriber_id,video_code,content_type" }
      );
    }

    if (features.actionItems && actionItems.length > 0) {
      const completed = actionItems.filter((_, i) => checkedItems[i]);
      await supabase.from("member_content_progress" as any).upsert(
        {
          subscriber_id: subscriber.id,
          video_code: videoCode,
          content_type: "action_item",
          status: "completed",
          action_items_completed: completed,
          completed_at: new Date().toISOString(),
        } as any,
        { onConflict: "subscriber_id,video_code,content_type" }
      );
    }

    try {
      await completeLesson.mutateAsync({
        videoCode,
        orderedLessons,
        progress,
      });
      toast.success("Lesson marked complete!");
      navigate("/portal/pathways");
    } catch {
      toast.error("Could not mark lesson complete.");
    }
  }

  if (isLoading || loadingContent) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lesson || !hasAccess) {
    return (
      <div className="space-y-6 text-center py-12">
        <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
        <h1 className="text-xl font-semibold">Lesson Locked</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete the previous lesson in your roadmap to unlock this one.
        </p>
        <Button variant="outline" onClick={() => navigate("/portal/pathways")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={lesson.title} noindex />
      <div className="space-y-6 max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/portal/pathways")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
        </Button>

        <div>
          <p className="text-xs font-mono text-muted-foreground">{lesson.video_code}</p>
          <h1 className="font-display text-2xl font-semibold mt-1">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lesson.phase} · {lesson.sub_category}
          </p>
        </div>

        {/* Video */}
        <Card>
          <CardContent className="pt-6">
            {video?.video_url ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={video.video_url}
                  controls
                  className="w-full h-full"
                  playsInline
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
                <p className="text-muted-foreground text-sm">
                  Video coming soon — script and action items are available below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Script sections */}
        {script && (
          <Collapsible open={scriptOpen} onOpenChange={setScriptOpen}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <CardTitle className="text-base">Lesson Script</CardTitle>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${scriptOpen ? "rotate-180" : ""}`}
                  />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {SCRIPT_SECTIONS.map(({ key, label }) =>
                    script[key] ? (
                      <div key={key}>
                        <p className="text-sm font-semibold text-primary mb-1">{label}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {script[key]}
                        </p>
                      </div>
                    ) : null
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Action items ($29+ tiers) */}
        {features.actionItems && actionItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actionItems.map((item, i) => (
                <label key={i} className="flex items-start gap-3 text-sm cursor-pointer">
                  <Checkbox
                    checked={!!checkedItems[i]}
                    onCheckedChange={(v) =>
                      setCheckedItems((prev) => ({ ...prev, [i]: !!v }))
                    }
                    disabled={isComplete}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reflection ($29+ tiers) */}
        {features.reflections && script?.reflection_prompt && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-base">Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{script.reflection_prompt}</p>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection here..."
                rows={4}
                disabled={isComplete}
              />
            </CardContent>
          </Card>
        )}

        {/* Mark complete */}
        {!isComplete && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleMarkComplete}
            disabled={completeLesson.isPending}
          >
            {completeLesson.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Mark as Complete
          </Button>
        )}

        {isComplete && (
          <div className="flex items-center justify-center gap-2 text-primary py-4">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Lesson completed</span>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          This content is for educational purposes only and is not medical advice.
        </p>
      </div>
    </>
  );
}
