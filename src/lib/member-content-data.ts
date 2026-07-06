/** Shared content studio constants for social + member content AI assist */
export const MEMBER_CONTENT_PAIN_POINTS = [
  "Bloating every night",
  "Energy crashes mid-day",
  "Cycle symptoms shifting wildly",
  "Water retention / inflammation",
  "Hair shedding, sleep disruption",
  "Feeling dismissed by doctors",
  "I've tried everything",
];

export const MEMBER_CONTENT_FALSE_BELIEFS = [
  "It's just normal aging",
  "Eat less move more",
  "Your labs are fine so nothing is wrong",
  "Hormones are unrelated to gut health",
  "Stress is all in your head",
];

export type MemberPostType = "article" | "weekly_note";

export const TIER_OPTIONS = [
  "awareness",
  "foundation",
  "guided",
  "restoration",
  "integration",
] as const;
