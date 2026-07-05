-- Portal Video Library: portal_videos + portal_video_scripts
-- Phase 1B: Two-prong content split — portal videos separate from social content_pieces

-- ── portal_videos ─────────────────────────────────────────────────────────────

CREATE TABLE public.portal_videos (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  video_code           text        UNIQUE NOT NULL,
  title                text        NOT NULL,
  phase                text        NOT NULL,
  sub_category         text        NOT NULL,
  sequence_order       int         NOT NULL DEFAULT 0,
  is_foundation_layer  boolean     NOT NULL DEFAULT false,
  production_status    text        NOT NULL DEFAULT 'not_started'
                                   CHECK (production_status IN (
                                     'not_started','scripted','recorded','uploaded','published'
                                   )),
  secondary_strength   text        CHECK (secondary_strength IN ('analytical','relator','futuristic')),
  video_url            text,
  supabase_storage_path text,
  published_at         timestamptz,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ── portal_video_scripts ──────────────────────────────────────────────────────

CREATE TABLE public.portal_video_scripts (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  video_code                text        NOT NULL REFERENCES public.portal_videos(video_code) ON DELETE CASCADE,
  learning_objective        text,
  introduction              text,
  core_educational_content  text,
  practical_application     text,
  gmh_cascade_connection    text,
  transition                text,
  action_items              jsonb       DEFAULT '[]'::jsonb,
  reflection_prompt         text,
  generated_at              timestamptz DEFAULT now(),
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now(),
  UNIQUE(video_code)
);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.portal_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_video_scripts ENABLE ROW LEVEL SECURITY;

-- Admin: full access (matched via admin_users table)
CREATE POLICY "admin_full_access_portal_videos" ON public.portal_videos
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "admin_full_access_portal_scripts" ON public.portal_video_scripts
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt() ->> 'sub')
  );

-- Members: read-only, published videos only
CREATE POLICY "member_read_published_videos" ON public.portal_videos
  FOR SELECT TO authenticated
  USING (production_status = 'published');

-- Members: read scripts for published videos only
CREATE POLICY "member_read_published_scripts" ON public.portal_video_scripts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_videos
      WHERE portal_videos.video_code = portal_video_scripts.video_code
        AND portal_videos.production_status = 'published'
    )
  );

-- ── Auto-update updated_at ────────────────────────────────────────────────────

CREATE TRIGGER portal_videos_updated_at
  BEFORE UPDATE ON public.portal_videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER portal_video_scripts_updated_at
  BEFORE UPDATE ON public.portal_video_scripts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Seed 148 videos ───────────────────────────────────────────────────────────

INSERT INTO public.portal_videos (video_code, title, phase, sub_category, sequence_order, is_foundation_layer) VALUES
-- Nervous System Foundation (15) — is_foundation_layer = true
('NS-01', 'What Is Nervous System Regulation and Why It Matters for Gut, Metabolism, and Hormones', 'Nervous System Foundation', 'Introduction', 1, true),
('NS-02', 'The HPA Axis Explained — How Stress Becomes a Physical Pattern', 'Nervous System Foundation', 'Introduction', 2, true),
('NS-03', 'Sympathetic vs Parasympathetic — Understanding Your Two Modes', 'Nervous System Foundation', 'Introduction', 3, true),
('NS-04', 'The Vagus Nerve and Its Role in Gut and Hormone Function', 'Nervous System Foundation', 'Introduction', 4, true),
('NS-05', 'How Chronic Stress Becomes Chronic Disease — The Cascade Explained', 'Nervous System Foundation', 'Introduction', 5, true),
('NS-06', 'Why Sleep Is a Nervous System Event Not Just Rest', 'Nervous System Foundation', 'Nervous System & Sleep', 6, true),
('NS-07', 'Cortisol Rhythm — Why Timing Matters More Than Total Cortisol', 'Nervous System Foundation', 'Nervous System & Sleep', 7, true),
('NS-08', 'What Wired and Tired Actually Means in the Body', 'Nervous System Foundation', 'Nervous System & Sleep', 8, true),
('NS-09', 'Sleep Hygiene as a Nervous System Tool — What Actually Works', 'Nervous System Foundation', 'Nervous System & Sleep', 9, true),
('NS-10', 'Screen Light, Melatonin, and Your Cortisol Curve', 'Nervous System Foundation', 'Nervous System & Sleep', 10, true),
('NS-11', 'Meal Timing as a Nervous System Signal', 'Nervous System Foundation', 'Nervous System & Practical Regulation', 11, true),
('NS-12', 'Movement as a Nervous System Regulator — What Type and How Much', 'Nervous System Foundation', 'Nervous System & Practical Regulation', 12, true),
('NS-13', 'Breathing and Vagal Tone — Practical Tools You Already Have', 'Nervous System Foundation', 'Nervous System & Practical Regulation', 13, true),
('NS-14', 'Creating a Decompression Routine That Actually Works for Your Life', 'Nervous System Foundation', 'Nervous System & Practical Regulation', 14, true),
('NS-15', 'Building Your Nervous System Baseline — The Non-Negotiables', 'Nervous System Foundation', 'Nervous System & Practical Regulation', 15, true),

