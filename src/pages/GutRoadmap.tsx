import { Helmet } from "react-helmet-async";
import coverImage from "@/assets/gutroadmap-cover.jpg";

/**
 * 8.5 × 11 inch ebook layout — each "page" is a fixed-proportion box
 * centered on screen, matching the original gutroadmap site exactly.
 */

const PAGE_STYLE: React.CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  margin: "2rem auto",
  padding: "1in",
  backgroundColor: "#faf8f4",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

const COVER_STYLE: React.CSSProperties = {
  width: "8.5in",
  height: "11in",
  margin: "2rem auto",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
};

export default function GutRoadmap() {
  return (
    <div style={{ backgroundColor: "#e8e4dc", minHeight: "100vh", paddingBottom: "3rem" }}>
      <Helmet>
        <title>30 Day Gut Reset Roadmap | Her Wellness Harmony</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ===== Page 1 — Cover ===== */}
      <div style={COVER_STYLE}>
        <img
          src={coverImage}
          alt="Fresh produce and healthy foods in a clean kitchen"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "hsl(150 35% 30% / 0.55)" }} />

        <div style={{ position: "relative", zIndex: 10, padding: "1in", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#faf8f4" }}>
          <div style={{ width: 64, height: 4, backgroundColor: "#c9973f", borderRadius: 2, marginBottom: 24 }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 500, lineHeight: 1.15, margin: 0 }}>
            30 Day Gut Reset<br />
            <span style={{ color: "#c9973f" }}>Roadmap</span>
          </h1>
          <div style={{ width: 64, height: 4, backgroundColor: "#c9973f", borderRadius: 2, marginTop: 24, marginBottom: 24 }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, maxWidth: 420, opacity: 0.92, margin: 0 }}>
            Calming the gut, restoring balance, and supporting a responsive metabolism.
          </p>
          <p style={{ fontSize: 14, maxWidth: 440, opacity: 0.8, marginTop: 16, lineHeight: 1.7 }}>
            A step-by-step guide for women who want clarity, not chaos, and a science-based process that starts with the gut so the rest of the body can follow…in harmony.
          </p>

          <div style={{ marginTop: 40 }}>
            <div style={{ width: 48, height: 2, backgroundColor: "#c9973f", borderRadius: 2, marginBottom: 8 }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, margin: 0 }}>Sheila McFarland</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#c9973f", fontSize: 14, margin: "2px 0" }}>Her Wellness Harmony</p>
            <a href="https://www.herwellnessharmony.com" style={{ fontSize: 12, opacity: 0.7, color: "#faf8f4", textDecoration: "none" }}>
              www.herwellnessharmony.com
            </a>
          </div>
        </div>
      </div>

      {/* ===== Page 2 — Before You Start ===== */}
      <EbookPage num={2}>
        <PageTitle>Before You Start (Important)</PageTitle>
        <P>
          This guide is not a diet, a detox, or a quick reset designed to force your body into compliance.
          It is a gut-first, science-based process built around chemistry, physiology, and order of operations.
          The goal is not restriction, control, or chasing outcomes. The goal is to reduce internal stress so your body
          can begin responding again. If you have tried to "fix" your health before and felt worse, stalled, or blamed
          yourself, nothing here requires you to push harder.
        </P>
        <H3>What This Guide Is…and Isn't</H3>
        <P>
          This is not a plan to fix hormones directly. This is not a metabolism hack. This is not about weight loss,
          discipline, or perfection. This guide is designed to support the gut first, because the gut is where signals
          are interpreted, nutrients are processed, and stress responses begin. When gut chemistry stabilizes, metabolic
          responsiveness can improve. When metabolism becomes more responsive, hormones have the conditions they need to
          regulate downstream. Nothing is forced. Nothing is rushed.
        </P>
        <H3>Why the Order Matters</H3>
        <P>
          Healing does not happen all at once, and it does not happen in reverse. The sequence we follow is:
          Gut → Metabolism → Hormones. When this order is ignored, the body often compensates with symptoms.
          When the order is respected, the body can adapt without resistance. This guide is structured to follow
          that natural sequence, even when it feels slower than what you may have been told before.
        </P>
        <H3>What to Expect as You Begin</H3>
        <P>
          Progress is not linear. Some changes will be subtle before they are obvious. Some days may feel neutral,
          not dramatic. Symptoms can fluctuate as the body recalibrates signaling and chemistry. This does not mean
          you are doing anything wrong. Consistency matters more than intensity. Stability matters more than speed.
        </P>
        <Callout>
          <H4>How to Use This Guide</H4>
          <P>
            Follow the phases in order. Do not skip ahead. Do not stack extra protocols or "add more" to accelerate
            results. This process works by reducing internal noise, not creating more of it. You are not behind.
            You are not failing. You are rebuilding… in harmony.
          </P>
        </Callout>
      </EbookPage>

      {/* ===== Page 3 — How This Reset Works ===== */}
      <EbookPage num={3}>
        <PageTitle>How This Reset Works</PageTitle>
        <P>
          This 30-day reset is structured in phases, not rules. Each phase focuses on reducing stress inside the body
          and restoring basic gut function before asking the body to do more. Nothing here is designed to override
          symptoms or force outcomes. The goal is to support the systems that allow healing to happen naturally.
        </P>
        <P>
          You will move through this guide in order. Skipping ahead or stacking phases may feel productive, but it
          often creates more internal stress instead of less.
        </P>
        <H3>The Order of Operations</H3>
        <P>Healing follows a sequence:</P>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#c9973f", margin: "16px 0" }}>
          Gut → Metabolism → Hormones
        </p>
        <P>
          The gut is where signals are interpreted, nutrients are absorbed, and stress responses are regulated.
          When gut function improves, metabolic responsiveness can follow. When metabolism becomes more stable,
          hormones finally have the conditions they need to regulate. This guide is built around that order on purpose.
        </P>
        <H3>What You'll Be Doing</H3>
        <P>Each phase will introduce simple, repeatable actions focused on:</P>
        <ul style={{ paddingLeft: 24, margin: "8px 0", lineHeight: 1.8 }}>
          <li>calming digestion</li>
          <li>reducing internal stress</li>
          <li>improving responsiveness rather than forcing change</li>
        </ul>
        <P>You are not meant to do everything perfectly. You are meant to stay consistent.</P>
        <Callout>
          <H4>A Quick Reminder</H4>
          <P>If something feels slower than expected, that does not mean it isn't working. Stability comes before momentum.</P>
        </Callout>
      </EbookPage>

      {/* ===== Page 4 — The Four Phases ===== */}
      <EbookPage num={4}>
        <PageTitle>The Four Phases of the Reset</PageTitle>
        <P>
          This 30-day reset follows a specific order for a reason. Healing does not happen all at once, and it does
          not happen in reverse. Each phase builds on the one before it. Skipping ahead or doing phases out of order
          often recreates the same stress patterns that led to symptoms in the first place. This guide is designed to
          move with the body, not against it.
        </P>
        <H3>Phase 1 (Days 1–7): Safety &amp; Calm</H3>
        <P>
          The first phase focuses on calming the gut and nervous system. When digestion is under constant stress,
          nothing downstream can respond properly. Phase 1 is about reducing irritation, stabilizing timing, and
          removing obvious sources of overwhelm so the gut can begin functioning again. This phase creates the
          foundation for everything that follows.
        </P>
        <H3>Phase 2 (Days 8–14): Digestion &amp; Motility Support</H3>
        <P>
          Once the system is calmer, the body can begin digesting, moving, and absorbing more effectively. Phase 2
          supports the mechanics of digestion and helps signals move through the gut. The goal is not to push
          metabolism, but to restore responsiveness by reducing compensation. This phase builds on stability, not intensity.
        </P>
        <H3>Phase 3 (Days 15–21): Gut Lining &amp; Microbiome Support</H3>
        <P>
          After digestion and movement improve, the gut lining and microbiome can be gently supported. Phase 3 focuses
          on nourishment rather than elimination. By this point, the body is better able to tolerate support without
          reacting. This phase is about reinforcing repair, not forcing change. Nothing here is aggressive or rushed.
        </P>
        <H3>Phase 4 (Days 22–30): Integrate &amp; Personalize</H3>
        <P>
          The final phase is about integration. Phase 4 helps you identify what works for your body and build a
          sustainable rhythm moving forward. Instead of following rigid rules, you begin creating a personalized
          baseline you can return to after the reset ends. This is where the "new default" takes shape.
        </P>
        <Callout>
          <H4>Important Reminder</H4>
          <P>
            Progress through these phases may feel slower than what you are used to. That does not mean it is
            ineffective. Stability comes before change. Responsiveness comes before results.
          </P>
        </Callout>
      </EbookPage>

      {/* ===== Page 5 — How to Use This Reset ===== */}
      <EbookPage num={5}>
        <PageTitle>How to Use This Reset</PageTitle>
        <P>
          This guide is designed to be followed in order, not customized all at once. Each phase builds on the one
          before it. Moving slowly and sequentially reduces internal stress and allows your body to respond without force.
        </P>
        <H3>Move Through The Phases In Order</H3>
        <P>
          Begin with Phase 1 and continue forward. Do not skip ahead, stack phases, or layer multiple goals at once.
          If a phase feels subtle, that does not mean it is ineffective. Stability comes before noticeable change.
        </P>
        <H3>You Do Not Have To Move On By The Calendar</H3>
        <P>
          The day ranges are guides, not deadlines. If a phase does not feel stable or complete, stay there before
          moving on. Progress happens when the body feels ready, not when the calendar says it's time.
        </P>
        <H3>Stay With The Phase You're In</H3>
        <P>
          Each phase has a specific focus. Your job is not to optimize or accelerate it. Stay with the phase for the
          full time window, even if you feel tempted to do more. Doing less, consistently, is often what allows
          progress to happen.
        </P>
        <H3>More Is Not Better Here</H3>
        <P>
          Adding extra protocols "just in case" often increases internal stress rather than reducing it. This reset is
          built to work with minimal inputs and clear signals. Let your body show you what it needs before adding
          anything new.
        </P>
        <H3>If Symptoms Change or Feel Unclear</H3>
        <P>
          Do not panic and do not start over. Return to the basics of the current phase. Simplify rather than add.
          Consistency matters more than intensity. Some days will feel neutral. Some may feel slower than expected.
          Both are normal parts of recalibration.
        </P>
        <H3>Your Only Goal</H3>
        <P>
          You are not trying to force healing. You are creating the conditions where healing becomes possible. The next
          pages will guide you through each phase with clear, practical direction. Follow them steadily, without
          pressure, and let responsiveness build over time.
        </P>
      </EbookPage>

      {/* ===== Page 6 — Phase 1 ===== */}
      <PhaseDetailPage
        num={6}
        label="Phase 1 — Safety & Calm"
        days="Days 1–7"
        goal="The goal of Phase 1 is to reduce internal stress so digestion can begin responding again. When the gut and nervous system are under constant stress, digestion is downregulated. This phase stabilizes timing, reduces reactivity, and creates the foundation for all later phases."
        dailyFocus="During this phase, prioritize regular meal timing and predictability over variety. Eat at roughly similar times each day and avoid long gaps followed by large or rushed meals. Choose gentle, familiar foods your body generally tolerates rather than introducing new foods for the sake of being healthy. Meals should be eaten in a calm environment when possible, with slower first bites and minimal rushing or multitasking. If certain foods, drinks, or habits clearly worsen symptoms, step back from them temporarily to reduce unnecessary stress signals. Each day should also include at least one intentional nervous system downshift, even if it is brief."
        avoid="Avoid cleanses, detoxes, fasting, or pushing harder to force results. Do not skip meals, add multiple new supplements at once, or expect rapid changes. Discipline through discomfort increases stress and works against this phase."
        signs="Progress may be subtle. Digestion often feels slightly less reactive, hunger and fullness cues become clearer, symptoms feel less chaotic, and meals begin to feel more neutral rather than stressful."
        hardTitle="If This Phase Feels Hard"
        hardText="Do less, not more. Simplify meals, return to predictable timing, and focus on calm and consistency. Symptom flares usually indicate the body needs more safety, not more intervention."
        nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 2 builds on this stability by supporting digestion and movement through the gut."
      />

      {/* ===== Page 7 — Phase 2 ===== */}
      <PhaseDetailPage
        num={7}
        label="Phase 2 — Digestion & Motility"
        days="Days 8–14"
        goal="The goal of Phase 2 is to support the breakdown of food and movement through the gut so nutrients can be absorbed and stagnation is reduced. This phase builds on the stability created in Phase 1. Safety and rhythm remain important, while digestion and motility become the primary focus."
        dailyFocus="During this phase, continue eating regular meals at consistent times and keep the calm eating habits established in Phase 1. Meals should be paced slowly enough to allow digestion to activate, with thorough chewing and attention to fullness before discomfort sets in. Choose foods that digest well for your body right now rather than foods chosen for nutritional trends or rules. Support natural motility by maintaining predictable daily rhythms, responding to bowel movement urges when they arise, and including gentle movement most days. Hydration should be steady across the day, with sipping rather than chugging, and with attention to how liquids at meals affect bloating or discomfort."
        avoid="Avoid aggressive fiber loading, laxative-style strategies, or forcing bowel movements. Do not add multiple digestive aids or supplements at the same time. Ignoring bloating, constipation, or heaviness in order to push through can increase stress rather than improve digestion."
        signs="Meals feel lighter and easier to digest, bloating is reduced, bowel movements become more complete or regular, and the feeling of heaviness or stagnation decreases. Progress may be gradual rather than dramatic."
        hardTitle="If This Phase Feels Hard"
        hardText="Resist the urge to add more interventions. Return to meal calm, consistent timing, hydration rhythm, and gentle movement. If symptoms increase, simplify rather than intensify."
        nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 3 focuses on nourishing the gut lining and supporting the microbiome once digestion and movement are more stable."
      />

      {/* ===== Page 8 — Phase 3 ===== */}
      <PhaseDetailPage
        num={8}
        label="Phase 3 — Gut Lining & Microbiome"
        days="Days 15–21"
        goal="The goal of Phase 3 is to gently nourish the gut lining and support beneficial bacteria once digestion and motility are more stable. This phase is about repair and nourishment, not stimulation. The body does its best healing work when it feels supported, not pressured."
        dailyFocus="During this phase, continue the timing, calm eating habits, and digestion support established in Phases 1 and 2. These remain the foundation. Introduce supportive foods or changes slowly and intentionally, one at a time, so your body's feedback is clear. Keep the rest of your routine steady while testing anything new. Focus on nourishment rather than aggressive strategies, and prioritize recovery states by protecting sleep quality, allowing calmer evenings, and giving the body space to rest after meals when possible."
        avoid="Avoid kill-off protocols, harsh cleanses, or forcing die-off reactions. Do not rapidly expand food variety or stack multiple new supplements at once. Ignoring subtle reactions or pushing through discomfort can disrupt the repair process."
        signs="Meals feel more nourishing than irritating, digestion feels steadier day to day, and sensitivity to previously tolerated foods may decrease. Progress often shows up as improved stability rather than dramatic changes."
        hardTitle="If This Phase Feels Hard"
        hardText="Treat reactions as information, not failure. Remove the most recent addition, return to what was stable, and allow the system to settle before reassessing. More gentleness usually leads to better results in this phase."
        nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 4 focuses on integrating what works and personalizing your new baseline moving forward."
      />

      {/* ===== Page 9 — Phase 4 ===== */}
      <PhaseDetailPage
        num={9}
        label="Phase 4 — Integrate & Personalize"
        days="Days 22–30"
        goal="The goal of Phase 4 is to integrate what has been working and begin forming a sustainable new baseline. This phase is not about doing more or pushing harder. It is about observing patterns, refining choices, and building a rhythm your body can maintain beyond the 30 days."
        dailyFocus="During this phase, continue the routines that have clearly supported digestion, energy, and calm. These become your non-negotiable anchors. Pay attention to patterns rather than isolated days, noticing which foods, timings, and habits improve digestion, mood, energy, cravings, and sleep, and which ones consistently create symptoms. Adjust gently based on these patterns, reducing or removing what repeatedly causes issues without fear or permanence. The goal is a routine that works on normal days, not just ideal ones."
        avoid="Avoid adding intensity, chasing perfection, or abandoning structure too quickly. Do not reintroduce multiple changes at once or dismiss subtle feedback from your body. This phase is about refinement, not testing limits."
        signs="You feel more confident interpreting your body's signals, symptoms are more predictable, and you have a clearer sense of what supports you and what does not. Digestion feels more responsive and less reactive overall."
        hardTitle="If This Phase Feels Unclear"
        hardText="Return to the basics that created stability earlier in the reset. Choose the option that lowers internal stress rather than increasing it. Personalization happens through consistency, not pressure."
        nextText="This phase marks the transition from a structured reset into an ongoing, individualized approach you can continue using moving forward."
      />

      {/* ===== Page 10 — Reflections 1 & 2 ===== */}
      <EbookPage num={10}>
        <PageTitle>Your Reflections — Phases 1 &amp; 2</PageTitle>
        <H3>Phase 1 — Safety &amp; Calm</H3>
        <P>
          What felt stabilizing or calming during this phase? What seemed to increase stress or symptoms?
          Note any changes in appetite, digestion, energy, or overall sense of calm.
        </P>
        <NotesBox label="Phase 1 Notes & Body Feedback:" />
        <H3>Phase 2 — Digestion &amp; Motility</H3>
        <P>
          What changes did you notice in digestion or bowel regularity? Which foods, timing, or routines felt
          supportive? Were there any patterns that stood out?
        </P>
        <NotesBox label="Phase 2 Notes & Body Feedback:" />
      </EbookPage>

      {/* ===== Page 11 — Reflections 3 & 4 ===== */}
      <EbookPage num={11}>
        <PageTitle>Your Reflections — Phases 3 &amp; 4</PageTitle>
        <H3>Phase 3 — Gut Lining &amp; Microbiome</H3>
        <P>
          What felt nourishing or supportive during this phase? Did you notice any reactions or sensitivities?
          What seemed to help your body feel more resilient or steady?
        </P>
        <NotesBox label="Phase 3 Notes & Body Feedback:" />
        <H3>Phase 4 — Integrate &amp; Personalize</H3>
        <P>
          Which habits or routines do you want to keep moving forward? What would you adjust if you repeated
          this reset? What signals from your body felt the most clear or reliable?
        </P>
        <NotesBox label="Phase 4 Notes & Body Feedback:" />
      </EbookPage>

      {/* ===== Page 12 — After Day 30 ===== */}
      <EbookPage num={12}>
        <PageTitle>After Day 30</PageTitle>
        <P>
          Completing this 30-day roadmap does not mean the work is finished. It means your body has gathered information.
        </P>
        <P>
          Many people repeat phases, spend longer where their body needs support, or cycle back to earlier phases when
          symptoms change. Healing is not linear, and progress is not measured by staying on a calendar.
        </P>
        <P>If a phase felt incomplete, it is appropriate to return to it. Stability matters more than speed.</P>
        <P>
          As the gut becomes more regulated, some people naturally move into deeper work around metabolism and hormones.
          Others continue refining digestion, food tolerance, and nervous system regulation. There is no single correct
          next step.
        </P>
        <P>
          If you feel unsure what to adjust next, longer-term coaching can provide structure, personalization, and
          guidance as your body responds. Coaching is not about doing more or pushing harder. It is about having support
          so you are not navigating complex signals alone.
        </P>
        <P>
          This roadmap is designed to be reused. Let your body's feedback guide when to repeat phases, when to slow
          down, and when to seek additional support. You do not need to rush. The work continues at the pace your body
          allows.
        </P>
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#2d4a3e", margin: 0 }}>
            Ready for personalized support?
          </p>
          <p style={{ fontSize: 14, color: "#6b7c74", marginTop: 8 }}>
            Choose the 4-week Gut &amp; Hormone Coaching package at:
          </p>
          <a
            href="https://www.herwellnessharmony.com/#services"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#c9973f", textDecoration: "none", marginTop: 8, display: "inline-block" }}
          >
            www.herwellnessharmony.com/services
          </a>
        </div>
      </EbookPage>
    </div>
  );
}

