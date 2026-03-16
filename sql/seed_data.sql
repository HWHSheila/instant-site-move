-- Seed Data from Blueprint Appendix A
-- Run this after content_studio_schema.sql

-- ============================================
-- PILLARS (5 Content Categories)
-- ============================================
INSERT INTO pillars (code, name, description, purpose, color) VALUES
('P1', 'Gut Function', 'Digestive health, microbiome balance, gut-brain axis', 'Help women understand how gut health impacts overall wellness', '#8B5CF6'),
('P2', 'Blood Sugar', 'Glucose regulation, insulin sensitivity, energy stability', 'Educate on blood sugar patterns and metabolic health', '#F59E0B'),
('P3', 'Inflammation', 'Immune response, chronic inflammation, recovery patterns', 'Connect inflammation to symptoms women experience', '#EF4444'),
('P4', 'Metabolic Instability', 'Metabolic adaptation, stress response, weight regulation', 'Explain how metabolism adapts to stress signals', '#10B981'),
('P5', 'Chronic Fatigue', 'Energy patterns, adrenal function, recovery', 'Address exhaustion and energy fluctuation patterns', '#3B82F6')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  purpose = EXCLUDED.purpose,
  color = EXCLUDED.color;

-- ============================================
-- PAIN POINTS (from Blueprint)
-- ============================================
INSERT INTO pain_points (title, description, category, pillar_id, gut_connection, metabolism_connection, hormone_connection, example_hooks) VALUES

-- Gut Function Pain Points
('Bloating after most meals', 'Persistent abdominal distension following eating', 'symptom', 
  (SELECT id FROM pillars WHERE code = 'P1'),
  'Gut bacteria imbalance can produce excess gas',
  'Slow digestion affects nutrient absorption and energy',
  'Gut inflammation can disrupt estrogen processing',
  ARRAY['Have you noticed your stomach expands after eating, no matter what you eat?', 'Do you feel like you look 6 months pregnant by the end of the day?']),

('Irregular digestion patterns', 'Alternating constipation and diarrhea', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P1'),
  'Gut motility affected by microbiome health',
  'Inconsistent nutrient absorption',
  'Stress hormones directly impact gut movement',
  ARRAY['Does your digestion seem unpredictable day to day?', 'One day constipated, next day the opposite?']),

-- Blood Sugar Pain Points
('Afternoon energy crashes', 'Severe fatigue in mid-afternoon', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P2'),
  'Blood sugar dips trigger gut stress response',
  'Unstable glucose affects cellular energy',
  'Cortisol spikes to compensate for low blood sugar',
  ARRAY['Do you hit a wall around 2-3pm every day?', 'Ever notice your energy tanks right after lunch?']),

('Cravings that feel uncontrollable', 'Intense urges for sugar or carbs', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P2'),
  'Blood sugar crashes trigger gut-brain signals',
  'Body seeking quick energy sources',
  'Insulin and leptin signaling disrupted',
  ARRAY['Do your cravings feel impossible to ignore?', 'Ever feel like you NEED sugar and nothing else will do?']),

('Hangry episodes', 'Irritability and mood changes when hungry', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P2'),
  'Low blood sugar affects gut-brain axis',
  'Brain running low on glucose fuel',
  'Cortisol and adrenaline surge to mobilize sugar',
  ARRAY['Do you turn into a different person when you''re hungry?', 'Does missing a meal make you irritable or anxious?']),

-- Inflammation Pain Points
('Feeling puffy or inflamed', 'Water retention and tissue swelling', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P3'),
  'Gut permeability can trigger systemic inflammation',
  'Inflammation affects how body handles fluid',
  'Inflammatory signals disrupt hormone balance',
  ARRAY['Do you wake up looking puffier than when you went to bed?', 'Do your rings feel tighter some days than others?']),

('Joint pain that moves around', 'Migratory aches and stiffness', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P3'),
  'Gut-derived inflammation can affect joints',
  'Metabolic waste accumulation in tissues',
  'Inflammatory hormones cause pain sensitivity',
  ARRAY['Does pain seem to move from one joint to another?', 'Wrists one day, knees the next?']),

-- Metabolic Instability Pain Points
('Weight fluctuates despite consistent eating', 'Unexplained weight changes', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P4'),
  'Gut health affects how calories are processed',
  'Metabolism adapts to perceived stress signals',
  'Cortisol causes water retention and fat storage',
  ARRAY['Does your weight swing 5+ pounds for no obvious reason?', 'Eating the same but scale keeps changing?']),

('Stubborn belly fat', 'Abdominal fat that won''t budge', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P4'),
  'Gut inflammation promotes visceral fat storage',
  'Stress metabolism prioritizes fat storage',
  'Cortisol directs fat specifically to midsection',
  ARRAY['Feel like no matter what you do, the belly stays?', 'Everything else shrinks but the midsection stays stubborn?']),

('Feeling cold all the time', 'Persistent coldness, especially extremities', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P4'),
  'Gut health affects thyroid function',
  'Metabolic slowdown reduces heat production',
  'Thyroid and metabolic hormones interconnected',
  ARRAY['Are you always the coldest person in the room?', 'Do you need socks even in summer?']),

-- Chronic Fatigue Pain Points
('Exhausted but can''t sleep', 'Tired but wired feeling', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P5'),
  'Gut produces neurotransmitters for sleep',
  'Cortisol rhythm inverted from chronic stress',
  'Melatonin and cortisol out of balance',
  ARRAY['Feel bone-tired but your mind won''t shut off?', 'Exhausted all day but wide awake at bedtime?']),

