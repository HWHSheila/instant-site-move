-- Content Studio Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PILLARS (5 content categories)
-- ============================================
CREATE TABLE IF NOT EXISTS pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- P1, P2, P3, P4, P5
  name TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  color TEXT, -- hex color for UI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAIN POINTS (symptoms and struggles)
-- ============================================
CREATE TABLE IF NOT EXISTS pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('symptom', 'confusion', 'frustration')),
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  gut_connection TEXT,
  metabolism_connection TEXT,
  hormone_connection TEXT,
  example_hooks TEXT[], -- array of example hook openings
  is_default BOOLEAN DEFAULT TRUE, -- true for pre-seeded, false for user-added
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FALSE BELIEFS (misconceptions to debunk)
-- ============================================
CREATE TABLE IF NOT EXISTS false_beliefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- the false belief
  correct_framing TEXT, -- what's actually true
  category TEXT CHECK (category IN ('diet_culture', 'medical_myth', 'self_blame')),
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  example_hooks TEXT[],
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GALLUP STRENGTHS
-- ============================================
CREATE TABLE IF NOT EXISTS gallup_strengths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  best_for TEXT[], -- array of post types this strength works best for
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT PIECES (generated scripts)
-- ============================================
CREATE TABLE IF NOT EXISTS content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  
  -- Content inputs
  pillar_id UUID REFERENCES pillars(id),
  pain_point_id UUID REFERENCES pain_points(id),
  false_belief_id UUID REFERENCES false_beliefs(id),
  post_type TEXT CHECK (post_type IN ('authority', 'engagement', 'sales')),
  hook_style TEXT CHECK (hook_style IN ('symptom', 'pattern', 'false_belief', 'confusion', 'observation')),
  primary_strength TEXT,
  secondary_strength TEXT,
  
  -- Script sections (from Document 4)
  script_hook TEXT,
  script_bridge TEXT,
  script_authority_anchor TEXT DEFAULT 'My name is Sheila, and I''ve dropped over 105 pounds by combining my background as a scientist with root cause wellness for women.',
  script_education TEXT,
  script_pattern_expansion TEXT,
  script_cta TEXT,
  full_script TEXT, -- combined script
  
  -- Caption and hashtags
  caption TEXT,
  hashtags TEXT[] DEFAULT ARRAY['#womenswellness', '#rootcausecoach', '#yourbodyischemistry', '#femalephysiology', '#metabolicstability'],
  
  -- Video (future HeyGen integration)
  video_url TEXT,
  video_status TEXT DEFAULT 'none' CHECK (video_status IN ('none', 'generating', 'ready', 'failed')),
  
  -- Status and scheduling
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'scheduled', 'posted')),
  scheduled_date DATE,
  posted_date TIMESTAMPTZ,
  
  -- Performance tracking
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGNS (themed weeks, launches, funnels)
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('themed_week', 'product_launch', 'evergreen_funnel')),
  focus_pain_point_id UUID REFERENCES pain_points(id),
  focus_false_belief_id UUID REFERENCES false_beliefs(id),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  target_posts INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CALENDAR ENTRIES (scheduled content)
-- ============================================
CREATE TABLE IF NOT EXISTS calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_piece_id UUID REFERENCES content_pieces(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  platform TEXT CHECK (platform IN ('tiktok', 'instagram_reels', 'instagram_stories', 'youtube_shorts', 'youtube_long', 'facebook')),
  posted BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT WEEKS (weekly planning view)
-- ============================================
CREATE TABLE IF NOT EXISTS content_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL, -- Monday of the week
  target_authority INTEGER DEFAULT 4, -- 50%
  target_sales INTEGER DEFAULT 2, -- 30%
  target_engagement INTEGER DEFAULT 1, -- 20%
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pain_points_pillar ON pain_points(pillar_id);
CREATE INDEX IF NOT EXISTS idx_false_beliefs_pillar ON false_beliefs(pillar_id);
CREATE INDEX IF NOT EXISTS idx_content_pieces_pillar ON content_pieces(pillar_id);
CREATE INDEX IF NOT EXISTS idx_content_pieces_status ON content_pieces(status);
CREATE INDEX IF NOT EXISTS idx_content_pieces_post_type ON content_pieces(post_type);
CREATE INDEX IF NOT EXISTS idx_content_pieces_scheduled ON content_pieces(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_date ON calendar_entries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_content_weeks_start ON content_weeks(week_start);

-- ============================================
-- ROW LEVEL SECURITY (optional - enable later)
-- ============================================
-- For now, tables are accessible. Enable RLS when adding multi-user support.

-- ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE false_beliefs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE content_weeks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pillars_updated_at BEFORE UPDATE ON pillars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pain_points_updated_at BEFORE UPDATE ON pain_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_false_beliefs_updated_at BEFORE UPDATE ON false_beliefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pieces_updated_at BEFORE UPDATE ON content_pieces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_entries_updated_at BEFORE UPDATE ON calendar_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_weeks_updated_at BEFORE UPDATE ON content_weeks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