-- Phase 1: Gut Function (49)
-- 1.1 Introduction to Gut Health
('GF-01', 'Introduction to Gut Function — Why the Gut Drives Everything', 'Gut Function', 'Introduction to Gut Health', 1, false),
('GF-02', 'The Gut-Brain Axis — How Your Gut and Nervous System Communicate', 'Gut Function', 'Introduction to Gut Health', 2, false),
('GF-03', 'What Happens When You Eat — The Full Digestive Sequence', 'Gut Function', 'Introduction to Gut Health', 3, false),
('GF-04', 'Why Digestion Starts in Your Mouth Not Your Stomach', 'Gut Function', 'Introduction to Gut Health', 4, false),
('GF-05', 'How Stress Shuts Down Digestion in Real Time', 'Gut Function', 'Introduction to Gut Health', 5, false),

-- 1.2 Gut Lining Permeability
('GL-01', 'What Is the Gut Lining and Why One Cell Thickness Matters', 'Gut Function', 'Gut Lining Permeability', 6, false),
('GL-02', 'What Causes Gut Lining Permeability — The Root Drivers', 'Gut Function', 'Gut Lining Permeability', 7, false),
('GL-03', 'How Leaky Gut Drives Systemic Inflammation', 'Gut Function', 'Gut Lining Permeability', 8, false),
('GL-04', 'Leaky Gut and Autoimmune Conditions — The Connection', 'Gut Function', 'Gut Lining Permeability', 9, false),
('GL-05', 'How Gut Permeability Drives New Food Sensitivities', 'Gut Function', 'Gut Lining Permeability', 10, false),
('GL-06', 'How Gut Lining Cells Regenerate Every 3-5 Days — The Good News', 'Gut Function', 'Gut Lining Permeability', 11, false),
('GL-07', 'Bone Broth and Collagen — Why These Are Gut Lining Building Blocks', 'Gut Function', 'Gut Lining Permeability', 12, false),
('GL-08', 'Foods That Damage the Gut Lining vs Foods That Support Repair', 'Gut Function', 'Gut Lining Permeability', 13, false),
('GL-09', 'How to Introduce Gut Lining Support Without Overwhelming Your System', 'Gut Function', 'Gut Lining Permeability', 14, false),
('GL-10', 'Action Steps for Gut Lining Repair — Your Guided Protocol', 'Gut Function', 'Gut Lining Permeability', 15, false),

