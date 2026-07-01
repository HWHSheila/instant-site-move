-- Portal Membership Database Schema
-- Run this in Supabase SQL Editor AFTER content_studio_schema.sql
-- Designed for Clerk auth (user_id is Clerk's sub claim, text not FK)

-- ============================================
-- SUBSCRIBERS (member profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('awareness', 'foundation', 'guided', 'restoration', 'integration')),
  track TEXT CHECK (track IN ('gut_focused', 'metabolic', 'hormonal', 'comprehensive')),
  intake_completed BOOLEAN DEFAULT FALSE,
  payment_status TEXT DEFAULT 'none' CHECK (payment_status IN ('none', 'trial', 'active', 'past_due', 'cancelled')),
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTAKE RESPONSES (wellness assessment)
-- ============================================
CREATE TABLE IF NOT EXISTS intake_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  gut_symptoms JSONB DEFAULT '[]'::jsonb,
  metabolic_symptoms JSONB DEFAULT '[]'::jsonb,
  hormonal_symptoms JSONB DEFAULT '[]'::jsonb,
  test_results JSONB DEFAULT '{}'::jsonb,
  health_history TEXT,
  goals TEXT,
  raw_form_data JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- PATTERN MAPS (AI-identified patterns)
-- ============================================
CREATE TABLE IF NOT EXISTS pattern_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  gut_patterns JSONB DEFAULT '[]'::jsonb,
  metabolic_patterns JSONB DEFAULT '[]'::jsonb,
  hormonal_patterns JSONB DEFAULT '[]'::jsonb,
  primary_focus TEXT,
  secondary_focus TEXT,
  watch_area TEXT,
  recommended_tier TEXT,
  ai_reasoning TEXT,
  override_by_admin BOOLEAN DEFAULT FALSE
);

-- ============================================
-- SUBSCRIBER PROGRESS (21-day journey)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriber_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  day_number INTEGER DEFAULT 1,
  current_phase TEXT DEFAULT 'clarity' CHECK (current_phase IN ('clarity', 'pattern_recognition', 'friction', 'guided_preview', 'complete')),
  last_check_in TIMESTAMPTZ,
  check_in_data JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT ITEMS (tier-gated portal content)
-- ============================================
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'guide', 'module', 'checklist')),
  pillar TEXT CHECK (pillar IN ('P1', 'P2', 'P3', 'P4', 'P5')),
  tier_access TEXT[] DEFAULT ARRAY['awareness'],
  track TEXT,
  phase TEXT CHECK (phase IN ('gut', 'metabolism', 'hormones')),
  storage_url TEXT,
  description TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT DRAFTS (admin AI pipeline staging)
-- ============================================
CREATE TABLE IF NOT EXISTS content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_seed TEXT NOT NULL,
  pillar TEXT CHECK (pillar IN ('P1', 'P2', 'P3', 'P4', 'P5')),
  post_type TEXT CHECK (post_type IN ('authority', 'engagement', 'sales')),
  hook_style TEXT CHECK (hook_style IN ('symptom', 'pattern', 'false_belief', 'confusion', 'observation')),
  generated_script TEXT,
  script_hook TEXT,
  script_bridge TEXT,
  script_authority_anchor TEXT,
  script_education TEXT,
  script_pattern_expansion TEXT,
  script_cta TEXT,
  generated_caption TEXT,
  hashtags TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  heygen_video_id TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================
-- ADMIN USERS (role mapping for Clerk users)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD user_id TO CONTENT STUDIO TABLES
-- (for multi-user Content Studio support)
-- ============================================
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE calendar_entries ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE content_weeks ADD COLUMN IF NOT EXISTS user_id TEXT;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subscribers_clerk ON subscribers(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_tier ON subscribers(tier);
CREATE INDEX IF NOT EXISTS idx_subscribers_payment ON subscribers(payment_status);
CREATE INDEX IF NOT EXISTS idx_intake_subscriber ON intake_responses(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_pattern_maps_subscriber ON pattern_maps(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_progress_subscriber ON subscriber_progress(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_content_items_tier ON content_items USING GIN(tier_access);
CREATE INDEX IF NOT EXISTS idx_content_items_phase ON content_items(phase);
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);
CREATE INDEX IF NOT EXISTS idx_admin_clerk ON admin_users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_content_pieces_user ON content_pieces(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id);

-- ============================================
-- UPDATED_AT TRIGGERS (for new tables)
-- ============================================
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pattern_maps_updated_at BEFORE UPDATE ON pattern_maps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON subscriber_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Portal schema created:';
  RAISE NOTICE '  - subscribers table ready';
  RAISE NOTICE '  - intake_responses table ready';
  RAISE NOTICE '  - pattern_maps table ready';
  RAISE NOTICE '  - subscriber_progress table ready';
  RAISE NOTICE '  - content_items table ready';
  RAISE NOTICE '  - content_drafts table ready';
  RAISE NOTICE '  - admin_users table ready';
  RAISE NOTICE '  - user_id added to content studio tables';
END $$;