/* ── Ebook page wrapper ── */

function EbookPage({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div style={PAGE_STYLE}>
      <p style={{ fontSize: 11, color: "#8a9490", marginBottom: 24 }}>{num}</p>
      {children}
    </div>
  );
}

/* ── Typography helpers ── */

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 500, color: "#2d4a3e", marginBottom: 20, marginTop: 0 }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "#2d4a3e", marginTop: 28, marginBottom: 8 }}>
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 500, color: "#2d4a3e", marginBottom: 6, marginTop: 0 }}>
      {children}
    </h4>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, lineHeight: 1.8, color: "#3a4f46", margin: "0 0 12px 0" }}>
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24, borderLeft: "4px solid #c9973f", backgroundColor: "rgba(201,151,63,0.06)", borderRadius: "0 8px 8px 0", padding: "16px 20px" }}>
      {children}
    </div>
  );
}

function NotesBox({ label }: { label: string }) {
  return (
    <div style={{ border: "1px solid #d1cdc4", borderRadius: 8, padding: 16, minHeight: 100, backgroundColor: "#fff", marginBottom: 24 }}>
      <p style={{ fontSize: 13, color: "#8a9490", fontStyle: "italic", margin: 0 }}>{label}</p>
    </div>
  );
}

/* ── Phase detail page ── */

interface PhaseDetailPageProps {
  num: number;
  label: string;
  days: string;
  goal: string;
  dailyFocus: string;
  avoid: string;
  signs: string;
  hardTitle: string;
  hardText: string;
  nextText: string;
}

function PhaseDetailPage({ num, label, days, goal, dailyFocus, avoid, signs, hardTitle, hardText, nextText }: PhaseDetailPageProps) {
  return (
    <EbookPage num={num}>
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973f", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 13, color: "#8a9490", marginBottom: 20 }}>({days})</p>

      <H3>Phase Goal</H3>
      <P>{goal}</P>

      <H3>Daily Focus</H3>
      <P>{dailyFocus}</P>

      <H3>What to Avoid</H3>
      <P>{avoid}</P>

      <H3>Signs This Phase Is Working</H3>
      <P>{signs}</P>

      <Callout>
        <H4>{hardTitle}</H4>
        <P>{hardText}</P>
      </Callout>

      <p style={{ marginTop: 20, fontSize: 13, color: "#8a9490", fontStyle: "italic" }}>{nextText}</p>
    </EbookPage>
  );
}
