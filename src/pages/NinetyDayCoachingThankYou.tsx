import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function NinetyDayCoachingThankYou() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Welcome — 90-Day Root Cause Coaching"
        description="Your onboarding email is on its way. Check your inbox."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-4">90-Day Root Cause Coaching</p>

            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-wellness-forest" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              You're In — Welcome to the Deeper Support Package
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Your onboarding email is on its way. If you don't see it within a few minutes, check your spam or promotions folder.
            </p>

            <p className="text-base text-muted-foreground italic">
              I'm looking forward to working with you.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
