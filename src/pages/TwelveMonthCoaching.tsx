import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function TwelveMonthCoaching() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="12-Month Root Cause Partnership — Deepest Support"
        description="The highest level of weekly coaching support for long-term physiology restoration and metabolic stability."
      />

      <div
        className="flex-1 relative"
        style={{
          background: `
            linear-gradient(
              175deg,
              hsl(150 40% 18%) 0%,
              hsl(150 35% 24%) 12%,
              hsl(150 28% 32%) 30%,
              hsl(145 22% 42%) 50%,
              hsl(145 20% 38%) 65%,
              hsl(150 28% 28%) 80%,
              hsl(150 38% 18%) 100%
            )
          `,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(42 75% 55% / 0.03) 0%, transparent 55%),
              radial-gradient(ellipse at 70% 80%, hsl(150 35% 15% / 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(150 20% 40% / 0.06) 0%, transparent 70%)
            `,
          }}
        />

        <Header />

        <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <div className="text-center mb-12">
            <p className="section-label text-wellness-gold mb-4 animate-fade-in">Coaching</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              12-Month Root Cause Partnership
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              The highest level of weekly coaching support for long-term physiology restoration and metabolic stability.
            </p>
            <div className="animate-fade-in mt-6" style={{ animationDelay: "0.25s" }}>
              <Button
                asChild
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
              >
                <a href="https://buy.stripe.com/eVqfZibTk13ubpO8VJ3840i">
                  Secure Your Spot
                </a>
              </Button>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-3xl font-display font-bold text-primary-foreground">$20,000</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Overview</p>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              This program is for women who want long-term coaching support with the highest level of guidance, accountability, and ongoing refinement. A full year allows deep physiology rebuilding, long-term pattern resolution, and strategy adjustments as your body changes across seasons, stressors, and life shifts. This is a true partnership model with weekly support.
            </p>
          </div>

          {/* What's Included */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Everything You Need for Structured Support
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Weekly coaching sessions for twelve months, comprehensive personalized root-cause strategy planning, ongoing refinement as physiology adapts, structured weekly check-ins and progress tracking, advanced supplement and lifestyle guidance, and direct messaging support between sessions.
            </p>
          </div>

          {/* What Makes This the Deepest Level */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What Makes This the Deepest Level of Support</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Long-Term Regulation and Adaptation
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              A full year allows long-term regulation and adaptation. Instead of cycling between short-term improvements and relapses, this partnership supports deeper stability through continuous refinement, accountability, and long-term integration. Strategy evolves as your physiology stabilizes so progress becomes sustainable and resilient over time.
            </p>
          </div>

          {/* Who This Is For */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Who This Is For</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Committed to Long-Term Healing
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              For women who are committed to long-term healing and want consistent weekly coaching support, structure, and accountability to stabilize gut health, metabolic signaling, hormone patterns, and stress load long term.
            </p>
          </div>

          {/* What Makes This More Extensive */}
          <div className="mb-12">
            <p className="section-label text-wellness-gold mb-4">What Makes This More Extensive Than 6-Month Coaching</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              The Deepest Container
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Twelve months provides the deepest container because it supports long-term stabilization and adaptation across seasons and changing stressors. The level of support is more extensive because we can refine the strategy over time and ensure the physiology holds steady long term.
            </p>
          </div>

          {/* Investment */}
          <div
            className="rounded-2xl px-6 py-10 md:px-10 md:py-12 mb-4"
            style={{
              background: `linear-gradient(170deg, hsl(150 35% 20% / 0.5) 0%, hsl(150 40% 15% / 0.7) 100%)`,
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="section-label text-wellness-gold mb-4">Investment</p>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">$20,000</span>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
            >
              <a href="https://buy.stripe.com/9B6dRa8H85jKeC00pd3840e">
                Secure Your Spot
              </a>
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
