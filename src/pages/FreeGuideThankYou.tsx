import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function FreeGuideThankYou() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="You're In! - Free Gut Repair Guide" 
        description="Thank you for requesting the Free Gut Repair Guide. Check your email for the download link."
      />
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            {/* Section Label */}
            <p className="section-label mb-4">Free Resource</p>
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-wellness-forest" />
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              You're In!
            </h1>
            
            {/* Supporting Text */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Check your email for the Free Gut Repair Guide. If you don't see it within a few minutes, please check your spam or promotions folder.
            </p>
            
            {/* Additional Info */}
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
