import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 md:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Wellness lifestyle"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-r from-wellness-forest/85 via-wellness-forest/60 to-wellness-forest/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wellness py-20 md:py-32">
        <div className="max-w-2xl">
          <p className="section-label text-wellness-gold mb-4 animate-fade-in">
            Root-Cause Wellness for Women
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Healing Gut, Hormones & Metabolism
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>Simple functional lifestyle shifts that help you understand your body, restore your energy, and experience true healing, without pressure or confusion.

          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-8 py-6 text-base">

              <a href="/free-guide">
                Download Your Free Gut Reset Guide
              </a>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-full px-8 py-6 text-base backdrop-blur-sm">

              <a href="#services">
                View Services
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>);

}