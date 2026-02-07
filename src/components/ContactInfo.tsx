import { Mail, Clock } from "lucide-react";

export function ContactInfo() {
  return (
    <section id="contact-info" className="py-16 md:py-20 bg-card">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-4">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
            Contact Her Wellness Harmony
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* What you can email about */}
          <div className="mb-10">
            <h3 className="text-xl font-display font-medium text-foreground mb-4">
              💬 What you can email me about:
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Questions about coaching services</li>
              <li>• Help choosing the right session for you</li>
              <li>• Support with scheduling or rescheduling</li>
              <li>• Issues accessing your guide or emails</li>
              <li>• General gut, hormone, or metabolism questions (within educational guidance)</li>
            </ul>
          </div>

          {/* What I cannot respond to */}
          <div className="mb-10 bg-background rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-display font-medium text-foreground mb-4">
              ⛔ What I <em>cannot</em> respond to:
            </h3>
            <p className="text-muted-foreground mb-4">
              To protect your safety and abide by regulations, I cannot answer:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Medical diagnosis questions</li>
              <li>• Emergency concerns</li>
              <li>• Prescription or medication advice</li>
              <li>• Requests to interpret labs outside your program</li>
            </ul>
            <p className="text-muted-foreground italic">
              For medical concerns, please contact a licensed provider.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Support */}
            <div className="bg-wellness-forest rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-10 h-10 text-wellness-gold" />
              </div>
              <h3 className="text-xl font-display font-medium text-primary-foreground mb-2">
                📩 Email Support
              </h3>
              <a 
                href="mailto:support@herwellnessharmony.com"
                className="text-wellness-gold hover:text-wellness-gold-light font-semibold text-lg transition-colors"
              >
                support@herwellnessharmony.com
              </a>
              <p className="text-primary-foreground/80 mt-3 text-sm">
                You'll receive a reply within 1–2 business days.
              </p>
            </div>

            {/* Support Hours */}
            <div className="bg-wellness-forest rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <Clock className="w-10 h-10 text-wellness-gold" />
              </div>
              <h3 className="text-xl font-display font-medium text-primary-foreground mb-2">
                💛 Client Support Hours
              </h3>
              <p className="text-primary-foreground font-semibold text-lg">
                Monday–Friday
              </p>
              <p className="text-primary-foreground/80">
                9am–5pm CST
              </p>
              <p className="text-primary-foreground/60 mt-2 text-sm">
                (Closed weekends & holidays)
              </p>
            </div>
          </div>

          {/* Thank you message */}
          <p className="text-center text-muted-foreground mt-10 text-lg">
            🧡 Thank you for trusting me with your healing journey.
          </p>
        </div>
      </div>
    </section>
  );
}
