import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const RATINGS: { key: BaselineKey; label: string; description: string }[] = [
  { key: "energy", label: "Energy", description: "How would you rate your overall energy level on a typical day?" },
  { key: "digestion", label: "Digestion", description: "How would you rate how comfortable and predictable your digestion feels?" },
  { key: "sleep", label: "Sleep", description: "How would you rate the quality and consistency of your sleep?" },
  { key: "mood", label: "Mood", description: "How would you rate your overall mood and emotional stability?" },
  { key: "bloating", label: "Bloating", description: "How often and how severely do you experience bloating?" },
  { key: "cravings", label: "Cravings", description: "How intense and frequent are your food cravings?" },
  { key: "bowel_regularity", label: "Bowel Regularity", description: "How regular and comfortable are your bowel movements?" },
  { key: "brain_fog", label: "Brain Fog", description: "How often do you experience difficulty focusing or mental cloudiness?" },
  { key: "joint_pain", label: "Joint Pain", description: "How frequently do you experience joint pain or stiffness?" },
  { key: "muscle_body_aches", label: "Muscle or Body Aches", description: "How frequently do you experience muscle soreness or body achiness?" },
  { key: "stress_level", label: "Stress Level", description: "How would you rate your average stress level over the last 30 days?" },
];

type BaselineKey =
  | "energy" | "digestion" | "sleep" | "mood" | "bloating" | "cravings"
  | "bowel_regularity" | "brain_fog" | "joint_pain" | "muscle_body_aches" | "stress_level";

const BRAND = {
  bg: "#F8F6F1",
  headerBg: "#264033",
  primaryText: "#264033",
  secondaryText: "#628371",
  gold: "#E2B236",
  green: "#327A56",
  sage: "#B3CCBF",
};

export default function ThirtyDayGuidedBaseline() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [ratings, setRatings] = useState<Record<BaselineKey, number>>(
    RATINGS.reduce((acc, r) => ({ ...acc, [r.key]: 5 }), {} as Record<BaselineKey, number>)
  );
  const [topSymptoms, setTopSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        top_3_symptoms: topSymptoms.trim() || null,
        ...ratings,
      };
      const { error: dbError } = await supabase.from("baseline_submissions").insert(payload);
      if (dbError) throw dbError;

      // Fire-and-forget email notification
      supabase.functions
        .invoke("send-baseline-email", { body: payload })
        .catch((err) => console.error("email send error", err));

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your baseline. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: BRAND.bg, minHeight: "100vh", fontFamily: "Georgia, serif", color: BRAND.primaryText }}>
      <Helmet>
        <title>30-Day Gut Reset Baseline | Her Wellness Harmony</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sticky header */}
      <header
        style={{ background: BRAND.headerBg, position: "sticky", top: 0, zIndex: 50 }}
        className="w-full py-5 shadow-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={logo} alt="Her Wellness Harmony" style={{ width: 56, height: 56, objectFit: "contain" }} />
          <div style={{ color: BRAND.sage, fontFamily: "Georgia, serif", fontSize: "1.125rem", letterSpacing: "0.02em" }}>
            30-Day Gut Reset
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-12">
        {submitted ? (
          <div
            className="text-center py-16 px-6 rounded-lg"
            style={{ background: "#ffffff", border: `1px solid ${BRAND.sage}` }}
          >
            <h1 style={{ color: BRAND.primaryText, fontSize: "1.875rem", marginBottom: "1rem" }}>Thank you.</h1>
            <p style={{ color: BRAND.secondaryText, fontSize: "1.125rem", lineHeight: 1.6 }}>
              Your baseline has been recorded. I will see you on Day 1.
            </p>
          </div>
        ) : (
          <>
            <section className="mb-10">
              <p style={{ color: BRAND.primaryText, fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Before we begin, I want to capture exactly where you are starting from. Be as honest as possible.
                There are no wrong answers. This is your baseline and we will come back to these numbers throughout
                the reset so you can see exactly how far you have come.
              </p>
              <p style={{ color: BRAND.primaryText, fontSize: "1.0625rem", lineHeight: 1.7, marginTop: "1rem" }}>
                For all ratings below: 1 = Low, 10 = High
              </p>
            </section>

            <form onSubmit={onSubmit} className="space-y-7">
              <Field label="First name" required>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
              </Field>

              <Field label="Last name" required>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </Field>

              <Field label="Email address" required>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </Field>

              {RATINGS.map((r) => (
                <div key={r.key}>
                  <label style={{ display: "block", fontSize: "1.0625rem", color: BRAND.primaryText, fontWeight: 600 }}>
                    {r.label}
                  </label>
                  <div style={{ fontSize: "0.9rem", color: BRAND.secondaryText, marginTop: 4, marginBottom: 10 }}>
                    {r.description}
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={ratings[r.key]}
                      onChange={(e) =>
                        setRatings((prev) => ({ ...prev, [r.key]: parseInt(e.target.value, 10) }))
                      }
                      style={{ flex: 1, accentColor: BRAND.green }}
                    />
                    <span
                      style={{
                        minWidth: 40,
                        textAlign: "center",
                        fontWeight: 700,
                        color: BRAND.primaryText,
                        background: "#fff",
                        border: `1px solid ${BRAND.sage}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                      }}
                    >
                      {ratings[r.key]}
                    </span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: "0.75rem", color: BRAND.secondaryText, marginTop: 4 }}>
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>
              ))}

              <Field label="Top 3 Symptoms">
                <textarea
                  value={topSymptoms}
                  onChange={(e) => setTopSymptoms(e.target.value)}
                  placeholder="List the top 3 symptoms that brought you to this reset."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>

              {error && (
                <div style={{ color: "#a3261c", fontSize: "0.95rem" }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  background: BRAND.gold,
                  color: BRAND.headerBg,
                  fontFamily: "Georgia, serif",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  padding: "16px 24px",
                  borderRadius: 999,
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  letterSpacing: "0.02em",
                }}
              >
                {submitting ? "Submitting…" : "Submit My Baseline"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  fontFamily: "Georgia, serif",
  color: "#264033",
  background: "#ffffff",
  border: "1px solid #B3CCBF",
  borderRadius: 8,
  outline: "none",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "1.0625rem",
          color: "#264033",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label} {required && <span style={{ color: "#a3261c" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
