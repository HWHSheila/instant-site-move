-- Row Level Security Policies
-- Run this AFTER portal_schema.sql and seed_data.sql
-- Requires Clerk JWT template to be configured so auth.jwt() contains the Clerk sub claim
--
-- Helper: extract Clerk user ID from JWT
-- Clerk JWT template maps to Supabase's auth.jwt()->'sub'

CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
$$ LANGUAGE sql STABLE;

-- ============================================
-- SUBSCRIBERS: users can only read/update their own row
-- ============================================
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscribers_select_own" ON subscribers
  FOR SELECT USING (clerk_user_id = requesting_user_id());

CREATE POLICY "subscribers_insert_own" ON subscribers
  FOR INSERT WITH CHECK (clerk_user_id = requesting_user_id());

CREATE POLICY "subscribers_update_own" ON subscribers
  FOR UPDATE USING (clerk_user_id = requesting_user_id());

-- Admin bypass for subscribers
CREATE POLICY "subscribers_admin_all" ON subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- INTAKE RESPONSES: subscriber-scoped
-- ============================================
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intake_select_own" ON intake_responses
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "intake_insert_own" ON intake_responses
  FOR INSERT WITH CHECK (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "intake_admin_all" ON intake_responses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- PATTERN MAPS: subscriber-scoped
-- ============================================
ALTER TABLE pattern_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patterns_select_own" ON pattern_maps
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "patterns_admin_all" ON pattern_maps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- SUBSCRIBER PROGRESS: subscriber-scoped
-- ============================================
ALTER TABLE subscriber_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_select_own" ON subscriber_progress
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "progress_admin_all" ON subscriber_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- CONTENT ITEMS: tier-gated read, admin write
-- ============================================
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_items_select_tiered" ON content_items
  FOR SELECT USING (
    approved = true
    AND (
      tier_access && ARRAY[(SELECT tier FROM subscribers WHERE clerk_user_id = requesting_user_id())]
      OR EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
    )
  );

CREATE POLICY "content_items_admin_all" ON content_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- CONTENT DRAFTS: admin only
-- ============================================
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_drafts_admin_all" ON content_drafts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

-- ============================================
-- ADMIN USERS: self-read, admin all
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_select_self" ON admin_users
  FOR SELECT USING (clerk_user_id = requesting_user_id());

-- ============================================
-- CONTENT STUDIO TABLES: user-scoped
-- ============================================
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_pieces_select_own" ON content_pieces
  FOR SELECT USING (
    user_id = requesting_user_id()
    OR user_id IS NULL
    OR EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "content_pieces_insert_own" ON content_pieces
  FOR INSERT WITH CHECK (
    user_id = requesting_user_id() OR user_id IS NULL
  );

CREATE POLICY "content_pieces_update_own" ON content_pieces
  FOR UPDATE USING (
    user_id = requesting_user_id() OR user_id IS NULL
  );

CREATE POLICY "content_pieces_delete_own" ON content_pieces
  FOR DELETE USING (
    user_id = requesting_user_id() OR user_id IS NULL
  );

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_select_own" ON campaigns
  FOR SELECT USING (
    user_id = requesting_user_id() OR user_id IS NULL
    OR EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "campaigns_insert_own" ON campaigns
  FOR INSERT WITH CHECK (user_id = requesting_user_id() OR user_id IS NULL);

CREATE POLICY "campaigns_update_own" ON campaigns
  FOR UPDATE USING (user_id = requesting_user_id() OR user_id IS NULL);

CREATE POLICY "campaigns_delete_own" ON campaigns
  FOR DELETE USING (user_id = requesting_user_id() OR user_id IS NULL);

ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_select_own" ON calendar_entries
  FOR SELECT USING (
    user_id = requesting_user_id() OR user_id IS NULL
    OR EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id())
  );

CREATE POLICY "calendar_insert_own" ON calendar_entries
  FOR INSERT WITH CHECK (user_id = requesting_user_id() OR user_id IS NULL);

CREATE POLICY "calendar_update_own" ON calendar_entries
  FOR UPDATE USING (user_id = requesting_user_id() OR user_id IS NULL);

-- ============================================
-- READ-ONLY REFERENCE TABLES
-- ============================================
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pillars_select_all" ON pillars FOR SELECT USING (true);

ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pain_points_select_all" ON pain_points FOR SELECT USING (true);

ALTER TABLE false_beliefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "false_beliefs_select_all" ON false_beliefs FOR SELECT USING (true);

ALTER TABLE gallup_strengths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallup_strengths_select_all" ON gallup_strengths FOR SELECT USING (true);

ALTER TABLE content_weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_weeks_select_all" ON content_weeks FOR SELECT USING (true);

-- ============================================
-- SERVICE ROLE BYPASS
-- ============================================
-- Edge Functions using SUPABASE_SERVICE_ROLE_KEY bypass RLS automatically.
-- No additional policies needed for Stripe webhook, identify-patterns, etc.

DO $$
BEGIN
  RAISE NOTICE 'RLS policies applied to all tables';
END $$;
