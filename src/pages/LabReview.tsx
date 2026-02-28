import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function LabReview() {
  return (
    <ServicePageTemplate
      seoTitle="Educational Lab Result Review | Her Wellness Harmony"
      seoDescription="A written educational analysis of your lab results through a root-cause lens with 48-hour turnaround."
      categoryLabel="Lab Review"
      headline="Educational Lab Result Review"
      subheadline="A written educational analysis of your lab results through a root-cause lens with 48-hour turnaround."
      includes={[
        "Independent review of submitted lab results",
        "Pattern analysis and red flag identification",
        "Educational commentary (non-diagnostic)",
        "48-hour turnaround on written report",
      ]}
      whoFor={[
        "Women with labs marked \"normal\" but ongoing symptoms",
        "Those seeking clarity before booking a consultation",
        "Anyone wanting structured interpretation",
      ]}
      walkAway={[
        "Clear written insights",
        "Identified areas of concern",
        "Suggested next level of support",
      ]}
      price="125"
      ctaText="Purchase Lab Review"
      ctaLink="https://buy.stripe.com/bJecN62iKfYo51qdbZ38407"
    />
  );
}
