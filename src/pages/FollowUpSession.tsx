import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function FollowUpSession() {
  return (
    <ServicePageTemplate
      seoTitle="Follow-Up Session | Her Wellness Harmony"
      seoDescription="A 45-minute session to refine progress, reassess patterns, and adjust direction after your initial consultation."
      categoryLabel="Follow-Up"
      headline="Follow-Up Session"
      subheadline="A 45-minute session to refine progress, reassess patterns, and adjust direction after your initial consultation."
      includes={[
        "45-minute virtual session",
        "Progress evaluation",
        "Symptom tracking review",
        "Strategy refinement",
      ]}
      whoFor={[
        "Previous consultation clients",
        "Women actively implementing recommendations",
        "Those needing recalibration",
      ]}
      walkAway={[
        "Adjusted action plan",
        "Refined sequencing",
        "Clear next steps",
      ]}
      price="99"
      ctaText="Book Follow-Up Session"
      ctaLink="https://buy.stripe.com/aFa00k8H8cMc51q1th38401"
    />
  );
}
