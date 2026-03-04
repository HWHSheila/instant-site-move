import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function StrategyIntakeThankYou() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Intake Received | Her Wellness Harmony"
        description="Your strategy call intake form has been received."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-4">Strategy Call Intake</p>

            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-wellness-forest" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              Thank You… Your Intake Form Has Been Received
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              I will review it prior to your call so we can make the most of our time together.
            </p>

            <a
              href="/"
              className="inline-block w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-8 py-4 text-base h-14 leading-[1.75rem] transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
