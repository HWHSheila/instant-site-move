export function ContactInfo() {
  return (
    <section id="contact-info" className="py-16 md:py-20 bg-card">
      <div className="container-wellness">
        <div className="mb-10">
          <p className="section-label mb-4">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground">
            Contact Her Wellness Harmony
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: email topics */}
          <div className="bg-wellness-sage/30 rounded-2xl p-8">
            <h3 className="text-xl font-display font-medium text-foreground mb-4">You Can Email Me About:</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2"><span>•</span><span>Wellness education services & choosing the right session</span></li>
              <li className="flex gap-2"><span>•</span><span>Scheduling or rescheduling support</span></li>
              <li className="flex gap-2"><span>•</span><span>Accessing your guide or emails</span></li>
              <li className="flex gap-2"><span>•</span><span>General gut, hormone, or metabolism questions (educational guidance)</span></li>
            </ul>

            <h3 className="text-xl font-display font-medium text-foreground mt-8 mb-4">I Cannot Respond To:</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2"><span>•</span><span>Medical diagnosis, emergency concerns, or prescription advice</span></li>
              <li className="flex gap-2"><span>•</span><span>Lab interpretation outside your program</span></li>
            </ul>
          </div>

          {/* Right: contact details */}
          <div className="space-y-6">
            <div className="bg-wellness-sage/30 rounded-2xl p-8">
              <h3 className="text-xl font-display font-medium text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground">
                <a
                  href="mailto:support@herwellnessharmony.com"
                  className="text-wellness-forest font-semibold hover:underline"
                >
                  support@herwellnessharmony.com
                </a>{" "}
                Reply within 1–2 business days.
              </p>
            </div>

            <div className="bg-wellness-sage/30 rounded-2xl p-8">
              <h3 className="text-xl font-display font-medium text-foreground mb-2">Client Support Hours</h3>
              <p className="text-muted-foreground">
                Monday–Friday, 9am–5pm CST Closed weekends & holidays.
              </p>
            </div>

            <div className="bg-wellness-sage/30 rounded-2xl p-8 flex items-center gap-3">
              <span className="text-muted-foreground">💬</span>
              <p className="text-muted-foreground italic">
                Thank you for trusting me with your healing journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
