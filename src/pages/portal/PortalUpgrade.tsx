import { SEO } from "@/components/SEO";

const tiers = [
  {
    name: "Membership Portal",
    description: "Self-guided root-cause coaching with the Pattern Library, Guided Pathways, AI Coaching Assistant, and Weekly Notes.",
    included: true,
  },
  {
    name: "Integrative Wellness Consultation",
    description: "The best place to start. We'll explore your symptoms, gut patterns, stress load, hormone clues, and build a personalized plan with 3–5 simple steps you can begin immediately.",
    included: false,
  },
  {
    name: "90-Day Coaching",
    description: "Three months of structured coaching to stabilize digestion, stress, and metabolic patterns.",
    included: false,
  },
  {
    name: "6-Month Coaching",
    description: "Deep, sustained coaching to address root-cause patterns across all body systems.",
    included: false,
  },
  {
    name: "12-Month Coaching",
    description: "A full year of comprehensive root-cause coaching for lasting transformation across gut, metabolism, and hormone health.",
    included: false,
  },
];

export default function PortalUpgrade() {
  return (
    <>
      <SEO title="Deep Support Coaching Options" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Deep Support Coaching Options</h1>
          <p className="text-muted-foreground mt-1">
            Explore deeper coaching support beyond the membership portal.
          </p>
        </div>

        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-xl border bg-card ${
                tier.included ? "border-primary/30 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="font-display text-base font-semibold text-foreground">{tier.name}</p>
                {tier.included && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              {!tier.included && (
                <button className="mt-3 text-sm font-medium text-primary hover:underline">
                  Learn more →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
