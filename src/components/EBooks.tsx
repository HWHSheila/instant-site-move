import { Button } from "@/components/ui/button";
// Image imports for ebooks
import ebookGutReset from "@/assets/ebook-gut-reset.png";
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
    <div className={`card-wellness overflow-hidden flex flex-col h-full ${comingSoon ? 'opacity-70' : ''}`}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover ${comingSoon ? 'grayscale-[30%]' : ''}`}
        />
        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-wellness-forest/40">
            <span className="bg-wellness-gold text-wellness-forest-dark text-lg font-display font-semibold px-6 py-3 rounded-full shadow-lg">
              Launching Soon
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`text-xl font-display font-medium mb-3 ${comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</h3>
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
