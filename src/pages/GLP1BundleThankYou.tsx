import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle } from "lucide-react";

export default function GLP1BundleThankYou() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4EFEA" }}>
      <SEO
        title="Your GLP-1 Bundle Is On Its Way"
        description="Check your inbox for access to the GLP-1 Signaling Guide and 30-Day Gut Reset Roadmap Bundle."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#8FA89E" }}>
              GLP-1 Bundle
            </p>

            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20" style={{ color: "#8FA89E" }} />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6 leading-tight" style={{ color: "#4B2E39" }}>
              Your GLP-1 Guide and 30-Day Gut Reset Roadmap Bundle Is On Its Way
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: "#333333" }}>
              Check your inbox for access to the download link. If you do not see it, check spam or promotions.
            </p>

            <a
              href="/"
              className="inline-block font-semibold rounded-full px-8 py-4 text-base h-14 leading-[1.75rem] transition-colors"
              style={{
                background: "#8FA89E",
                color: "#FFFFFF",
              }}
            >
              Explore more at herwellnessharmony.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
