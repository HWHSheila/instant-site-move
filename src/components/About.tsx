import { Button } from "@/components/ui/button";

const tags = [
"Gut Repair",
"Hormone Balance",
"Metabolic Support",
"Mitochondrial Resilience",
"Nervous System Harmony"];


export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-3">About Her Wellness Harmony</p>
          <h2 className="section-title">Where Science Meets Intuition</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-foreground leading-relaxed mb-8">My name is <strong>Sheila McFarland</strong>, and Her Wellness Harmony was born from my own unexpected detour into illness, burnout, and complete loss of control over my body, and the fierce determination to take that power back.</p>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="card-wellness p-6">
              <h3 className="text-xl font-display font-medium text-foreground mb-4 flex items-center gap-2">
                 My Journey
              </h3>
              <p className="text-muted-foreground leading-relaxed">After nearly 20 years in science, a severe reaction triggered mitochondrial dysfunction, gut damage, hormone imbalance, and metabolic crash. When traditional answers failed, I went deeper, studying root-cause gut healing, functional nutrition, and nervous system recovery. Little by little, everything shifted.

              </p>
            </div>

            <div className="card-wellness p-6">
              <h3 className="text-xl font-display font-medium text-foreground mb-4 flex items-center gap-2">My Philosophy


              </h3>
              <p className="text-muted-foreground leading-relaxed">Healing doesn't happen through force. It happens through gentleness, rhythm, safety, and honoring your body's timing. I blend evidence-based strategies, functional lifestyle shifts, and TCM energetics, because true healing is biochemical, energetic, emotional, and metabolic.

              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map((tag) => <span key={tag} className="badge-wellness">
                {tag}
              </span>)}
          </div>
        </div>
      </div>
    </section>);

}

export function WorkingWith() {
  const attributes = [
  "Gentle & supportive",
  "Non-judgmental",
  "Science-informed",
  "Nervous-system aware",
  "Gut-first approach",
  "Hormone-friendly",
  "Emotionally safe",
  "Root-cause focused"];


  return (
    <section className="py-20 md:py-28 bg-wellness-forest">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label text-wellness-gold mb-3">What It's Like</p>
          <h2 className="section-title text-primary-foreground">Working With Sheila</h2>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-primary-foreground/90 leading-relaxed mb-8">
            I help you understand your body, reconnect with your intuition, and support your gut, metabolism, and hormones in a way that feels grounding, doable, and empowering. You'll never be rushed, shamed, or overwhelmed. This is root-cause healing with compassion and clarity.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-8 py-6 text-base mb-12">

            <a href="https://buy.stripe.com/9B6eVe5uW7rS0La1th38404" target="_blank" rel="noopener noreferrer">
              Book Your Initial Consultation
            </a>
          </Button>

          {/* Scrolling Marquee */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...attributes, ...attributes].map((attr, index) =>
              <span
                key={index}
                className="inline-flex items-center px-6 py-2 mx-2 rounded-full border border-primary-foreground/30 text-primary-foreground/90 text-sm">

                  {attr}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}