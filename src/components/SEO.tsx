import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "Her Wellness Harmony | Root-Cause Wellness for Women";
const DEFAULT_DESCRIPTION = "Simple functional lifestyle shifts that help you understand your body, restore your energy, and experience true healing — without pressure or confusion.";
const OG_IMAGE = "https://instant-site-move.lovable.app/og-image.png";

export function SEO({ title, description }: SEOProps) {
  const pageTitle = title ? `${title} | Her Wellness Harmony` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
