import { SEO } from "@/components/SEO";

const pillars = [
  {
    step: "1",
    title: "Gut",
    description:
      "Digestion is the foundation. How your body breaks down, absorbs, and eliminates nutrients shapes everything downstream...from energy to mood to hormone signaling.",
  },
  {
    step: "2",
    title: "Metabolism",
    description:
      "Your metabolic rhythm determines how efficiently your body converts food into fuel. When digestion is disrupted, metabolic stability often follows.",
  },
  {
    step: "3",
    title: "Hormones",
    description:
      "Hormonal patterns are often the last system to respond...and the first system women notice. Understanding what drives those patterns is where root-cause coaching begins.",
  },
];

export default function PortalStartHere() {
  return (
    <>
      <SEO title="Start Here" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Start Here</h1>
          <p className="text-muted-foreground mt-1">
            The core framework behind everything inside this portal.
          </p>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            This portal is designed to help you understand how your digestion patterns, metabolic rhythm, stress signals, and hormone responses are all connected — and why addressing them in the right order matters.
          </p>
          <p>
            Instead of chasing individual symptoms, you'll learn to read your body's patterns and follow a structured path toward stability. Everything inside this portal is built on that principle.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 md:p-6 space-y-2">
          <p className="font-display text-lg font-medium text-foreground">The Root-Cause Framework</p>
          <p className="text-sm text-muted-foreground">
            Gut → Metabolism → Hormones. This is the order your body processes information, and the order we follow inside this portal.
          </p>
        </div>

        <div className="space-y-4">
          {pillars.map((p) => (
            <div key={p.step} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm shrink-0">
                {p.step}
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
