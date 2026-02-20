import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

export default function GLP1BundleConfirm() {
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
        "systeme-subscribe",
        {
          body: {
            email,
            tagName: "HWH - GLP-1 Bundle",
          },
        }
      );

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      navigate("/glp1-bundle-thankyou");
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4EFEA" }}>
      <SEO
        title="Confirm Your Email - GLP-1 Bundle"
        description="Enter your email to receive the GLP-1 Signaling Guide and 30-Day Gut Reset Roadmap Bundle."
        noindex
      />
      <Header />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container-wellness">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#8FA89E" }}>
              GLP-1 Bundle
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6 leading-tight" style={{ color: "#4B2E39" }}>
              Confirm Your Email to Access the GLP-1 Signaling Guide and 30-Day Gut Reset Roadmap Bundle
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: "#333333" }}>
              Enter your email below to receive your copy and future physiology-based guidance.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full h-14 text-base rounded-full px-6 border focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#E8DDD3",
                  background: "#FFFFFF",
                  color: "#333333",
                }}
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold rounded-full px-8 py-4 text-base h-14 transition-colors disabled:opacity-50"
                style={{
                  background: "#8FA89E",
                  color: "#FFFFFF",
                }}
              >
                {loading ? "Sending..." : "Access My Bundle"}
              </button>

              <p className="text-sm mt-4" style={{ color: "#8FA89E" }}>
                Your privacy is important. We will never share your email.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
