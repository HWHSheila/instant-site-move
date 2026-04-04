import { Button } from "@/components/ui/button";
import { Star, FileText, RefreshCw, Pill, Clock, Calendar } from "lucide-react";

interface ServiceItemProps {
  icon: React.ElementType;
  title: string;
  detail: string;
  bookingLink: string;
}

function ServiceItem({ icon: Icon, title, detail, bookingLink }: ServiceItemProps) {
  return (
    <div className="flex gap-5 p-6 bg-card rounded-xl border border-border">
      <div className="flex-shrink-0 mt-1">
        <Icon className="w-8 h-8 text-muted-foreground/60" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-display font-medium text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">{detail}</p>
        <Button
          asChild
          className="bg-wellness-sage/50 hover:bg-wellness-sage/70 text-foreground rounded-lg px-6"
        >
          <a href={bookingLink}>Book Now</a>
        </Button>
      </div>
    </div>
  );
}

const services: ServiceItemProps[] = [
  {
    icon: Star,
    title: "Integrative Wellness Consultation — $175",
    detail: "60 min · Best place to start. Explore symptoms, gut patterns, stress load, and hormone clues. Walk away with 3–5 simple, personalized steps.",
    bookingLink: "/wellness-consultation",
  },
  {
    icon: FileText,
    title: "Educational Lab Result Review — $125",
    detail: "Written report · Understand your labs without fear. Get clear explanations, overlooked patterns, and better questions for your provider.",
    bookingLink: "/lab-review",
  },
  {
    icon: RefreshCw,
    title: "Follow-Up Wellness Session — $99",
    detail: "45 min · For returning clients. Review progress, adjust supplements, food rhythm, and inflammation triggers.",
    bookingLink: "/follow-up-session",
  },
  {
    icon: Pill,
    title: "Gut Support & Supplement Review — $150",
    detail: "45 min · Simplify an overwhelming supplement routine with a clear, gut-friendly plan.",
    bookingLink: "/supplement-review",
  },
  {
    icon: Clock,
    title: "Morning + Night Routine Blueprint — $125",
    detail: "60 min · Build A.M./P.M. routines supporting gut motility, cortisol rhythm, hydration, blood sugar, and circadian alignment.",
    bookingLink: "/routine-blueprint",
  },
  {
    icon: Calendar,
    title: "4-Week Gut & Hormone Wellness Program — $1,000",
    detail: "4 weeks · Deep support with weekly sessions, personalized plans, and ongoing accountability for root-cause healing.",
    bookingLink: "/4-week-coaching",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="mb-10">
          <p className="section-label mb-3">Services</p>
          <h2 className="section-title mb-4">Personalized Wellness Education for Your Healing Path</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Root-cause guidance designed to help women feel better in their bodies — without extremes, fear-based restrictions, or confusing protocols.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {services.map((service) => (
            <ServiceItem key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
