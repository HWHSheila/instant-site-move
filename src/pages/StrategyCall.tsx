import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const StrategyCall = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Initial Root Cause Strategy Call | Her Wellness Harmony"
        description="A focused 15-minute conversation to clarify your primary symptom patterns and determine your next step."
      />

      {/* Continuous subtle gradient background */}
      <div
        className="flex-1"
        style={{
          background: `
            linear-gradient(
              175deg,
              hsl(150 35% 22%) 0%,
              hsl(150 30% 28%) 15%,
              hsl(150 20% 38%) 35%,
              hsl(145 18% 48%) 55%,
              hsl(140 15% 55%) 75%,
              hsl(145 18% 48%) 90%,
              hsl(150 25% 32%) 100%
            )
          `,
        }}
      >
        {/* Very subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, hsl(42 75% 55% / 0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, hsl(150 35% 20% / 0.08) 0%, transparent 50%)
            `,
          }}
        />

        <Header />

        <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          {/* Title area */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Strategy Call</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-4 text-primary-foreground">
              Initial Root Cause Strategy Call
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-primary-foreground/80">
              A focused 15-minute conversation to clarify your primary symptom patterns and determine your next step.
            </p>
          </div>

          {/* What This Call Is */}
          <div className="mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-5 text-primary-foreground">
              What This Call Is
            </h2>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85">
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                A structured 15-minute clarity session
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                Focused on identifying your primary symptom cluster
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                Designed to determine whether the roadmap, consultation, or coaching is the right next step
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                For women who feel something is off but are unsure where to begin
              </li>
            </ul>
          </div>

          {/* What This Call Is Not */}
          <div className="mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-5 text-primary-foreground">
              What This Call Is Not
            </h2>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85 mb-5">
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                This is not a full protocol session
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                No supplement prescriptions
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                No deep lab review
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                No custom treatment plan
              </li>
            </ul>
            <p className="text-base md:text-lg italic text-primary-foreground/75">
              This is a focused starting point, not a comprehensive consultation.
            </p>
          </div>

          {/* What We'll Cover */}
          <div className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-5 text-primary-foreground">
              What We'll Cover
            </h2>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85">
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                Your top 1–2 symptom patterns
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                Where you may be in the gut → metabolism → hormone sequence
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                The most appropriate next level of support
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://calendly.com/herwellnessharmony-support/initial-root-cause-strategy-session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full px-10 py-4 text-base font-semibold transition-opacity hover:opacity-90 bg-wellness-gold text-wellness-forest-dark"
            >
              Schedule Your Strategy Call
            </a>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StrategyCall;
