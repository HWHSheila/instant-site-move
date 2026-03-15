import { SEO } from "@/components/SEO";
import { Droplets, Wind, Zap, Cookie, Moon, Activity, Snail, BatteryLow } from "lucide-react";

const patterns = [
  { label: "Bloating", icon: Wind, description: "Understanding what drives abdominal distension and discomfort after eating." },
  { label: "Water Retention", icon: Droplets, description: "Exploring fluid balance patterns related to stress, sleep, and digestion." },
  { label: "Fatigue After Meals", icon: BatteryLow, description: "Why energy drops after eating and what it signals about metabolic rhythm." },
  { label: "Cravings", icon: Cookie, description: "What cravings reveal about blood sugar patterns, stress load, and nutrient gaps." },
  { label: "Poor Sleep", icon: Moon, description: "How sleep disruption connects to nervous system regulation and recovery." },
  { label: "Cycle Changes", icon: Activity, description: "Shifts in menstrual patterns and what they reflect about hormonal signaling." },
  { label: "Slow Digestion", icon: Snail, description: "Motility patterns, transit time, and what influences digestive pacing." },
  { label: "Energy Crashes", icon: Zap, description: "Mid-day energy dips and what they indicate about metabolic stability." },
];

export default function PortalPatterns() {
  return (
    <>
      <SEO title="Pattern Library" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Pattern Library</h1>
          <p className="text-muted-foreground mt-1">
            Common experiences explained through a root-cause lens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patterns.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-accent/15 text-accent-foreground">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
