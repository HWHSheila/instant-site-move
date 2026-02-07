import { useState, FormEvent } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function FreeGuide() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to Systeme.io via fetch
      const formData = new FormData();
      formData.append("email", email);
      formData.append("surname", "");

      await fetch("https://systeme.io/embedded/37722709/subscription", {
        method: "POST",
        body: formData,
        mode: "no-cors", // Required for cross-origin form submission
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Still show success since no-cors doesn't return status
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Free Gut Repair Guide" 
        description="Download the free Gut Repair Guide and learn how to support gut healing, metabolism, and hormones with a simple step-by-step roadmap."
      />
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            {/* Section Label */}
            <p className="section-label mb-4">Free Resource</p>
            
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              Download the Free Gut Repair Guide
            </h1>
            
            {/* Supporting Text */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
              Learn how to support gut healing, metabolism, and hormones with a simple step-by-step roadmap.
            </p>
            
            {/* Form or Confirmation */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base rounded-full px-6 border-border bg-card focus:border-wellness-forest focus:ring-wellness-forest"
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-8 py-6 text-base h-14"
                >
                  {isSubmitting ? "Sending..." : "Get the Free Guide"}
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Your privacy is important. We'll never share your email.
                </p>
              </form>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-8 md:p-10">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-wellness-forest" />
                </div>
                <h2 className="text-2xl font-display font-medium text-foreground mb-3">
                  You're In!
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Check your email for the guide. If you don't see it within a few minutes, please check your spam folder.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
