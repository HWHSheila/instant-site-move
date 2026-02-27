import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export default function FourWeekCoaching() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Deep Support Package — 4-Week Gut & Hormone Coaching"
        description="A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order."
      />
      <Header />

      {/* Hero Section — matches homepage hero */}
      <section className="relative min-h-[60vh] flex items-center pt-14 md:pt-16">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Wellness lifestyle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wellness-forest/85 via-wellness-forest/60 to-wellness-forest/40" />
        </div>

        <div className="relative z-10 container-wellness py-16 md:py-16">
          <div className="max-w-2xl">
            <p className="section-label text-wellness-gold mb-4 animate-fade-in">
              Coaching
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Deep Support Package
            </h1>
            <p className="text-xl md:text-2xl font-display font-medium text-primary-foreground/90 mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              4-Week Gut & Hormone Coaching for Women
            </p>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order.
            </p>
          </div>
        </div>
      </section>

      {/* Authority Anchor */}
      <section className="bg-muted py-12 md:py-10">
        <div className="container-wellness">
          <div className="max-w-3xl">
            <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
              "My name is Sheila, and I've dropped over 100 pounds combining my science background with root-cause wellness for women."
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-background py-12 md:py-10">
        <div className="container-wellness">
          <div className="max-w-3xl">
            <p className="section-label text-accent mb-4">What's Included</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-6">
              Everything You Need for Structured Support
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              This package includes one 60-minute initial strategy session and three 45-minute weekly follow-up sessions, structured weekly progress check-ins, a fully personalized gut and hormone support plan, targeted supplement and routine guidance, and direct messaging support between sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-muted py-12 md:py-10">
        <div className="container-wellness">
          <div className="max-w-3xl">
            <p className="section-label text-accent mb-4">Who This Is For</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-6">
              Root-Cause Guidance with Accountability
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              For women who are eating "healthy" but still feel inflamed, exhausted, or hormonally unstable and want structured, root-cause guidance with clear direction and accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Investment + CTA — dark overlay like hero */}
      <section className="relative py-16 md:py-14">
        <div className="absolute inset-0 bg-wellness-forest" />
        <div className="relative z-10 container-wellness">
          <div className="max-w-3xl">
            <p className="section-label text-wellness-gold mb-4">Investment</p>
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-xl line-through text-primary-foreground/50">$1,000</span>
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">$647</span>
            </div>
            <p className="text-sm font-medium text-wellness-gold mb-6">
              (Only 7 spots remaining)
            </p>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
            >
              <a href="https://buy.stripe.com/9B6eVe5uW7rS0La1th38404">
                Secure Your Spot
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
