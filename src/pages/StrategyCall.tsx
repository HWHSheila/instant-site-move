import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const StrategyCall = () => {
  return (
    <div className="min-h-screen" style={{ background: "#F4EFE8" }}>
      <SEO
        title="Initial Root Cause Strategy Call | Her Wellness Harmony"
        description="A focused 15-minute conversation to clarify your primary symptom patterns and determine your next step."
      />
      <Header />

      {/* Section 1 — Header */}
      <section style={{ background: "#1F3A2E" }} className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-4" style={{ color: "#F4EFE8" }}>
            Initial Root Cause Strategy Call
          </h1>
          <p className="text-lg md:text-xl leading-relaxed" style={{ color: "rgba(244, 239, 232, 0.85)" }}>
            A focused 15-minute conversation to clarify your primary symptom patterns and determine your next step.
          </p>
        </div>
      </section>

      {/* Section 2 — What This Call Is */}
      <section className="py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-6" style={{ color: "#1F3A2E" }}>
            What This Call Is
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed" style={{ color: "#2F2F2F" }}>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              A structured 15-minute clarity session
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              Focused on identifying your primary symptom cluster
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              Designed to determine whether the roadmap, consultation, or coaching is the right next step
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              For women who feel something is off but are unsure where to begin
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3 — What This Call Is Not */}
      <section className="py-14 md:py-18" style={{ background: "#EDE8DF" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-6" style={{ color: "#1F3A2E" }}>
            What This Call Is Not
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed mb-6" style={{ color: "#2F2F2F" }}>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              This is not a full protocol session
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              No supplement prescriptions
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              No deep lab review
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              No custom treatment plan
            </li>
          </ul>
          <p className="text-base md:text-lg italic" style={{ color: "#2F2F2F" }}>
            This is a focused starting point, not a comprehensive consultation.
          </p>
        </div>
      </section>

      {/* Section 4 — What We'll Cover */}
      <section className="py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-6" style={{ color: "#1F3A2E" }}>
            What We'll Cover
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed" style={{ color: "#2F2F2F" }}>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              Your top 1–2 symptom patterns
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              Where you may be in the gut → metabolism → hormone sequence
            </li>
            <li className="flex items-start gap-3">
              <span style={{ color: "#9CAF88" }} className="mt-1.5 text-lg leading-none">•</span>
              The most appropriate next level of support
            </li>
          </ul>
        </div>
      </section>

      {/* Section 5 — CTA */}
      <section className="py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="https://calendly.com/herwellnessharmony-support/initial-root-cause-strategy-session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-10 py-4 text-base font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#C9A646", color: "#1F3A2E" }}
          >
            Schedule Your Strategy Call
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategyCall;
