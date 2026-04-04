import { Button } from "@/components/ui/button";
import { Leaf, Zap, Heart, Flame, Smile } from "lucide-react";
import sheilaPortrait from "@/assets/sheila-portrait.png";
import workingChemistry from "@/assets/working-with-chemistry.jpg";
import workingOils from "@/assets/working-with-oils.jpg";
import workingFunctional from "@/assets/working-with-functional.jpg";
import workingLived from "@/assets/working-with-lived.jpg";

const philosophyCards = [
  { icon: Leaf, label: "Gut Repair" },
  { icon: Heart, label: "Hormone Balance" },
  { icon: Zap, label: "Metabolic Support" },
  { icon: Flame, label: "Mitochondrial Resilience" },
  { icon: Smile, label: "Nervous System Harmony" },
];

const timelineItems = [
  {
    title: "Early Diagnosis",
    text: "Diagnosed with type 2 diabetes. No mention of gut or hormones. Tried different low-carb diets including Keto and Carnivore. Slowly dropped some weight.",
    side: "left" as const,
  },
  {
    title: "2022 Crisis",
    text: "Blood sugar reached nearly 600, borderline diabetic coma, severe candida overgrowth, rashes, and debilitating fatigue. Told to focus on A1C. Worked to stabilize blood sugar and A1C, and succeeded. Continued dropping weight. Felt strong and in control.",
    side: "right" as const,
  },
  {
    title: "2025 Collapse",
    text: "A severe kidney infection. Heavy antibiotics caused gut collapse, followed by metabolic and hormonal breakdown. Weight plateaued. Dismissed and gaslit by doctors.",
    side: "left" as const,
  },
  {
    title: "Root-Cause Rebuild",
    text: "Applied 20+ years of laboratory root cause analysis to her own body. Stopped chasing symptoms. Shifted to healing mode. Down 105+ lbs.",
    side: "right" as const,
  },
];

const workingWithItems = [
  {
    image: workingChemistry,
    title: "Chemistry & Root-Cause Analysis",
    lines: [
      "20+ years of root cause analysis in a professional laboratory and a Bachelor's Degree in Chemistry.",
      "Evidence-based thinking helps uncover patterns and isolate causes.",
    ],
  },
  {
    image: workingOils,
    title: "Essential Oil Chemistry",
    lines: [
      "Deep knowledge of molecular composition and how oils interact with the body's systems.",
      "This lens connects formulation, function, and energetic support.",
    ],
  },
  {
    image: workingFunctional,
    title: "Functional Medicine Education",
    lines: [
      "Currently pursuing FM-CP certification, blending evidence-based strategies with gut-first, hormone-friendly protocols.",
      "Ongoing training strengthens a systems-based approach to health.",
    ],
  },
  {
    image: workingLived,
    title: "Lived Healing Experience",
    lines: [
      "Personal navigation of metabolic crisis, gut dysfunction, and hormonal imbalance.",
      "That experience shapes a compassionate, grounded approach.",
    ],
  },
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        {/* Opener: Photo left, sage card right */}
        <div className="grid md:grid-cols-[auto_1fr] gap-0 mb-20">
          <div className="flex justify-center md:justify-start">
            <img
              src={sheilaPortrait}
              alt="Sheila McFarland, founder of Her Wellness Harmony"
              className="w-72 md:w-80 h-auto object-contain rounded-2xl"
              loading="lazy"
            />
          </div>
          <div className="bg-wellness-sage/30 rounded-2xl p-8 md:p-10 flex flex-col justify-center">
            <p className="section-label mb-3">About Her Wellness Harmony</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              Where Science Meets Lived Experience
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm <strong>Sheila McFarland</strong> — a wellness educator with 20+ years of scientific laboratory experience in root cause analysis, a chemistry degree, and a lived journey through metabolic crisis, gut dysfunction, and hormonal imbalance. I built Her Wellness Harmony because I know what it feels like to be dismissed by a system focused only on surface-level numbers while your body screams something deeper. That is the experience I bring to every woman I work with.
            </p>
          </div>
        </div>

        {/* My Journey — Timeline */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="section-label mb-3">My Journey</p>
            <h2 className="section-title">From Crisis to Root-Cause Clarity</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wellness-forest/30 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              {timelineItems.map((item, i) => (
                <div key={item.title} className="relative grid md:grid-cols-2 gap-8 items-start">
                  {/* Dot */}
                  <div className="absolute left-1/2 top-2 w-4 h-4 rounded-full bg-wellness-forest -translate-x-1/2 hidden md:block z-10" />

                  {item.side === "left" ? (
                    <>
                      <div className="text-right pr-8 hidden md:block">
                        <h3 className="text-xl font-display font-medium text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="pl-8 hidden md:block">
                        <h3 className="text-xl font-display font-medium text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </>
                  )}

                  {/* Mobile: stack */}
                  <div className="md:hidden col-span-full">
                    <h3 className="text-xl font-display font-medium text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-center mt-10 max-w-3xl mx-auto leading-relaxed">
            From a severe health crisis to deeper understanding, this journey has been about uncovering root causes and rebuilding health step by step.
          </p>
        </div>

        {/* My Philosophy */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <p className="section-label mb-3">My Philosophy</p>
            <h2 className="section-title mb-4">Healing From the Inside Out</h2>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto mb-10">
            True Healing is biochemical + energetic + emotional + metabolic. It's the whole woman. I help women rebuild from the inside out. No overwhelm. No shame. No perfectionism. Just real support, simple shifts, and clarity that finally makes sense.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {philosophyCards.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-muted rounded-xl p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-full bg-wellness-forest flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-display font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground italic text-center max-w-3xl mx-auto">
            All information shared by Her Wellness Harmony is for educational purposes only and does not constitute medical advice. Please consult your qualified medical provider before making changes to your health regimen.
          </p>
        </div>
      </div>
    </section>
  );
}

export function WorkingWith() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Working With Sheila</p>
          <h2 className="section-title">Uniquely Qualified - What Makes This Approach Different</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {workingWithItems.map((item) => (
            <div key={item.title} className="text-left">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-[5/4] object-cover rounded-xl mb-4"
                loading="lazy"
                width={800}
                height={640}
              />
              <h3 className="text-lg font-display font-medium text-foreground mb-3">{item.title}</h3>
              {item.lines.map((line, i) => (
                <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-2">{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-lg px-8 py-6 text-base"
          >
            <a href="/strategy-call">
              Schedule Your Strategy Call
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
