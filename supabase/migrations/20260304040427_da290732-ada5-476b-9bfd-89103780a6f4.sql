
CREATE TABLE public.strategy_intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  call_date_time TEXT NOT NULL,
  digestive_symptoms TEXT[] DEFAULT '{}',
  digestive_other TEXT,
  timing_pattern TEXT[] DEFAULT '{}',
  food_triggers TEXT[] DEFAULT '{}',
  bowel_frequency TEXT,
  stool_consistency TEXT,
  energy_patterns TEXT[] DEFAULT '{}',
  has_cravings TEXT,
  craving_types TEXT[] DEFAULT '{}',
  craving_timing TEXT[] DEFAULT '{}',
  weight_fluid_patterns TEXT[] DEFAULT '{}',
  cycle_patterns TEXT[] DEFAULT '{}',
  hormonal_symptoms TEXT[] DEFAULT '{}',
  nervous_system TEXT[] DEFAULT '{}',
  has_recent_labs TEXT,
  lab_details TEXT,
  diagnoses TEXT,
  medications_supplements TEXT,
  tried_approaches TEXT,
  what_helped TEXT,
  what_worsened TEXT,
  desired_outcomes TEXT,
  desired_clarity TEXT,
  open_to_coaching TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.strategy_intake_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for form submissions)
CREATE POLICY "Allow public inserts" ON public.strategy_intake_submissions
  FOR INSERT WITH CHECK (true);

-- No select/update/delete for public users