-- 1.3 Gut Microbiome and Dysbiosis
('MB-01', 'What Is the Gut Microbiome and Why Diversity Matters', 'Gut Function', 'Gut Microbiome and Dysbiosis', 16, false),
('MB-02', 'What Is Dysbiosis and How Does It Develop', 'Gut Function', 'Gut Microbiome and Dysbiosis', 17, false),
('MB-03', 'The Estrobolome — How Your Gut Microbiome Controls Estrogen', 'Gut Function', 'Gut Microbiome and Dysbiosis', 18, false),
('MB-04', 'How Dysbiosis Drives Insulin Resistance', 'Gut Function', 'Gut Microbiome and Dysbiosis', 19, false),
('MB-05', 'How Dysbiosis Disrupts Natural GLP-1 Production', 'Gut Function', 'Gut Microbiome and Dysbiosis', 20, false),
('MB-06', 'Antibiotics and the Microbiome — What the Research Shows', 'Gut Function', 'Gut Microbiome and Dysbiosis', 21, false),
('MB-07', 'Prebiotics vs Probiotics — What to Use and When', 'Gut Function', 'Gut Microbiome and Dysbiosis', 22, false),
('MB-08', 'Why You Should Not Start Probiotics Before Healing the Gut Lining', 'Gut Function', 'Gut Microbiome and Dysbiosis', 23, false),
('MB-09', 'Fermented Foods as Microbiome Support — Starting Slow', 'Gut Function', 'Gut Microbiome and Dysbiosis', 24, false),
('MB-10', 'Building Microbiome Diversity Through Food — Practical Action Steps', 'Gut Function', 'Gut Microbiome and Dysbiosis', 25, false),

-- 1.4 Digestive Dysfunction
('DD-01', 'Low Stomach Acid — What It Is, What Causes It, and Why It Matters', 'Gut Function', 'Digestive Dysfunction', 26, false),
('DD-02', 'Slow Gut Motility — Why Food Moves Too Slowly and What That Does', 'Gut Function', 'Digestive Dysfunction', 27, false),
('DD-03', 'Bloating — The 5 Root Causes That Have Nothing to Do With Food', 'Gut Function', 'Digestive Dysfunction', 28, false),
('DD-04', 'Acid Reflux — Why the Real Cause Is Often Low Acid Not High Acid', 'Gut Function', 'Digestive Dysfunction', 29, false),
('DD-05', 'Bile and Enzyme Production — The Overlooked Piece of Digestion', 'Gut Function', 'Digestive Dysfunction', 30, false),
('DD-06', 'Eating Pace, Chewing, and Digestive Capacity', 'Gut Function', 'Digestive Dysfunction', 31, false),
('DD-07', 'Hydration and Gut Function — When and How You Drink Matters', 'Gut Function', 'Digestive Dysfunction', 32, false),
('DD-08', 'Food Sequencing and Its Impact on Digestion and Blood Sugar', 'Gut Function', 'Digestive Dysfunction', 33, false),
('DD-09', 'Meal Timing as a Digestive Rhythm Signal', 'Gut Function', 'Digestive Dysfunction', 34, false),
('DD-10', 'Building Your Digestion Rhythm Baseline', 'Gut Function', 'Digestive Dysfunction', 35, false),

-- 1.5 Bowel Health
('BH-01', 'What Healthy Bowel Function Actually Looks Like', 'Gut Function', 'Bowel Health', 36, false),
('BH-02', 'Constipation — Root Causes and Root Solutions', 'Gut Function', 'Bowel Health', 37, false),
('BH-03', 'Diarrhea and Loose Stools — What the Pattern Is Telling You', 'Gut Function', 'Bowel Health', 38, false),
('BH-04', 'Alternating Constipation and Diarrhea — The IBS-like Pattern', 'Gut Function', 'Bowel Health', 39, false),
('BH-05', 'Incomplete Bowel Movements — What This Pattern Reveals', 'Gut Function', 'Bowel Health', 40, false),
('BH-06', 'Bowel Health and Hormone Clearance — The Connection', 'Gut Function', 'Bowel Health', 41, false),
('BH-07', 'How Your Bowel Patterns Change With Your Cycle', 'Gut Function', 'Bowel Health', 42, false),
('BH-08', 'Action Steps for Bowel Regularity — Your Guided Protocol', 'Gut Function', 'Bowel Health', 43, false),

-- 1.6 SIBO
('SB-01', 'What Is SIBO and How Does It Develop', 'Gut Function', 'SIBO', 44, false),
('SB-02', 'SIBO Symptoms and Why They Mimic Other Conditions', 'Gut Function', 'SIBO', 45, false),
('SB-03', 'The Root Causes of SIBO — Motility, Stomach Acid, and More', 'Gut Function', 'SIBO', 46, false),
('SB-04', 'SIBO and Bloating — Why This Pattern Is Different', 'Gut Function', 'SIBO', 47, false),
('SB-05', 'Dietary Approaches That Support SIBO Management', 'Gut Function', 'SIBO', 48, false),
('SB-06', 'When to Consider Testing and What to Ask Your Provider', 'Gut Function', 'SIBO', 49, false),

