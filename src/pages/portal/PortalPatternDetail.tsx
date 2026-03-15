import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ChevronLeft, Compass, Route } from "lucide-react";
import {
  Droplets, Wind, Zap, Cookie, Moon, Activity, Snail, BatteryLow,
  type LucideIcon,
} from "lucide-react";

interface PatternData {
  label: string;
  slug: string;
  icon: LucideIcon;
  feelsLike: string[];
  systems: string[];
  rootCause: string;
  nextSteps: string;
}

const patternData: PatternData[] = [
  {
    label: "Bloating",
    slug: "bloating",
    icon: Wind,
    feelsLike: [
      "Abdominal distension after meals, even with small portions",
      "Pressure or fullness that lingers for hours",
      "Clothes fitting tighter by end of day",
      "Discomfort that fluctuates throughout the day",
    ],
    systems: [
      "Digestive motility and transit pacing",
      "Microbial balance and fermentation patterns",
      "Stress-driven nervous system activation (sympathetic dominance)",
      "Enzyme and bile production capacity",
    ],
    rootCause:
      "Bloating often begins in the gut — with impaired motility, microbial imbalances, or incomplete breakdown of food. When the digestive system is under stress, metabolic rhythm slows, which can amplify fluid retention and hormonal signaling disruptions downstream.",
    nextSteps:
      "Start with the Digestion Rhythm pathway in Guided Pathways to begin stabilizing your digestive foundation, or revisit Start Here to understand how gut health anchors the entire system.",
  },
  {
    label: "Water Retention",
    slug: "water-retention",
    icon: Droplets,
    feelsLike: [
      "Puffiness in hands, face, or ankles — especially in the morning",
      "Weight fluctuations of several pounds day to day",
      "A feeling of heaviness unrelated to food intake",
      "Rings or shoes feeling tighter than usual",
    ],
    systems: [
      "Cortisol and aldosterone regulation",
      "Lymphatic drainage and circulation",
      "Sodium-potassium balance influenced by stress load",
      "Hormonal shifts during the menstrual cycle",
    ],
    rootCause:
      "Water retention is often a downstream signal of chronic stress activation. Elevated cortisol influences aldosterone, which governs fluid balance. When metabolic rhythm is unstable and the nervous system stays in overdrive, the body holds onto fluid as a protective response.",
    nextSteps:
      "Explore the Stress Load pathway in Guided Pathways to understand nervous system regulation, then revisit Start Here to see how stress connects to metabolic and hormonal responses.",
  },
  {
    label: "Fatigue After Meals",
    slug: "fatigue-after-meals",
    icon: BatteryLow,
    feelsLike: [
      "Sudden drowsiness or brain fog within 30–90 minutes of eating",
      "Needing caffeine or sugar to stay alert after lunch",
      "Difficulty concentrating or feeling 'weighed down'",
      "Energy that crashes harder after larger meals",
    ],
    systems: [
      "Blood sugar regulation and insulin response",
      "Digestive effort and enzyme capacity",
      "Autonomic nervous system shift during digestion",
      "Mitochondrial energy production efficiency",
    ],
    rootCause:
      "Post-meal fatigue reflects metabolic instability — often an exaggerated insulin response or poor blood sugar regulation. The gut's digestive workload, combined with nervous system state, determines how much energy is diverted away from the brain and muscles after eating.",
    nextSteps:
      "Follow the Metabolic Stability pathway in Guided Pathways to work on blood sugar patterns, and review Start Here to understand how metabolism connects to energy and hormones.",
  },
  {
    label: "Cravings",
    slug: "cravings",
    icon: Cookie,
    feelsLike: [
      "Intense urges for sugar, salt, or carbohydrates — especially mid-afternoon or evening",
      "Eating past fullness without feeling satisfied",
      "Cravings that spike after poor sleep or stressful days",
      "Feeling driven to eat even when not physically hungry",
    ],
    systems: [
      "Blood sugar dysregulation and glucose variability",
      "Cortisol-driven appetite signaling",
      "Neurotransmitter balance (dopamine, serotonin)",
      "Nutrient insufficiencies (magnesium, chromium, B vitamins)",
    ],
    rootCause:
      "Cravings are often the body's attempt to self-correct metabolic instability. When blood sugar swings, cortisol rises, or key nutrients are depleted, the brain signals urgency for quick-energy foods. This pattern is amplified when gut health and stress load are both compromised.",
    nextSteps:
      "Start with the Metabolic Stability pathway in Guided Pathways, and explore the Stress Load pathway to address cortisol-driven appetite patterns.",
  },
  {
    label: "Poor Sleep",
    slug: "poor-sleep",
    icon: Moon,
    feelsLike: [
      "Difficulty falling asleep despite feeling exhausted",
      "Waking between 2–4 AM and struggling to fall back asleep",
      "Restless or unrefreshing sleep",
      "Racing thoughts or physical tension at bedtime",
    ],
    systems: [
      "Cortisol rhythm and HPA axis regulation",
      "Melatonin production and circadian signaling",
      "Blood sugar stability overnight",
      "Nervous system state (sympathetic vs. parasympathetic tone)",
    ],
    rootCause:
      "Sleep disruption is often a nervous system and metabolic issue. When cortisol doesn't decline properly in the evening — due to chronic stress, blood sugar instability, or gut-driven inflammation — the body stays in a state of alertness that overrides natural sleep signals.",
    nextSteps:
      "Explore the Stress Load pathway in Guided Pathways to work on nervous system regulation, and revisit Start Here to understand the connection between stress, metabolism, and recovery.",
  },
  {
    label: "Cycle Changes",
    slug: "cycle-changes",
    icon: Activity,
    feelsLike: [
      "Irregular cycle length or missed periods",
      "Heavier or lighter flow than usual",
      "Worsening PMS symptoms (mood shifts, cramping, breast tenderness)",
      "New symptoms appearing in the luteal phase",
    ],
    systems: [
      "Estrogen and progesterone balance",
      "Thyroid and adrenal output",
      "Liver detoxification and estrogen clearance",
      "Gut microbiome and estrobolome activity",
    ],
    rootCause:
      "Menstrual pattern changes are often the final expression of upstream imbalances. The gut influences estrogen recycling through the estrobolome. Metabolic instability affects ovulation. Chronic stress suppresses progesterone. Hormones are the last system to shift — and the first place many notice symptoms.",
    nextSteps:
      "Begin with Guided Pathways to stabilize digestion and stress load first — hormonal patterns often improve as upstream systems are addressed. Review Start Here to see the full framework.",
  },
  {
    label: "Slow Digestion",
    slug: "slow-digestion",
    icon: Snail,
    feelsLike: [
      "Infrequent bowel movements (less than once daily)",
      "Feeling like food sits in the stomach for hours",
      "Heaviness or discomfort after eating",
      "Needing stimulants (coffee, supplements) to have a bowel movement",
    ],
    systems: [
      "Vagal tone and parasympathetic activation",
      "Bile production and gallbladder function",
      "Thyroid influence on gut motility",
      "Hydration and electrolyte balance",
    ],
    rootCause:
      "Slow digestion reflects reduced motility, often driven by nervous system dominance (sympathetic overdrive), insufficient bile flow, or thyroid-related slowing. When the body is in a stress state, it deprioritizes digestion — leading to longer transit times and incomplete elimination.",
    nextSteps:
      "Start with the Digestion Rhythm pathway in Guided Pathways to address motility foundations, and explore Start Here to understand how gut function drives everything downstream.",
  },
  {
    label: "Energy Crashes",
    slug: "energy-crashes",
    icon: Zap,
    feelsLike: [
      "Sudden mid-afternoon energy drops",
      "Needing caffeine or sugar to get through the day",
      "Feeling wired but tired — exhausted yet unable to rest",
      "Energy that is unpredictable from day to day",
    ],
    systems: [
      "Blood sugar regulation and glycemic variability",
      "Adrenal output and cortisol curve",
      "Mitochondrial function and cellular energy",
      "Sleep quality and overnight recovery",
    ],
    rootCause:
      "Energy crashes signal metabolic instability — the body cycling between blood sugar spikes and drops, often compounded by adrenal fatigue patterns. When the gut isn't absorbing nutrients efficiently and stress load remains high, the metabolic system can't maintain steady energy output.",
    nextSteps:
      "Follow the Metabolic Stability pathway in Guided Pathways, and address the Stress Load pathway to support adrenal recovery and steady energy.",
  },
];

