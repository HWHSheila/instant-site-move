import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export function Hero() {
  return (
    <section className="pt-20 md:pt-24 bg-background">
      <div className="container-wellness py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-wellness-gold mb-4">
              Root-Cause Wellness For Women
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-foreground leading-tight mb-6">
              Healing Gut, Hormones & Metabolism
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Simple functional lifestyle shifts that help you understand your body, restore your energy, and experience true healing — without pressure or confusion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-lg px-8 py-6 text-base"
              >
                <a href="/free-guide">
                  Download Your Free Gut Reset Guide
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground/30 text-foreground hover:bg-muted rounded-lg px-8 py-6 text-base"
              >
                <a href="#services">
                  View Services
                </a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={heroImage}
              alt="Wellness lifestyle - herbal tea with fresh ingredients"
              className="rounded-2xl shadow-lg w-full max-w-lg object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