-- Phase 2: Metabolic Repair (32)
-- 2.1 Introduction to Metabolic Health
('MR-01', 'Introduction to Metabolic Repair — Why the Gut Comes First', 'Metabolic Repair', 'Introduction to Metabolic Health', 1, false),
('MR-02', 'What Metabolism Actually Is — Beyond Calories', 'Metabolic Repair', 'Introduction to Metabolic Health', 2, false),
('MR-03', 'Mitochondrial Function — How Your Cells Produce Energy', 'Metabolic Repair', 'Introduction to Metabolic Health', 3, false),
('MR-04', 'How Gut Health Directly Impacts Metabolic Function', 'Metabolic Repair', 'Introduction to Metabolic Health', 4, false),

-- 2.2 Blood Sugar and Insulin Resistance
('BS-01', 'Blood Sugar Regulation — The Full Picture', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 5, false),
('BS-02', 'What Insulin Resistance Actually Is and How It Develops', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 6, false),
('BS-03', 'How Chronic Stress Drives Insulin Resistance Through Cortisol', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 7, false),
('BS-04', 'How Poor Sleep Worsens Insulin Sensitivity Overnight', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 8, false),
('BS-05', 'How Gut Inflammation Drives Insulin Resistance', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 9, false),
('BS-06', 'How Muscle Loss Reduces Glucose Uptake', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 10, false),
('BS-07', 'How Sedentary Behavior Worsens Insulin Resistance', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 11, false),
('BS-08', 'Food Sequencing and Insulin Response — The Order of Operations', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 12, false),
('BS-09', 'Fatty Liver and Insulin Resistance — The Vicious Cycle', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 13, false),
('BS-10', 'Practical Action Steps for Blood Sugar Stability', 'Metabolic Repair', 'Blood Sugar and Insulin Resistance', 14, false),

-- 2.3 GLP-1 and Natural Metabolic Hormones
('GL1-01', 'What Is GLP-1 and Why Your Body Already Makes It', 'Metabolic Repair', 'GLP-1 and Natural Metabolic Hormones', 15, false),
('GL1-02', 'How Gut Health Supports Natural GLP-1 Production', 'Metabolic Repair', 'GLP-1 and Natural Metabolic Hormones', 16, false),
('GL1-03', 'What Feeds GLP-1 Production — Protein, Fiber, and Stability', 'Metabolic Repair', 'GLP-1 and Natural Metabolic Hormones', 17, false),
('GL1-04', 'GLP-1 Medication vs Natural Production — Understanding Both', 'Metabolic Repair', 'GLP-1 and Natural Metabolic Hormones', 18, false),

-- 2.4 Metabolic Rate and Body Composition
('MC-01', 'Why Your Metabolic Rate Changed and What That Means', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 19, false),
('MC-02', 'Muscle Mass as a Metabolic Strategy — Not Just Fitness', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 20, false),
('MC-03', 'How Visceral Fat Functions as an Inflammatory Organ', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 21, false),
('MC-04', 'Why Belly Fat Is the Last to Go and What Has to Change First', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 22, false),
('MC-05', 'Movement Frequency vs Movement Intensity for Metabolic Health', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 23, false),
('MC-06', 'Nutrient Absorption and Metabolic Function — The Gut Connection', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 24, false),
('MC-07', 'Building Your Metabolic Stability Baseline', 'Metabolic Repair', 'Metabolic Rate and Body Composition', 25, false),

