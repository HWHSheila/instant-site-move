import { Button } from "@/components/ui/button";
import contactImage from "@/assets/contact-cta-image.jpg";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Download the exact guide Sheila wishes she had when she started. It's free, it's simple, and it's the first step toward feeling whole again.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-lg px-8 py-6 text-base"
            >
              <a href="/free-guide">
                Download Your Free Guide
              </a>
            </Button>
          </div>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={contactImage}
              alt="Woman reading a wellness guide"
              className="rounded-2xl shadow-lg w-full max-w-lg object-cover aspect-[4/3]"
              loading="lazy"
              width={800}
              height={800}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
