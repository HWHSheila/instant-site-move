import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function FourWeekCoaching() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Deep Support Package — 4-Week Gut & Hormone Coaching"
        description="A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order."
      />
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container-wellness">
          <div className="max-w-2xl mx-auto">

            {/* Section Label */}
            <p className="section-label mb-4 text-center">Coaching</p>

            {/* Hero */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-4 leading-tight text-center">
              Deep Support Package
            </h1>
            <p className="text-xl md:text-2xl font-display font-medium text-foreground/80 mb-8 text-center leading-snug">
              4-Week Gut & Hormone Coaching for Women
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 text-center">
              A structured 4-week container designed to stabilize digestion and stress load to support metabolic rhythm and hormone signaling in the correct order.
            </p>

            {/* Divider */}
            <hr className="border-border mb-10" />

            {/* Authority Anchor */}
            <p className="text-base md:text-lg text-foreground leading-relaxed mb-10 italic text-center">
              "My name is Sheila, and I've dropped over 100 pounds combining my science background with root-cause wellness for women."
            </p>

            {/* What's Included */}
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
              What's Included
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              This package includes one 60-minute initial strategy session and three 45-minute weekly follow-up sessions, structured weekly progress check-ins, a fully personalized gut and hormone support plan, targeted supplement and routine guidance, and direct messaging support between sessions.
            </p>

            {/* Who This Is For */}
            <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
              Who This Is For
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-12">
              For women who are eating "healthy" but still feel inflamed, exhausted, or hormonally unstable and want structured, root-cause guidance with clear direction and accountability.
            </p>

            {/* Divider */}
            <hr className="border-border mb-10" />

            {/* Investment Section */}
            <div className="text-center mb-10">
              <p className="section-label mb-4">Investment</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-xl line-through text-muted-foreground/60">$1,000</span>
                <span className="text-3xl md:text-4xl font-display font-semibold text-wellness-forest">$647</span>
              </div>
              <p className="text-sm font-medium text-wellness-forest/80">(Only 7 spots remaining)</p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a
                href="https://buy.stripe.com/9B6eVe5uW7rS0La1th38404"
                className="inline-block w-full sm:w-auto bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-10 py-4 text-base h-14 leading-[1.75rem] transition-colors"
              >
                Secure Your Spot
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
