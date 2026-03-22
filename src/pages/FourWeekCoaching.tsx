import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function FourWeekCoaching() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Deep Support Package — 4-Week Gut & Hormone Coaching"
        description="A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order."
      />

      {/* Full-page continuous gradient background */}
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
        {/* Subtle radial overlays for depth */}
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
          {/* Hero content — centered, no image */}
          <div className="text-center mb-12">
            <p className="section-label text-wellness-gold mb-4 animate-fade-in">
              Coaching
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Deep Support Package
            </h1>
            <p
              className="text-xl md:text-2xl font-display font-medium text-primary-foreground/90 mb-5 animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              4-Week Gut & Hormone Coaching for Women
            </p>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order.
            </p>
            <div className="animate-fade-in mt-6" style={{ animationDelay: "0.25s" }}>
              <Button
                asChild
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
              >
                 <a href="https://buy.stripe.com/eVq9AU8H8cMcdxW9ZN3840f">
                  Secure Your Spot
                </a>
              </Button>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-3xl font-display font-bold text-primary-foreground">$1,000</span>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Everything You Need for Structured Support
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              This package includes one 60-minute initial strategy session and three 45-minute weekly follow-up sessions, structured weekly progress check-ins, a fully personalized gut and hormone support plan, targeted supplement and routine guidance, and direct messaging support between sessions.
            </p>
          </div>

          {/* Who This Is For */}
          <div className="mb-12">
            <p className="section-label text-wellness-gold mb-4">Who This Is For</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-primary-foreground mb-5">
              Root-Cause Guidance with Accountability
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              For women who are eating "healthy" but still feel inflamed, exhausted, or hormonally unstable and want structured, root-cause guidance with clear direction and accountability.
            </p>
          </div>

          {/* Investment — slightly darker blend */}
          <div
            className="rounded-2xl px-6 py-10 md:px-10 md:py-12 mb-4"
            style={{
              background: `linear-gradient(170deg, hsl(150 35% 20% / 0.5) 0%, hsl(150 40% 15% / 0.7) 100%)`,
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="section-label text-wellness-gold mb-4">Investment</p>
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">$1,000</span>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base mt-6"
            >
              <a href="https://buy.stripe.com/6oU7sM3mOeUkbpOfk73840b">
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
