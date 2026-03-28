import { Button } from "@/components/ui/button";
import sheilaPortrait from "@/assets/sheila-portrait.png";

const tags = [
  "Gut Repair",
  "Hormone Balance",
  "Metabolic Support",
  "Mitochondrial Resilience",
  "Nervous System Harmony",
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-3">About Her Wellness Harmony</p>
          <h2 className="section-title">Where Science Meets Lived Experience</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Two-column opener: text left, photo right */}
          <div className="grid md:grid-cols-2 gap-10 items-start mb-12">
            <p className="text-lg text-foreground leading-relaxed">
              Her Wellness Harmony was born from one woman's unexpected detour into illness, burnout, and complete loss of control over her own body... and the fierce determination to take that power back. My name is <strong>Sheila McFarland</strong>. I am a wellness educator with over 20 years of scientific laboratory experience in root cause analysis, a chemistry degree, and a lived journey through metabolic crisis, gut dysfunction, and hormonal imbalance. I built this because I know what it feels like to be dismissed by a system focused only on surface-level numbers... while your body is screaming something deeper. I know what it feels like to have to figure it out yourself. And I know what it feels like when things finally start to shift. That is the experience I bring to every woman I work with.
            </p>
            <div className="flex justify-center md:justify-end">
              <img
                src={sheilaPortrait}
                alt="Sheila McFarland, founder of Her Wellness Harmony"
                className="w-72 md:w-80 h-72 md:h-[420px] object-cover object-[center_25%] rounded-2xl shadow-lg border-4 border-border"
              />
            </div>
          </div>

          {/* My Journey — full width */}
          <div className="card-wellness p-6 mb-6">
            <h3 className="text-xl font-display font-medium text-foreground mb-4">My Journey</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Before the crisis, I had already walked the road of metabolic dysfunction. I had been diagnosed with type 2 diabetes years earlier, and like many women, I became laser-focused on my blood sugar, A1C, and doing everything I could to stabilize my metabolism. I worked hard to bring my numbers back into a healthy range. It wasn't easy... but I did it. I felt strong, empowered, and finally in control of my health again.</p>
              <p>And then everything changed.</p>
              <p>In 2022, my blood sugar reached nearly 600. I was borderline diabetic coma. My body was in crisis... severe Candida overgrowth spreading through my organs and nervous system, rashes covering my body, exhaustion so deep I didn't know if I was going to pull out of it.</p>
              <p>I was told to focus on my A1C and blood sugar numbers. That was it. Not my insulin. Not my gut. Not my hormones.</p>
              <p>So I did. I changed my diet. My numbers improved. And because the system only looked at those numbers, I thought I was fine.</p>
              <p>I wasn't fine.</p>
              <p>The summer of 2025, I got a severe kidney infection. I was put on heavy antibiotics. And everything that had been quietly wrong became suddenly, unmistakably loud. My gut... which had been struggling all along... collapsed. And when my gut collapsed, my metabolism and hormones followed.</p>
              <p>I went back to my doctors. I described the symptoms I was developing as side effects to the medications I had been given. I was dismissed. I was gaslit. I was told my symptoms had nothing to do with what they had prescribed.</p>
              <p>I had to figure it out myself.</p>
              <p>So I did what I had spent over 20 years doing in a science laboratory... I applied root cause analysis. Not to a sample. To my own body.</p>
              <p>I stopped chasing symptoms and started rebuilding foundations. Little by little, my energy shifted. My gut started calming. My hormones began responding. My metabolism started moving again. I have lost 105 pounds. And I am still on this journey... because when you address the root cause, it takes longer than silencing a symptom. But it actually works.</p>
              <p>Four months ago, I realized I was not the only woman going through this. The woman I was four or five years ago... dismissed, confused, told her numbers look fine while her body says otherwise... is everywhere. That is who I built this for.</p>
            </div>
          </div>

          {/* My Philosophy — full width */}
          <div className="card-wellness p-6 mb-10">
            <h3 className="text-xl font-display font-medium text-foreground mb-4">My Philosophy</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Healing doesn't happen through force. It happens through gentleness, rhythm, safety, soft structure, daily alignment, nervous system calm, and honoring your body's timing.</p>
              <p>I help women rebuild from the inside out by focusing on:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Gut repair</li>
                <li>Hormone balance</li>
                <li>Metabolic support</li>
                <li>Mitochondrial resilience</li>
                <li>Nervous system harmony</li>
              </ul>
              <p>No overwhelm. No shame. No perfectionism. Just real support, simple shifts, and clarity that finally makes sense.</p>
              <p className="italic text-sm">All information I share is for educational purposes only and is not medical advice. I am a wellness educator, not a licensed medical practitioner. Please always consult your qualified medical provider before making changes to your health.</p>
            </div>
          </div>

          {/* Where Science Meets Lived Experience */}
          <div className="mb-10">
            <h3 className="text-2xl font-display font-medium text-foreground mb-4 text-center">Where Science Meets Lived Experience</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4 max-w-3xl mx-auto">
              <p>Her Wellness Harmony was created from the intersection of my scientific background, my functional wellness education, my understanding of essential oil chemistry, and my own lived healing experience.</p>
              <p>I blend:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Evidence-based strategies</li>
                <li>Functional lifestyle shifts</li>
                <li>Gut and metabolism support</li>
                <li>Hormone-friendly routines</li>
                <li>Energetics from Traditional Chinese Medicine (TCM)</li>
                <li>Essential oils strategically applied based on their biochemical properties and alignment with organ systems</li>
                <li>Organ clock patterns</li>
                <li>Nervous system regulation</li>
                <li>Simple, sustainable habits</li>
              </ul>
              <p>...because true healing isn't one-dimensional. It's biochemical + energetic + emotional + metabolic. It's the whole woman.</p>
            </div>
          </div>

          {/* Who I Serve */}
          <div className="mb-10">
            <h3 className="text-2xl font-display font-medium text-foreground mb-4 text-center">Who I Serve</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4 max-w-3xl mx-auto">
              <p>Her Wellness Harmony is for women who:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Feel lost in their symptoms</li>
                <li>Know something deeper is going on</li>
                <li>Are done with quick fixes</li>
                <li>Crave root-cause answers</li>
                <li>Want to feel safe in their own body again</li>
                <li>Want a guide who gets it... not just academically, but personally</li>
              </ul>
              <p>If that's you, you're in the right place.</p>
            </div>
          </div>

          {/* My Mission */}
          <div className="mb-10">
            <h3 className="text-2xl font-display font-medium text-foreground mb-4 text-center">My Mission</h3>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              To empower women to understand their bodies, restore their energy, support their gut and hormones, and experience true healing... without pressure, confusion, or complexity. Because when a woman heals at the root, everything in her life transforms.
            </p>
          </div>

          {/* My Background */}
          <div className="mb-10">
            <h3 className="text-2xl font-display font-medium text-foreground mb-4 text-center">My Background</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4 max-w-3xl mx-auto">
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Bachelor of Science in Chemistry</li>
                <li>20+ years of professional laboratory experience specializing in root cause analysis</li>
                <li>Currently pursuing FM-CP (Functional Medicine Certified Practitioner) certification</li>
                <li>Trained in essential oil chemistry and application</li>
                <li>Personal lived experience navigating metabolic crisis, gut dysfunction, hormonal imbalance, and recovery through root-cause principles</li>
              </ul>
              <p className="italic text-sm">All content provided by Her Wellness Harmony is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Please consult your qualified medical provider before making any changes to your health regimen.</p>
            </div>
          </div>

          {/* Static Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map((tag) => (
              <span key={tag} className="badge-wellness">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkingWith() {
  const attributes = [
    "Non-judgmental",
    "Science-informed",
    "Nervous-system aware",
    "Gut-first approach",
    "Hormone-friendly",
    "Root-cause focused",
    "TCM Energetics",
  ];

  return (
    <section className="py-20 md:py-28 bg-wellness-forest">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label text-wellness-gold mb-3">What It's Like</p>
          <h2 className="section-title text-primary-foreground">Working With Sheila</h2>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="text-lg text-primary-foreground/90 leading-relaxed mb-8 space-y-4 text-left">
            <p>I know what it feels like to sit in a doctor's office and be told your numbers look fine... while your body is telling you something completely different. I know what it feels like to be dismissed. To spend years focused on the wrong numbers while the real problem went unaddressed.</p>
            <p>I spent over 20 years in a science laboratory doing root cause analysis. When the medical system stopped looking, I turned that same methodology on myself. And it changed everything.</p>
            <p>My approach is unique because of four things working together: my chemistry and root cause analysis background, my understanding of essential oil chemistry and how oils interact with the body at a biochemical level, my functional medicine education, and my own lived healing experience. Most educators have one or two of these. I bring all four.</p>
            <p>I am not here to replace your doctor. I am here to help you understand your body in a way that makes your conversations with your doctor more informed, more specific, and more productive.</p>
            <p>If you are a woman who has been told everything looks fine... but you know it doesn't feel fine... you are exactly who this is for.</p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-8 py-6 text-base mb-12"
          >
            <a href="https://www.herwellnessharmony.com/strategy-call">
              Schedule Your Strategy Call
            </a>
          </Button>

          {/* Static tags — no animation */}
          <div className="flex flex-wrap justify-center gap-3">
            {attributes.map((attr) => (
              <span
                key={attr}
                className="inline-flex items-center px-6 py-2 rounded-full border border-primary-foreground/30 text-primary-foreground/90 text-sm"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