('Brain fog that won''t lift', 'Persistent mental cloudiness', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P5'),
  'Gut inflammation affects brain function',
  'Blood sugar instability starves brain',
  'Inflammatory hormones cross blood-brain barrier',
  ARRAY['Feel like you''re thinking through cotton?', 'Words on the tip of your tongue but can''t find them?']),

('Waking up unrefreshed', 'Feeling tired despite sleeping', 'symptom',
  (SELECT id FROM pillars WHERE code = 'P5'),
  'Gut health affects sleep quality hormones',
  'Body not recovering during sleep',
  'Cortisol spiking at wrong times',
  ARRAY['8 hours of sleep but still exhausted?', 'Feel like you didn''t sleep at all?']);

-- ============================================
-- FALSE BELIEFS (from Blueprint)
-- ============================================
INSERT INTO false_beliefs (title, correct_framing, category, pillar_id, example_hooks) VALUES

-- Diet Culture False Beliefs
('You need to eat less to lose weight', 
  'Under-eating can actually disrupt metabolic and hormone signaling, making weight loss harder.',
  'diet_culture',
  (SELECT id FROM pillars WHERE code = 'P4'),
  ARRAY['Have you been told you just need to eat less and move more?', 'What if eating too little is actually working against you?']),

('Carbs are the enemy', 
  'The body needs glucose for brain function and hormone production. The issue is often timing and quality, not carbs themselves.',
  'diet_culture',
  (SELECT id FROM pillars WHERE code = 'P2'),
  ARRAY['Been avoiding carbs but still not feeling better?', 'What if cutting carbs is actually stressing your body more?']),

('You should feel miserable on a diet', 
  'Feeling terrible usually means your body is sending stress signals. Sustainable change shouldn''t require suffering.',
  'diet_culture',
  (SELECT id FROM pillars WHERE code = 'P4'),
  ARRAY['Ever been told that misery means it''s working?', 'What if feeling awful is actually a sign something''s wrong?']),

-- Medical Myth False Beliefs
('Your labs are normal so you''re fine', 
  'Standard lab ranges are based on population averages, not optimal function. You can have ''normal'' labs and still feel terrible.',
  'medical_myth',
  (SELECT id FROM pillars WHERE code = 'P5'),
  ARRAY['Doctor says your labs are fine but you still feel awful?', 'Normal on paper but not feeling normal?']),

('Hormones only matter during menopause', 
  'Hormone patterns affect women at every age. Shifts can start in your 20s and 30s.',
  'medical_myth',
  (SELECT id FROM pillars WHERE code = 'P4'),
  ARRAY['Think you''re too young for hormone issues?', 'Told your hormones can''t be the problem at your age?']),

('Bloating is just part of being a woman', 
  'Chronic bloating is a signal from your body, not a normal part of female existence.',
  'medical_myth',
  (SELECT id FROM pillars WHERE code = 'P1'),
  ARRAY['Been told bloating is just something women deal with?', 'What if bloating is actually trying to tell you something?']),

-- Self-Blame False Beliefs  
('You broke your metabolism', 
  'Your metabolism adapted to stress signals and under-fueling. It''s not broken, it''s responding to the environment.',
  'self_blame',
  (SELECT id FROM pillars WHERE code = 'P4'),
  ARRAY['Feel like you ruined your metabolism?', 'Worried you''ve done permanent damage?']),

('You just need more discipline', 
  'Willpower is not the issue when your body is sending survival signals. You can''t discipline your way out of physiology.',
  'self_blame',
  (SELECT id FROM pillars WHERE code = 'P2'),
  ARRAY['Beat yourself up for lacking discipline?', 'What if discipline isn''t actually the problem?']),

('This is just how your body is', 
  'Bodies are adaptable. Your current state is a response to inputs, not a permanent condition.',
  'self_blame',
  (SELECT id FROM pillars WHERE code = 'P5'),
  ARRAY['Resigned to feeling this way forever?', 'What if this isn''t just ''how you are''?']);

-- ============================================
-- GALLUP STRENGTHS (Sheila's Top 14)
-- ============================================
INSERT INTO gallup_strengths (name, description, best_for) VALUES
('Analytical', 'Logical, cause-and-effect thinking', ARRAY['authority']),
('Learner', 'Curious, always seeking to understand', ARRAY['authority']),
('Strategic', 'Sees patterns and pathways', ARRAY['authority']),
('Restorative', 'Problem-solver, loves fixing things', ARRAY['authority', 'sales']),
('Intellection', 'Deep thinking, introspective', ARRAY['authority']),
('Relator', 'Builds genuine connections', ARRAY['engagement']),
('Responsibility', 'Committed, follows through', ARRAY['engagement']),
('Significance', 'Makes impact, helps others feel seen', ARRAY['engagement']),
('Competition', 'Drives to improve and excel', ARRAY['engagement', 'sales']),
('Command', 'Direct, confident presence', ARRAY['sales']),
('Focus', 'Prioritizes what matters', ARRAY['sales']),
('Futuristic', 'Envisions possibilities', ARRAY['sales']),
('Activator', 'Action-oriented, makes things happen', ARRAY['sales']),
('Achiever', 'Driven, productive, goal-focused', ARRAY['authority', 'sales'])
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  best_for = EXCLUDED.best_for;

-- ============================================
-- VERIFY SEED DATA
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted:';
  RAISE NOTICE '  - Pillars: %', (SELECT COUNT(*) FROM pillars);
  RAISE NOTICE '  - Pain Points: %', (SELECT COUNT(*) FROM pain_points);
  RAISE NOTICE '  - False Beliefs: %', (SELECT COUNT(*) FROM false_beliefs);
  RAISE NOTICE '  - Gallup Strengths: %', (SELECT COUNT(*) FROM gallup_strengths);
END $$;
