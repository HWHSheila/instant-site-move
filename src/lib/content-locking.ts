/**
 * Sequential content locking per HWH_Sequential_Content_Locking_Logic.md
 */

import type { RoadmapVideo } from "./roadmap-catalog";
import { NS_FOUNDATION_PHASE } from "./roadmap-catalog";

export type ProgressStatus = "locked" | "unlocked" | "in_progress" | "completed";

export interface ProgressRow {
  video_code: string;
  content_type: string;
  status: ProgressStatus;
  completed_at: string | null;
  reflection_response?: string | null;
  action_items_completed?: string[] | null;
}

export function buildOrderedLessonList(
  videos: RoadmapVideo[],
  includedSubcategories: Record<string, string[]>
): RoadmapVideo[] {
  const included = new Set<string>();
  for (const subs of Object.values(includedSubcategories)) {
    subs.forEach((s) => included.add(s));
  }

  const nsVideos = videos
    .filter((v) => v.phase === NS_FOUNDATION_PHASE)
    .sort((a, b) => a.sequence_order - b.sequence_order);

  const pathwayVideos: RoadmapVideo[] = [];
  const phases = ["Gut Function", "Metabolic Repair", "Hormonal Balancing"];

  for (const phase of phases) {
    const subs = includedSubcategories[phase] ?? [];
    for (const sub of subs) {
      const subVideos = videos
        .filter((v) => v.phase === phase && v.sub_category === sub)
        .sort((a, b) => a.sequence_order - b.sequence_order);
      pathwayVideos.push(...subVideos);
    }
  }

  return [...nsVideos, ...pathwayVideos];
}

export function getInitialUnlockedCodes(orderedLessons: RoadmapVideo[]): string[] {
  const unlocked: string[] = [];

  const firstNs = orderedLessons.find((v) => v.phase === NS_FOUNDATION_PHASE);
  if (firstNs) unlocked.push(firstNs.video_code);

  const firstPathway = orderedLessons.find((v) => v.phase !== NS_FOUNDATION_PHASE);
  if (firstPathway) unlocked.push(firstPathway.video_code);

  return unlocked;
}

export function buildInitialProgressRows(
  orderedLessons: RoadmapVideo[],
  unlockedCodes: string[]
): Array<{ video_code: string; content_type: string; status: ProgressStatus }> {
  const unlockedSet = new Set(unlockedCodes);
  return orderedLessons.map((lesson) => ({
    video_code: lesson.video_code,
    content_type: "lesson",
    status: unlockedSet.has(lesson.video_code) ? "unlocked" : "locked",
  }));
}

export function getLessonStatus(
  videoCode: string,
  progress: ProgressRow[]
): ProgressStatus {
  return (
    progress.find((p) => p.video_code === videoCode && p.content_type === "lesson")
      ?.status ?? "locked"
  );
}

export function canAccessLesson(
  videoCode: string,
  orderedLessons: RoadmapVideo[],
  progress: ProgressRow[]
): boolean {
  const status = getLessonStatus(videoCode, progress);
  return status === "unlocked" || status === "in_progress" || status === "completed";
}

/** After marking lesson complete, return the next video_code to unlock (if any) */
export function getNextLessonToUnlock(
  completedCode: string,
  orderedLessons: RoadmapVideo[],
  progress: ProgressRow[]
): string | null {
  const idx = orderedLessons.findIndex((v) => v.video_code === completedCode);
  if (idx < 0 || idx >= orderedLessons.length - 1) return null;

  const completed = completedCode;
  const current = orderedLessons[idx];
  const next = orderedLessons[idx + 1];

  // Within same sub-category: unlock next lesson
  if (
    next.phase === current.phase &&
    next.sub_category === current.sub_category
  ) {
    return next.video_code;
  }

  // Moving to next sub-category: all lessons in current sub-category must be complete
  const subLessons = orderedLessons.filter(
    (v) => v.phase === current.phase && v.sub_category === current.sub_category
  );
  const allComplete = subLessons.every(
    (v) =>
      v.video_code === completed ||
      getLessonStatus(v.video_code, progress) === "completed"
  );
  if (allComplete) return next.video_code;

  return null;
}

export function computeRoadmapStats(
  orderedLessons: RoadmapVideo[],
  progress: ProgressRow[]
): { completed: number; total: number; percent: number } {
  const lessonProgress = progress.filter((p) => p.content_type === "lesson");
  const total = orderedLessons.length;
  const completed = orderedLessons.filter(
    (v) => getLessonStatus(v.video_code, lessonProgress) === "completed"
  ).length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
