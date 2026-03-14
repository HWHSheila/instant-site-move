import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import gutRoadmapCover from "@/assets/gut-roadmap-phase1.png";

export default function Phase1GutReset() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4EFEA" }}>
      <SEO
        title="Complete Phase 1 of Your 90-Day Protocol"
        description="Get the 30-Day Gut Reset Roadmap — Phase 1 of the 90-Day GLP-1 Optimization Protocol. A structured reset to calm digestion, stabilize metabolism, and reduce hormone-driven symptoms."
        
      />
      <Header />

      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <div className="text-center mb-12">
              <p
                className="text-sm font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#8FA89E" }}
              >
                Phase 1 — 90-Day GLP-1 Optimization Protocol
              </p>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-4 leading-tight"
                style={{ color: "#4B2E39" }}
              >
                You Have the Guide — Now Start Phase&nbsp;1
              </h1>
              <p
                className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: "#333333" }}
              >
                The 30-Day Gut Reset Roadmap is the structured first phase of the 90-Day GLP-1
                Optimization Protocol included in your guide.
              </p>
            </div>

            {/* Product card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm max-w-2xl mx-auto">
              {/* Image */}
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{
                  background: "#D8CFC4",
                  paddingTop: "40px",
                  paddingBottom: "40px",
                }}
              >
                <img
                  src={gutRoadmapCover}
                  alt="30-Day Gut Reset Roadmap Cover"
                  className="object-contain rounded shadow-lg"
                  style={{ maxHeight: "420px" }}
                />
              </div>

              {/* Details */}
              <div className="p-8 md:p-10">
                <p
                  className="text-xs font-semibold tracking-[0.15em] uppercase mb-2"
                  style={{ color: "#8FA89E" }}
                >
                  Digital Guide
                </p>
                <h2
                  className="text-2xl md:text-3xl font-display font-medium mb-4 leading-snug"
                  style={{ color: "#4B2E39" }}
                >
                  30-Day Gut Reset Roadmap — $37
                </h2>

                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "#555555" }}
                >
                  A structured, step-by-step reset designed to calm digestion, stabilize
                  metabolism, and reduce hormone-driven symptoms without restriction, extremes,
                  or burnout.
                </p>

                <h3
                  className="text-sm font-semibold tracking-[0.1em] uppercase mb-3"
                  style={{ color: "#4B2E39" }}
                >
                  What's Included
                </h3>
                <ul
                  className="list-disc list-inside text-base leading-relaxed mb-8 space-y-1.5"
                  style={{ color: "#555555" }}
                >
                  <li>A full 30-day structured gut reset protocol</li>
                  <li>Weekly phase breakdowns with clear action steps</li>
                  <li>Guidance on calming inflammation and supporting digestion</li>
                  <li>Strategies for stabilizing blood sugar and metabolism</li>
                  <li>Hormone-friendly nutrition and lifestyle shifts</li>
                </ul>

                {/* Price + CTA */}
                <a
                  href="https://buy.stripe.com/8x2dRa3mOaE43Xm4Ft38408"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-semibold rounded-full px-8 py-4 text-base transition-colors"
                  style={{ background: "#8FA89E", color: "#FFFFFF" }}
                >
                  Get the Roadmap
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
