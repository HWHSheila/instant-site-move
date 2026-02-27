import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

export default function FourWeekConfirm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "mailerlite-subscribe",
        {
          body: {
            email,
            groupName: "PAID 4 Week Coaching Clients",
          },
        }
      );

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      navigate("/4-week-thankyou");
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Confirm Your Email — Deep Support Package"
        description="Enter your email to receive your onboarding and scheduling link for the 4-Week Gut & Hormone Coaching package."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-4">Step 2 of 2</p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight">
              4-Week Gut & Hormone Coaching
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
              Enter the same email you used at checkout so I can send your onboarding and scheduling link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full h-14 text-base rounded-full px-6 border border-border bg-card focus:border-wellness-forest focus:ring-wellness-forest focus:outline-none focus:ring-2"
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wellness-forest hover:bg-wellness-forest-dark text-primary-foreground font-semibold rounded-full px-8 py-4 text-base h-14 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send My Onboarding Email"}
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
