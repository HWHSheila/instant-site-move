import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function WellnessConsultation() {
  return (
    <ServicePageTemplate
      seoTitle="Integrative Wellness Consultation | Her Wellness Harmony"
      seoDescription="A 60-minute deep-dive session designed to assess symptom patterns, identify root drivers, and map out a structured plan for gut, metabolism, and hormone support."
      categoryLabel="Consultation"
      headline="Integrative Wellness Consultation"
      subheadline="A 60-minute deep-dive session designed to assess symptom patterns, identify root drivers, and map out a structured plan for gut, metabolism, and hormone support."
      includes={[
        "60-minute virtual session via Microsoft Teams",
        "Review of symptom history and health timeline",
        "Pattern recognition across gut → metabolism → hormones",
        "Discussion of current labs (if available)",
        "Strategic sequencing recommendations",
      ]}
      whoFor={[
        "Women experiencing complex or escalating symptoms",
        "Those who feel \"normal\" labs aren't telling the full story",
        "Anyone ready for a structured, root-cause framework",
      ]}
      walkAway={[
        "Clarity on your primary physiological patterns",
        "A structured direction for next steps",
        "Clear sequencing priorities",
      ]}
      price="175"
      ctaText="Book Your Consultation"
      ctaLink="https://buy.stripe.com/7sYdRaf5wbI89hG2xl38400"
    />
  );
}
