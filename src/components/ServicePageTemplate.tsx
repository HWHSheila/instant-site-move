import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

interface ServicePageProps {
  seoTitle: string;
  seoDescription: string;
  categoryLabel: string;
  headline: string;
  subheadline: string;
  includesTitle?: string;
  includes: string[];
  whoForTitle?: string;
  whoFor: string[];
  walkAwayTitle?: string;
  walkAway: string[];
  price: string;
  originalPrice?: string;
  spotsRemaining?: number;
  ctaText: string;
  ctaLink: string;
  clarityNote?: string;
}

export default function ServicePageTemplate({
  seoTitle,
  seoDescription,
  categoryLabel,
  headline,
  subheadline,
  includesTitle = "What This Session Includes",
  includes,
  whoForTitle = "Who This Is For",
  whoFor,
  walkAwayTitle = "What You'll Walk Away With",
  walkAway,
  price,
  originalPrice,
  spotsRemaining,
  ctaText,
  ctaLink,
  clarityNote,
}: ServicePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title={seoTitle} description={seoDescription} />

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
              {categoryLabel}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {headline}
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {subheadline}
            </p>
            <div className="animate-fade-in mt-6" style={{ animationDelay: "0.25s" }}>
              <Button
                asChild
                size="lg"
                className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
              >
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">{includesTitle}</p>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85">
              {includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Who This Is For */}
          <div className="mb-10">
            <p className="section-label text-wellness-gold mb-4">{whoForTitle}</p>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85">
              {whoFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Walk Away With */}
          <div className="mb-12">
            <p className="section-label text-wellness-gold mb-4">{walkAwayTitle}</p>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-primary-foreground/85">
              {walkAway.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-wellness-gold mt-1.5 text-lg leading-none">•</span>
                  {item}
                </li>
              ))}
            </ul>
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
            <div className="flex items-baseline gap-4 mb-3">
              {originalPrice && (
                <span className="text-xl line-through text-primary-foreground/50">${originalPrice}</span>
              )}
              <span className="text-4xl md:text-5xl font-display font-semibold text-primary-foreground">${price}</span>
            </div>
            {spotsRemaining && (
              <p className="text-sm font-medium text-wellness-gold mb-6">
                (Only {spotsRemaining} spots remaining)
              </p>
            )}
            {clarityNote && (
              <p className="text-base text-primary-foreground/75 mb-6">{clarityNote}</p>
            )}
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base"
            >
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
