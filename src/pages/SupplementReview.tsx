import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function SupplementReview() {
  return (
    <ServicePageTemplate
      seoTitle="Gut & Supplement Review | Her Wellness Harmony"
      seoDescription="A 45-minute structured review of your current supplements and gut-support strategy."
      categoryLabel="Supplement Strategy"
      headline="Gut & Supplement Review"
      subheadline="A 45-minute structured review of your current supplements and gut-support strategy."
      includes={[
        "Review of current supplement stack",
        "Gut-support sequencing discussion",
        "Identification of redundancy or overload",
        "Strategic adjustments",
      ]}
      whoFor={[
        "Women taking multiple supplements without clarity",
        "Those experiencing side effects",
        "Anyone wanting simplification",
      ]}
      walkAway={[
        "Streamlined supplement strategy",
        "Improved sequencing",
        "Clear priorities",
      ]}
      price="150"
      ctaText="Book Supplement Review"
      ctaLink="https://buy.stripe.com/aFaeVe7D4h2sbpOb3R38402"
    />
  );
}
