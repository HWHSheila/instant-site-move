import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";

const palette = {
  page: "#F4EFEA",
  ink: "#4B2E39",
  text: "#333333",
  muted: "#66615D",
  sage: "#8FA89E",
  cream: "#FBF7F2",
  border: "#E8DDD3",
  gold: "#C9A646",
};

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: palette.page }}>
      <Header />
      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-24">{children}</main>
      <Footer />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: palette.sage }}>
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex w-full sm:w-auto justify-center items-center rounded-full px-8 py-4 text-base font-semibold transition-colors"
      style={{ background: palette.sage, color: "#FFFFFF" }}
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex w-full sm:w-auto justify-center items-center rounded-full px-8 py-4 text-base font-semibold border transition-colors"
      style={{ borderColor: palette.border, color: palette.ink, background: "#FFFFFF" }}
    >
      {children}
    </a>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-base md:text-lg leading-relaxed" style={{ color: palette.text }}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: palette.gold }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OptInPage({
  title,
  description,
  eyebrow,
  buttonLabel,
  redirectTo,
  tagName,
  seoTitle,
}: {
  title: string;
  description: string;
  eyebrow: string;
  buttonLabel: string;
  redirectTo: string;
  tagName: string;
  seoTitle: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("systeme-subscribe", {
        body: { email, tagName },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      navigate(redirectTo);
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <SEO title={seoTitle} description={description} noindex />
      <section className="container-wellness">
        <div className="max-w-xl mx-auto text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight mb-6" style={{ color: palette.ink }}>
            {title}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: palette.text }}>
            {description}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full h-14 text-base rounded-full px-6 border focus:outline-none focus:ring-2"
              style={{ borderColor: palette.border, background: "#FFFFFF", color: palette.text }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-full px-8 py-4 text-base h-14 transition-colors disabled:opacity-50"
              style={{ background: palette.sage, color: "#FFFFFF" }}
            >
              {loading ? "Sending..." : buttonLabel}
            </button>
            <p className="text-sm pt-2" style={{ color: palette.sage }}>
              Your privacy is important. We will never share your email.
            </p>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function ThankYouPage({ title, description, eyebrow, seoTitle }: { title: string; description: string; eyebrow: string; seoTitle: string }) {
  return (
    <PageShell>
      <SEO title={seoTitle} description={description} noindex />
      <section className="container-wellness">
        <div className="max-w-xl mx-auto text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20" style={{ color: palette.sage }} />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight mb-6" style={{ color: palette.ink }}>
            {title}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: palette.text }}>
            {description}
          </p>
          <PrimaryButton href="/">Return Home</PrimaryButton>
        </div>
      </section>
    </PageShell>
  );
}

export function GLP1Ebook() {
  return (
    <PageShell>
      <SEO
        title="Understanding GLP-1 Signaling Ebook"
        description="Learn how gut health, blood sugar, and metabolic stress influence appetite and hormone balance."
      />
      <section className="container-wellness">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <Eyebrow>Understanding GLP-1 Signaling</Eyebrow>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6" style={{ color: palette.ink }}>
              Make sense of hunger, cravings, and metabolic signals.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: palette.text }}>
              This ebook helps you understand how gut health, blood sugar, and metabolic stress influence appetite and hormone balance without turning your body into a willpower problem.
            </p>
            <PrimaryButton href="/glp1-ebook-protocol-confirm">Get the Ebook</PrimaryButton>
          </div>
          <div className="rounded-2xl p-6 md:p-8" style={{ background: palette.cream, border: `1px solid ${palette.border}` }}>
            <h2 className="text-2xl md:text-3xl font-display font-medium mb-5" style={{ color: palette.ink }}>
              What you will learn
            </h2>
            <FeatureList
              items={[
                "What GLP-1 actually is and why it matters",
                "How blood sugar and stress can change appetite signaling",
                "Why medications amplify a signal rather than rebuild the whole system",
                "How protein, fiber, sleep, movement, and gut health support the environment underneath",
              ]}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-14">
          <section>
            <h2 className="text-2xl md:text-3xl font-display font-medium mb-4" style={{ color: palette.ink }}>If your body feels inconsistent</h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: palette.muted }}>
              This guide is for the woman who feels hungry again soon after eating, notices energy dips, or feels like her body is not responding the way it used to.
            </p>
          </section>
          <section>
            <h2 className="text-2xl md:text-3xl font-display font-medium mb-4" style={{ color: palette.ink }}>Who it is for</h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: palette.muted }}>
              It is for women who want a calm, educational explanation of the system before choosing the next step with more structure.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

