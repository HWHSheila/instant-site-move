import { Button } from "@/components/ui/button";
import { Droplets, Brain, Heart, Smile, Zap, Moon, Flame, Wind } from "lucide-react";
import essentialOilsImg from "@/assets/essential-oils-display.jpg";

const supportItems = [
  { icon: Droplets, label: "Support gut motility and digestive function" },
  { icon: Brain, label: "Promote nervous system calm and stress regulation" },
  { icon: Heart, label: "Support hormone and endocrine system balance" },
  { icon: Smile, label: "Enhance emotional wellness and mood regulation" },
  { icon: Wind, label: "Move stagnant energy along TCM meridians" },
  { icon: Zap, label: "Support metabolic and mitochondrial function" },
  { icon: Moon, label: "Promote restful sleep and circadian rhythm support" },
  { icon: Flame, label: "Reduce inflammation signals in the body" },
];

function handleExternalLink(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
  e.preventDefault();
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function EssentialOils() {
  return (
    <section id="essential-oils" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        {/* Main intro */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Essential Oils</p>
          <h2 className="section-title mb-2">What Are Essential Oils?</h2>
          <p className="text-xl text-muted-foreground font-display">And how can they support your journey?</p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essential oils are highly concentrated aromatic compounds extracted from plants. They have been used across cultures for centuries for their biochemical, energetic, and therapeutic properties. As someone with a chemistry background, I approach essential oils very differently than most... I understand their molecular composition, how they interact with the body's systems, and how to apply them strategically based on the body's biochemical needs, organ clock patterns, and TCM meridian alignment.
          </p>
        </div>

        {/* Ways essential oils can support */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-display font-medium text-foreground text-center mb-8">
            Ways Essential Oils Can Support Your Journey
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {supportItems.map(({ icon: Icon, label }) => (
              <div key={label} className="card-wellness p-5 flex items-start gap-3">
                <Icon className="w-6 h-6 text-wellness-forest flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not a shortcut */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-display font-medium text-foreground text-center mb-6">
            Essential Oils as a Support Tool... Not a Shortcut
          </h3>
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Think of addressing root causes through nutrition, lifestyle, and wellness education as your journey from New York to California. You will get there either way. But essential oils are the difference between walking and flying... they are a biochemical support tool that helps your body shift more effectively and with less struggle. They are not the destination. They are the vehicle that helps you arrive with less wear and tear along the way.</p>
            <p>I do not use oils as a replacement for root-cause work. I use them as an intelligent, strategic layer within it.</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-16" />

        {/* dōTERRA section */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">The dōTERRA Difference</p>
          <h2 className="section-title">Not All Essential Oils Are Created Equal</h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Left: text */}
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Quality and purity matter... especially when you are using oils as a biochemical support tool within a root-cause wellness approach.</p>
            <p>I exclusively use and recommend dōTERRA essential oils because they meet my specific standards as someone who understands essential oil chemistry. dōTERRA sources their oils directly from the native habitats of each plant, working closely with farmers across more than 40 countries... two-thirds of which are developing nations... to ensure purity, potency, and ethical harvesting practices.</p>
            <p>Every batch is tested through dōTERRA's CPTG (Certified Pure Tested Grade) process... a rigorous multi-stage third-party testing standard that ensures each oil is free from fillers, contaminants, and synthetic additives.</p>
            <p>When you purchase dōTERRA oils through Her Wellness Harmony, you are not just investing in a product. You are investing in quality that your body can actually use... and supporting farmers and communities around the world.</p>
            <Button
              asChild
              size="lg"
              className="bg-wellness-gold hover:bg-wellness-gold-light text-wellness-forest-dark font-semibold rounded-full px-8 py-6 text-base mt-4"
            >
              <a
                href="https://www.doterra.com/US/en/site/herwellnessharmony"
                onClick={(e) => handleExternalLink(e, "https://www.doterra.com/US/en/site/herwellnessharmony")}
              >
                Order or Book a Call
              </a>
            </Button>
          </div>

          {/* Right: image */}
          <div>
            <img
              src={essentialOilsImg}
              alt="Essential oil amber glass dropper bottles with botanical elements"
              className="rounded-2xl shadow-md w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
