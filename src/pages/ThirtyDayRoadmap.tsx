import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import gutRoadmapCover from "@/assets/gut-roadmap-phase1.png";

export default function ThirtyDayRoadmap() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4EFEA" }}>
      <SEO
        title="30-Day Gut Reset Roadmap"
        description="Get the 30-Day Gut Reset Roadmap — a structured reset to calm digestion, stabilize metabolism, and reduce hormone-driven symptoms."
        
      />
      <Header />

      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-3xl mx-auto">
            {/* Product card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Image */}
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{
                  background: "#D8CFC4",
                  paddingTop: "48px",
                  paddingBottom: "48px",
                }}
              >
                <img
                  src={gutRoadmapCover}
                  alt="30-Day Gut Reset Roadmap Cover"
                  className="object-contain rounded shadow-lg"
                  style={{ maxHeight: "520px" }}
                />
              </div>

              {/* Details */}
              <div className="p-10 md:p-14">
                <p
                  className="text-xs font-semibold tracking-[0.15em] uppercase mb-2"
                  style={{ color: "#8FA89E" }}
                >
                  Digital Guide
                </p>
                <h1
                  className="text-2xl md:text-4xl font-display font-medium mb-5 leading-snug"
                  style={{ color: "#4B2E39" }}
                >
                  30-Day Gut Reset Roadmap — $37
                </h1>

                <p
                  className="text-base md:text-lg leading-relaxed mb-7"
                  style={{ color: "#555555" }}
                >
                  A structured, step-by-step reset designed to calm digestion, stabilize
                  metabolism, and reduce hormone-driven symptoms without restriction, extremes,
                  or burnout.
                </p>

                <h2
                  className="text-sm font-semibold tracking-[0.1em] uppercase mb-3"
                  style={{ color: "#4B2E39" }}
                >
                  What's Included
                </h2>
                <ul
                  className="list-disc list-inside text-base md:text-lg leading-relaxed mb-10 space-y-2"
                  style={{ color: "#555555" }}
                >
                  <li>A full 30-day structured gut reset protocol</li>
                  <li>Weekly phase breakdowns with clear action steps</li>
                  <li>Guidance on calming inflammation and supporting digestion</li>
                  <li>Strategies for stabilizing blood sugar and metabolism</li>
                  <li>Hormone-friendly nutrition and lifestyle shifts</li>
                </ul>

                {/* CTA */}
                <a
                  href="https://buy.stripe.com/8x2dRa3mOaE43Xm4Ft38408"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-semibold rounded-full px-8 py-4 text-base md:text-lg transition-colors"
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
