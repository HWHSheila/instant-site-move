import { Button } from "@/components/ui/button";
import ebookGutReset from "@/assets/ebook-gut-reset.jpg";
import ebookGlp1 from "@/assets/ebook-glp1.jpg";
import ebookGutEnvironment from "@/assets/ebook-gut-environment.jpg";

interface EBookCardProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  comingSoon?: boolean;
}

function EBookCard({ image, title, description, ctaText, ctaLink, comingSoon }: EBookCardProps) {
  return (
    <div className="card-wellness overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {comingSoon && (
          <div className="absolute top-4 right-4 bg-wellness-gold text-wellness-forest-dark text-xs font-semibold px-3 py-1 rounded-full">
            Launching Soon
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-display font-medium text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">{description}</p>
        
        {ctaLink && !comingSoon ? (
          <Button
            asChild
            className="w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-full"
          >
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              {ctaText}
            </a>
          </Button>
        ) : (
          <Button
            disabled
            className="w-full bg-muted text-muted-foreground rounded-full cursor-not-allowed"
          >
            {ctaText}
          </Button>
        )}
      </div>
    </div>
  );
}

const ebooks: EBookCardProps[] = [
  {
    image: ebookGutReset,
    title: "30-Day Gut Reset Roadmap",
    description: "A structured, step-by-step reset designed to calm digestion, stabilize metabolism, and reduce hormone-driven symptoms — without restriction, extremes, or burnout.",
    ctaText: "Get Your Copy",
    ctaLink: "https://buy.stripe.com/8x2dRa3mOaE43Xm4Ft38408",
  },
  {
    image: ebookGlp1,
    title: "Understanding GLP-1 Signaling",
    description: "Learn how gut health, blood sugar regulation, and metabolic stress influence GLP-1 signaling, appetite, and weight response — and how to strengthen it naturally.",
    ctaText: "Coming Soon",
    comingSoon: true,
  },
  {
    image: ebookGutEnvironment,
    title: "Restoring the Gut Environment",
    description: "A comprehensive guide to rebuilding your gut microbiome, reducing inflammation, and creating an environment where healing can truly happen.",
    ctaText: "Coming Soon",
    comingSoon: true,
  },
];

export function EBooks() {
  return (
    <section id="ebooks" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Resources</p>
          <h2 className="section-title">E-Books & Guides</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <EBookCard key={ebook.title} {...ebook} />
          ))}
        </div>
      </div>
    </section>
  );
}
