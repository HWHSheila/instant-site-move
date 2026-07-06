import { describe, it, expect } from "vitest";
import {
  buildInitialProgressRows,
  getInitialUnlockedCodes,
  getNextLessonToUnlock,
  getLessonStatus,
} from "../content-locking";
import type { RoadmapVideo } from "../roadmap-catalog";

const lessons: RoadmapVideo[] = [
  { video_code: "NS-01", title: "A", phase: "Nervous System Foundation", sub_category: "Introduction", sequence_order: 1, is_foundation_layer: true, video_url: null, production_status: "published" },
  { video_code: "GL-01", title: "B", phase: "Gut Function", sub_category: "Introduction to Gut Health", sequence_order: 2, is_foundation_layer: false, video_url: null, production_status: "published" },
  { video_code: "GL-02", title: "C", phase: "Gut Function", sub_category: "Gut Lining Permeability", sequence_order: 3, is_foundation_layer: false, video_url: null, production_status: "published" },
];

describe("content-locking", () => {
  it("unlocks first NS and first pathway lesson initially", () => {
    const unlocked = getInitialUnlockedCodes(lessons);
    expect(unlocked).toEqual(["NS-01", "GL-01"]);
  });

  it("marks non-unlocked lessons as locked in initial rows", () => {
    const unlocked = getInitialUnlockedCodes(lessons);
    const rows = buildInitialProgressRows(lessons, unlocked);
    expect(getLessonStatus("GL-02", rows)).toBe("locked");
    expect(getLessonStatus("GL-01", rows)).toBe("unlocked");
  });

  it("unlocks next lesson after completion", () => {
    const unlocked = getInitialUnlockedCodes(lessons);
    const rows = buildInitialProgressRows(lessons, unlocked);
    const next = getNextLessonToUnlock("GL-01", lessons, rows);
    expect(next).toBe("GL-02");
  });
});
