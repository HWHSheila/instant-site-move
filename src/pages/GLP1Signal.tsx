import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useCallback } from "react";
import coverBg from "@/assets/glp1-cover-bg.jpg";
import chapterOpener from "@/assets/glp1-chapter-opener.jpg";
import protocolTransition from "@/assets/glp1-protocol-transition.jpg";
import coachingImg from "@/assets/glp1-coaching.jpg";

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
          padding: 0.75in 1in;
        }
        .ebook-doc-h1 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.65rem;
          line-height: 1.3;
          margin-bottom: 0.75em;
          margin-top: 0;
        }
        .ebook-doc-h2 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1.15rem;
          line-height: 1.35;
          margin-top: 1.75em;
          margin-bottom: 0.6em;
        }
        .ebook-doc-h3 {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 1.5em;
          margin-bottom: 0.4em;
        }
        .ebook-doc-body {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #3A3A3A;
          margin-bottom: 0.8em;
          margin-top: 0;
        }
        .ebook-doc-list {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #3A3A3A;
          padding-left: 1.5em;
          margin-bottom: 0.8em;
          margin-top: 0;
          list-style-type: disc;
          list-style-position: outside;
        }
        .ebook-doc-list li {
          margin-bottom: 0.3em;
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
          margin-bottom: 1.1em;
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
        .ebook-doc-layers {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin: 1em 0;
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
          margin: 1.25em 0;
        }
        .ebook-doc-phase-header {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.4em;
        }
        .ebook-doc-toc-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          color: #3A3A3A;
          padding: 0.45em 0;
          border-bottom: 1px solid #D9D1CB;
        }
        .ebook-doc-toc-chapter {
          font-family: 'Montserrat', sans-serif;
          color: #4B2E4C;
          font-weight: 600;
        }
        .ebook-doc-image {
          width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1em 0;
          display: block;
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1in",
      }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#AE9297", marginBottom: "3em" }}>
          HER WELLNESS HARMONY
        </p>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "2.4rem", color: "#4B2E4C", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.5em" }}>
          Understanding<br />GLP-1 Signaling
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9rem", fontWeight: 400, color: "#383838", lineHeight: 1.6, maxWidth: "380px", marginBottom: "3em" }}>
          How gut health, blood sugar, and metabolic stress influence appetite regulation and hormone balance.
        </p>
        <hr style={{ width: "50px", height: "2px", background: "#C9A646", border: "none", marginBottom: "2em" }} />
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "#AE9297", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25em" }}>Written By</p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.3rem", fontWeight: 600, color: "#4B2E4C", marginBottom: "0" }}>
          Sheila McFarland
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "#AE9297", position: "absolute", bottom: "0.75in" }}>
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
          { ch: "Chapter 4", title: "GLP-1 Medications. What They Really Do" },
          { ch: "Chapter 5", title: "Supporting GLP-1 Naturally" },
          { ch: "Chapter 6", title: "Order of Operations. Gut → Metabolism → Hormones" },
          { ch: "Chapter 7", title: "The 90-Day GLP-1 Optimization Protocol" },
          { ch: "", title: "Next Steps" },
          { ch: "", title: "Appendix: References and Notes" },
        ].map((item, i) => (
          <div key={i} className="ebook-doc-toc-item">
            {item.ch && <span className="ebook-doc-toc-chapter">{item.ch} — </span>}
            <span>{item.title}</span>
          </div>
        ))}
        <PageFooter pageNum={2} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== INTRODUCTION ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Introduction</div>
        <h1 className="ebook-doc-h1">Renewing Your Metabolism by Understanding the Chemistry Behind GLP-1</h1>

        <p className="ebook-doc-body">Over the past few years, GLP-1 has moved from a relatively unknown metabolic hormone to a household term. Medications like semaglutide, tirzepatide, and retatrutide have changed the conversation around weight loss, appetite, and metabolic health. Social media is filled with before and after photos, appetite suppression stories, and headlines describing these drugs as revolutionary.</p>
        <p className="ebook-doc-body">In many ways, they are.</p>
        <p className="ebook-doc-body">But the sudden attention on GLP-1 has also created confusion.</p>
        <p className="ebook-doc-body">GLP-1 is often described as a weight loss hormone or a fat burning accelerator. It is neither.</p>
        <p className="ebook-doc-body">GLP-1 is a hormone your body uses for signaling.</p>
        <p className="ebook-doc-body">Every time you eat, your gut releases GLP-1 as part of a signaling cascade that helps regulate digestion, blood sugar, insulin response, and satiety. It does not burn fat directly. It does not override physiology. It does not replace foundational metabolic health.</p>
        <p className="ebook-doc-body">What the popularity of GLP-1 medications has revealed is something deeper. Metabolism is chemical. It is coordinated. It responds to signaling, not just calories, willpower, or discipline.</p>
        <p className="ebook-doc-body">When GLP-1 signaling functions properly, the body responds efficiently to food. Blood sugar stabilizes more easily. Appetite cues feel appropriate. Energy regulation becomes smoother. When signaling breaks down, the system becomes dysregulated. Hunger increases. Blood sugar becomes erratic. Fat storage becomes easier. Energy feels inconsistent.</p>
        <p className="ebook-doc-body">Most conversations focus on how to increase GLP-1.</p>
        <p className="ebook-doc-body">This book focuses on understanding it.</p>
        <p className="ebook-doc-body">Inside these pages, you will learn what GLP-1 actually is, how it functions as a signaling hormone, why signaling breaks down, what medications truly do inside the body, and how to support GLP-1 naturally by restoring the chemistry upstream.</p>
        <p className="ebook-doc-body">GLP-1 does not operate in isolation. It sits within a larger metabolic hierarchy that begins in the gut, extends through insulin sensitivity and energy metabolism, and ultimately influences hormones and body composition.</p>
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

        <p className="ebook-doc-body">GLP-1 stands for glucagon-like peptide-1. It is not a drug. It is not a supplement. It is not a fat-burning hormone.</p>
        <p className="ebook-doc-body">It is a hormone your body uses for signaling.</p>
        <p className="ebook-doc-body">GLP-1 is made in the gut, specifically by specialized cells called L-cells. These cells respond when you eat and release GLP-1 as part of the body's signaling system. In simple terms, this is one of the ways your gut tells the rest of your body that food has arrived and it's time to respond.</p>
        <p className="ebook-doc-body">Its role is to coordinate what happens next.</p>
        <p className="ebook-doc-body">GLP-1 tells your body that nutrients have arrived and it is time to respond appropriately.</p>
        <p className="ebook-doc-body">When GLP-1 is released, several important things happen:</p>
        <ul className="ebook-doc-list">
          <li>Insulin is released in response to food</li>
          <li>Glucagon levels decrease</li>
          <li>Stomach emptying slows</li>
          <li>Appetite signals in the brain shift</li>
          <li>Blood sugar becomes more stable</li>
        </ul>
        <p className="ebook-doc-body">GLP-1 does not burn fat. It coordinates metabolic traffic.</p>
        <p className="ebook-doc-body">It helps your body decide what to do with incoming energy.</p>

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
        <p className="ebook-doc-body">GLP-1 is not magic.</p>
        <p className="ebook-doc-body">It is biology.</p>

        <h2 className="ebook-doc-h2">The Real Takeaway</h2>
        <p className="ebook-doc-body">GLP-1 is not a weight loss trick.</p>
        <p className="ebook-doc-body">It is a signal that helps regulate energy distribution, appetite, and glucose balance.</p>
        <p className="ebook-doc-body">If you understand that it is a messenger rather than a fat burner, everything else in this book will make more sense.</p>
        <p className="ebook-doc-body">In the next chapter, we will look more closely at why calling GLP-1 a fat-burning hormone is not only inaccurate, but misleading.</p>
        <PageFooter pageNum={5} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 2 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 2</div>
        <h1 className="ebook-doc-h1">GLP-1 Is a Signal, Not a Fat Burner</h1>

        <p className="ebook-doc-body">One of the most common misunderstandings about GLP-1 is that it is a fat-burning hormone.</p>
        <p className="ebook-doc-body">It is not.</p>
        <p className="ebook-doc-body">GLP-1 does not directly burn fat tissue. It does not increase metabolic rate in a dramatic way. It does not force the body to lose weight.</p>
        <p className="ebook-doc-body">GLP-1 is a signaling hormone.</p>
        <p className="ebook-doc-body">Its role is coordination.</p>
        <p className="ebook-doc-body">When you eat, GLP-1 helps regulate how your body responds to incoming nutrients. It influences insulin release, slows gastric emptying, and communicates satiety to the brain. It helps stabilize blood sugar after meals. It contributes to appetite regulation.</p>
        <p className="ebook-doc-body">Those effects can support weight loss.</p>
        <p className="ebook-doc-body">But they are not the same thing as fat burning.</p>

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
          <li>But it does not automatically rebuild the terrain</li>
        </ul>
        <PageFooter pageNum={6} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 2 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>GLP-1 Works Within a System</h2>
        <p className="ebook-doc-body">GLP-1 interacts with insulin. Insulin interacts with muscle tissue. Muscle tissue influences glucose uptake. Glucose uptake influences mitochondrial energy production. Mitochondrial efficiency influences fatigue, hunger signaling, and metabolic flexibility.</p>
        <p className="ebook-doc-body">This is a chain.</p>
        <div className="ebook-doc-flow" style={{ margin: "1.25em 0" }}>
          <span className="ebook-doc-flow-step">GLP-1</span>
          <span className="ebook-doc-flow-arrow">→</span>
          <span className="ebook-doc-flow-step">Insulin</span>
          <span className="ebook-doc-flow-arrow">→</span>
          <span className="ebook-doc-flow-step">Muscle</span>
          <span className="ebook-doc-flow-arrow">→</span>
          <span className="ebook-doc-flow-step">Glucose uptake</span>
          <span className="ebook-doc-flow-arrow">→</span>
          <span className="ebook-doc-flow-step">Mitochondria</span>
          <span className="ebook-doc-flow-arrow">→</span>
          <span className="ebook-doc-flow-step">Energy output</span>
        </div>
        <p className="ebook-doc-body">If one part of the chain is unstable, the overall outcome changes.</p>
        <p className="ebook-doc-body">Calling GLP-1 a fat-burning hormone oversimplifies a complex system.</p>
        <p className="ebook-doc-body">It reduces a communication network to a single outcome.</p>
        <p className="ebook-doc-body">GLP-1 helps regulate energy distribution and appetite cues. It supports coordination between digestion, blood sugar control, and satiety.</p>
        <p className="ebook-doc-body">It does not replace foundational physiology.</p>

        <h2 className="ebook-doc-h2">The Shift in Perspective</h2>
        <p className="ebook-doc-body">If GLP-1 is a signal rather than a fat burner, the goal changes.</p>
        <p className="ebook-doc-body">The goal is no longer to force appetite suppression.</p>
        <p className="ebook-doc-body">The goal becomes improving the signaling environment.</p>
        <p className="ebook-doc-body">That means supporting gut health, stabilizing blood sugar, preserving muscle, improving sleep quality, and reducing inflammatory load.</p>
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
        <p className="ebook-doc-body">GLP-1 functions inside a network. When that network becomes unstable, the signal weakens, distorts, or becomes less effective.</p>
        <p className="ebook-doc-body">To understand why GLP-1 signaling breaks, we need to look upstream.</p>

        <h2 className="ebook-doc-h2">Gut Dysfunction</h2>
        <p className="ebook-doc-body">GLP-1 is produced in the small intestine.</p>
        <p className="ebook-doc-body">If the gut lining is inflamed, irritated, or compromised, signaling can be affected at the source.</p>
        <p className="ebook-doc-body">Common contributors include:</p>
        <ul className="ebook-doc-list">
          <li>Chronic stress</li>
          <li>Repeated restrictive dieting</li>
          <li>Low fiber intake</li>
          <li>Dysbiosis</li>
          <li>Poor sleep</li>
          <li>High inflammatory load</li>
        </ul>
        <p className="ebook-doc-body">When the gut environment is unstable, hormone signaling becomes inconsistent.</p>
        <p className="ebook-doc-body">The intestine is not just a digestive organ. It is an endocrine organ. If the terrain is disrupted, the signal may weaken.</p>

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
        <p className="ebook-doc-body">The signal may still be present, but the response is altered.</p>
        <PageFooter pageNum={8} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 3 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Chronic Stress and Nervous System Dysregulation</h2>
        <p className="ebook-doc-body">The gut and brain communicate continuously through the vagus nerve and stress hormones.</p>
        <p className="ebook-doc-body">Chronic stress elevates cortisol. Elevated cortisol influences blood sugar. Blood sugar instability influences insulin. Insulin interacts with GLP-1.</p>
        <p className="ebook-doc-body">Everything connects.</p>
        <p className="ebook-doc-body">If the nervous system is constantly in a heightened stress state, signaling patterns shift. Hunger cues can intensify. Appetite regulation becomes less predictable. Energy becomes less stable.</p>
        <p className="ebook-doc-body">This is not a willpower issue.</p>
        <p className="ebook-doc-body">It is a regulatory issue.</p>

        <h2 className="ebook-doc-h2">Loss of Muscle Mass</h2>
        <p className="ebook-doc-body">Muscle tissue plays a major role in glucose disposal.</p>
        <p className="ebook-doc-body">When muscle mass decreases, glucose handling becomes less efficient. This can place additional strain on insulin signaling and indirectly affect the broader metabolic network.</p>
        <p className="ebook-doc-body">Aggressive dieting, inadequate protein intake, and lack of resistance training can all reduce lean mass over time.</p>
        <p className="ebook-doc-body">GLP-1 signaling does not operate independently from muscle health.</p>
        <p className="ebook-doc-body">Metabolism is tissue dependent.</p>

        <h2 className="ebook-doc-h2">Inflammation</h2>
        <p className="ebook-doc-body">Low-grade systemic inflammation can interfere with hormonal communication.</p>
        <p className="ebook-doc-body">Inflammatory signals influence insulin sensitivity, appetite regulation, and energy production.</p>
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
        <p className="ebook-doc-body">If energy regulation has become unstable, the goal is not to overpower the system. The goal is to restore the environment that supports stable signaling.</p>
        <p className="ebook-doc-body">This is why understanding upstream factors matters.</p>
        <p className="ebook-doc-body">In the next chapter, we will look at GLP-1 medications and examine what they actually do within this signaling network.</p>
        <PageFooter pageNum={9} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 4 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 4</div>
        <h1 className="ebook-doc-h1">GLP-1 Medications. What They Really Do</h1>

        <p className="ebook-doc-body">GLP-1 medications have changed the landscape of metabolic care. Drugs such as semaglutide and tirzepatide were originally developed to support blood sugar control in type 2 diabetes. Over time, their impact on appetite regulation and body weight became widely recognized.</p>
        <p className="ebook-doc-body">To understand these medications clearly, it is important to return to physiology.</p>
        <p className="ebook-doc-body">These drugs do not create a new hormone. They mimic or amplify the action of GLP-1. In simple terms, they enhance a signal that already exists in the body.</p>
        <p className="ebook-doc-body">When GLP-1 receptor activity increases, several predictable outcomes occur. Insulin secretion improves in response to glucose. Gastric emptying slows. Appetite signaling in the brain shifts. Many people feel full sooner and experience fewer cravings.</p>
        <p className="ebook-doc-body">These effects can lead to meaningful weight loss and improved blood sugar regulation.</p>
        <p className="ebook-doc-body">However, the mechanism is amplification, not reconstruction.</p>
        <p className="ebook-doc-body">Semaglutide primarily acts as a GLP-1 receptor agonist. It binds to the GLP-1 receptor and activates it for a prolonged period of time. This sustained receptor activity contributes to appetite suppression and improved glycemic control.</p>
        <p className="ebook-doc-body">Tirzepatide works slightly differently. It activates both GLP-1 receptors and GIP receptors, another incretin hormone pathway. Because of this dual action, some individuals experience stronger metabolic effects.</p>
        <p className="ebook-doc-body">Retatrutide is being studied as a triple agonist, targeting GLP-1, GIP, and glucagon receptors. Its broader receptor activity may produce more significant weight and metabolic changes in some individuals.</p>
        <p className="ebook-doc-body">The key distinction is this. These medications increase receptor activation. They do not repair gut barrier integrity. They do not automatically restore muscle mass. They do not correct sleep patterns. They do not eliminate chronic stress. They do not directly rebuild mitochondrial efficiency.</p>
        <p className="ebook-doc-body">For some individuals, medications create an opportunity. Appetite becomes manageable. Blood sugar stabilizes. Space is created to build healthier habits.</p>
        <p className="ebook-doc-body">For others, side effects emerge.</p>
        <p className="ebook-doc-body">Nausea, digestive discomfort, gallbladder stress, fatigue, or muscle loss can occur. Reduced appetite without adequate protein intake may accelerate lean tissue loss. Rapid weight loss without resistance training can compromise metabolic resilience.</p>
        <p className="ebook-doc-body">The outcome depends on the environment in which the medication is used.</p>
        <PageFooter pageNum={10} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 4 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <p className="ebook-doc-body">If the internal terrain remains inflamed, stressed, or undernourished, long term sustainability may be limited once the medication is stopped. If foundational support is in place, outcomes may be more stable.</p>
        <p className="ebook-doc-body">It is important to approach this topic without extremes.</p>
        <p className="ebook-doc-body">GLP-1 medications are not magic.</p>
        <p className="ebook-doc-body">They are not failure. They are not shortcuts in a moral sense. They are tools that amplify a signal.</p>
        <p className="ebook-doc-body">The more important question is whether the signaling environment underneath is being supported.</p>
        <p className="ebook-doc-body">If appetite is reduced but protein intake is insufficient, muscle mass may decline. If blood sugar improves but sleep remains disrupted, stress signaling may continue to interfere with regulation. If weight decreases but resistance training is absent, metabolic flexibility may not improve.</p>
        <p className="ebook-doc-body">Medication can influence the signal.</p>
        <p className="ebook-doc-body">It does not automatically restore the system.</p>
        <p className="ebook-doc-body">Understanding what these drugs do allows you to make informed decisions. Whether you choose to use medication, avoid it, or use it temporarily, the same foundational principles apply. Gut stability, metabolic support, muscle preservation, stress regulation, and inflammatory control remain essential.</p>
        <p className="ebook-doc-body">In the next chapter, we will shift toward how GLP-1 signaling can be supported naturally by improving the terrain in which the signal operates.</p>
        <PageFooter pageNum={11} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 5</div>
        <h1 className="ebook-doc-h1">Supporting GLP-1 Naturally</h1>

        <p className="ebook-doc-body">If GLP-1 is a signal, then supporting it naturally means improving the environment in which that signal is produced and received.</p>
        <p className="ebook-doc-body">This is not about forcing more hormone output. It is about stabilizing the internal terrain so the body can regulate more effectively on its own.</p>
        <p className="ebook-doc-body">GLP-1 is released in response to food. The quality, composition, and timing of that food influence how strong and stable the signal becomes.</p>
        <p className="ebook-doc-body">Protein plays a critical role. Adequate protein intake supports satiety, preserves lean muscle mass, and stabilizes blood sugar. Amino acids stimulate incretin release and contribute to a more predictable metabolic response after meals. Consistently under-eating protein can weaken appetite regulation over time.</p>
        <p className="ebook-doc-body">Fiber is equally important. Soluble fiber slows glucose absorption and supports microbial fermentation in the gut. Certain gut bacteria produce short chain fatty acids that influence incretin signaling. A low fiber diet can impair this communication pathway. Gradually increasing fiber through whole foods can improve signaling stability.</p>
        <p className="ebook-doc-body">Carbohydrate quality matters more than carbohydrate elimination. Whole, minimally processed carbohydrates paired with protein and fat produce a different glycemic response than refined sugars eaten alone. Stable blood sugar supports coordinated hormone communication.</p>
        <p className="ebook-doc-body">Meal timing influences signaling rhythm. Constant grazing can blunt hunger and satiety cues. Extended periods of chaotic eating can destabilize blood sugar. Regular meals with balanced macronutrients allow the signaling network to regain predictability.</p>
        <p className="ebook-doc-body">Muscle tissue plays a central role in metabolic health. Resistance training improves insulin sensitivity and enhances glucose disposal. When muscle mass increases or is preserved, metabolic flexibility improves. This indirectly supports GLP-1 effectiveness because the downstream response becomes more efficient.</p>
        <PageFooter pageNum={12} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 5 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Sleep and Metabolic Health</h2>
        <p className="ebook-doc-body">Sleep is often underestimated. Inadequate sleep disrupts hunger hormones, increases cortisol, and destabilizes blood sugar regulation. Even one week of poor sleep can alter appetite signaling. Prioritizing consistent sleep is not optional in metabolic restoration. It is foundational.</p>

        <h2 className="ebook-doc-h2">Stress Regulation</h2>
        <p className="ebook-doc-body">Stress regulation also matters. Chronic stress elevates cortisol. Elevated cortisol influences glucose production and insulin sensitivity. When stress remains unmanaged, appetite regulation becomes less predictable. Supporting nervous system regulation through consistent routines, light exposure, movement, and intentional rest strengthens signaling stability.</p>

        <h2 className="ebook-doc-h2">Inflammatory Load</h2>
        <p className="ebook-doc-body">Inflammatory load influences the entire metabolic network. Highly processed foods, sedentary behavior, and chronic sleep deprivation can increase systemic inflammation. Reducing inflammatory inputs does not require perfection. It requires consistency.</p>
        <p className="ebook-doc-body">None of these strategies are extreme. They are foundational.</p>

        <h2 className="ebook-doc-h2">Supporting GLP-1</h2>
        <p className="ebook-doc-body">Supporting GLP-1 naturally is not about biohacking. It is about rebuilding rhythm. It is about restoring predictability to digestion, blood sugar regulation, and energy distribution.</p>
        <p className="ebook-doc-body">When the internal environment stabilizes, signaling becomes clearer. Hunger cues feel appropriate. Energy becomes more reliable. Appetite regulation feels less chaotic.</p>
        <p className="ebook-doc-body">This is not a quick intervention. It is a systems approach.</p>
        <p className="ebook-doc-body">In the next chapter, we will examine order of operations and why restoring the gut and metabolic environment must come before expecting hormone signaling to normalize.</p>
        <PageFooter pageNum={13} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 6 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 6</div>
        <h1 className="ebook-doc-h1">Order of Operations</h1>

        <p className="ebook-doc-body">When metabolic regulation becomes unstable, the instinct is often to intervene at the level of appetite or body weight.</p>
        <p className="ebook-doc-body">But hormone signaling does not exist at the top of the hierarchy.</p>
        <p className="ebook-doc-body">It exists downstream.</p>
        <p className="ebook-doc-body">GLP-1 is influenced by the environment in which it is produced and received. That environment begins in the gut, extends through metabolic chemistry, and ultimately influences broader hormonal balance.</p>
        <p className="ebook-doc-body">If you try to correct the bottom of the chain without stabilizing the top, progress may be inconsistent.</p>
        <p className="ebook-doc-body">The first layer is the gut environment.</p>
        <p className="ebook-doc-body">GLP-1 is released from the small intestine. If the gut lining is irritated, inflamed, or functionally unstable, hormone signaling becomes less predictable. Digestive stress, microbial imbalance, and irregular meal patterns all affect the quality of the signal at its source.</p>
        <p className="ebook-doc-body">Restoring digestive stability creates the foundation for reliable signaling.</p>
        <p className="ebook-doc-body">The second layer is metabolic chemistry.</p>
        <p className="ebook-doc-body">Blood sugar stability, insulin sensitivity, muscle mass, sleep quality, and inflammatory load all shape how the body responds to GLP-1. Even if the hormone is released appropriately, the downstream response depends on cellular health and metabolic flexibility.</p>
        <p className="ebook-doc-body">Improving metabolic chemistry strengthens the body's ability to respond to signals effectively.</p>
        <p className="ebook-doc-body">The third layer is hormonal harmony.</p>
        <p className="ebook-doc-body">When gut stability and metabolic chemistry improve, broader hormonal patterns begin to stabilize. Appetite regulation becomes more predictable. Energy becomes more consistent. Weight changes occur within a more regulated system rather than through force.</p>
        <p className="ebook-doc-body">Attempting to regulate hormones without addressing the layers beneath them can create temporary shifts, but rarely lasting stability.</p>
        <p className="ebook-doc-body">This is why order matters.</p>

        <div className="ebook-doc-diagram">
          <div className="ebook-doc-layers">
            <div className="ebook-doc-layer" style={{ background: "#A3BFA8", width: "160px" }}>Gut</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#AE9297", width: "200px" }}>Metabolism</div>
            <div className="ebook-doc-layer-arrow">↓</div>
            <div className="ebook-doc-layer" style={{ background: "#4B2E4C", width: "240px" }}>Hormones</div>
          </div>
        </div>

        <p className="ebook-doc-body">Gut stability supports metabolic chemistry. Metabolic chemistry supports hormone signaling. Hormone signaling influences appetite, energy, and body composition.</p>
        <p className="ebook-doc-body">When you respect the hierarchy, you work with the system rather than against it.</p>
        <p className="ebook-doc-body">In the next chapter, we will bring this framework together in a structured 90-day approach that moves through these layers intentionally and progressively.</p>
        <PageFooter pageNum={14} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 7 ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Chapter 7</div>
        <h1 className="ebook-doc-h1">The 90-Day GLP-1 Optimization Protocol</h1>

        <img src={protocolTransition} alt="A woman walking peacefully in nature, representing the journey of metabolic restoration" className="ebook-doc-image" style={{ maxHeight: "2.5in", objectFit: "cover" }} />

        <p className="ebook-doc-body">Understanding GLP-1 is important. Supporting the signal is essential. But lasting metabolic change requires structure and sequence.</p>
        <p className="ebook-doc-body">This ninety-day protocol moves intentionally through the hierarchy of gut stability, metabolic chemistry, and hormone regulation. Each phase builds on the previous one. Progression follows stability, not impatience.</p>
        <p className="ebook-doc-body">If a phase does not feel complete, remain there longer before advancing.</p>

        <div className="ebook-doc-phase-box">
          <div className="ebook-doc-phase-header">Phase 1: Reset the Chemistry — Days 1-30</div>
          <p className="ebook-doc-body" style={{ marginBottom: "0.4em" }}>If needed, follow the 30-Day Gut Reset Roadmap for detailed structure during this phase.</p>
          <p className="ebook-doc-body">This phase establishes the foundation. The goal is to calm digestive stress, stabilize blood sugar, and restore rhythm.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Follow these steps:</p>
          <ul className="ebook-doc-list">
            <li>Eat three structured meals per day. Avoid constant grazing. Allow hunger and satiety cues to reestablish rhythm.</li>
            <li>Prioritize protein at every meal. Aim for a meaningful protein source such as eggs, poultry, fish, Greek yogurt, or lean red meat.</li>
            <li>Increase fiber gradually through whole foods such as vegetables, berries, legumes, and resistant starch sources.</li>
            <li>Remove obvious irritants. Reduce ultra-processed foods, excess alcohol, and highly refined sugars.</li>
            <li>Hydrate consistently throughout the day.</li>
            <li>Sleep seven to eight hours per night. Keep sleep and wake times consistent.</li>
            <li>Walk daily. Gentle movement improves glucose handling and digestive motility.</li>
          </ul>
          <p className="ebook-doc-body">The objective is stability, not intensity. Appetite cues should begin to feel less chaotic. Energy should become more predictable.</p>
        </div>
        <PageFooter pageNum={15} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== CHAPTER 7 continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-phase-box" style={{ borderLeftColor: "#AE9297" }}>
          <div className="ebook-doc-phase-header">Phase 2: Restore the Metabolism — Days 31-60</div>
          <p className="ebook-doc-body">With digestive rhythm improving, this phase strengthens metabolic responsiveness.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Follow these steps:</p>
          <ul className="ebook-doc-list">
            <li>Continue structured meals with adequate protein.</li>
            <li>Begin or intensify resistance training at least three times per week. Preserve and build lean muscle mass.</li>
            <li>Ensure total daily protein intake supports muscle preservation.</li>
            <li>Maintain consistent sleep. Protect it as a metabolic intervention.</li>
            <li>Monitor blood sugar response indirectly through energy stability and reduced crashes.</li>
            <li>Incorporate stress regulation practices such as breath work, time outdoors, and screen reduction before bed.</li>
            <li>Continue reducing inflammatory inputs.</li>
          </ul>
          <p className="ebook-doc-body">The objective is improved insulin sensitivity, stronger glucose disposal through muscle, and enhanced metabolic flexibility.</p>
        </div>

        <div className="ebook-doc-phase-box" style={{ borderLeftColor: "#4B2E4C" }}>
          <div className="ebook-doc-phase-header">Phase 3: Reharmonize the System — Days 61-90</div>
          <p className="ebook-doc-body">This phase integrates and personalizes.</p>
          <p className="ebook-doc-body" style={{ fontWeight: 600 }}>Follow these steps:</p>
          <ul className="ebook-doc-list">
            <li>Maintain resistance training and protein intake.</li>
            <li>Evaluate hunger and satiety cues. Adjust portion sizes based on internal regulation rather than strict rules.</li>
            <li>Refine carbohydrate intake based on activity level and energy response.</li>
            <li>Continue fiber and whole food intake.</li>
            <li>Maintain sleep consistency.</li>
            <li>Assess stress load and adjust routines to preserve nervous system stability.</li>
            <li>Introduce personalization only after consistency has been established.</li>
          </ul>
          <p className="ebook-doc-body">The objective is sustainability. Appetite should feel intuitive. Energy should feel stable. Metabolic regulation should feel less reactive.</p>
        </div>

        <p className="ebook-doc-body">This ninety-day structure does not force outcomes. It restores order.</p>
        <p className="ebook-doc-body">GLP-1 signaling improves when the environment supports it. When gut stability, muscle mass, sleep, and stress regulation are aligned, hormone communication becomes more efficient.</p>
        <p className="ebook-doc-body">The body responds to sequence.</p>
        <p className="ebook-doc-body">When you respect order of operations, the system stabilizes.</p>
        <PageFooter pageNum={16} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== NEXT STEPS ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <div className="ebook-doc-chapter-label">Next Steps</div>
        <h1 className="ebook-doc-h1">Continuing Beyond 90 Days</h1>

        <p className="ebook-doc-body">By the end of the 90-Day GLP-1 Optimization Protocol, you will have:</p>
        <ul className="ebook-doc-list">
          <li>Reset the chemistry of your gut and blood sugar</li>
          <li>Stabilized metabolic signaling</li>
          <li>Re-established rhythm between appetite, energy, and hormone balance</li>
          <li>Built foundational habits that support long-term physiology</li>
        </ul>
        <p className="ebook-doc-body">For many people, this is enough to continue independently.</p>
        <p className="ebook-doc-body">For others, this is where deeper personalization becomes valuable.</p>
        <p className="ebook-doc-body">If you would like guided support as you transition from structured protocol into sustainable lifestyle integration, the next step is private coaching.</p>

        <hr className="ebook-doc-divider" />

        <img src={coachingImg} alt="A supportive wellness coaching session" className="ebook-doc-image" style={{ maxHeight: "2.5in", objectFit: "cover" }} />

        <h2 className="ebook-doc-h2">4-Week Gut and Hormone Support Coaching Package</h2>
        <p className="ebook-doc-body" style={{ fontWeight: 600 }}>4 Weeks · $647</p>
        <p className="ebook-doc-body">This package is designed to help you translate the framework in this ebook into your real life.</p>

        <h3 className="ebook-doc-h3">Initial Session</h3>
        <p className="ebook-doc-body" style={{ fontWeight: 600 }}>60 minutes</p>
        <p className="ebook-doc-body">We begin with a comprehensive review of your current physiology and daily rhythms. Together, we explore:</p>
        <ul className="ebook-doc-list">
          <li>Gut patterns and digestion signals</li>
          <li>Stress rhythm and nervous system load</li>
          <li>Hydration and mineral balance</li>
          <li>Metabolic cues</li>
          <li>Sleep timing and quality</li>
          <li>Supportive supplement or essential oil routines, if desired</li>
        </ul>
        <p className="ebook-doc-body">You will leave this session with a personalized 4-week starting plan aligned with your current capacity.</p>
        <PageFooter pageNum={17} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== NEXT STEPS continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h3 className="ebook-doc-h3" style={{ marginTop: 0 }}>Weekly Follow-Up Sessions</h3>
        <p className="ebook-doc-body" style={{ fontWeight: 600 }}>3 sessions · 45 minutes each</p>
        <p className="ebook-doc-body">Each week, we assess how your body is responding and refine your plan accordingly. Adjustments are made based on real data from your lived experience.</p>
        <p className="ebook-doc-body">Areas of support include:</p>
        <ul className="ebook-doc-list">
          <li>Gut repair progression</li>
          <li>Nervous system regulation</li>
          <li>Hormone-friendly meal timing</li>
          <li>Hydration and mineral rhythm</li>
          <li>Inflammation patterns</li>
          <li>Morning versus nighttime adjustments</li>
          <li>Supportive oils and supplements, if appropriate</li>
          <li>Realistic habit building</li>
        </ul>
        <p className="ebook-doc-body">This coaching experience provides clarity, accountability, and refinement beyond what a static protocol can offer.</p>
        <p className="ebook-doc-body">If you feel steady and confident after 90 days, continue building. If you feel ready for deeper personalization, this is your next step.</p>
        <p className="ebook-doc-body" style={{ fontStyle: "italic", color: "#AE9297" }}>Coaching sessions are educational in nature and do not replace care from your licensed healthcare provider.</p>
        <p className="ebook-doc-body">To inquire about availability, visit: <a href="https://www.herwellnessharmony.com" style={{ color: "#4B2E4C", textDecoration: "underline" }}>www.herwellnessharmony.com</a> and view services</p>
        <PageFooter pageNum={18} />
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
        <PageFooter pageNum={19} />
      </div>
      <div className="ebook-spacer" />

      {/* ==================== APPENDIX continued ==================== */}
      <div className="ebook-doc-page ebook-content-page">
        <h2 className="ebook-doc-h2" style={{ marginTop: 0 }}>Notes on Order of Operations</h2>
        <p className="ebook-doc-body">The framework presented in this ebook, Gut → Metabolism → Hormones, reflects a physiology-based systems approach. While simplified for clarity, it aligns with the understanding that:</p>
        <ul className="ebook-doc-list">
          <li>Gut integrity and nutrient signaling influence incretin hormone release</li>
          <li>Blood sugar stability influences insulin and GLP-1 signaling dynamics</li>
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
        <p className="ebook-doc-body">Understanding GLP-1 as a signaling hormone rather than a fat-loss shortcut allows for a more sustainable and systems-based approach to metabolism.</p>

        <hr className="ebook-doc-divider" />
        <p style={{ textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "#AE9297", marginTop: "1.5em" }}>
          <a href="https://www.herwellnessharmony.com" style={{ color: "#AE9297", textDecoration: "none" }}>www.herwellnessharmony.com</a>
        </p>
        <PageFooter pageNum={20} />
      </div>
      </EbookScaler>
    </div>
  );
}
