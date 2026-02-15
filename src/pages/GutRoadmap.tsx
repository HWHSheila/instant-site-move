import { Helmet } from "react-helmet-async";

/**
 * Embeds the original gutroadmap ebook page to guarantee
 * a pixel-perfect match with the original design.
 */
export default function GutRoadmap() {
  return (
    <>
      <Helmet>
        <title>30 Day Gut Reset Roadmap | Her Wellness Harmony</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <iframe
        src="https://gutroadmap-herwellnessharmony.lovable.app"
        title="30 Day Gut Reset Roadmap"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
      />
    </>
  );
}
