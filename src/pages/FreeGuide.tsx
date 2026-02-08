import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function FreeGuide() {
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
            
            {/* Raw HTML Form - Direct Systeme.io Submission */}
            <form 
              method="post" 
              action="https://systeme.io/embedded/37722709/subscription"
              className="space-y-4"
            >
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="Enter your email address"
                className="w-full h-14 text-base rounded-full px-6 border border-border bg-card focus:border-wellness-forest focus:ring-wellness-forest focus:outline-none focus:ring-2"
              />
              
              <button 
                type="submit"
                className="w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-8 py-4 text-base h-14 transition-colors"
              >
                Get the FREE Guide
              </button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Your privacy is important. We'll never share your email.
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
