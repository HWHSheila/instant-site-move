import { Button } from "@/components/ui/button";
import essentialOilsImg from "@/assets/essential-oils-display.jpg";

const supportCategories = [
  "Gut Motility Support",
  "Nervous System Calm",
  "Hormone Balance",
  "Mood & Emotional Wellness",
  "TCM Meridian Support",
  "Metabolic & Mitochondrial Function",
  "Sleep & Circadian Rhythm",
  "Inflammation Reduction",
];

function handleExternalLink(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
  e.preventDefault();
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function EssentialOils() {
  return (
    <section id="essential-oils" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        {/* Full-width image */}
        <div className="mb-10">
          <img
            src={essentialOilsImg}
            alt="Essential oil amber glass dropper bottles with botanical elements"
            className="w-full aspect-[16/9] object-cover rounded-2xl"
            loading="lazy"
          />
        </div>

        <div className="mb-6">
          <p className="section-label mb-3">Essential Oils</p>
          <h2 className="section-title">Not All Essential Oils Are Created Equal</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: text */}
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
            <Button
              asChild
              size="lg"
              className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-lg px-8 py-6 text-base mt-6"
            >
              <a
                href="https://www.doterra.com/US/en/site/herwellnessharmony"
                onClick={(e) => handleExternalLink(e, "https://www.doterra.com/US/en/site/herwellnessharmony")}
              >
                Order or Book a Call
              </a>
            </Button>
          </div>

          {/* Right: categories grid */}
          <div className="bg-wellness-sage/30 rounded-xl p-8">
            <div className="grid grid-cols-2 gap-4">
              {supportCategories.map((cat) => (
                <div key={cat} className="flex items-start gap-3">
                  <div className="w-1 h-full min-h-[2rem] bg-wellness-forest rounded-full flex-shrink-0 mt-1" />
                  <span className="text-lg font-display font-medium text-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
