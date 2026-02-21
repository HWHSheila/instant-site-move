import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import glp1Cover from "@/assets/glp1-signaling-thumbnail.png";
import gutRoadmapCover from "@/assets/gut-roadmap-thumbnail.png";

export default function GLP1Option() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4EFEA" }}>
      <SEO
        title="Get Your GLP-1 Guide"
        description="Choose the Understanding GLP-1 Signaling ebook on its own, or bundle it with the 30-Day Gut Reset Roadmap."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#8FA89E" }}>
              Choose Your Option
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-4 leading-tight" style={{ color: "#4B2E39" }}>
              Get Your GLP-1 Signaling Guide
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "#333333" }}>
              Select the option that's right for you below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option 1: GLP-1 Guide Only */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="flex items-center justify-center overflow-hidden" style={{ background: "#D8CFC4", aspectRatio: "3/4" }}>
                <img
                  src={glp1Cover}
                  alt="Understanding GLP-1 Signaling Ebook Cover"
                  className="object-contain"
                  style={{ maxHeight: "85%" }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#8FA89E" }}>
                  Single Guide
                </p>
                <h2 className="text-xl font-display font-medium mb-3 leading-snug" style={{ color: "#4B2E39" }}>
                  Understanding GLP-1 Signaling
                </h2>
                <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: "#555555" }}>
                  Learn how gut health, blood sugar regulation, and metabolic stress influence GLP-1 signaling, appetite, and weight response, and how to strengthen it naturally. Includes the 90-Day GLP-1 Optimization Protocol.
                </p>
                <a
                  href="https://buy.stripe.com/28E14oaPgbI8alK4Ft38409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-semibold rounded-full px-8 py-4 text-base transition-colors"
                  style={{ background: "#8FA89E", color: "#FFFFFF" }}
                >
                  Get the Guide
                </a>
              </div>
            </div>

            {/* Option 2: Bundle */}
            <div className="rounded-2xl overflow-hidden shadow-md flex flex-col" style={{ background: "#4B2E39" }}>
              {/* Bundle image area — two covers layered diagonally */}
              <div className="relative overflow-hidden flex items-center justify-center" style={{ background: "#D8CFC4", aspectRatio: "3/4" }}>
                <div
                  className="absolute top-4 right-4 z-10 text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                  style={{ background: "#C9A96E", color: "#4B2E39" }}
                >
                  Best Value
                </div>
                {/* Back cover — GLP-1, rotated left */}
                <img
                  src={glp1Cover}
                  alt="Understanding GLP-1 Signaling Ebook"
                  className="absolute rounded shadow-lg"
                  style={{
                    width: "50%",
                    transform: "rotate(-7deg) translateX(-42%)",
                    zIndex: 1,
                  }}
                />
                {/* Front cover — Gut Roadmap, rotated right */}
                <img
                  src={gutRoadmapCover}
                  alt="30-Day Gut Reset Roadmap Ebook"
                  className="absolute rounded shadow-xl"
                  style={{
                    width: "50%",
                    transform: "rotate(6deg) translateX(42%)",
                    zIndex: 2,
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#C9A96E" }}>
                  Bundle
                </p>
                <h2 className="text-xl font-display font-medium mb-3 leading-snug" style={{ color: "#F4EFEA" }}>
                  GLP-1 Guide + 30-Day Gut Reset Roadmap
                </h2>
                <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: "#D9D1CB" }}>
                  The 30-Day Gut Reset Roadmap is Phase 1 of the 90-Day GLP-1 Optimization Protocol. Get both guides together and save 20% with the bundle package.
                </p>
                <a
                  href="https://buy.stripe.com/eVq00k4qS6nO9hG7RF3840a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-semibold rounded-full px-8 py-4 text-base transition-colors"
                  style={{ background: "#C9A96E", color: "#4B2E39" }}
                >
                  Get the Bundle
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
