import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import type { RoadmapVideo } from "@/lib/roadmap-catalog";
import { NS_FOUNDATION_PHASE } from "@/lib/roadmap-catalog";
import type { ProgressRow } from "@/lib/content-locking";
import {
  buildOrderedLessonList,
  getNextLessonToUnlock,
  computeRoadmapStats,
} from "@/lib/content-locking";

export interface MemberRoadmap {
  id: string;
  subscriber_id: string;
  assessment_id: string | null;
  phase_sequence: string[];
  included_subcategories: Record<string, string[]>;
  primary_pattern: string | null;
  secondary_pattern: string | null;
  atm_reasoning: string | null;
  recommended_tier: string | null;
  tier_reasoning: string | null;
  current_phase: string | null;
  current_subcategory: string | null;
}

function parseRoadmap(row: Record<string, unknown>): MemberRoadmap {
  return {
    id: row.id as string,
    subscriber_id: row.subscriber_id as string,
    assessment_id: row.assessment_id as string | null,
    phase_sequence: (row.phase_sequence as string[]) ?? [],
    included_subcategories: (row.included_subcategories as Record<string, string[]>) ?? {},
    primary_pattern: row.primary_pattern as string | null,
    secondary_pattern: row.secondary_pattern as string | null,
    atm_reasoning: row.atm_reasoning as string | null,
    recommended_tier: row.recommended_tier as string | null,
    tier_reasoning: row.tier_reasoning as string | null,
    current_phase: row.current_phase as string | null,
    current_subcategory: row.current_subcategory as string | null,
  };
}

export function useMemberRoadmap(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["member-roadmap", subscriberId],
    queryFn: async (): Promise<MemberRoadmap | null> => {
      if (!subscriberId) return null;

      const { data, error } = await supabase
        .from("member_roadmaps" as any)
        .select("*")
        .eq("subscriber_id", subscriberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return parseRoadmap(data as Record<string, unknown>);
    },
    enabled: !!subscriberId,
  });
}

export function useRoadmapVideos(includedSubcategories: Record<string, string[]> | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["roadmap-videos", includedSubcategories],
    queryFn: async (): Promise<RoadmapVideo[]> => {
      const { data, error } = await supabase
        .from("portal_videos" as any)
        .select("video_code, title, phase, sub_category, sequence_order, is_foundation_layer, video_url, production_status")
        .order("sequence_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as RoadmapVideo[];
    },
    enabled: !!includedSubcategories,
  });
}

export function useContentProgress(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["content-progress", subscriberId],
    queryFn: async (): Promise<ProgressRow[]> => {
      if (!subscriberId) return [];

      const { data, error } = await supabase
        .from("member_content_progress" as any)
        .select("video_code, content_type, status, completed_at, reflection_response, action_items_completed")
        .eq("subscriber_id", subscriberId);

      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
    enabled: !!subscriberId,
  });
}

export function useRoadmapWithProgress(subscriberId: string | undefined) {
  const { data: roadmap, isLoading: roadmapLoading } = useMemberRoadmap(subscriberId);
  const { data: videos = [], isLoading: videosLoading } = useRoadmapVideos(
    roadmap?.included_subcategories
  );
  const { data: progress = [], isLoading: progressLoading } = useContentProgress(subscriberId);

  const orderedLessons =
    roadmap && videos.length > 0
      ? buildOrderedLessonList(videos, roadmap.included_subcategories)
      : [];

  const stats = computeRoadmapStats(orderedLessons, progress);

  return {
    roadmap,
    videos,
    progress,
    orderedLessons,
    stats,
    isLoading: roadmapLoading || videosLoading || progressLoading,
  };
}

function isPhaseComplete(
  phase: string,
  orderedLessons: RoadmapVideo[],
  progress: ProgressRow[],
  justCompletedCode?: string
): boolean {
  const phaseLessons = orderedLessons.filter((v) => v.phase === phase);
  if (phaseLessons.length === 0) return false;
  return phaseLessons.every((v) => {
    if (justCompletedCode && v.video_code === justCompletedCode) return true;
    return (
      progress.find((p) => p.video_code === v.video_code && p.content_type === "lesson")
        ?.status === "completed"
    );
  });
}

function pathwayPhases(orderedLessons: RoadmapVideo[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of orderedLessons) {
    if (v.phase === NS_FOUNDATION_PHASE) continue;
    if (!seen.has(v.phase)) {
      seen.add(v.phase);
      out.push(v.phase);
    }
  }
  return out;
}

export function useCompleteLesson(subscriberId: string | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoCode,
      orderedLessons,
      progress,
    }: {
      videoCode: string;
      orderedLessons: RoadmapVideo[];
      progress: ProgressRow[];
    }) => {
      if (!subscriberId) throw new Error("Not authenticated");

      const now = new Date().toISOString();
      const completedLesson = orderedLessons.find((v) => v.video_code === videoCode);
      const phase = completedLesson?.phase;

      const phaseWasComplete =
        !!phase && isPhaseComplete(phase, orderedLessons, progress);
      const roadmapWasComplete = pathwayPhases(orderedLessons).every((p) =>
        isPhaseComplete(p, orderedLessons, progress)
      );

      const { error: completeErr } = await supabase
        .from("member_content_progress" as any)
        .update({ status: "completed", completed_at: now })
        .eq("subscriber_id", subscriberId)
        .eq("video_code", videoCode)
        .eq("content_type", "lesson");

      if (completeErr) throw completeErr;

      const nextCode = getNextLessonToUnlock(videoCode, orderedLessons, progress);
      if (nextCode) {
        const { error: unlockErr } = await supabase
          .from("member_content_progress" as any)
          .upsert(
            {
              subscriber_id: subscriberId,
              video_code: nextCode,
              content_type: "lesson",
              status: "unlocked",
            } as any,
            { onConflict: "subscriber_id,video_code,content_type" }
          );
        if (unlockErr) throw unlockErr;
      }

      // MailerLite: phase / full roadmap completion (best-effort)
      if (phase && !phaseWasComplete) {
        const phaseNowComplete = isPhaseComplete(
          phase,
          orderedLessons,
          progress,
          videoCode
        );
        if (phaseNowComplete) {
          const phases = pathwayPhases(orderedLessons);
          const idx = phases.indexOf(phase);
          const nextPhase = idx >= 0 && idx < phases.length - 1 ? phases[idx + 1] : null;

          const { data: sub } = await supabase
            .from("subscribers")
            .select("email, tier, payment_status")
            .eq("id", subscriberId)
            .maybeSingle();

          if (sub?.email) {
            void supabase.functions
              .invoke("fire-mailerlite-trigger", {
                body: {
                  trigger_name: "phase_completed",
                  subscriber_id: subscriberId,
                  email: sub.email,
                  trigger_data: {
                    phase_name: phase,
                    next_phase: nextPhase,
                    tier: sub.tier,
                    payment_status: sub.payment_status,
                  },
                },
              })
              .catch(() => {
                /* non-blocking */
              });

            const roadmapNowComplete = phases.every((p) =>
              isPhaseComplete(p, orderedLessons, progress, videoCode)
            );
            if (roadmapNowComplete && !roadmapWasComplete) {
              void supabase.functions
                .invoke("fire-mailerlite-trigger", {
                  body: {
                    trigger_name: "full_roadmap_completed",
                    subscriber_id: subscriberId,
                    email: sub.email,
                    trigger_data: {
                      tier: sub.tier,
                      payment_status: sub.payment_status,
                    },
                  },
                })
                .catch(() => {
                  /* non-blocking */
                });
            }
          }
        }
      }

      return { nextCode };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-progress", subscriberId] });
    },
  });
}