export function getPatternBySlug(slug: string): PatternData | undefined {
  return patternData.find((p) => p.slug === slug);
}

export { patternData };

export default function PortalPatternDetail() {
  const { slug } = useParams<{ slug: string }>();
  const pattern = slug ? getPatternBySlug(slug) : undefined;

  if (!pattern) {
    return (
      <>
        <SEO title="Pattern Not Found" noindex />
        <div className="space-y-4">
          <h1 className="font-display text-2xl font-semibold text-foreground">Pattern not found</h1>
          <p className="text-muted-foreground">This pattern doesn't exist yet.</p>
          <Link to="/portal/patterns" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Pattern Library
          </Link>
        </div>
      </>
    );
  }

  const Icon = pattern.icon;

  return (
    <>
      <SEO title={`${pattern.label} — Pattern Library`} noindex />
      <div className="space-y-8">
        {/* Back link */}
        <Link
          to="/portal/patterns"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Pattern Library
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            {pattern.label}
          </h1>
        </div>

        {/* Feels Like */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-medium text-foreground">
            What this pattern commonly feels like
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {pattern.feelsLike.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Systems */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-medium text-foreground">
            What systems may be influencing it
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {pattern.systems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Root-Cause Framework */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-medium text-foreground">
            How it connects to the root-cause framework
          </h2>
          <div className="rounded-xl border border-border bg-primary/5 p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{pattern.rootCause}</p>
            <p className="mt-3 text-xs font-medium text-primary tracking-wide uppercase">
              Gut → Metabolism → Hormones
            </p>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-medium text-foreground">Where to go next</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{pattern.nextSteps}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/portal/start-here"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-colors"
            >
              <Compass className="w-4 h-4" /> Start Here
            </Link>
            <Link
              to="/portal/pathways"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-colors"
            >
              <Route className="w-4 h-4" /> Guided Pathways
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
