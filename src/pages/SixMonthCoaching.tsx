import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function SixMonthCoaching() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="6-Month Root Cause Transformation — Weekly Coaching"
        description="Weekly coaching designed for deeper physiology stabilization and sustainable metabolic regulation over six months."
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
              6-Month Root Cause Transformation
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Weekly coaching designed for deeper physiology stabilization and sustainable metabolic regulation.
            </p>
            <div className="animate-fade-in mt-6" style={{ animationDelay: "0.25s" }}>
              <Button
                asChild
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
              >
                <a href="https://buy.stripe.com/8x29AUe1sdQgdxWfk73840h">
                  Secure Your Spot
                </a>
              </Button>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-3xl font-display font-bold text-primary-foreground">$10,000</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Overview</p>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              This program is for women who need more than a short reset. Six months gives enough time for deeper digestive support, metabolic stabilization, nervous system regulation, and hormone pattern support to actually take hold. This is structured coaching with weekly guidance, accountability, and ongoing refinement.
            </p>
          </div>

          {/* What's Included */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Everything You Need for Structured Support
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Weekly coaching sessions for six months, a personalized root-cause strategy plan, structured weekly progress check-ins, protocol and routine adjustments as your physiology shifts, supplement and lifestyle guidance, and direct messaging support between sessions.
            </p>
          </div>

          {/* What Makes 6 Months More Transformational */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What Makes 6 Months More Transformational</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Beyond Short-Term Stabilization
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Six months allows enough time to move beyond short-term stabilization and work through deeper multi-system patterns. As the body adapts, the strategy must evolve. This longer container supports deeper regulation work across digestion, metabolic signaling, inflammation load, stress chemistry, and hormone pattern shifts, with refinements made based on your real-time response.
            </p>
          </div>

          {/* Who This Is For */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Who This Is For</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Root-Cause Guidance with Long-Term Accountability
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              For women who have tried quick fixes and short protocols and are ready for a longer-term coaching container that supports deeper stabilization, consistency, and sustainable results without extreme restriction.
            </p>
          </div>

          {/* What Makes This More Extensive */}
          <div className="mb-12">
            <p className="section-label text-wellness-gold mb-4">What Makes This More Extensive Than 90-Day Coaching</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              More Complete Stabilization
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Six months allows more complete stabilization and longer tracking across changing life stressors and physiology. Support becomes more comprehensive because we have time to refine, reinforce, and integrate the strategy so it holds.
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
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">$10,000</span>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
            >
              <a href="https://buy.stripe.com/fZu6oIe1s6nO2Tigob3840d">
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