-- 2.5 PMOS
('PM-01', 'What Is PMOS — The Full Picture Most Women Are Never Shown', 'Metabolic Repair', 'PMOS', 26, false),
('PM-02', 'Why PMOS Starts in the Gut Not the Ovaries', 'Metabolic Repair', 'PMOS', 27, false),
('PM-03', 'Insulin Resistance as the Root Driver of PMOS', 'Metabolic Repair', 'PMOS', 28, false),
('PM-04', 'Androgen Excess in PMOS — What Is Driving It', 'Metabolic Repair', 'PMOS', 29, false),
('PM-05', 'Why Belly Fat Is So Resistant in PMOS and What Changes That', 'Metabolic Repair', 'PMOS', 30, false),
('PM-06', 'The Gut-Estrobolome-Androgen Connection in PMOS', 'Metabolic Repair', 'PMOS', 31, false),
('PM-07', 'Action Steps for PMOS — Building the Right Foundation', 'Metabolic Repair', 'PMOS', 32, false),

-- Phase 3: Hormonal Balancing (43)
-- 3.1 Introduction to Hormonal Balancing
('HB-01', 'Introduction to Hormonal Balancing — Why Hormones Come Last', 'Hormonal Balancing', 'Introduction to Hormonal Balancing', 1, false),
('HB-02', 'How the Gut Sets the Stage for Hormonal Function', 'Hormonal Balancing', 'Introduction to Hormonal Balancing', 2, false),
('HB-03', 'The Hormone Hierarchy — Which Hormones Drive Which', 'Hormonal Balancing', 'Introduction to Hormonal Balancing', 3, false),
('HB-04', 'How Inflammation Disrupts Hormone Production', 'Hormonal Balancing', 'Introduction to Hormonal Balancing', 4, false),

-- 3.2 Estrogen and Progesterone Balance
('EP-01', 'What Estrogen Dominance Actually Is and What Drives It', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 5, false),
('EP-02', 'How the Estrobolome Controls Estrogen Clearance', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 6, false),
('EP-03', 'Progesterone — Why It Declines and What That Does to Estrogen', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 7, false),
('EP-04', 'Estrogen and Inflammation — The Bidirectional Loop', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 8, false),
('EP-05', 'Cycle Irregularity as a Root Cause Signal', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 9, false),
('EP-06', 'PMS and Pre-Menstrual Symptoms as Pattern Data', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 10, false),
('EP-07', 'Swelling and Water Retention Before Your Period — The Hormone Signal', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 11, false),
('EP-08', 'Supporting Estrogen Clearance Through Gut and Liver Health', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 12, false),
('EP-09', 'Action Steps for Estrogen and Progesterone Balance', 'Hormonal Balancing', 'Estrogen and Progesterone Balance', 13, false),

-- 3.3 Thyroid Function
('TH-01', 'How the Thyroid Works — T4 to T3 Conversion Explained', 'Hormonal Balancing', 'Thyroid Function', 14, false),
('TH-02', 'Why Normal Thyroid Labs Do Not Mean Optimal Thyroid Function', 'Hormonal Balancing', 'Thyroid Function', 15, false),
('TH-03', 'The Gut and Thyroid Connection — 20 Percent of T3 Conversion', 'Hormonal Balancing', 'Thyroid Function', 16, false),
('TH-04', 'Hashimoto''s Thyroiditis and Gut Permeability', 'Hormonal Balancing', 'Thyroid Function', 17, false),
('TH-05', 'Cold Intolerance as a Thyroid Signal', 'Hormonal Balancing', 'Thyroid Function', 18, false),
('TH-06', 'Hair Thinning and Thyroid Function', 'Hormonal Balancing', 'Thyroid Function', 19, false),
('TH-07', 'Stubborn Weight and Thyroid Pattern — Not a Willpower Problem', 'Hormonal Balancing', 'Thyroid Function', 20, false),
('TH-08', 'Fatigue That Sleep Cannot Fix — The Thyroid and Mitochondria Connection', 'Hormonal Balancing', 'Thyroid Function', 21, false),
('TH-09', 'Difficulty Swallowing as a Thyroid Signal', 'Hormonal Balancing', 'Thyroid Function', 22, false),
('TH-10', 'Thyroid Medication and Gut Absorption', 'Hormonal Balancing', 'Thyroid Function', 23, false),
('TH-11', 'Supporting Thyroid Function Through Gut Health and Nutrition', 'Hormonal Balancing', 'Thyroid Function', 24, false),

