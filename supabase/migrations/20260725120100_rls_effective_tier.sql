-- RLS baseline, plus the trial rule in the database.
--
-- sql/rls_policies.sql was also applied by hand. This restates it idempotently
-- and corrects one thing that would otherwise break the moment the assessment
-- stops writing subscribers.tier: content access was gated on that column, so a
-- member on trial, whose tier is now null, would see nothing at all.
--
-- Access is therefore derived here from payment status and trial day, matching
-- src/lib/effective-tier.ts exactly. The two must be changed together.

CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
$$ LANGUAGE sql STABLE;

-- Sheila's trial model, 25 July 2026: days 1 to 18 Foundation,
-- days 19 to 21 Restoration, then the tier they are billed for.
CREATE OR REPLACE FUNCTION effective_tier(p_clerk_user_id TEXT)
RETURNS TEXT AS $$
  SELECT CASE
    WHEN s.payment_status = 'trial' THEN
      CASE
        WHEN s.trial_start_date IS NOT NULL
          AND (CURRENT_DATE - s.trial_start_date::date) + 1 >= 19
        THEN 'restoration'
        ELSE 'foundation'
      END
    WHEN s.payment_status IN ('active', 'past_due') THEN s.tier
    ELSE NULL
  END
  FROM subscribers s
  WHERE s.clerk_user_id = p_clerk_user_id;
$$ LANGUAGE sql STABLE;

-- Tier access is cumulative: Foundation also sees Awareness content.
CREATE OR REPLACE FUNCTION tiers_visible_to(p_tier TEXT)
RETURNS TEXT[] AS $$
  SELECT CASE p_tier
    WHEN 'integration' THEN ARRAY['awareness','foundation','guided','restoration','integration']
    WHEN 'restoration'  THEN ARRAY['awareness','foundation','guided','restoration']
    WHEN 'guided'       THEN ARRAY['awareness','foundation','guided']
    WHEN 'foundation'   THEN ARRAY['awareness','foundation']
    WHEN 'awareness'    THEN ARRAY['awareness']
    ELSE ARRAY[]::TEXT[]
  END;
$$ LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE clerk_user_id = requesting_user_id());
$$ LANGUAGE sql STABLE;

-- ============================================
-- SUBSCRIBERS
-- ============================================
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscribers_select_own" ON subscribers;
CREATE POLICY "subscribers_select_own" ON subscribers
  FOR SELECT USING (clerk_user_id = requesting_user_id());

DROP POLICY IF EXISTS "subscribers_insert_own" ON subscribers;
CREATE POLICY "subscribers_insert_own" ON subscribers
  FOR INSERT WITH CHECK (clerk_user_id = requesting_user_id());

DROP POLICY IF EXISTS "subscribers_update_own" ON subscribers;
CREATE POLICY "subscribers_update_own" ON subscribers
  FOR UPDATE USING (clerk_user_id = requesting_user_id());

DROP POLICY IF EXISTS "subscribers_admin_all" ON subscribers;
CREATE POLICY "subscribers_admin_all" ON subscribers
  FOR ALL USING (is_admin_user());

-- ============================================
-- INTAKE RESPONSES
-- ============================================
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intake_select_own" ON intake_responses;
CREATE POLICY "intake_select_own" ON intake_responses
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

