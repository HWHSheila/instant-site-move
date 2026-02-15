import { Helmet } from "react-helmet-async";

export default function RootCauseFree() {
  return (
    <>
      <Helmet>
        <title>Root Cause Free Guide | Her Wellness Harmony</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <iframe
        src="https://root-cause-free.lovable.app"
        title="Root Cause Free Guide"
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
