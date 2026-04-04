import { Button } from "@/components/ui/button";
import ebookGutReset from "@/assets/ebook-gut-reset-cover.jpg";
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
    <div className="flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {comingSoon && (
        <span className="inline-block self-start text-xs font-semibold tracking-widest uppercase bg-muted text-muted-foreground px-3 py-1 rounded-md border border-border mb-2">
          Coming Soon
        </span>
      )}

      <h3 className="text-xl font-display font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">{description}</p>

      {ctaLink && !comingSoon && (
        <Button
          asChild
          className="self-start bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground rounded-lg px-6"
        >
          <a href={ctaLink} target="_blank" rel="noopener noreferrer">
            {ctaText}
          </a>
        </Button>
      )}
    </div>
  );
}

const ebooks: EBookCardProps[] = [
  {
    image: ebookGutReset,
    title: "30-Day Gut Reset Roadmap — $37",
    description: "A structured reset to calm digestion, stabilize metabolism, and reduce hormone-driven symptoms — without restriction or burnout.",
    ctaText: "Get Your Copy",
    ctaLink: "https://buy.stripe.com/8x2dRa3mOaE43Xm4Ft38408",
  },
  {
    image: ebookGlp1,
    title: "Understanding GLP-1 Signaling — Launching Soon",
    description: "Learn how gut health, blood sugar, and metabolic stress influence GLP-1 signaling, appetite, and weight response — and how to strengthen it naturally.",
    ctaText: "Coming Soon",
    comingSoon: true,
  },
  {
    image: ebookGutEnvironment,
    title: "Restoring the Gut Environment — Launching Soon",
    description: "A comprehensive guide to rebuilding your gut microbiome, reducing inflammation, and creating an environment where healing can truly happen.",
    ctaText: "Coming Soon",
    comingSoon: true,
  },
];

export function EBooks() {
  return (
    <section id="ebooks" className="py-20 md:py-28 bg-background">
      <div className="container-wellness">
        <div className="mb-10">
          <p className="section-label mb-3">Resources</p>
          <h2 className="section-title">E-Books & Guides</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {ebooks.map((ebook) => (
            <EBookCard key={ebook.title} {...ebook} />
          ))}
        </div>
      </div>
    </section>
  );
}