DROP POLICY IF EXISTS "intake_insert_own" ON intake_responses;
CREATE POLICY "intake_insert_own" ON intake_responses
  FOR INSERT WITH CHECK (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

DROP POLICY IF EXISTS "intake_admin_all" ON intake_responses;
CREATE POLICY "intake_admin_all" ON intake_responses FOR ALL USING (is_admin_user());

-- ============================================
-- PATTERN MAPS
-- ============================================
ALTER TABLE pattern_maps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patterns_select_own" ON pattern_maps;
CREATE POLICY "patterns_select_own" ON pattern_maps
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

DROP POLICY IF EXISTS "patterns_admin_all" ON pattern_maps;
CREATE POLICY "patterns_admin_all" ON pattern_maps FOR ALL USING (is_admin_user());

-- ============================================
-- SUBSCRIBER PROGRESS
-- ============================================
ALTER TABLE subscriber_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progress_select_own" ON subscriber_progress;
CREATE POLICY "progress_select_own" ON subscriber_progress
  FOR SELECT USING (
    subscriber_id IN (SELECT id FROM subscribers WHERE clerk_user_id = requesting_user_id())
  );

DROP POLICY IF EXISTS "progress_admin_all" ON subscriber_progress;
CREATE POLICY "progress_admin_all" ON subscriber_progress FOR ALL USING (is_admin_user());

-- ============================================
-- CONTENT ITEMS
-- ============================================
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_items_select_tiered" ON content_items;
CREATE POLICY "content_items_select_tiered" ON content_items
  FOR SELECT USING (
    approved = true
    AND (
      tier_access && tiers_visible_to(effective_tier(requesting_user_id()))
      OR is_admin_user()
    )
  );

DROP POLICY IF EXISTS "content_items_admin_all" ON content_items;
CREATE POLICY "content_items_admin_all" ON content_items FOR ALL USING (is_admin_user());

-- ============================================
-- CONTENT DRAFTS
-- ============================================
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_drafts_admin_all" ON content_drafts;
CREATE POLICY "content_drafts_admin_all" ON content_drafts FOR ALL USING (is_admin_user());

-- ============================================
-- ADMIN USERS
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select_self" ON admin_users;
CREATE POLICY "admin_users_select_self" ON admin_users
  FOR SELECT USING (clerk_user_id = requesting_user_id());

-- ============================================
-- CONTENT STUDIO TABLES
-- ============================================
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_pieces_select_own" ON content_pieces;
CREATE POLICY "content_pieces_select_own" ON content_pieces
  FOR SELECT USING (
    user_id = requesting_user_id() OR user_id IS NULL OR is_admin_user()
  );

DROP POLICY IF EXISTS "content_pieces_insert_own" ON content_pieces;
CREATE POLICY "content_pieces_insert_own" ON content_pieces
  FOR INSERT WITH CHECK (user_id = requesting_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "content_pieces_update_own" ON content_pieces;
CREATE POLICY "content_pieces_update_own" ON content_pieces
  FOR UPDATE USING (user_id = requesting_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "content_pieces_delete_own" ON content_pieces;
CREATE POLICY "content_pieces_delete_own" ON content_pieces
  FOR DELETE USING (user_id = requesting_user_id() OR user_id IS NULL);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campaigns_select_own" ON campaigns;
CREATE POLICY "campaigns_select_own" ON campaigns
  FOR SELECT USING (user_id = requesting_user_id() OR user_id IS NULL OR is_admin_user());

DROP POLICY IF EXISTS "campaigns_insert_own" ON campaigns;
CREATE POLICY "campaigns_insert_own" ON campaigns
  FOR INSERT WITH CHECK (user_id = requesting_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "campaigns_update_own" ON campaigns;
CREATE POLICY "campaigns_update_own" ON campaigns
  FOR UPDATE USING (user_id = requesting_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "campaigns_delete_own" ON campaigns;
CREATE POLICY "campaigns_delete_own" ON campaigns
  FOR DELETE USING (user_id = requesting_user_id() OR user_id IS NULL);

ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calendar_select_own" ON calendar_entries;
CREATE POLICY "calendar_select_own" ON calendar_entries
  FOR SELECT USING (user_id = requesting_user_id() OR user_id IS NULL OR is_admin_user());

DROP POLICY IF EXISTS "calendar_insert_own" ON calendar_entries;
CREATE POLICY "calendar_insert_own" ON calendar_entries
  FOR INSERT WITH CHECK (user_id = requesting_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "calendar_update_own" ON calendar_entries;
CREATE POLICY "calendar_update_own" ON calendar_entries
  FOR UPDATE USING (user_id = requesting_user_id() OR user_id IS NULL);

-- ============================================
-- READ-ONLY REFERENCE TABLES
-- ============================================
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pillars_select_all" ON pillars;
CREATE POLICY "pillars_select_all" ON pillars FOR SELECT USING (true);

ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pain_points_select_all" ON pain_points;
CREATE POLICY "pain_points_select_all" ON pain_points FOR SELECT USING (true);

ALTER TABLE false_beliefs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "false_beliefs_select_all" ON false_beliefs;
CREATE POLICY "false_beliefs_select_all" ON false_beliefs FOR SELECT USING (true);

ALTER TABLE gallup_strengths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallup_strengths_select_all" ON gallup_strengths;
CREATE POLICY "gallup_strengths_select_all" ON gallup_strengths FOR SELECT USING (true);

ALTER TABLE content_weeks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "content_weeks_select_all" ON content_weeks;
CREATE POLICY "content_weeks_select_all" ON content_weeks FOR SELECT USING (true);
