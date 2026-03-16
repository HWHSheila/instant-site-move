// Content Studio Types (matches Supabase schema)

export type PostType = 'authority' | 'engagement' | 'sales';
export type HookStyle = 'symptom' | 'pattern' | 'false_belief' | 'confusion' | 'observation';
export type PainPointCategory = 'symptom' | 'confusion' | 'frustration';
export type FalseBeliefCategory = 'diet_culture' | 'medical_myth' | 'self_blame';
export type ContentStatus = 'draft' | 'ready' | 'scheduled' | 'posted';
export type CampaignType = 'themed_week' | 'product_launch' | 'evergreen_funnel';
export type CampaignStatus = 'planning' | 'active' | 'completed' | 'paused';
export type Platform = 'tiktok' | 'instagram_reels' | 'instagram_stories' | 'youtube_shorts' | 'youtube_long' | 'facebook';
export type VideoStatus = 'none' | 'generating' | 'ready' | 'failed';

export interface Pillar {
  id: string;
  code: string; // P1, P2, P3, P4, P5
  name: string;
  description: string | null;
  purpose: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface PainPoint {
  id: string;
  title: string;
  description: string | null;
  category: PainPointCategory | null;
  pillar_id: string | null;
  gut_connection: string | null;
  metabolism_connection: string | null;
  hormone_connection: string | null;
  example_hooks: string[] | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  pillar?: Pillar;
}

export interface FalseBelief {
  id: string;
  title: string;
  correct_framing: string | null;
  category: FalseBeliefCategory | null;
  pillar_id: string | null;
  example_hooks: string[] | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  pillar?: Pillar;
}

export interface GallupStrength {
  id: string;
  name: string;
  description: string | null;
  best_for: string[] | null;
  created_at: string;
}

export interface ContentPiece {
  id: string;
  title: string;
  
  // Content inputs
  pillar_id: string | null;
  pain_point_id: string | null;
  false_belief_id: string | null;
  post_type: PostType | null;
  hook_style: HookStyle | null;
  primary_strength: string | null;
  secondary_strength: string | null;
  
  // Script sections
  script_hook: string | null;
  script_bridge: string | null;
  script_authority_anchor: string;
  script_education: string | null;
  script_pattern_expansion: string | null;
  script_cta: string | null;
  full_script: string | null;
  
  // Caption and hashtags
  caption: string | null;
  hashtags: string[];
  
  // Video
  video_url: string | null;
  video_status: VideoStatus;
  
  // Status and scheduling
  status: ContentStatus;
  scheduled_date: string | null;
  posted_date: string | null;
  
  // Performance
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  
  created_at: string;
  updated_at: string;
  
  // Joined
  pillar?: Pillar;
  pain_point?: PainPoint;
  false_belief?: FalseBelief;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  type: CampaignType | null;
  focus_pain_point_id: string | null;
  focus_false_belief_id: string | null;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  target_posts: number;
  created_at: string;
  updated_at: string;
  // Joined
  focus_pain_point?: PainPoint;
  focus_false_belief?: FalseBelief;
  content_pieces?: ContentPiece[];
}

export interface CalendarEntry {
  id: string;
  content_piece_id: string | null;
  campaign_id: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  platform: Platform | null;
  posted: boolean;
  posted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  content_piece?: ContentPiece;
  campaign?: Campaign;
}

export interface ContentWeek {
  id: string;
  week_start: string;
  target_authority: number;
  target_sales: number;
  target_engagement: number;
  status: 'planning' | 'in_progress' | 'completed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Script Generation Input
export interface ScriptGenerationInput {
  pillar: Pillar;
  painPoint?: PainPoint;
  falseBelief?: FalseBelief;
  postType: PostType;
  hookStyle: HookStyle;
  primaryStrength: string;
  secondaryStrength?: string;
}

// Script Generation Output
export interface GeneratedScript {
  hook: string;
  bridge: string;
  authorityAnchor: string;
  education: string;
  patternExpansion: string;
  cta: string;
  fullScript: string;
  caption: string;
  hashtags: string[];
}

// Post Type Distribution (50/30/20)
export interface PostTypeDistribution {
  authority: { target: number; actual: number; percentage: number };
  sales: { target: number; actual: number; percentage: number };
  engagement: { target: number; actual: number; percentage: number };
}
