import { Mail, Instagram, Facebook } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-wellness-forest">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label text-wellness-gold mb-3">Get In Touch</p>
          <h2 className="section-title text-primary-foreground">Let's Start Your Healing Journey</h2>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-primary-foreground/90 leading-relaxed mb-8">
            Have questions about which service is right for you? Ready to take the first step toward root-cause healing? I'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <a
              href="mailto:hello@herwellnessharmony.com"
              className="flex items-center gap-3 text-primary-foreground hover:text-wellness-gold transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>hello@herwellnessharmony.com</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://instagram.com/herwellnessharmony"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/herwellnessharmony"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
