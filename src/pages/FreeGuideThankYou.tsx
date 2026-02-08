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
            
            {/* Confirmation Card */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-wellness-forest" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-3">
                You're In!
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Check your email for the guide. If you don't see it within a few minutes, please check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
