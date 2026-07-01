CREATE TABLE public.baseline_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  energy integer NOT NULL,
  digestion integer NOT NULL,
  sleep integer NOT NULL,
  mood integer NOT NULL,
  bloating integer NOT NULL,
  cravings integer NOT NULL,
  bowel_regularity integer NOT NULL,
  brain_fog integer NOT NULL,
  joint_pain integer NOT NULL,
  muscle_body_aches integer NOT NULL,
  stress_level integer NOT NULL,
  top_3_symptoms text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.baseline_submissions TO anon;
GRANT INSERT ON public.baseline_submissions TO authenticated;
GRANT ALL ON public.baseline_submissions TO service_role;

ALTER TABLE public.baseline_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.baseline_submissions
  FOR INSERT TO public WITH CHECK (true);