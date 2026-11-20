DROP POLICY IF EXISTS "Allow public inserts" ON public.strategy_intake_submissions;
CREATE POLICY "Public can submit valid intake forms" ON public.strategy_intake_submissions
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) BETWEEN 1 AND 200
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(call_date_time) BETWEEN 1 AND 200
);

DROP POLICY IF EXISTS "Allow public inserts" ON public.baseline_submissions;
CREATE POLICY "Public can submit valid baseline forms" ON public.baseline_submissions
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(first_name)) BETWEEN 1 AND 100
  AND length(trim(last_name)) BETWEEN 1 AND 100
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND energy BETWEEN 1 AND 10 AND digestion BETWEEN 1 AND 10 AND sleep BETWEEN 1 AND 10
  AND mood BETWEEN 1 AND 10 AND bloating BETWEEN 1 AND 10 AND cravings BETWEEN 1 AND 10
  AND bowel_regularity BETWEEN 1 AND 10 AND brain_fog BETWEEN 1 AND 10
  AND joint_pain BETWEEN 1 AND 10 AND muscle_body_aches BETWEEN 1 AND 10
  AND stress_level BETWEEN 1 AND 10
  AND (top_3_symptoms IS NULL OR length(top_3_symptoms) <= 2000)
);