export function GLP1ProtocolAddon() {
  return (
    <PageShell>
      <SEO title="Add the Full GLP-1 Protocol" description="Add the full 90-Day GLP-1 Optimization Protocol as the implementation layer after the ebook." noindex />
      <section className="container-wellness">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Optional Next Step</Eyebrow>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6" style={{ color: palette.ink }}>
            The ebook explains the system. The protocol helps you apply it.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: palette.text }}>
            If you want structure after understanding the GLP-1 framework, the full protocol walks through the 90-day sequence with more guidance and practical rhythm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton href="/90day-protocol-confirm">Yes, Add the Full Protocol</PrimaryButton>
            <SecondaryButton href="/glp1-ebook-protocol-thankyou">No, Continue Without It</SecondaryButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function NinetyDayProtocol() {
  return (
    <PageShell>
      <SEO title="90-Day GLP-1 Optimization Protocol" description="A three-phase structure for applying GLP-1 support through gut stability, metabolic support, and hormone signaling refinement." />
      <section className="container-wellness">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>90-Day GLP-1 Optimization Protocol</Eyebrow>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6" style={{ color: palette.ink }}>
              A structured pathway for applying what you learned.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: palette.text }}>
              The protocol organizes the work into three phases so you can support the system in order instead of trying to change everything at once.
            </p>
          </div>
          <div className="grid gap-5 md:gap-6">
            {[
              ["Phase 1", "Reset the Chemistry", "Focus on gut stability, meal rhythm, hydration, and simple blood sugar support."],
              ["Phase 2", "Restore the Metabolism", "Build on the foundation with movement, muscle preservation, sleep rhythm, and metabolic responsiveness."],
              ["Phase 3", "Reharmonize the System", "Refine the routine around hunger, energy, hormone patterns, and real-life consistency."],
            ].map(([phase, title, copy]) => (
              <section key={phase} className="rounded-2xl p-6 md:p-8" style={{ background: "#FFFFFF", border: `1px solid ${palette.border}` }}>
                <p className="text-sm font-semibold tracking-[0.16em] uppercase mb-2" style={{ color: palette.sage }}>{phase}</p>
                <h2 className="text-2xl md:text-3xl font-display font-medium mb-3" style={{ color: palette.ink }}>{title}</h2>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: palette.muted }}>{copy}</p>
              </section>
            ))}
          </div>
          <div className="text-center mt-10">
            <PrimaryButton href="/90day-protocol-confirm">Get the Full Protocol</PrimaryButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function GLP1EbookProtocolConfirm() {
  return <OptInPage title="Confirm Your Email to Access the Ebook + Protocol" description="Enter your email below to receive the Understanding GLP-1 Signaling ebook and protocol access details." eyebrow="Ebook + Protocol" buttonLabel="Access Ebook + Protocol" redirectTo="/glp1-ebook-protocol-thankyou" tagName="HWH - GLP-1 Ebook + Protocol" seoTitle="Confirm Ebook + Protocol" />;
}

export function GLP1EbookProtocolThankYou() {
  return <ThankYouPage title="Your Ebook + Protocol Access Is On Its Way" description="Check your inbox for access details. If you do not see it, check spam or promotions." eyebrow="Ebook + Protocol" seoTitle="Ebook + Protocol Confirmation" />;
}

export function GLP1RoadmapConfirm() {
  return <OptInPage title="Confirm Your Email to Access the Ebook + Roadmap" description="Enter your email below to receive the Understanding GLP-1 Signaling ebook and roadmap access details." eyebrow="Ebook + Roadmap" buttonLabel="Access Ebook + Roadmap" redirectTo="/glp1-roadmap-thankyou" tagName="HWH - GLP-1 Ebook + Roadmap" seoTitle="Confirm Ebook + Roadmap" />;
}

export function GLP1RoadmapThankYou() {
  return <ThankYouPage title="Your Ebook + Roadmap Access Is On Its Way" description="Check your inbox for access details. If you do not see it, check spam or promotions." eyebrow="Ebook + Roadmap" seoTitle="Ebook + Roadmap Confirmation" />;
}

export function NinetyDayProtocolConfirm() {
  return <OptInPage title="Confirm Your Email to Access the 90-Day Protocol" description="Enter your email below to receive access details for the full 90-Day GLP-1 Optimization Protocol." eyebrow="90-Day Protocol" buttonLabel="Access the Protocol" redirectTo="/90day-protocol-thankyou" tagName="HWH - 90-Day GLP-1 Protocol" seoTitle="Confirm 90-Day Protocol" />;
}

export function NinetyDayProtocolThankYou() {
  return <ThankYouPage title="Your 90-Day Protocol Access Is On Its Way" description="Check your inbox for access details. If you do not see it, check spam or promotions." eyebrow="90-Day Protocol" seoTitle="90-Day Protocol Confirmation" />;
}
