import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function NinetyDayCoaching() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="90-Day Root Cause Coaching — Deeper Support Package"
        description="Structured weekly coaching to stabilize gut health, metabolism, and hormone signaling over 90 days."
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
          {/* Hero */}
          <div className="text-center mb-12">
            <p className="section-label text-wellness-gold mb-4 animate-fade-in">
              Coaching
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              90-Day Root Cause Coaching
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Structured weekly coaching to stabilize gut health, metabolism, and hormone signaling.
            </p>
            <div className="animate-fade-in mt-6" style={{ animationDelay: "0.25s" }}>
              <Button
                asChild
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
              >
                <a href="https://buy.stripe.com/9B614o0aCaE4ctS9ZN3840g">
                  Secure Your Spot
                </a>
              </Button>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-3xl font-display font-bold text-primary-foreground">$5,500</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Overview</p>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              This program is designed for women who feel stuck in symptom cycles and want structured, weekly root-cause support long enough to identify patterns, stabilize physiology, and build real momentum. You will be guided step by step through gut and metabolic stabilization with clear direction and accountability.
            </p>
          </div>

          {/* What's Included */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Everything You Need for Structured Support
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              Weekly coaching sessions across the full 90-day container, a personalized root-cause strategy plan, structured weekly check-ins and adjustments, supplement and routine guidance, and direct messaging support between sessions.
            </p>
          </div>

          {/* 90-Day GLP-1 Optimization Protocol */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">90-Day GLP-1 Optimization Protocol</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Integrated Metabolic Signaling Support
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              As part of the 90-Day Root Cause Coaching program, you will be guided through a structured 90-Day GLP-1 Optimization Protocol designed to support metabolic signaling, appetite regulation patterns, digestive stability, blood sugar consistency, stress chemistry regulation, and inflammation load reduction. This protocol is adjusted as your body responds so support evolves with your physiology rather than staying static.
            </p>
          </div>

          {/* Who This Is For */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">Who This Is For</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Root-Cause Guidance with Accountability
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              For women who are eating "healthy" but still feel inflamed, exhausted, puffy, reactive, or metabolically stuck and want weekly structure and accountability to stabilize digestion, metabolic patterns, and hormone signaling.
            </p>
          </div>

          {/* What Makes This Deeper */}
          <div className="mb-12">
            <p className="section-label text-wellness-gold mb-4">What Makes This Deeper Than 4-Week Coaching</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Deeper Pattern Recognition and Refinement
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              The longer timeline allows deeper pattern recognition and refinement. Instead of making one plan and hoping it works, we can track your responses week to week, identify triggers, and adjust strategy and support as your physiology stabilizes.
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
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">$5,500</span>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
            >
              <a href="https://buy.stripe.com/9B614o0aCaE4ctS9ZN3840g">
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
