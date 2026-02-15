import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function ThankYouRoadmap() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="You're In! - 30 Day Gut Reset Roadmap" 
        description="Your 30-Day Gut Reset Roadmap is on the way. Check your inbox."
      />
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-4">30 Day Gut Reset Roadmap</p>
            
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-wellness-forest" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              You're In… Your Roadmap Is On The Way
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Check your inbox in the next few minutes. If you don't see it, check spam.
            </p>
            
            <a
              href="https://gutroadmap-herwellnessharmony.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-8 py-4 text-base h-14 leading-[1.75rem] transition-colors"
            >
              Access Your Roadmap Now
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
