import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  ogImage?: string;
  ogUrl?: string;
}

const DEFAULT_TITLE = "Her Wellness Harmony | Root-Cause Wellness for Women";
const DEFAULT_DESCRIPTION = "Simple functional lifestyle shifts that help you understand your body, restore your energy, and experience true healing — without pressure or confusion.";
const OG_IMAGE = "https://instant-site-move.lovable.app/og-image.png";

export function SEO({ title, description, noindex, ogImage, ogUrl }: SEOProps) {
  const pageTitle = title ? `${title} | Her Wellness Harmony` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const image = ogImage || OG_IMAGE;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      <meta property="og:title" content={title || pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
