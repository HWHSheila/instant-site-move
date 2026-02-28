import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function RoutineBlueprint() {
  return (
    <ServicePageTemplate
      seoTitle="Morning & Night Routine Blueprint | Her Wellness Harmony"
      seoDescription="A 60-minute session to build a structured daily rhythm that supports gut repair, metabolic stability, and hormone regulation."
      categoryLabel="Routine Blueprint"
      headline="Morning & Night Routine Blueprint"
      subheadline="A 60-minute session to build a structured daily rhythm that supports gut repair, metabolic stability, and hormone regulation."
      includes={[
        "60-minute virtual session",
        "Morning routine optimization",
        "Night routine design",
        "Stress load reduction sequencing",
      ]}
      whoFor={[
        "Women with inconsistent energy",
        "Those struggling with sleep or rhythm",
        "Anyone needing structured daily physiology support",
      ]}
      walkAway={[
        "Personalized morning framework",
        "Personalized night framework",
        "Clear daily rhythm structure",
      ]}
      price="150"
      ctaText="Build My Routine Blueprint"
      ctaLink="https://buy.stripe.com/9B600kaPgcMc2Ti5Jx38403"
    />
  );
}
