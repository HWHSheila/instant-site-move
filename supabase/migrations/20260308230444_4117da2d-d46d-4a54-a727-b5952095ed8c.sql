
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (true);

-- Insert a sample blog post
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image, published_at)
VALUES (
  'Why Gut Health Is the Foundation of Hormonal Balance',
  'gut-health-hormonal-balance',
  'Understanding the gut-hormone connection is key to addressing symptoms like fatigue, bloating, and metabolic resistance at their root.',
  E'## The Gut-Hormone Connection\n\nYour gut does far more than digest food. It plays a central role in how your body produces, metabolizes, and clears hormones. When gut function is compromised, it creates a ripple effect that can show up as fatigue, bloating, stubborn weight, mood shifts, and hormonal imbalance.\n\n## Why This Matters for Women\n\nWomen are especially affected by gut-hormone disruption because estrogen metabolism depends heavily on a healthy gut microbiome. A collection of gut bacteria known as the estrobolome is directly responsible for processing estrogen. When this system is out of balance, it can contribute to estrogen dominance, PMS, irregular cycles, and difficulty losing weight.\n\n## Signs Your Gut May Be Affecting Your Hormones\n\n- Persistent bloating that worsens around your cycle\n- Energy crashes in the afternoon\n- Difficulty losing weight despite eating well\n- Skin breakouts, especially along the jawline\n- Mood swings or increased anxiety before your period\n\n## What You Can Do\n\nAddressing gut health does not mean jumping into a restrictive elimination diet. It means understanding what is driving the imbalance and supporting your digestive system in the right order. This often involves stabilizing digestion first, then supporting the microbiome, and finally addressing hormone signaling.\n\n## A Root-Cause Approach\n\nRather than treating symptoms in isolation, a root-cause approach looks at how your gut, metabolism, and hormones are interconnected. When you address the foundation first, the downstream symptoms often begin to resolve on their own.\n\nIf you are experiencing persistent symptoms that have not responded to surface-level changes, it may be time to look deeper at what your gut is telling you.',
  NULL,
  now()
),
(
  'Understanding Metabolic Signaling and Why It Matters',
  'metabolic-signaling-explained',
  'Metabolic signaling controls how your body uses energy, stores fat, and regulates appetite. Here is what you need to know.',
  E'## What Is Metabolic Signaling?\n\nMetabolic signaling refers to the complex communication network your body uses to regulate energy production, fat storage, appetite, and blood sugar. When these signals are working properly, your body efficiently converts food into energy and maintains a stable weight.\n\n## When Signaling Breaks Down\n\nChronic stress, poor sleep, gut imbalance, and processed food can all disrupt metabolic signaling. When this happens, you may notice:\n\n- Increased cravings, especially for sugar and carbs\n- Weight gain around the midsection\n- Blood sugar crashes and energy dips\n- Feeling hungry even after eating a full meal\n- Difficulty fasting or going between meals without snacking\n\n## The Role of GLP-1\n\nGLP-1 (glucagon-like peptide-1) is one of the key metabolic signals your body produces. It helps regulate appetite, blood sugar, and how your body responds to food. Supporting natural GLP-1 production through nutrition and lifestyle can make a significant difference in metabolic function.\n\n## Supporting Your Metabolism Naturally\n\nRather than relying on calorie restriction or extreme dieting, supporting metabolic signaling involves:\n\n- Stabilizing blood sugar through balanced meals\n- Supporting gut health to improve nutrient absorption\n- Managing stress to reduce cortisol-driven fat storage\n- Prioritizing sleep for hormonal recovery\n\n## The Bigger Picture\n\nMetabolic health is not about willpower. It is about whether your body''s signaling systems are functioning properly. When you support these systems at the root level, weight management and energy become much more sustainable.',
  NULL,
  now()
),
(
  'The Connection Between Stress and Digestive Health',
  'stress-digestive-health-connection',
  'Chronic stress does not just affect your mood. It directly impacts your digestion, gut lining, and ability to absorb nutrients.',
  E'## How Stress Affects Your Gut\n\nWhen your body is in a stress response, it diverts resources away from digestion. This is a survival mechanism, but when stress becomes chronic, it creates ongoing digestive dysfunction. Your body simply cannot digest well when it is constantly in fight-or-flight mode.\n\n## Common Signs of Stress-Related Digestive Issues\n\n- Bloating after meals even when eating healthy foods\n- Acid reflux or heartburn\n- Alternating constipation and loose stools\n- Feeling nauseated or losing your appetite during stressful periods\n- Food sensitivities that seem to come and go\n\n## The Gut-Brain Axis\n\nYour gut and brain are in constant communication through what is known as the gut-brain axis. This bidirectional pathway means that stress affects your gut, and gut imbalance affects your mood, anxiety levels, and cognitive function. It is a cycle that can be difficult to break without addressing both sides.\n\n## Breaking the Cycle\n\nAddressing stress-related digestive issues requires a dual approach:\n\n1. **Supporting the nervous system** through breathwork, movement, and lifestyle adjustments that reduce the overall stress load\n2. **Supporting digestive function** through targeted nutrition, timing, and gentle gut support\n\n## Why This Matters for Long-Term Health\n\nIf stress-driven digestive dysfunction continues unchecked, it can lead to nutrient deficiencies, increased inflammation, and downstream hormonal imbalance. Addressing the stress-gut connection is often one of the most impactful steps in a root-cause wellness approach.\n\nUnderstanding this connection is the first step toward building a strategy that supports both your nervous system and your gut simultaneously.',
  NULL,
  now()
);
