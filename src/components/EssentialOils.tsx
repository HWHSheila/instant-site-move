import { Button } from "@/components/ui/button";
import essentialOilsImg from "@/assets/essential-oils-display.jpg";
import { Leaf } from "lucide-react";

const leftItems = [
  "Gut Motility Support",
  "Hormone Balance",
  "TCM Meridian Support",
  "Sleep & Circadian Rhythm",
];

const rightItems = [
  "Nervous System Calm",
  "Mood & Emotional Wellness",
  "Metabolic & Mitochondrial Function",
  "Inflammation Reduction",
];

function handleExternalLink(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
  e.preventDefault();
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function EssentialOils() {
  return (
    <section id="essential-oils" className="py-5 md:py-6 bg-background">
      <div className="container-wellness">
        <div className="mb-6">
          <p className="section-label mb-3">Essential Oils</p>
          <h2 className="section-title">Not All Essential Oils Are Created Equal</h2>
        </div>

        {/* Full-width image */}
        <div className="mb-10">
          <img
            src={essentialOilsImg}
            alt="Essential oil amber glass dropper bottles with botanical elements"
            className="w-full aspect-[16/9] object-cover rounded-2xl"
            loading="lazy"
          />
        </div>

        <div className="bg-card rounded-xl border border-border p-8">
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              I exclusively use and recommend <strong className="text-foreground">dōTERRA</strong> essential oils because quality matters from sourcing to storage. Not all oils are created with the same level of transparency or purity, and that can affect both aroma and performance.
            </p>
            <p>
              <strong className="text-foreground">CPTG® (Certified Pure Tested Grade)</strong> means each oil is screened through third-party testing for purity, potency, and consistency. This helps verify the oil meets strict quality standards and is free from adulteration, synthetic fillers, and residual contaminants.
            </p>
            <p>
              With my chemistry background, I value oils used intentionally and with high standards. Better oils can mean a more reliable experience and a more consistent wellness tool.
            </p>
          </div>

          <h3 className="text-xl font-display font-medium text-foreground mt-8 mb-5">
            Essential oils are commonly used to support:
          </h3>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-3">
            <ul className="space-y-3">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Leaf className="w-4 h-4 text-wellness-forest mt-1 flex-shrink-0" strokeWidth={2} />
                  <span className="text-foreground font-display font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Leaf className="w-4 h-4 text-wellness-forest mt-1 flex-shrink-0" strokeWidth={2} />
                  <span className="text-foreground font-display font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-lg px-8 py-6 text-base mt-8"
          >
            <a
              href="https://www.doterra.com/US/en/site/herwellnessharmony"
              onClick={(e) => handleExternalLink(e, "https://www.doterra.com/US/en/site/herwellnessharmony")}
            >
              Order or Book a Call
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
