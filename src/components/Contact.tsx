import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-wellness-forest">
      <div className="container-wellness">
        <div className="bg-wellness-forest-dark rounded-3xl py-16 md:py-20 px-8 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-primary-foreground mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Download the exact guide Sheila wishes she had when she started. It's free, it's simple, and it's the first step toward feeling whole again.
          </p>
          
          <Button
            asChild
            size="lg"
            className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-10 py-6 text-base mx-auto"
          >
            <a href="/free-guide">
              Download Your Free Gut Reset Guide
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
