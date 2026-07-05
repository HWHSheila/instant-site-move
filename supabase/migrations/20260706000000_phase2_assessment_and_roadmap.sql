-- Phase 2-6 Schema: Assessment, Roadmaps, Progress, Mini Assessments, Priority Support, MailerLite
-- Applied on top of existing portal_schema.sql tables (subscribers, intake_responses, pattern_maps, etc.)

-- ============================================
-- WELLNESS ASSESSMENTS (full 13-step intake)
-- Replaces the simplified intake_responses for new members
-- ============================================
CREATE TABLE IF NOT EXISTS public.wellness_assessments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id       uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  status              text        NOT NULL DEFAULT 'in_progress'
                                  CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_step        integer     NOT NULL DEFAULT 1,

  -- Step 1: Identifying Information & Chief Concerns
  first_name          text,
  age                 integer,
  location            text,
  primary_health_goal text,
  why_now             text,

  -- Step 2: Medical History (Q4 provides condition list — dev-proposed defaults used)
  past_diagnoses      jsonb       DEFAULT '[]'::jsonb,
  past_diagnoses_other text,
  surgeries_hospitalizations boolean,
  surgeries_detail    text,
  chronic_conditions  jsonb       DEFAULT '[]'::jsonb,
  chronic_conditions_other text,
  pregnancy_count     integer,
  delivery_count      integer,
  miscarriage_count   integer,
  head_injury_history boolean,

  -- Step 3: Medications & Supplements
  current_rx          text,
  current_otc         text,
  current_supplements text,
  past_rx             text,
  past_otc            text,
  past_supplements    text,
  childhood_antibiotics text      CHECK (childhood_antibiotics IN ('yes', 'no', 'unknown')),
  adult_antibiotics   text        CHECK (adult_antibiotics IN ('yes', 'no', 'unknown')),
  adult_antibiotics_detail text,
  ppi_history         text        CHECK (ppi_history IN ('yes', 'no', 'unknown')),
  hormonal_contraceptive_history boolean,
  hormonal_contraceptive_detail text,

  -- Step 4: Family Health History (Q4 provides condition list)
  family_conditions   jsonb       DEFAULT '[]'::jsonb,
  family_autoimmune   text        CHECK (family_autoimmune IN ('yes', 'no', 'unknown')),
  family_thyroid      text        CHECK (family_thyroid IN ('yes', 'no', 'unknown')),
  family_metabolic    text        CHECK (family_metabolic IN ('yes', 'no', 'unknown')),

  -- Step 5: Early Life & Birth History
  birth_type          text        CHECK (birth_type IN ('vaginal', 'c_section', 'unknown')),
  infant_feeding      text        CHECK (infant_feeding IN ('breastfed', 'formula', 'combination', 'unknown')),
  childhood_antibiotics_early text CHECK (childhood_antibiotics_early IN ('yes', 'no', 'unknown')),
  childhood_illness   boolean,
  childhood_illness_detail text,
  childhood_trauma    boolean,
  childhood_trauma_detail text,

  -- Step 6: Symptom Inventory (stored as JSONB arrays with frequency)
  symptoms_gut        jsonb       DEFAULT '[]'::jsonb,
  symptoms_metabolic  jsonb       DEFAULT '[]'::jsonb,
  symptoms_hormonal   jsonb       DEFAULT '[]'::jsonb,
  symptoms_neuro      jsonb       DEFAULT '[]'::jsonb,
  symptoms_skin       jsonb       DEFAULT '[]'::jsonb,
  symptoms_cardio     jsonb       DEFAULT '[]'::jsonb,
  symptoms_sexual     jsonb       DEFAULT '[]'::jsonb,
  symptoms_systemic   jsonb       DEFAULT '[]'::jsonb,

  -- Step 7: Diet & Nutrition
  meals_per_day       text,
  meal_timing         text,
  water_intake        text,
  caffeine_intake     text,
  alcohol_intake      text,
  food_sensitivities  text,
  diets_tried         jsonb       DEFAULT '[]'::jsonb,
  food_relationship   text,
  eating_causes_symptoms text,

  -- Step 8: Sleep Patterns
  avg_bedtime         text,
  avg_wake_time       text,
  avg_sleep_hours     text,
  sleep_quality       text,
  trouble_falling_asleep text,
  trouble_staying_asleep text,
  wake_to_urinate     text,
  feel_rested         text,
  shift_work          boolean,

  -- Step 9: Stress & Mental/Emotional Health
  stress_level        integer,
  stress_sources      jsonb       DEFAULT '[]'::jsonb,
  anxiety_depression_history text,
  trauma_history      text,
  coping_mechanisms   jsonb       DEFAULT '[]'::jsonb,
  support_system      text,
  sense_of_purpose    text,

  -- Step 10: Movement & Exercise
  activity_level      text,
  exercise_type       text,
  exercise_frequency  text,
  sitting_hours       text,
  movement_barriers   jsonb       DEFAULT '[]'::jsonb,

  -- Step 11: Environmental Exposures
  mold_exposure       text        CHECK (mold_exposure IN ('yes', 'no', 'unknown')),
  chemical_exposure   boolean,
  water_source        text,
  personal_care       text,
  travel_exposure     boolean,

  -- Step 12: Lab & Test Results (all optional open text)
  lab_tsh             text,
  lab_free_t3         text,
  lab_free_t4         text,
  lab_tpo_antibodies  text,
  lab_thyroid_diagnosis text,
  lab_fasting_glucose text,
  lab_fasting_insulin text,
  lab_hba1c           text,
  lab_triglycerides   text,
  lab_hdl             text,
  lab_alt_ast         text,
  lab_estrogen        text,
  lab_progesterone    text,
  lab_cortisol        text,
  lab_dheas           text,
  lab_testosterone    text,
  lab_crp             text,
  lab_esr             text,
  lab_homocysteine    text,
  lab_gi_map          text,
  lab_sibo            text        CHECK (lab_sibo IN ('positive', 'negative', 'not_tested')),
  lab_food_sensitivity text,
  lab_ferritin        text,
  lab_vitamin_d       text,
  lab_b12             text,
  lab_magnesium       text,
  lab_other           text,

  -- Step 13: Day 1 Baseline Ratings (1-10 scale, stored as JSONB)
  -- Uses all 26 items from spec; Q5 may reduce to 23 — either way it's a simple array edit
  baseline_ratings    jsonb       DEFAULT '{}'::jsonb,
  baseline_open_text  jsonb       DEFAULT '{}'::jsonb,

  -- Metadata
  started_at          timestamptz DEFAULT now(),
  completed_at        timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellness_assessments_subscriber
  ON public.wellness_assessments(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_wellness_assessments_status
  ON public.wellness_assessments(status);

-- ============================================
-- ASSESSMENT CONSENTS (legal logging)
-- ============================================
CREATE TABLE IF NOT EXISTS public.assessment_consents (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  assessment_id   uuid        NOT NULL REFERENCES public.wellness_assessments(id) ON DELETE CASCADE,
  consent_text    text        NOT NULL,
  consented_at    timestamptz NOT NULL DEFAULT now(),
  ip_address      text
);

CREATE INDEX IF NOT EXISTS idx_assessment_consents_subscriber
  ON public.assessment_consents(subscriber_id);

-- ============================================
-- MEMBER ROADMAPS (personalized pathway)
-- Phase order is fixed (gut → metabolic → hormonal, NS parallel)
-- Sub-category selection is pluggable via Q6 answer
-- ============================================
CREATE TABLE IF NOT EXISTS public.member_roadmaps (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id       uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  assessment_id       uuid        REFERENCES public.wellness_assessments(id),

  -- Phase ordering (always: gut → metabolic → hormonal; NS Foundation parallel)
  phase_sequence      jsonb       NOT NULL DEFAULT '["Gut Function","Metabolic Repair","Hormonal Balancing"]'::jsonb,
  -- Sub-categories included per phase (Q6 determines logic; default = all in phase)
  included_subcategories jsonb    NOT NULL DEFAULT '{}'::jsonb,

  -- ATM slotting results
  primary_pattern     text,
  secondary_pattern   text,
  atm_reasoning       text,

  -- Tier recommendation (dev-proposed thresholds, Sheila approves)
  recommended_tier    text        CHECK (recommended_tier IN ('awareness','foundation','guided','restoration','integration')),
  tier_reasoning      text,

  -- Current progress
  current_phase       text,
  current_subcategory text,
  started_at          timestamptz DEFAULT now(),
  completed_at        timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_roadmaps_subscriber
  ON public.member_roadmaps(subscriber_id);

-- ============================================
-- MEMBER CONTENT PROGRESS (sequential locking)
-- Tracks completion of every lesson, action item, reflection
-- ============================================
CREATE TABLE IF NOT EXISTS public.member_content_progress (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id     uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  video_code        text        NOT NULL,
  content_type      text        NOT NULL DEFAULT 'lesson'
                                CHECK (content_type IN ('lesson','action_item','reflection')),
  status            text        NOT NULL DEFAULT 'locked'
                                CHECK (status IN ('locked','unlocked','in_progress','completed')),
  completed_at      timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE(subscriber_id, video_code, content_type)
);

CREATE INDEX IF NOT EXISTS idx_member_progress_subscriber
  ON public.member_content_progress(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_video
  ON public.member_content_progress(video_code);
CREATE INDEX IF NOT EXISTS idx_member_progress_status
  ON public.member_content_progress(status);

-- ============================================
-- MINI ASSESSMENTS (Day 1, 11, 21, ongoing)
-- Rating items match Step 13 baseline (26 items, Q5 may trim to 23)
-- ============================================
CREATE TABLE IF NOT EXISTS public.mini_assessments (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id     uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  assessment_type   text        NOT NULL
                                CHECK (assessment_type IN ('baseline','day_11','day_21','semi_monthly')),
  day_number        integer,
  ratings           jsonb       NOT NULL DEFAULT '{}'::jsonb,
  open_text_improved text,
  open_text_challenging text,
  open_text_note_to_sheila text,
  completed_at      timestamptz DEFAULT now(),
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mini_assessments_subscriber
  ON public.mini_assessments(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_mini_assessments_type
  ON public.mini_assessments(assessment_type);

-- ============================================
-- SYMPTOM LOGS (free-form tracking, $9+ tiers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  log_text        text        NOT NULL,
  logged_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_subscriber
  ON public.symptom_logs(subscriber_id);

-- ============================================
-- AI COACH USAGE (monthly question tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_coach_usage (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  question        text        NOT NULL,
  response        text,
  billing_month   text        NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_coach_usage_subscriber
  ON public.ai_coach_usage(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_ai_coach_usage_month
  ON public.ai_coach_usage(billing_month);

-- ============================================
-- PRIORITY SUPPORT MESSAGES (Restoration/Integration)
-- ============================================
CREATE TABLE IF NOT EXISTS public.priority_support_messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  direction       text        NOT NULL CHECK (direction IN ('member_to_sheila','sheila_to_member')),
  message_text    text        NOT NULL,
  billing_month   text        NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_priority_messages_subscriber
  ON public.priority_support_messages(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_priority_messages_month
  ON public.priority_support_messages(billing_month);

-- ============================================
-- MAILER LITE TRIGGER LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.mailer_lite_trigger_log (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id   uuid        NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
  trigger_name    text        NOT NULL,
  trigger_data    jsonb       DEFAULT '{}'::jsonb,
  fired_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ml_trigger_subscriber
  ON public.mailer_lite_trigger_log(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_ml_trigger_name
  ON public.mailer_lite_trigger_log(trigger_name);

-- ============================================
-- ALTER SUBSCRIBERS: add assessment_completed flag
-- (intake_completed stays for backward compat)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscribers'
    AND column_name = 'assessment_completed'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN assessment_completed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscribers'
    AND column_name = 'assessment_completed_at'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN assessment_completed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscribers'
    AND column_name = 'current_roadmap_phase'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN current_roadmap_phase text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscribers'
    AND column_name = 'days_active'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN days_active integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscribers'
    AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN last_login_at timestamptz;
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Wellness Assessments
ALTER TABLE public.wellness_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_wellness_assessments"
  ON public.wellness_assessments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_assessments"
  ON public.wellness_assessments FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Assessment Consents
ALTER TABLE public.assessment_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_consents"
  ON public.assessment_consents FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_consents"
  ON public.assessment_consents FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Member Roadmaps
ALTER TABLE public.member_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_roadmaps"
  ON public.member_roadmaps FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_roadmap"
  ON public.member_roadmaps FOR SELECT
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Member Content Progress
ALTER TABLE public.member_content_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_progress"
  ON public.member_content_progress FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_progress"
  ON public.member_content_progress FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Mini Assessments
ALTER TABLE public.mini_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_mini_assessments"
  ON public.mini_assessments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_mini_assessments"
  ON public.mini_assessments FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Symptom Logs
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_symptom_logs"
  ON public.symptom_logs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_symptom_logs"
  ON public.symptom_logs FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- AI Coach Usage
ALTER TABLE public.ai_coach_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_ai_coach"
  ON public.ai_coach_usage FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_ai_coach"
  ON public.ai_coach_usage FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Priority Support Messages
ALTER TABLE public.priority_support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_priority_messages"
  ON public.priority_support_messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_own_priority_messages"
  ON public.priority_support_messages FOR ALL
  USING (
    subscriber_id IN (
      SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- MailerLite Trigger Log
ALTER TABLE public.mailer_lite_trigger_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_ml_triggers"
  ON public.mailer_lite_trigger_log FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE TRIGGER update_wellness_assessments_updated_at
  BEFORE UPDATE ON public.wellness_assessments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER update_member_roadmaps_updated_at
  BEFORE UPDATE ON public.member_roadmaps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER update_member_content_progress_updated_at
  BEFORE UPDATE ON public.member_content_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
