/**
 * Roadmap structure matching portal_videos seed data.
 * Video codes are loaded from Supabase at runtime; this defines phase/sub-category order.
 */

export const NS_FOUNDATION_PHASE = "Nervous System Foundation";

export const PHASE_ORDER = [
  "Gut Function",
  "Metabolic Repair",
  "Hormonal Balancing",
] as const;

export type RoadmapPhase = (typeof PHASE_ORDER)[number] | typeof NS_FOUNDATION_PHASE;

export const SUBCATEGORIES_BY_PHASE: Record<string, string[]> = {
  [NS_FOUNDATION_PHASE]: [
    "Introduction",
    "Nervous System & Sleep",
    "Nervous System & Practical Regulation",
  ],
  "Gut Function": [
    "Introduction to Gut Health",
    "Gut Lining Permeability",
    "Gut Microbiome and Dysbiosis",
    "Digestive Dysfunction",
    "Bowel Health",
    "SIBO",
  ],
  "Metabolic Repair": [
    "Introduction to Metabolic Health",
    "Blood Sugar and Insulin Resistance",
    "GLP-1 and Natural Metabolic Hormones",
    "Metabolic Rate and Body Composition",
    "PMOS",
  ],
  "Hormonal Balancing": [
    "Introduction to Hormonal Balancing",
    "Estrogen and Progesterone Balance",
    "Thyroid Function",
    "Cortisol and Adrenal Function",
    "Perimenopause",
    "Menopause",
  ],
};

export interface RoadmapVideo {
  video_code: string;
  title: string;
  phase: string;
  sub_category: string;
  sequence_order: number;
  is_foundation_layer: boolean;
  video_url: string | null;
  production_status: string;
}

export interface RoadmapSubCategory {
  phase: string;
  name: string;
  videos: RoadmapVideo[];
}

export interface StructuredRoadmap {
  nervousSystem: RoadmapSubCategory[];
  phases: RoadmapSubCategory[];
}
