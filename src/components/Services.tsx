import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  price: string;
  priceLabel: string;
  title: string;
  duration: string;
  description: string;
  bookingLink: string;
}

function ServiceCard({ price, priceLabel, title, duration, description, bookingLink }: ServiceCardProps) {
  return (
    <div className="card-wellness p-6 flex flex-col h-full">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">{priceLabel}</span>
        <span className="text-2xl font-display font-semibold text-accent ml-2">${price}</span>
      </div>
      
      <h3 className="text-xl font-display font-medium text-foreground mb-2">{title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4">{duration}</p>
      
      <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">{description}</p>
      
      <Button
        asChild
        className="w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full"
      >
        <a href={bookingLink} target="_blank" rel="noopener noreferrer">
          Book Now
        </a>
      </Button>
    </div>
  );
}

const services: ServiceCardProps[] = [
  {
    price: "175",
    priceLabel: "Initial Session",
    title: "Integrative Wellness Consultation",
    duration: "60 minutes",
    description: "The best place to start. We'll explore your symptoms, gut patterns, stress load, hormone clues, and build a personalized plan with 3–5 simple steps you can begin immediately.",
    bookingLink: "https://buy.stripe.com/7sYdRaf5wbI89hG2xl38400",
  },
  {
    price: "125",
    priceLabel: "48-Hour Turnaround",
    title: "Educational Lab Result Review",
    duration: "Written Report",
    description: "Understand what your lab results actually mean — without fear-based interpretations. Get clear explanations, common overlooked patterns, and better questions to bring to your provider.",
    bookingLink: "https://buy.stripe.com/bJecN62iKfYo51qdbZ38407",
  },
  {
    price: "99",
    priceLabel: "Returning Clients",
    title: "Follow-Up Coaching Session",
    duration: "45 minutes",
    description: "Continued support, guidance, and accountability. We'll review what's improving, what's shifting, and adjust supplements, food rhythm, and inflammation triggers.",
    bookingLink: "https://buy.stripe.com/aFa00k8H8cMc51q1th38401",
  },
  {
    price: "150",
    priceLabel: "Clarity Session",
    title: "Gut Support & Supplement Review",
    duration: "45 minutes",
    description: "If your supplement routine feels overwhelming, this session brings clarity. We'll simplify your routine with a clear, gut-friendly supplement plan.",
    bookingLink: "https://buy.stripe.com/aFaeVe7D4h2sbpOb3R38402",
  },
  {
    price: "125",
    priceLabel: "Personalized Rhythms",
    title: "Morning + Night Routine Blueprint",
    duration: "60 minutes",
    description: "Together we build supportive A.M. and P.M. routines — supporting gut motility, cortisol rhythm, hydration, blood sugar, and circadian alignment.",
    bookingLink: "https://buy.stripe.com/9B600kaPgcMc2Ti5Jx38403",
  },
  {
    price: "647",
    priceLabel: "Deep Support Package",
    title: "4-Week Gut & Hormone Coaching",
    duration: "4 Weeks",
    description: "A comprehensive package for women ready to commit to deeper root-cause healing with weekly sessions, personalized plans, and ongoing support.",
    bookingLink: "https://buy.stripe.com/7sYdRaf5wbI89hG2xl38400",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-muted">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Services</p>
          <h2 className="section-title mb-4">Personalized Coaching for Your Healing Path</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Root-cause guidance designed to help women feel better in their bodies — without extremes, fear-based restrictions, or confusing protocols.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
