import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useCallback } from "react";
import coverBg from "@/assets/glp1-cover-bg.jpg";
import chapterOpener from "@/assets/glp1-chapter-opener.jpg";
import protocolTransition from "@/assets/glp1-protocol-transition.jpg";
import proteinFoods from "@/assets/glp1-protein-foods.jpg";
import fiberFoods from "@/assets/glp1-fiber-foods.jpg";
import healthyFats from "@/assets/glp1-healthy-fats.jpg";
import polyphenols from "@/assets/glp1-polyphenols.jpg";
import teaIncretin from "@/assets/glp1-tea-incretin.jpg";
import movementImage from "@/assets/glp1-movement.jpg";
import sleepCalm from "@/assets/glp1-sleep-calm.jpg";

function EbookScaler({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const rescale = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const pageWidthPx = 816; // 8.5in at 96dpi
    const viewportWidth = outer.clientWidth;
    if (viewportWidth < pageWidthPx) {
      const scale = viewportWidth / pageWidthPx;
      inner.style.transform = `scale(${scale})`;
      inner.style.transformOrigin = "top left";
      inner.style.width = `${pageWidthPx}px`;
      outer.style.height = `${inner.scrollHeight * scale}px`;
    } else {
      inner.style.transform = "";
      inner.style.width = "";
      outer.style.height = "";
    }
  }, []);

  useEffect(() => {
    rescale();
    window.addEventListener("resize", rescale);
    const timer = setTimeout(rescale, 500);
    return () => {
      window.removeEventListener("resize", rescale);
      clearTimeout(timer);
    };
  }, [rescale]);

  return (
    <div ref={outerRef} style={{ width: "100%", overflow: "hidden", position: "relative" }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

const PageFooter = ({ pageNum }: { pageNum: number }) => (
  <div className="ebook-doc-footer">
    <a href="https://www.herwellnessharmony.com" style={{ color: "#AE9297", textDecoration: "none" }}>www.herwellnessharmony.com</a>
    <div style={{ marginTop: "0.25em", fontSize: "0.6rem" }}>{pageNum}</div>
  </div>
);

export default function GLP1Signal() {
  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: "#D9D1CB", minHeight: "100vh" }}>
      <Helmet>
        <title>Understanding GLP-1 Signaling | Her Wellness Harmony</title>
        <meta name="robots" content="index, follow" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .ebook-doc-page { page-break-after: always; box-shadow: none !important; margin: 0 !important; }
          .ebook-doc-page:last-child { page-break-after: auto; }
          .ebook-spacer { display: none; }
        }
        @media screen {
          .ebook-spacer { height: 40px; }
        }
        .ebook-doc-page {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
          background: #FFFFFF;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        .ebook-doc-page + .ebook-doc-page {
          margin-top: 0;
        }
        @media screen {
          .ebook-doc-page {
            box-shadow: 0 2px 20px rgba(0,0,0,0.12);
            margin-bottom: 0;
          }
        }
        .ebook-content-page {
          padding: 0.76in 0.95in;
        }
        .ebook-doc-h1 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.72rem;
          line-height: 1.32;
          margin-bottom: 0.95em;
          margin-top: 0;
        }
        .ebook-doc-h2 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.2rem;
          line-height: 1.38;
          margin-top: 2.05em;
          margin-bottom: 0.82em;
        }
        .ebook-doc-h3 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.03rem;
          line-height: 1.35;
          margin-top: 1.45em;
          margin-bottom: 0.45em;
        }
        .ebook-doc-body {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          font-size: 0.94rem;
          line-height: 1.86;
          color: #3A3A3A;
          margin-bottom: 1.12em;
          margin-top: 0;
        }
        .ebook-doc-list {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          font-size: 0.92rem;
          line-height: 1.82;
          color: #3A3A3A;
          padding-left: 1.45em;
          margin-bottom: 1.25em;
          margin-top: 0.55em;
          list-style-type: disc;
          list-style-position: outside;
        }
        .ebook-doc-list li {
          margin-bottom: 0.42em;
          display: list-item;
          list-style-type: disc;
        }
        .ebook-doc-list li::marker {
          color: #4B2E4C;
        }
        .ebook-doc-chapter-label {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #AE9297;
          margin-bottom: 0.6em;
        }
        .ebook-doc-divider {
          width: 50px;
          height: 2px;
          background: #C9A646;
          margin: 1.5em 0;
          border: none;
        }
        .ebook-doc-diagram {
          background: #F8F0F0;
          border: 1px solid #D9D1CB;
          border-radius: 8px;
          padding: 1.5em;
          margin: 1.25em 0;
          text-align: center;
        }
        .ebook-doc-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.4em;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem;
          color: #4B2E4C;
        }
        .ebook-doc-flow-step {
          background: #A3BFA8;
          color: #FFFFFF;
          padding: 0.4em 0.8em;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.75rem;
        }
        .ebook-doc-flow-arrow {
          color: #A3BFA8;
          font-size: 1rem;
          font-weight: bold;
        }
        /* Refined Chapter 1 signaling diagram */
        .ebook-signal-diagram {
          background: linear-gradient(180deg, #FBF6F1 0%, #F4ECE3 100%);
          border: 1px solid #E5DCD1;
          border-radius: 14px;
          padding: 1.6em 1.2em 1.4em;
          margin: 1.4em 0;
        }
        .ebook-signal-caption {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #AE9297;
          text-align: center;
          margin-bottom: 1.25em;
        }
        .ebook-signal-flow {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 0.5em;
          flex-wrap: nowrap;
        }
        .ebook-signal-node {
          flex: 1 1 0;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #E5DCD1;
          border-radius: 12px;
          padding: 0.7em 0.4em 0.65em;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 1px 2px rgba(75, 46, 76, 0.04);
        }
        .ebook-signal-node-label {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.7rem;
          color: #4B2E4C;
          line-height: 1.25;
        }
        .ebook-signal-node-sub {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #A3BFA8;
          margin-bottom: 0.35em;
        }
        .ebook-signal-connector {
          align-self: center;
          flex: 0 0 auto;
          color: #C9A646;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          line-height: 1;
        }
        /* Wider variant for the metabolic chain diagram */
        .ebook-signal-flow.is-system {
          gap: 0.15em;
          align-items: stretch;
        }
        .ebook-signal-flow.is-system .ebook-signal-node {
          flex: 1 1 0;
          padding: 0.55em 0.5em;
          min-height: 3.6em;
          aspect-ratio: auto;
        }
        .ebook-signal-flow.is-system .ebook-signal-node-sub {
          margin-bottom: 0.35em;
          white-space: nowrap;
        }
        .ebook-signal-flow.is-system .ebook-signal-node-label {
          font-size: 0.7rem;
          line-height: 1.2;
          white-space: normal;
          word-break: keep-all;
        }
        .ebook-signal-flow.is-system .ebook-signal-connector {
          flex: 0 0 auto;
          font-size: 0.6rem;
          margin: 0;
          padding: 0 0.05em;
        }
        .ebook-doc-layers {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin: 1.12em 0 1.28em;
        }
        .ebook-doc-layer {
          width: 220px;
          padding: 0.75em;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          color: #FFFFFF;
          border-radius: 6px;
        }
        .ebook-doc-layer-arrow {
          color: #AE9297;
          font-size: 1.2rem;
          line-height: 1;
          margin: 0.2em 0;
        }
        .ebook-doc-phase-box {
          background: #F8F0F0;
          border-left: 4px solid #A3BFA8;
          border-radius: 0 6px 6px 0;
          padding: 1.25em;
          margin: 1.35em 0;
        }
        .ebook-doc-phase-header {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 0.45em;
        }
        .ebook-doc-toc-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.92rem;
          color: #3A3A3A;
          padding: 0.94em 0;
          border-bottom: none;
        }
        .ebook-doc-toc-chapter {
          font-family: 'Montserrat', sans-serif;
          color: #AE9297;
          font-weight: 400;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.18em;
        }
        .ebook-doc-toc-title {
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.03rem;
        }
        .ebook-doc-toc-section {
          color: #AE9297;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 0.82rem;
        }
        .ebook-image-placeholder {
          border: 1px solid #E5DCD1;
          background: #FBF6F1;
          color: #AE9297;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          padding: 0;
          margin: 1em 0 1.35em;
          overflow: hidden;
          height: 1.72in;
        }
        .ebook-image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ebook-doc-image {
          width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1.12em 0 1.28em;
          display: block;
        }
        .ebook-doc-cta {
          display: block;
          width: 100%;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.94rem;
          line-height: 1.2;
          color: #FFFFFF;
          background: #8FA89E;
          border-radius: 999px;
          padding: 1em 1.4em;
          margin: 1.45em 0 0.8em;
          text-decoration: none;
          box-sizing: border-box;
        }
        .ebook-doc-footer {
          position: absolute;
          bottom: 0.5in;
          left: 1in;
          right: 1in;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          color: #AE9297;
          letter-spacing: 0.05em;
        }
      `}</style>

      <EbookScaler>
      {/* ==================== COVER PAGE ==================== */}
      <div className="ebook-doc-page" style={{
        backgroundImage: `url(${coverBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "soft-light",
        backgroundColor: "rgba(255,255,255,0.26)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1in",
      }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8F747B", marginBottom: "3em" }}>
          HER WELLNESS HARMONY
        </p>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", color: "#3F2441", fontWeight: 700, lineHeight: 1.02, marginBottom: "0.62em" }}>
          <span style={{ display: "block", fontSize: "1.75rem", fontWeight: 600, letterSpacing: "0.01em", marginBottom: "0.26em" }}>Understanding</span>
          <span style={{ display: "inline-block", fontSize: "3.25rem", textTransform: "none", letterSpacing: "0.01em", background: "rgba(255,255,255,0.58)", borderRadius: "6px", padding: "0.07em 0.2em", boxShadow: "0 8px 24px rgba(75,46,76,0.08)" }}>GLP-1 Signaling</span>
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.94rem", fontWeight: 400, color: "#383838", lineHeight: 1.68, maxWidth: "440px", marginBottom: "3em" }}>
          How gut health, blood sugar, and metabolic stress influence appetite and hormone balance
        </p>
        <hr style={{ width: "50px", height: "2px", background: "#C9A646", border: "none", marginBottom: "1.8em" }} />
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 600, color: "#4B2E4C", marginBottom: "0" }}>
          Sheila McFarland
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.92rem", fontWeight: 600, color: "#8F747B", position: "absolute", bottom: "0.75in" }}>
          <a href="https://www.herwellnessharmony.com" style={{ color: "#AE9297", textDecoration: "none" }}>www.herwellnessharmony.com</a>
        </p>
      </div>
      <div className="ebook-spacer" />

      {/* ==================== TABLE OF CONTENTS ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Contents</div>
        <h1 className="ebook-doc-h1" style={{ fontSize: "1.5rem", marginBottom: "1.5em" }}>Table of Contents</h1>
        {[
          { ch: "", title: "Introduction" },
          { ch: "Chapter 1", title: "What GLP-1 Actually Is" },
          { ch: "Chapter 2", title: "GLP-1 Is a Signal, Not a Fat Burner" },
          { ch: "Chapter 3", title: "Why GLP-1 Signaling Breaks" },
          { ch: "Chapter 4", title: "GLP-1 Medications. What They Do" },
          { ch: "Chapter 5", title: "Supporting GLP-1 Naturally" },
          { ch: "Chapter 6", title: "Gut, Metabolism, and Hormones" },
          { ch: "Chapter 7", title: "Introduction to the 90-Day GLP-1 Optimization Protocol" },
          { ch: "", title: "Next Steps" },
          { ch: "", title: "Appendix: References and Notes" },
        ].map((item, i) => (
          <div key={i} className="ebook-doc-toc-item">
            {item.ch ? <span className="ebook-doc-toc-chapter">{item.ch}</span> : null}
            <span className={item.ch ? "ebook-doc-toc-title" : "ebook-doc-toc-section"}>{item.title}</span>
          </div>
        ))}
        <PageFooter pageNum={2} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== INTRODUCTION ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Introduction</div>
        <h1 className="ebook-doc-h1">Renewing Your Metabolism by Understanding the Chemistry Behind GLP-1</h1>

        <p className="ebook-doc-body">If your hunger makes no sense…</p>
        <p className="ebook-doc-body">If you’re eating and still thinking about food…</p>
        <p className="ebook-doc-body">If your energy crashes even when you’re trying to do everything right…</p>
        <p className="ebook-doc-body">Your body is not broken.</p>
        <p className="ebook-doc-body">And this is not random.</p>
        <p className="ebook-doc-body">Over the past few years, GLP-1 has gone from a relatively unknown metabolic hormone to a household term. Medications like semaglutide, tirzepatide, and retatrutide have changed the conversation around weight loss, appetite, and metabolic health.</p>
        <p className="ebook-doc-body">They have created results that feel almost immediate.</p>
        <p className="ebook-doc-body">But they have also created confusion.</p>
        <p className="ebook-doc-body">GLP-1 is often described as a weight loss hormone or a fat-burning accelerator. It is neither.</p>
        <p className="ebook-doc-body">GLP-1 is a signaling hormone.</p>
        <p className="ebook-doc-body">Every time you eat, your gut releases GLP-1 as part of a signaling cascade that coordinates digestion, blood sugar, insulin response, and satiety.</p>
        <p className="ebook-doc-body">It does not burn fat directly or override your physiology.</p>
        <p className="ebook-doc-body">And it does not replace foundational metabolic health.</p>
        <p className="ebook-doc-body">What the rise of GLP-1 medications has revealed is something deeper.</p>
        <p className="ebook-doc-body">Your metabolism is not just about calories.</p>
        <p className="ebook-doc-body">It is about how your body communicates.</p>
        <p className="ebook-doc-body">When that communication is stable, your body responds appropriately to food.</p>
        <p className="ebook-doc-body">When it is disrupted, everything starts to feel inconsistent.</p>
        <p className="ebook-doc-body">This book will help you understand that system.</p>
        <p className="ebook-doc-body">Inside these pages, you will learn what GLP-1 actually is, how it functions inside the signaling environment, why that communication breaks down, what medications truly do inside the body, and how to support GLP-1 naturally by restoring the chemistry upstream.</p>
        <p className="ebook-doc-body">GLP-1 does not operate in isolation. It sits within a larger metabolic hierarchy that begins in the gut, extends through insulin sensitivity and energy metabolism, and ultimately coordinates hormones and body composition.</p>
        <p className="ebook-doc-body">You cannot force the bottom of the chain without stabilizing the top.</p>
        <p className="ebook-doc-body">This book is not anti-medication. It is not a quick fix. It is not a restrictive diet strategy. It is a physiology first framework for understanding how GLP-1 fits into the broader picture of metabolic renewal, and how to work with the body instead of against it.</p>
        <p className="ebook-doc-body">If you understand the signal, you understand the system.</p>
        <p className="ebook-doc-body">When you understand the system, you can begin rebuilding it with intention.</p>
        <PageFooter pageNum={3} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 1 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 1</div>
        <h1 className="ebook-doc-h1">What GLP-1 Actually Is</h1>

        <img src={chapterOpener} alt="Wholesome meal preparation representing nourishment and gut health" className="ebook-doc-image" style={{ maxHeight: "2.5in", objectFit: "cover" }} />

        <p className="ebook-doc-body">GLP-1 stands for glucagon-like peptide-1. It is not a drug. It is not a supplement.</p>
        <p className="ebook-doc-body">GLP-1 is made in the gut, specifically by specialized cells called L-cells. These cells respond when you eat and release GLP-1 as part of the body's signaling system. In simple terms, this is one of the ways your gut tells the rest of your body that food has arrived and it's time to respond.</p>
        <p className="ebook-doc-body">GLP-1 tells your body that nutrients have arrived and it is time to respond appropriately.</p>
        <p className="ebook-doc-body">When GLP-1 is released, several important things happen:</p>
        <ul className="ebook-doc-list">
          <li>Insulin is released in response to food</li>
          <li>Glucagon levels decrease</li>
          <li>Stomach emptying slows</li>
          <li>Appetite signals in the brain shift</li>
          <li>Blood sugar becomes more stable</li>
        </ul>
        <p className="ebook-doc-body">GLP-1 coordinates metabolic traffic.</p>
        <p className="ebook-doc-body">It tells your body what to do with incoming energy.</p>
        <p className="ebook-doc-body">This is where a lot of women get confused.</p>
        <p className="ebook-doc-body">You’re told your hunger is the problem…</p>
        <p className="ebook-doc-body">Your weight is the problem…</p>
        <p className="ebook-doc-body">Your willpower is the problem…</p>
        <p className="ebook-doc-body">This is where most advice goes wrong.</p>
        <p className="ebook-doc-body">But GLP-1 isn’t about force.</p>
        <p className="ebook-doc-body">You don’t have a hunger problem. You have a signaling problem.</p>
        <p className="ebook-doc-body">And when that signal becomes inconsistent…</p>
        <p className="ebook-doc-body">your appetite, energy, and cravings can start to feel unpredictable too.</p>

        <div className="ebook-signal-diagram">
          <div className="ebook-signal-caption">The GLP-1 Signaling Pathway</div>
          <div className="ebook-signal-flow">
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Origin</div>
              <div className="ebook-signal-node-label">Gut</div>
            </div>
            <div className="ebook-signal-connector">———</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Signal</div>
              <div className="ebook-signal-node-label">GLP-1<br />Release</div>
            </div>
            <div className="ebook-signal-connector">———</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Receiver</div>
              <div className="ebook-signal-node-label">Pancreas</div>
            </div>
            <div className="ebook-signal-connector">———</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Response</div>
              <div className="ebook-signal-node-label">Insulin<br />Release</div>
            </div>
            <div className="ebook-signal-connector">———</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Outcome</div>
              <div className="ebook-signal-node-label">Stable<br />Blood Sugar</div>
            </div>
          </div>
        </div>

        <h2 className="ebook-doc-h2">GLP-1 Is Part of a Larger Conversation</h2>
        <p className="ebook-doc-body">GLP-1 does not work alone.</p>
        <p className="ebook-doc-body">It communicates with the pancreas, the liver, the brain, and even the vagus nerve. It interacts with insulin, glucagon, leptin, ghrelin, cortisol, and inflammatory signals.</p>
        <p className="ebook-doc-body">It operates within a network.</p>
        <p className="ebook-doc-body">When that network is functioning well, you feel:</p>
        <ul className="ebook-doc-list">
          <li>Satisfied after meals</li>
          <li>Mentally clear</li>
          <li>Steady in your energy</li>
          <li>Less reactive to sugar swings</li>
        </ul>
        <p className="ebook-doc-body">When that network is dysregulated, you may notice:</p>
        <ul className="ebook-doc-list">
          <li>Intense hunger soon after eating</li>
          <li>Cravings that feel urgent rather than normal</li>
          <li>Energy crashes</li>
          <li>Difficulty losing weight despite effort</li>
        </ul>
        <p className="ebook-doc-body">The issue is rarely that GLP-1 is absent.</p>
        <p className="ebook-doc-body">The issue is that the signaling environment has become distorted.</p>
        <PageFooter pageNum={4} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 1 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Why GLP-1 Matters So Much Right Now</h2>
        <p className="ebook-doc-body">GLP-1 has become widely discussed because medications that mimic it can produce significant weight loss and blood sugar improvement.</p>
        <p className="ebook-doc-body">However, the medication is not creating a new pathway.</p>
        <p className="ebook-doc-body">It is amplifying a pathway that already exists.</p>
        <p className="ebook-doc-body">That distinction matters.</p>
        <p className="ebook-doc-body">If your internal signaling is supported, your body is capable of producing and responding to GLP-1 naturally.</p>
        <p className="ebook-doc-body">If your internal chemistry is:</p>
        <ul className="ebook-doc-list">
          <li>Inflamed</li>
          <li>Stressed</li>
          <li>Sleep deprived</li>
          <li>Metabolically strained</li>
        </ul>
        <p className="ebook-doc-body">the signal may weaken.</p>
        <p className="ebook-doc-body">GLP-1 isn’t magic.</p>
        <p className="ebook-doc-body">It’s predictable biology.</p>

        <h2 className="ebook-doc-h2">The Real Takeaway</h2>
        <p className="ebook-doc-body">GLP-1 is not a weight loss trick.</p>
        <p className="ebook-doc-body">It is a signal your body uses to coordinate energy distribution, appetite, and glucose balance.</p>
        <p className="ebook-doc-body">If you understand that it is a messenger, everything else in this book will make more sense.</p>
        <p className="ebook-doc-body">In the next chapter, we will look more closely at why this distinction matters for appetite, energy, and long-term metabolic stability.</p>
        <PageFooter pageNum={5} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 2 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 2</div>
        <h1 className="ebook-doc-h1">GLP-1 Is a Signal, Not a Fat Burner</h1>

        <p className="ebook-doc-body">One of the most common misunderstandings about GLP-1 is that it is a fat-burning hormone.</p>
        <p className="ebook-doc-body">It is not.</p>
        <p className="ebook-doc-body">GLP-1 does not directly burn fat tissue, dramatically increase metabolic rate, or force the body to lose weight.</p>
        <p className="ebook-doc-body">GLP-1 is a signal your body uses to coordinate what happens after you eat.</p>
        <p className="ebook-doc-body">When you eat, GLP-1 tells your body how to respond to incoming nutrients. It signals insulin release, slows gastric emptying, communicates satiety to the brain, and supports steadier blood sugar after meals.</p>
        <p className="ebook-doc-body">Those effects can support weight loss, but the mechanism is not fat burning. It’s coordination.</p>
        <p className="ebook-doc-body">This is why appetite can change quickly while deeper metabolic repair still takes time.</p>

        <h2 className="ebook-doc-h2">Appetite Suppression Is Not Metabolic Repair</h2>
        <p className="ebook-doc-body">Many GLP-1 medications reduce appetite significantly. This often leads to lower calorie intake, which can result in weight loss.</p>
        <p className="ebook-doc-body">However, appetite suppression alone does not equal metabolic restoration.</p>
        <p className="ebook-doc-body">If the underlying signaling environment remains disrupted, long term results may depend on continued external stimulation rather than internal regulation.</p>
        <p className="ebook-doc-body">It is possible to eat less and still have:</p>
        <ul className="ebook-doc-list">
          <li>Insulin resistance</li>
          <li>Poor metabolic flexibility</li>
          <li>Muscle loss</li>
          <li>Thyroid downregulation</li>
          <li>Persistent inflammation</li>
        </ul>
        <p className="ebook-doc-body">Weight change does not automatically mean metabolic health has improved.</p>
        <p className="ebook-doc-body">This distinction matters.</p>

        <h2 className="ebook-doc-h2">Signaling Versus Forcing</h2>
        <p className="ebook-doc-body">There is a difference between restoring a signal and forcing a response.</p>
        <p className="ebook-doc-body">Restoring a signal means improving the internal environment so that the body naturally produces and responds to GLP-1 effectively.</p>
        <p className="ebook-doc-body">Forcing a response means amplifying a signal regardless of whether the system underneath is stable.</p>
        <p className="ebook-doc-body">If gut function is impaired, inflammation is elevated, sleep is insufficient, or stress is chronic, the signaling network becomes distorted. In that environment, simply increasing GLP-1 activity does not necessarily repair the broader metabolic system.</p>
        <ul className="ebook-doc-list" style={{ marginTop: "1.5em" }}>
          <li>It may reduce appetite</li>
          <li>It may improve blood sugar</li>
          <li>But it does not automatically rebuild the system underneath it</li>
        </ul>
        <PageFooter pageNum={6} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 2 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>GLP-1 Works Within a System</h2>
        <p className="ebook-doc-body">GLP-1 interacts with insulin. Insulin interacts with muscle tissue. Muscle tissue shapes glucose uptake. Glucose uptake affects mitochondrial energy production. Mitochondrial efficiency affects fatigue, hunger signaling, and metabolic flexibility.</p>
        <p className="ebook-doc-body">This is a chain.</p>
        <div className="ebook-signal-diagram">
          <div className="ebook-signal-caption">The Metabolic Chain</div>
          <div className="ebook-signal-flow is-system">
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Signal</div>
              <div className="ebook-signal-node-label">GLP-1</div>
            </div>
            <div className="ebook-signal-connector">—</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Hormone</div>
              <div className="ebook-signal-node-label">Insulin</div>
            </div>
            <div className="ebook-signal-connector">—</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Tissue</div>
              <div className="ebook-signal-node-label">Muscle</div>
            </div>
            <div className="ebook-signal-connector">—</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Process</div>
              <div className="ebook-signal-node-label">Glucose Uptake</div>
            </div>
            <div className="ebook-signal-connector">—</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Engine</div>
              <div className="ebook-signal-node-label">Mitochondria</div>
            </div>
            <div className="ebook-signal-connector">—</div>
            <div className="ebook-signal-node">
              <div className="ebook-signal-node-sub">Outcome</div>
              <div className="ebook-signal-node-label">Energy Output</div>
            </div>
          </div>
        </div>
        <p className="ebook-doc-body">If one part of the chain is unstable, the overall outcome changes.</p>
        <p className="ebook-doc-body">Reducing GLP-1 to weight loss oversimplifies a complex communication network.</p>
        <p className="ebook-doc-body">GLP-1 coordinates energy distribution and appetite cues between digestion, blood sugar control, and satiety.</p>
        <p className="ebook-doc-body">It does not replace foundational physiology.</p>
        <p className="ebook-doc-body">This is why things can feel inconsistent.</p>
        <p className="ebook-doc-body">Some days your appetite feels normal, and other days it doesn’t make sense.</p>
        <p className="ebook-doc-body">It’s not randomness. It’s signaling.</p>

        <h2 className="ebook-doc-h2">The Shift in Perspective</h2>
        <p className="ebook-doc-body">When GLP-1 is understood as a signal, the goal changes.</p>
        <p className="ebook-doc-body" style={{ marginTop: "1.25em", marginBottom: "1.25em" }}>The goal is no longer to force appetite suppression, but to stabilize the environment the signal depends on.</p>
        <p className="ebook-doc-body" style={{ marginTop: "1.25em", marginBottom: "1.25em" }}>That means supporting gut health, stabilizing blood sugar, preserving muscle, improving sleep quality, and reducing inflammatory load.</p>
        <p className="ebook-doc-body">When signaling improves, regulation becomes smoother.</p>
        <p className="ebook-doc-body">In the next chapter, we will examine why GLP-1 signaling breaks in the first place, and what disrupts the communication network that supports metabolic stability.</p>
        <PageFooter pageNum={7} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 3 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 3</div>
        <h1 className="ebook-doc-h1">Why GLP-1 Signaling Breaks</h1>

        <p className="ebook-doc-body">GLP-1 does not disappear.</p>
        <p className="ebook-doc-body">In most cases, the body is still capable of producing it.</p>
        <p className="ebook-doc-body">The issue is not the existence of the hormone. The issue is the signaling environment.</p>
        <p className="ebook-doc-body">GLP-1 functions inside a network. When that network becomes unstable, the signal weakens, distorts, or becomes less effective. This is why you might feel hungry even after eating, or experience energy crashes a few hours later.</p>
        <p className="ebook-doc-body">To understand why GLP-1 signaling breaks, we need to look upstream.</p>

        <h2 className="ebook-doc-h2">Gut Dysfunction</h2>
        <p className="ebook-doc-body">GLP-1 is produced in the small intestine.</p>
        <p className="ebook-doc-body">If the gut lining is inflamed, irritated, or compromised, signaling is affected at the source.</p>
        <p className="ebook-doc-body">Common contributors include:</p>
        <ul className="ebook-doc-list">
          <li>Chronic stress</li>
          <li>Repeated restrictive dieting</li>
          <li>Low fiber intake</li>
          <li>Dysbiosis</li>
          <li>Poor sleep</li>
          <li>High inflammatory load</li>
        </ul>
        <p className="ebook-doc-body">When the gut environment is unstable, hormone signaling becomes inconsistent. This can show up as cravings, irregular hunger, or feeling like your body is not responding the way it used to.</p>
        <p className="ebook-doc-body">The intestine is not just a digestive organ. It is an endocrine organ, meaning it produces and communicates important signals in the body. If the terrain is disrupted, the signal may weaken.</p>

        <div className="ebook-doc-diagram">
          <div className="ebook-doc-layers">
            <div className="ebook-doc-layer" style={{ background: "#A3BFA8" }}>Gut</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#AE9297" }}>Metabolic Chemistry</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#4B2E4C" }}>Hormone Signaling</div>
          </div>
        </div>

        <h2 className="ebook-doc-h2">Blood Sugar Instability</h2>
        <p className="ebook-doc-body">GLP-1 works closely with insulin.</p>
        <p className="ebook-doc-body">If blood sugar is frequently spiking and crashing, insulin signaling becomes strained. Over time, cells may become less responsive to insulin. This is often referred to as insulin resistance.</p>
        <p className="ebook-doc-body">When insulin signaling is impaired, the coordination between GLP-1 and glucose regulation becomes less efficient.</p>
        <p className="ebook-doc-body">You may notice:</p>
        <ul className="ebook-doc-list">
          <li>Increased hunger</li>
          <li>Cravings for quick carbohydrates</li>
          <li>Afternoon energy crashes</li>
          <li>Difficulty losing weight</li>
        </ul>
        <p className="ebook-doc-body">The signal may still be present, but the response is altered. This is where you might feel stuck, doing all the right things but not seeing consistent results.</p>
        <PageFooter pageNum={8} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 3 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Chronic Stress and Nervous System Dysregulation</h2>
        <p className="ebook-doc-body">The gut and brain communicate continuously through the vagus nerve and stress hormones.</p>
        <p className="ebook-doc-body">Chronic stress elevates cortisol. Elevated cortisol signals blood sugar. Blood sugar instability signals insulin. Insulin interacts with GLP-1. This is why stress can make your hunger feel less predictable and your energy harder to stabilize.</p>
        <p className="ebook-doc-body">Everything connects.</p>
        <p className="ebook-doc-body">If the nervous system is constantly in a heightened stress state, signaling patterns shift. Hunger cues can intensify. Appetite regulation becomes less predictable. Energy becomes less stable.</p>
        <p className="ebook-doc-body">This is not a willpower issue.</p>
        <p className="ebook-doc-body">You can’t out-discipline unstable chemistry.</p>
        <p className="ebook-doc-body">It is a regulatory issue.</p>

        <h2 className="ebook-doc-h2">Loss of Muscle Mass</h2>
        <p className="ebook-doc-body">Muscle tissue plays a major role in glucose disposal.</p>
        <p className="ebook-doc-body">When muscle mass decreases, glucose handling becomes less efficient. This can place additional strain on insulin signaling and indirectly affect the broader metabolic network.</p>
        <p className="ebook-doc-body">Aggressive dieting, inadequate protein intake, and lack of resistance training can all reduce lean mass over time.</p>
        <p className="ebook-doc-body">GLP-1 signaling does not operate independently from muscle health.</p>
        <p className="ebook-doc-body">Metabolism is tissue dependent.</p>

        <h2 className="ebook-doc-h2">Inflammation</h2>
        <p className="ebook-doc-body">Low-grade systemic inflammation can interfere with hormonal communication.</p>
        <p className="ebook-doc-body">Inflammatory signals affect insulin sensitivity, appetite regulation, and energy production.</p>
        <p className="ebook-doc-body">Inflammation can stem from:</p>
        <ul className="ebook-doc-list">
          <li>Poor gut barrier integrity</li>
          <li>Chronic stress</li>
          <li>Sleep deprivation</li>
          <li>Processed food overload</li>
          <li>Sedentary behavior</li>
        </ul>
        <p className="ebook-doc-body">When inflammatory load increases, signaling clarity decreases.</p>
        <p className="ebook-doc-body">Hormones communicate less efficiently in an inflamed environment.</p>

        <h2 className="ebook-doc-h2">The Bigger Pattern</h2>
        <p className="ebook-doc-body">GLP-1 signaling rarely breaks in isolation.</p>
        <p className="ebook-doc-body">It is usually part of a broader pattern of metabolic strain.</p>
        <p className="ebook-doc-body">The body is not malfunctioning. It is adapting.</p>
        <p className="ebook-doc-body">Your body isn’t working against you. It’s responding to the environment it’s in.</p>
        <p className="ebook-doc-body">If energy regulation has become unstable, the goal is not to overpower the system. The goal is to restore the environment that supports stable signaling.</p>
        <p className="ebook-doc-body">This is why understanding upstream factors matters.</p>
        <p className="ebook-doc-body">In the next chapter, we will look at GLP-1 medications and examine what they actually do within this signaling network.</p>
        <PageFooter pageNum={9} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 4 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 4</div>
        <h1 className="ebook-doc-h1">GLP-1 Medications. What They Do</h1>

        <p className="ebook-doc-body">GLP-1 medications have changed the landscape of metabolic care. Drugs such as semaglutide and tirzepatide were originally developed to support blood sugar control in type 2 diabetes. Over time, their impact on appetite regulation and body weight became widely recognized.</p>
        <p className="ebook-doc-body">To understand these medications clearly, it is important to return to physiology.</p>
        <p className="ebook-doc-body">These drugs do not create a new hormone. They mimic or amplify the action of GLP-1. In simple terms, they enhance a signal that already exists in the body.</p>
        <p className="ebook-doc-body">When GLP-1 receptor activity increases, several predictable outcomes occur:</p>
        <ul className="ebook-doc-list">
          <li>Insulin secretion improves in response to glucose</li>
          <li>Gastric emptying slows</li>
          <li>Appetite signaling in the brain shifts</li>
          <li>Many people feel full sooner and experience fewer cravings</li>
        </ul>
        <p className="ebook-doc-body">These effects can lead to meaningful weight loss and improved blood sugar regulation.</p>
        <p className="ebook-doc-body">However, the mechanism is amplification, not reconstruction.</p>
        <p className="ebook-doc-body">Semaglutide primarily acts as a GLP-1 receptor agonist. It binds to the GLP-1 receptor and activates it for a prolonged period of time. This sustained receptor activity contributes to appetite suppression and improved glycemic control.</p>
        <p className="ebook-doc-body">Tirzepatide works slightly differently. It activates both GLP-1 receptors and GIP receptors, another incretin hormone pathway. Because of this dual action, some individuals experience stronger metabolic effects.</p>
        <p className="ebook-doc-body">Retatrutide is being studied as a triple agonist, targeting GLP-1, GIP, and glucagon receptors. Its broader receptor activity may produce more significant weight and metabolic changes in some individuals.</p>
        <p className="ebook-doc-body">The key distinction is this. These medications increase receptor activation. They do not repair gut barrier integrity. They do not automatically restore muscle mass. They do not correct sleep patterns. They do not eliminate chronic stress. They do not directly rebuild mitochondrial efficiency.</p>
        <p className="ebook-doc-body">For some individuals, medications create an opportunity. Appetite becomes manageable. Blood sugar stabilizes. Space is created to build healthier habits.</p>
        <p className="ebook-doc-body">For others, side effects emerge.</p>
        <ul className="ebook-doc-list">
          <li>Nausea or digestive discomfort</li>
          <li>Gallbladder stress</li>
          <li>Fatigue</li>
          <li>Muscle loss</li>
        </ul>
        <p className="ebook-doc-body">Reduced appetite without adequate protein intake may accelerate lean tissue loss. Rapid weight loss without resistance training can compromise metabolic resilience.</p>
        <p className="ebook-doc-body">The outcome depends on the environment in which the medication is used.</p>
        <PageFooter pageNum={10} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 4 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <p className="ebook-doc-body">If the internal terrain remains inflamed, stressed, or undernourished, long term sustainability may be limited once the medication is stopped. If foundational support is in place, outcomes may be more stable.</p>
        <p className="ebook-doc-body">It is important to approach this topic without extremes.</p>
        <p className="ebook-doc-body">GLP-1 medications are not magic.</p>
        <p className="ebook-doc-body">They are not failure. They are not shortcuts in a moral sense. They are tools that amplify a signal, not rebuild the system underneath it.</p>
        <p className="ebook-doc-body">The more important question is whether the signaling environment underneath is being supported.</p>
        <p className="ebook-doc-body">If appetite is reduced but protein intake is insufficient, muscle mass may decline. If blood sugar improves but sleep remains disrupted, stress signaling may continue to interfere with regulation. If weight decreases but resistance training is absent, metabolic flexibility may not improve.</p>
        <p className="ebook-doc-body">Medication can shift appetite and blood sugar.</p>
        <p className="ebook-doc-body">It does not restore the system underneath it.</p>
        <p className="ebook-doc-body">Understanding what these drugs do allows you to make informed decisions. Whether you choose to use medication, avoid it, or use it temporarily, the same foundational principles apply. Gut stability, metabolic support, muscle preservation, stress regulation, and inflammatory control remain essential.</p>
        <p className="ebook-doc-body">This is why some people feel great while using these medications…</p>
        <p className="ebook-doc-body">but struggle once they stop.</p>
        <p className="ebook-doc-body">The signal was being amplified, but the system underneath it was never fully rebuilt.</p>
        <p className="ebook-doc-body">And without that foundation, the same patterns can return.</p>
        <p className="ebook-doc-body">In the next chapter, we will shift toward how GLP-1 signaling can be supported naturally by improving the terrain in which the signal operates.</p>
        <PageFooter pageNum={11} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 5</div>
        <h1 className="ebook-doc-h1">Supporting GLP-1 Naturally</h1>

        <p className="ebook-doc-body">These are not random health tips. They are inputs that stabilize the signaling environment, helping the body create, receive, and respond to GLP-1 more reliably.</p>
        <p className="ebook-doc-body">Supporting GLP-1 naturally is not about forcing your body to produce more hormone.</p>
        <p className="ebook-doc-body">In most cases, GLP-1 dysfunction is downstream. It often reflects stress in the gut, blood sugar system, nervous system, sleep rhythm, muscle tissue, or inflammatory load.</p>
        <p className="ebook-doc-body">The goal is to support the terrain upstream so appetite, energy, and hormone signaling can become more predictable.</p>

        <h2 className="ebook-doc-h2">Protein and satiety signaling</h2>
        <p className="ebook-doc-body">Protein helps meals feel more satisfying. It also supports lean muscle, which is important for blood sugar regulation and metabolic resilience.</p>
        <p className="ebook-doc-body">When protein is too low, you may feel full for a short period, but hunger can return quickly and cravings can feel harder to manage. A steady protein rhythm gives the body a clearer satiety signal.</p>
        <div className="ebook-image-placeholder"><img src={proteinFoods} alt="Whole food protein sources including salmon, eggs, yogurt, and legumes" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Fiber and gut signaling</h2>
        <p className="ebook-doc-body">Fiber slows the rise of blood sugar after meals and feeds beneficial gut bacteria. This helps create a steadier post-meal response.</p>
        <p className="ebook-doc-body">Resistant starch is a special type of fiber that passes through the small intestine and becomes fuel for microbes in the colon. Cooled potatoes, oats, beans, lentils, and green banana are simple examples.</p>
        <p className="ebook-doc-body">Without enough fiber, blood sugar can rise quickly after meals and drop just as fast, often driving cravings, energy crashes, and the feeling of needing to eat again soon after.</p>
        <PageFooter pageNum={12} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-image-placeholder" style={{ marginTop: 0 }}><img src={fiberFoods} alt="Fiber-rich and resistant starch foods including oats, beans, green banana, and potatoes" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Healthy fats and hormone signaling</h2>
        <p className="ebook-doc-body">Healthy fats help meals feel complete. They slow digestion in a supportive way and can make appetite cues feel more stable.</p>
        <p className="ebook-doc-body">Avocado, olive oil, nuts, seeds, and fatty fish can be helpful when they are used to balance a meal, not replace protein or fiber.</p>
        <div className="ebook-image-placeholder"><img src={healthyFats} alt="Healthy fats including avocado, olive oil, nuts, and seeds" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Polyphenol-rich foods and metabolic signaling</h2>
        <p className="ebook-doc-body">Polyphenols are plant compounds found in berries, greens, herbs, spices, olives, cocoa, and deeply colored foods. They help support the gut environment and reduce oxidative stress.</p>
        <p className="ebook-doc-body">They do not act like medication. They are gentle inputs that support a healthier signaling environment over time.</p>
        <PageFooter pageNum={13} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-image-placeholder" style={{ marginTop: 0 }}><img src={polyphenols} alt="Polyphenol-rich foods including berries, herbs, greens, olives, and cocoa nibs" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Tea and the incretin effect</h2>
        <p className="ebook-doc-body">The incretin effect describes how the gut helps signal insulin release after eating. GLP-1 is one of the hormones involved in this response.</p>
        <p className="ebook-doc-body">Green tea, matcha, and yerba mate contain plant compounds that may gently support metabolic signaling for some people. They are optional, not required, and should be used only if tolerated well.</p>
        <div className="ebook-image-placeholder"><img src={teaIncretin} alt="Green tea, matcha, and yerba mate arranged with herbs" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Gut microbiome support</h2>
        <p className="ebook-doc-body">The gut microbiome helps shape the environment where GLP-1 signaling begins. A more diverse, stable microbiome can support better communication between digestion, metabolism, and appetite.</p>
        <p className="ebook-doc-body">Akkermansia is one helpful microbe often discussed in gut health. It is associated with the protective mucus layer of the gut lining. The goal is not to chase one microbe, but to build a gut environment where beneficial microbes can thrive.</p>
        <PageFooter pageNum={14} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Movement and GLP-1 response</h2>
        <p className="ebook-doc-body">Movement helps glucose move into muscle. This improves the downstream response to metabolic signals and can make energy feel more stable.</p>
        <p className="ebook-doc-body">Walking after meals is one of the simplest ways to support blood sugar rhythm. Resistance training also matters because muscle tissue is a major site for glucose storage and use.</p>
        <div className="ebook-image-placeholder"><img src={movementImage} alt="Woman walking outdoors in a peaceful garden setting" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Sleep and circadian rhythm</h2>
        <p className="ebook-doc-body">Sleep signals hunger hormones, blood sugar regulation, cortisol rhythm, and appetite control. When sleep is short or inconsistent, hunger and stress signaling can shift, making the body feel more reactive around food even if your intake has not changed.</p>
        <p className="ebook-doc-body">A steadier sleep rhythm supports the internal timing system that helps metabolism respond more predictably.</p>
        <PageFooter pageNum={15} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-image-placeholder" style={{ marginTop: 0 }}><img src={sleepCalm} alt="Calming evening scene with linen bedding, tea, and a book" loading="lazy" width={1024} height={768} /></div>

        <h2 className="ebook-doc-h2">Stress and nervous system regulation</h2>
        <p className="ebook-doc-body">Chronic stress changes the chemistry of the body. Cortisol can affect blood sugar, cravings, digestion, sleep, and the way appetite cues are interpreted.</p>
        <p className="ebook-doc-body">Nervous system regulation does not need to be complicated. Quiet meals, slow breathing, gentle walks, sunlight, consistent routines, and less over-scheduling can all support the signaling environment.</p>

        <h2 className="ebook-doc-h2">When supplements or medications may be needed</h2>
        <p className="ebook-doc-body">Supplements and medications can be useful tools, but they should not be the first guess. They should be introduced after proper testing, a careful review of symptoms and health history, and guidance from a qualified medical professional.</p>
        <p className="ebook-doc-body">This is especially important if you are using a GLP-1 medication, managing blood sugar concerns, taking prescriptions, or experiencing significant digestive symptoms.</p>

        <h2 className="ebook-doc-h2">The real goal</h2>
        <p className="ebook-doc-body">Supporting GLP-1 naturally means rebuilding the system upstream. Food, movement, sleep, and stress regulation are not small details. They are the conditions that help the signal work better.</p>
        <p className="ebook-doc-body">They work together to stabilize the signaling environment your body depends on.</p>
        <p className="ebook-doc-body">When that environment becomes more stable, appetite, energy, and metabolic responses begin to feel more predictable again.</p>
        <p className="ebook-doc-body">This is not about doing everything perfectly.</p>
        <p className="ebook-doc-body">It is about creating enough consistency for your body to respond differently over time.</p>
        <p className="ebook-doc-body">In the next chapter, we will examine order of operations and why gut stability and metabolic chemistry come before expecting hormone signaling to normalize.</p>
        <PageFooter pageNum={16} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 6 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 6</div>
        <h1 className="ebook-doc-h1">Order of Operations</h1>

        <p className="ebook-doc-body">When metabolic regulation becomes unstable, the instinct is often to intervene at the level of appetite or body weight.</p>
        <p className="ebook-doc-body">But hormone signaling does not exist at the top of the hierarchy.</p>
        <p className="ebook-doc-body">It exists downstream.</p>
        <p className="ebook-doc-body">GLP-1 is influenced by the environment in which it is produced and received. That environment begins in the gut, extends through metabolic chemistry, and ultimately signals broader hormonal balance.</p>
        <p className="ebook-doc-body">If you try to correct the bottom of the chain without stabilizing the top, progress may be inconsistent.</p>
        <h2 className="ebook-doc-h2">Gut</h2>
        <p className="ebook-doc-body">GLP-1 is released from the small intestine. If the gut lining is irritated, inflamed, or functionally unstable, hormone signaling becomes less predictable. Digestive stress, microbial imbalance, and irregular meal patterns all affect the quality of the signal at its source.</p>
        <p className="ebook-doc-body">Restoring digestive stability creates the foundation for reliable signaling.</p>
        <h2 className="ebook-doc-h2">Metabolism</h2>
        <p className="ebook-doc-body">Blood sugar stability, insulin sensitivity, muscle mass, sleep quality, and inflammatory load all shape how the body responds to GLP-1. Even if the hormone is released appropriately, the downstream response depends on cellular health and metabolic flexibility.</p>
        <p className="ebook-doc-body">Improving metabolic chemistry strengthens the body's ability to respond to signals effectively.</p>
        <h2 className="ebook-doc-h2">Hormones</h2>
        <p className="ebook-doc-body">When gut stability and metabolic chemistry improve, broader hormonal patterns begin to stabilize. Appetite regulation becomes more predictable. Energy becomes more consistent. Weight changes occur within a more regulated system rather than through force.</p>
        <p className="ebook-doc-body">Attempting to regulate hormones without addressing the layers beneath them can create temporary shifts, but rarely lasting stability.</p>
        <p className="ebook-doc-body">This is why order matters.</p>
        <p className="ebook-doc-body">Most people try to fix the symptom. This shows you where to start.</p>

        <div className="ebook-doc-diagram">
          <div className="ebook-doc-layers">
            <div className="ebook-doc-layer" style={{ background: "#A3BFA8", width: "160px" }}>Gut</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#AE9297", width: "200px" }}>Metabolism</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#4B2E4C", width: "240px" }}>Hormones</div>
          </div>
        </div>

        <p className="ebook-doc-body">Gut stability supports metabolic chemistry. Metabolic chemistry supports hormone signaling. Hormone signaling directly affects appetite, energy, and body composition.</p>
        <p className="ebook-doc-body">When you respect the hierarchy, you work with the system rather than against it.</p>
        <p className="ebook-doc-body">In the next chapter, we will bring this framework together in a structured 90-day approach that moves through these layers intentionally and progressively.</p>
        <PageFooter pageNum={17} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 7 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 7</div>
        <h1 className="ebook-doc-h1">Introduction to the 90-Day GLP-1 Optimization Protocol</h1>

        <img src={protocolTransition} alt="A woman walking peacefully in nature, representing the journey of metabolic restoration" className="ebook-doc-image" style={{ maxHeight: "2.5in", objectFit: "cover" }} />

        <p className="ebook-doc-body">Understanding GLP-1 is important. Supporting how it functions in your body is essential. But lasting metabolic change usually requires structure, sequence, and enough time to observe what your body is communicating.</p>
        <p className="ebook-doc-body">The 90-Day GLP-1 Optimization Protocol is introduced here as a next layer of support, not as a full protocol included inside this ebook.</p>
        <p className="ebook-doc-body">The purpose is to show the order of operations: stabilize the gut, support metabolic chemistry, then refine hormone signaling.</p>
        <p className="ebook-doc-body">This ebook gives you the framework for understanding how the system works, but understanding alone does not create change.</p>
        <p className="ebook-doc-body">Structure is what allows the body to actually shift.</p>
        <p className="ebook-doc-body">The full protocol is designed to walk you step by step through how to apply each phase in real life.</p>

        <div className="ebook-doc-phase-box">
          <div className="ebook-doc-phase-header">Phase 1: Reset the Chemistry - Days 1-30</div>
          <p className="ebook-doc-body">This phase focuses on calming digestive stress, stabilizing blood sugar, and restoring meal rhythm.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Key priorities include:</p>
          <ul className="ebook-doc-list">
            <li>Consistent meals with protein and fiber</li>
            <li>Gentle support for digestion and hydration</li>
            <li>Reducing obvious inflammatory inputs</li>
            <li>Simple sleep and movement rhythms</li>
          </ul>
          <p className="ebook-doc-body">The focus is stability, not intensity.</p>
        </div>
        <PageFooter pageNum={18} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 7 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-phase-box" style={{ borderLeftColor: "#AE9297", marginTop: 0 }}>
          <div className="ebook-doc-phase-header">Phase 2: Restore the Metabolism - Days 31-60</div>
          <p className="ebook-doc-body">This phase focuses on strengthening metabolic responsiveness once the foundation is steadier.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Key priorities include:</p>
          <ul className="ebook-doc-list">
            <li>Muscle preservation and supportive movement</li>
            <li>Blood sugar steadiness</li>
            <li>Sleep protection</li>
            <li>Stress regulation that fits real life</li>
          </ul>
        </div>

        <div className="ebook-doc-phase-box" style={{ borderLeftColor: "#4B2E4C" }}>
          <div className="ebook-doc-phase-header">Phase 3: Reharmonize the System - Days 61-90</div>
          <p className="ebook-doc-body">This phase focuses on integration and personalization after consistency is established.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Key priorities include:</p>
          <ul className="ebook-doc-list">
            <li>Refining meals around hunger, energy, and activity</li>
            <li>Maintaining gut and metabolic foundations</li>
            <li>Watching patterns instead of forcing outcomes</li>
            <li>Personalizing only after the basics are stable</li>
          </ul>
        </div>

        <p className="ebook-doc-body">If your hunger feels inconsistent…</p>
        <p className="ebook-doc-body">If your energy doesn’t match what you’re doing…</p>
        <p className="ebook-doc-body">If you feel like you’re trying, but your body isn’t responding…</p>
        <p className="ebook-doc-body">This is where structure starts to matter.</p>
        <p className="ebook-doc-body">The 90-Day GLP-1 Optimization Protocol gives you a clear, step-by-step way to stabilize the system underneath those symptoms… not just manage them temporarily.</p>
        <a href="/90day-protocol" className="ebook-doc-cta">Get the Full 90-Day GLP-1 Optimization Protocol</a>
        <PageFooter pageNum={19} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== NEXT STEPS ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Next Steps</div>
        <h1 className="ebook-doc-h1">Continuing the Work</h1>

        <p className="ebook-doc-body">This ebook gives you the foundation for understanding GLP-1 as part of a larger system. The next step is not to chase a stronger signal. It is to build the conditions that help the signal work more clearly.</p>
        <p className="ebook-doc-body">The 90-Day GLP-1 Optimization Protocol is the natural continuation of this framework. It takes the ideas introduced here and organizes them into a more structured pathway.</p>
        <p className="ebook-doc-body">Rather than trying to change everything at once, the pathway moves in sequence: gut stability first, metabolic support second, hormone signaling refinement third.</p>

        <h2 className="ebook-doc-h2">A structured continuation can help you focus on:</h2>
        <ul className="ebook-doc-list">
          <li>Understanding which upstream factors may be affecting your GLP-1 response</li>
          <li>Building meal rhythm around protein, fiber, and blood sugar stability</li>
          <li>Supporting digestion, muscle, movement, sleep, and stress regulation</li>
          <li>Observing your real-life response before adding more complexity</li>
          <li>Personalizing support with testing and professional guidance when needed</li>
        </ul>

        <p className="ebook-doc-body">If this ebook helped you see your symptoms through a more connected lens, the next layer is learning how to apply the sequence with more structure and clarity.</p>
        <h2 className="ebook-doc-h2">Is this next step right for you?</h2>
        <p className="ebook-doc-body">This next step is for you if:</p>
        <ul className="ebook-doc-list">
          <li>You feel like you’re doing everything right, but your body isn’t responding</li>
          <li>Your hunger doesn’t match what you’re eating</li>
          <li>Your energy drops throughout the day</li>
          <li>Your cravings feel unpredictable or hard to control</li>
        </ul>
        <p className="ebook-doc-body">If you recognized yourself in these patterns, it’s not because you lack discipline.</p>
        <p className="ebook-doc-body">It’s because your signaling environment hasn’t been supported yet.</p>
        <p className="ebook-doc-body">And that is something that can be rebuilt.</p>
        <p className="ebook-doc-body">You don’t need more restriction.</p>
        <p className="ebook-doc-body">You need a system that works with your body.</p>
        <p className="ebook-doc-body" style={{ fontStyle: "italic", color: "#AE9297" }}>This ebook is educational in nature and does not replace care from your licensed healthcare provider.</p>
        <p className="ebook-doc-body">To explore supportive resources, visit <a href="https://www.herwellnessharmony.com" style={{ color: "#4B2E4C", textDecoration: "underline" }}>www.herwellnessharmony.com</a>.</p>
        <PageFooter pageNum={20} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== APPENDIX ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Appendix</div>
        <h1 className="ebook-doc-h1">References and Notes</h1>

        <p className="ebook-doc-body">This ebook is designed for educational purposes and is not intended to diagnose, treat, or replace individualized medical care. The physiology discussed throughout this guide is supported by established research in endocrinology, metabolism, and gastrointestinal signaling.</p>

        <h2 className="ebook-doc-h2">Key Scientific Foundations of GLP-1 Physiology</h2>
        <ul className="ebook-doc-list" style={{ listStyleType: "none", paddingLeft: 0 }}>
          <li style={{ marginBottom: "0.8em" }}>Holst, J.J. (2007). The physiology of glucagon-like peptide 1. <em>Physiological Reviews</em>, 87(4), 1409-1439. A foundational review describing how GLP-1 is secreted from intestinal L-cells, its role in insulin secretion, appetite regulation, and gastric emptying.</li>
          <li style={{ marginBottom: "0.8em" }}>Drucker, D.J. (2018). Mechanisms of action and therapeutic application of glucagon-like peptide-1. <em>Cell Metabolism</em>, 27(4), 740-756. Explains how GLP-1 receptor signaling works and how pharmaceutical agonists mimic natural GLP-1 activity.</li>
          <li style={{ marginBottom: "0.8em" }}>Nauck, M.A., Meier, J.J. (2018). Incretin hormones: Their role in health and disease. <em>Diabetes, Obesity and Metabolism</em>, 20(S1), 5-21. Details the incretin effect and how GLP-1 contributes to glucose-dependent insulin secretion.</li>
          <li style={{ marginBottom: "0.8em" }}>DeFronzo, R.A. et al. (2016). Pathophysiologic approach to therapy in type 2 diabetes. <em>Diabetes Care</em>, 39(Supplement 2), S52-S59. Discusses insulin resistance, beta-cell function, and the broader metabolic context in which GLP-1 operates.</li>
          <li style={{ marginBottom: "0.8em" }}>Chaudhri, O.B., et al. (2008). The role of gut hormones in appetite regulation. <em>Gastroenterology</em>, 135(6), 2030-2042. Describes how gut-derived hormones, including GLP-1, influence satiety and energy intake.</li>
          <li style={{ marginBottom: "0.8em" }}>Lean, M.E.J., et al. (2021). The role of GLP-1 receptor agonists in weight management. <em>Nature Reviews Endocrinology</em>, 17, 593-606. Reviews pharmaceutical GLP-1 agonists and their effects on weight, appetite, and metabolic regulation.</li>
        </ul>
        <PageFooter pageNum={21} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== APPENDIX continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Notes on Order of Operations</h2>
        <p className="ebook-doc-body">The framework presented in this ebook, Gut → Metabolism → Hormones, reflects a physiology-based systems approach. While simplified for clarity, it aligns with the understanding that:</p>
        <ul className="ebook-doc-list">
          <li>Gut integrity and nutrient signaling influence incretin hormone release</li>
          <li>Blood sugar stability signals insulin and GLP-1 signaling dynamics</li>
          <li>Chronic metabolic stress alters downstream hormonal balance</li>
        </ul>
        <p className="ebook-doc-body">This guide integrates research on incretin biology with clinical observations in metabolic health, gut physiology, and hormone regulation.</p>

        <h2 className="ebook-doc-h2">Notes on Natural GLP-1 Support</h2>
        <p className="ebook-doc-body">Emerging research suggests that GLP-1 secretion may be influenced by:</p>
        <ul className="ebook-doc-list">
          <li>Dietary fiber and short-chain fatty acid production</li>
          <li>Protein intake and amino acid signaling</li>
          <li>Gastric emptying rate</li>
          <li>Insulin sensitivity</li>
          <li>Sleep quality and circadian rhythm</li>
          <li>Exercise-induced metabolic adaptation</li>
        </ul>
        <p className="ebook-doc-body">The protocol outlined in this ebook focuses on foundational physiology rather than isolated supplementation.</p>

        <h2 className="ebook-doc-h2">Medication Clarification</h2>
        <p className="ebook-doc-body">GLP-1 receptor agonists such as semaglutide, tirzepatide, and retatrutide are pharmaceutical agents that activate GLP-1 receptors. These medications do not "create" natural GLP-1 production but mimic or amplify receptor signaling. Their long-term metabolic impact depends on the broader physiological environment in which they are used.</p>

        <h2 className="ebook-doc-h2">Final Note</h2>
        <p className="ebook-doc-body">Understanding GLP-1 as a signal rather than a fat-loss shortcut allows for a more sustainable and systems-based approach to metabolism.</p>

        <PageFooter pageNum={22} />
      </div>
      </EbookScaler>
    </div>
  );
}