-- 3.4 Cortisol and Adrenal Function
('CA-01', 'The Cortisol Curve — What Optimal Looks Like vs Dysregulated', 'Hormonal Balancing', 'Cortisol and Adrenal Function', 25, false),
('CA-02', 'How Chronic Cortisol Elevation Suppresses Sex Hormone Production', 'Hormonal Balancing', 'Cortisol and Adrenal Function', 26, false),
('CA-03', 'Adrenal Fatigue vs HPA Axis Dysregulation — What the Research Shows', 'Hormonal Balancing', 'Cortisol and Adrenal Function', 27, false),
('CA-04', 'Cortisol and Blood Sugar — The Direct Link', 'Hormonal Balancing', 'Cortisol and Adrenal Function', 28, false),
('CA-05', 'How to Support Cortisol Rhythm Through Daily Habits', 'Hormonal Balancing', 'Cortisol and Adrenal Function', 29, false),

-- 3.5 Perimenopause
('PE-01', 'What Is Perimenopause and When Does It Actually Start', 'Hormonal Balancing', 'Perimenopause', 30, false),
('PE-02', 'How Estrogen Fluctuates During Perimenopause', 'Hormonal Balancing', 'Perimenopause', 31, false),
('PE-03', 'Cycle Changes During Perimenopause — What Is Normal', 'Hormonal Balancing', 'Perimenopause', 32, false),
('PE-04', 'Sleep Disruption in Perimenopause — The Hormone Connection', 'Hormonal Balancing', 'Perimenopause', 33, false),
('PE-05', 'Belly Fat and Metabolic Shifts in Perimenopause', 'Hormonal Balancing', 'Perimenopause', 34, false),
('PE-06', 'Anxiety and Mood Changes in Perimenopause', 'Hormonal Balancing', 'Perimenopause', 35, false),
('PE-07', 'Supporting the Body Through Perimenopause — The Root Cause Approach', 'Hormonal Balancing', 'Perimenopause', 36, false),

-- 3.6 Menopause
('MN-01', 'What Changes in the Body at Menopause', 'Hormonal Balancing', 'Menopause', 37, false),
('MN-02', 'Hot Flashes and Night Sweats — What Is Driving Them', 'Hormonal Balancing', 'Menopause', 38, false),
('MN-03', 'Metabolic Changes in Menopause and Why They Happen', 'Hormonal Balancing', 'Menopause', 39, false),
('MN-04', 'Gut Health Changes in Menopause — Estrogen Was Protecting the Gut', 'Hormonal Balancing', 'Menopause', 40, false),
('MN-05', 'Bone Density and Muscle Mass in Menopause', 'Hormonal Balancing', 'Menopause', 41, false),
('MN-06', 'Feeling Like a Different Person — Emotional and Cognitive Changes', 'Hormonal Balancing', 'Menopause', 42, false),
('MN-07', 'The Root Cause Approach to Thriving in Menopause', 'Hormonal Balancing', 'Menopause', 43, false),

-- Phase 4: Maintenance (9)
('MT-01', 'What Maintenance Actually Means — It Is Not Starting Over', 'Maintenance', 'Building Your Lifetime Baseline', 1, false),
('MT-02', 'Your Personal Baseline — The Non-Negotiables That Keep Everything Stable', 'Maintenance', 'Building Your Lifetime Baseline', 2, false),
('MT-03', 'How to Read Your Body''s Signals After the Program', 'Maintenance', 'Building Your Lifetime Baseline', 3, false),
('MT-04', 'What to Do When Life Disrupts Your Baseline', 'Maintenance', 'Building Your Lifetime Baseline', 4, false),
('MT-05', 'Seasonal Adjustments to Your Wellness Practices', 'Maintenance', 'Building Your Lifetime Baseline', 5, false),
('MT-06', 'Long-Term Gut Health Maintenance', 'Maintenance', 'Building Your Lifetime Baseline', 6, false),
('MT-07', 'Long-Term Metabolic Maintenance', 'Maintenance', 'Building Your Lifetime Baseline', 7, false),
('MT-08', 'Long-Term Hormonal Maintenance', 'Maintenance', 'Building Your Lifetime Baseline', 8, false),
('MT-09', 'When to Re-Assess and How to Know If You Need to Go Deeper', 'Maintenance', 'Building Your Lifetime Baseline', 9, false);
