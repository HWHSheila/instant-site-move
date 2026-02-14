import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function ThankYouRoadmap() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="You're In! - 30 Day Gut Reset Roadmap" 
        description="Thank you for requesting the 30-Day Gut Reset Roadmap. Check your email for the download link."
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
              You're In!
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Check your email for the 30-Day Gut Reset Roadmap. If you don't see it within a few minutes, please check your spam or promotions folder.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Questions? Reach out anytime — we're here to help.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
