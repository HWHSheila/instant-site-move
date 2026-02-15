import { SEO } from "@/components/SEO";
import coverImage from "@/assets/gutroadmap-cover.jpg";

export default function GutRoadmap() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="30 Day Gut Reset Roadmap"
        description="A step-by-step guide for women who want clarity, not chaos, and a science-based process that starts with the gut."
        noindex
      />

      <div className="max-w-3xl mx-auto">
        {/* ===== Cover Page ===== */}
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
          <img
            src={coverImage}
            alt="Fresh produce and healthy foods in a clean kitchen"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-wellness-forest/60" />

          <div className="relative z-10 px-8 pb-16 pt-32 text-primary-foreground space-y-6">
            <div className="w-16 h-1 bg-accent rounded" />
            <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight">
              30 Day Gut Reset{" "}
              <span className="text-accent block">Roadmap</span>
            </h1>
            <div className="w-16 h-1 bg-accent rounded" />
            <p className="font-display italic text-lg md:text-xl max-w-md opacity-90">
              Calming the gut, restoring balance, and supporting a responsive metabolism.
            </p>
            <p className="text-sm md:text-base max-w-lg opacity-80 leading-relaxed">
              A step-by-step guide for women who want clarity, not chaos, and a science-based process
              that starts with the gut so the rest of the body can follow…in harmony.
            </p>

            <div className="pt-6 space-y-1">
              <div className="w-12 h-0.5 bg-accent rounded" />
              <p className="font-display font-semibold text-base">Sheila McFarland</p>
              <p className="font-display italic text-accent text-sm">Her Wellness Harmony</p>
              <a
                href="https://www.herwellnessharmony.com"
                className="text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                www.herwellnessharmony.com
              </a>
            </div>
          </div>
        </section>

        {/* ===== Content Pages ===== */}
        <div className="px-6 md:px-10 py-12 space-y-16 text-foreground font-body text-base leading-relaxed">

          {/* Page 2 — Before You Start */}
          <PageSection pageNum={2} title="Before You Start (Important)">
            <p>
              This guide is not a diet, a detox, or a quick reset designed to force your body into compliance.
              It is a gut-first, science-based process built around chemistry, physiology, and order of operations.
              The goal is not restriction, control, or chasing outcomes. The goal is to reduce internal stress so your body
              can begin responding again. If you have tried to "fix" your health before and felt worse, stalled, or blamed
              yourself, nothing here requires you to push harder.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">What This Guide Is…and Isn't</h3>
            <p>
              This is not a plan to fix hormones directly. This is not a metabolism hack. This is not about weight loss,
              discipline, or perfection. This guide is designed to support the gut first, because the gut is where signals
              are interpreted, nutrients are processed, and stress responses begin. When gut chemistry stabilizes, metabolic
              responsiveness can improve. When metabolism becomes more responsive, hormones have the conditions they need to
              regulate downstream. Nothing is forced. Nothing is rushed.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">Why the Order Matters</h3>
            <p>
              Healing does not happen all at once, and it does not happen in reverse. The sequence we follow is:
              Gut → Metabolism → Hormones. When this order is ignored, the body often compensates with symptoms.
              When the order is respected, the body can adapt without resistance. This guide is structured to follow
              that natural sequence, even when it feels slower than what you may have been told before.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">What to Expect as You Begin</h3>
            <p>
              Progress is not linear. Some changes will be subtle before they are obvious. Some days may feel neutral,
              not dramatic. Symptoms can fluctuate as the body recalibrates signaling and chemistry. This does not mean
              you are doing anything wrong. Consistency matters more than intensity. Stability matters more than speed.
            </p>

            <Callout>
              <h4 className="font-display font-medium mb-2">How to Use This Guide</h4>
              <p>
                Follow the phases in order. Do not skip ahead. Do not stack extra protocols or "add more" to accelerate
                results. This process works by reducing internal noise, not creating more of it. You are not behind.
                You are not failing. You are rebuilding… in harmony.
              </p>
            </Callout>
          </PageSection>

          {/* Page 3 — How This Reset Works */}
          <PageSection pageNum={3} title="How This Reset Works">
            <p>
              This 30-day reset is structured in phases, not rules. Each phase focuses on reducing stress inside the body
              and restoring basic gut function before asking the body to do more. Nothing here is designed to override
              symptoms or force outcomes. The goal is to support the systems that allow healing to happen naturally.
            </p>
            <p>
              You will move through this guide in order. Skipping ahead or stacking phases may feel productive, but it
              often creates more internal stress instead of less.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">The Order of Operations</h3>
            <p>Healing follows a sequence:</p>
            <p className="font-display text-lg font-medium text-accent my-4">Gut → Metabolism → Hormones</p>
            <p>
              The gut is where signals are interpreted, nutrients are absorbed, and stress responses are regulated.
              When gut function improves, metabolic responsiveness can follow. When metabolism becomes more stable,
              hormones finally have the conditions they need to regulate. This guide is built around that order on purpose.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">What You'll Be Doing</h3>
            <p>Each phase will introduce simple, repeatable actions focused on:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>calming digestion</li>
              <li>reducing internal stress</li>
              <li>improving responsiveness rather than forcing change</li>
            </ul>
            <p className="mt-3">You are not meant to do everything perfectly. You are meant to stay consistent.</p>

            <Callout>
              <h4 className="font-display font-medium mb-2">A Quick Reminder</h4>
              <p>If something feels slower than expected, that does not mean it isn't working. Stability comes before momentum.</p>
            </Callout>
          </PageSection>

          {/* Page 4 — The Four Phases */}
          <PageSection pageNum={4} title="The Four Phases of the Reset">
            <p>
              This 30-day reset follows a specific order for a reason. Healing does not happen all at once, and it does
              not happen in reverse. Each phase builds on the one before it. Skipping ahead or doing phases out of order
              often recreates the same stress patterns that led to symptoms in the first place. This guide is designed to
              move with the body, not against it.
            </p>

            <PhaseOverview title="Phase 1 (Days 1–7): Safety & Calm">
              The first phase focuses on calming the gut and nervous system. When digestion is under constant stress,
              nothing downstream can respond properly. Phase 1 is about reducing irritation, stabilizing timing, and
              removing obvious sources of overwhelm so the gut can begin functioning again. This phase creates the
              foundation for everything that follows.
            </PhaseOverview>
            <PhaseOverview title="Phase 2 (Days 8–14): Digestion & Motility Support">
              Once the system is calmer, the body can begin digesting, moving, and absorbing more effectively. Phase 2
              supports the mechanics of digestion and helps signals move through the gut. The goal is not to push
              metabolism, but to restore responsiveness by reducing compensation. This phase builds on stability, not intensity.
            </PhaseOverview>
            <PhaseOverview title="Phase 3 (Days 15–21): Gut Lining & Microbiome Support">
              After digestion and movement improve, the gut lining and microbiome can be gently supported. Phase 3 focuses
              on nourishment rather than elimination. By this point, the body is better able to tolerate support without
              reacting. This phase is about reinforcing repair, not forcing change. Nothing here is aggressive or rushed.
            </PhaseOverview>
            <PhaseOverview title="Phase 4 (Days 22–30): Integrate & Personalize">
              The final phase is about integration. Phase 4 helps you identify what works for your body and build a
              sustainable rhythm moving forward. Instead of following rigid rules, you begin creating a personalized
              baseline you can return to after the reset ends. This is where the "new default" takes shape.
            </PhaseOverview>

            <Callout>
              <h4 className="font-display font-medium mb-2">Important Reminder</h4>
              <p>
                Progress through these phases may feel slower than what you are used to. That does not mean it is
                ineffective. Stability comes before change. Responsiveness comes before results.
              </p>
            </Callout>
          </PageSection>

          {/* Page 5 — How to Use This Reset */}
          <PageSection pageNum={5} title="How to Use This Reset">
            <p>
              This guide is designed to be followed in order, not customized all at once. Each phase builds on the one
              before it. Moving slowly and sequentially reduces internal stress and allows your body to respond without force.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">Move Through The Phases In Order</h3>
            <p>
              Begin with Phase 1 and continue forward. Do not skip ahead, stack phases, or layer multiple goals at once.
              If a phase feels subtle, that does not mean it is ineffective. Stability comes before noticeable change.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">You Do Not Have To Move On By The Calendar</h3>
            <p>
              The day ranges are guides, not deadlines. If a phase does not feel stable or complete, stay there before
              moving on. Progress happens when the body feels ready, not when the calendar says it's time.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">Stay With The Phase You're In</h3>
            <p>
              Each phase has a specific focus. Your job is not to optimize or accelerate it. Stay with the phase for the
              full time window, even if you feel tempted to do more. Doing less, consistently, is often what allows
              progress to happen.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">More Is Not Better Here</h3>
            <p>
              Adding extra protocols "just in case" often increases internal stress rather than reducing it. This reset is
              built to work with minimal inputs and clear signals. Let your body show you what it needs before adding
              anything new.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">If Symptoms Change or Feel Unclear</h3>
            <p>
              Do not panic and do not start over. Return to the basics of the current phase. Simplify rather than add.
              Consistency matters more than intensity. Some days will feel neutral. Some may feel slower than expected.
              Both are normal parts of recalibration.
            </p>

            <h3 className="font-display text-xl font-medium mt-8 mb-3">Your Only Goal</h3>
            <p>
              You are not trying to force healing. You are creating the conditions where healing becomes possible. The next
              pages will guide you through each phase with clear, practical direction. Follow them steadily, without
              pressure, and let responsiveness build over time.
            </p>
          </PageSection>

          {/* Page 6 — Phase 1 */}
          <PhaseDetail
            pageNum={6}
            phaseLabel="Phase 1 — Safety & Calm"
            phaseDays="Days 1–7"
            goal="The goal of Phase 1 is to reduce internal stress so digestion can begin responding again. When the gut and nervous system are under constant stress, digestion is downregulated. This phase stabilizes timing, reduces reactivity, and creates the foundation for all later phases."
            dailyFocus="During this phase, prioritize regular meal timing and predictability over variety. Eat at roughly similar times each day and avoid long gaps followed by large or rushed meals. Choose gentle, familiar foods your body generally tolerates rather than introducing new foods for the sake of being healthy. Meals should be eaten in a calm environment when possible, with slower first bites and minimal rushing or multitasking. If certain foods, drinks, or habits clearly worsen symptoms, step back from them temporarily to reduce unnecessary stress signals. Each day should also include at least one intentional nervous system downshift, even if it is brief."
            avoid="Avoid cleanses, detoxes, fasting, or pushing harder to force results. Do not skip meals, add multiple new supplements at once, or expect rapid changes. Discipline through discomfort increases stress and works against this phase."
            signs="Progress may be subtle. Digestion often feels slightly less reactive, hunger and fullness cues become clearer, symptoms feel less chaotic, and meals begin to feel more neutral rather than stressful."
            hardTitle="If This Phase Feels Hard"
            hardText="Do less, not more. Simplify meals, return to predictable timing, and focus on calm and consistency. Symptom flares usually indicate the body needs more safety, not more intervention."
            nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 2 builds on this stability by supporting digestion and movement through the gut."
          />

          {/* Page 7 — Phase 2 */}
          <PhaseDetail
            pageNum={7}
            phaseLabel="Phase 2 — Digestion & Motility"
            phaseDays="Days 8–14"
            goal="The goal of Phase 2 is to support the breakdown of food and movement through the gut so nutrients can be absorbed and stagnation is reduced. This phase builds on the stability created in Phase 1. Safety and rhythm remain important, while digestion and motility become the primary focus."
            dailyFocus="During this phase, continue eating regular meals at consistent times and keep the calm eating habits established in Phase 1. Meals should be paced slowly enough to allow digestion to activate, with thorough chewing and attention to fullness before discomfort sets in. Choose foods that digest well for your body right now rather than foods chosen for nutritional trends or rules. Support natural motility by maintaining predictable daily rhythms, responding to bowel movement urges when they arise, and including gentle movement most days. Hydration should be steady across the day, with sipping rather than chugging, and with attention to how liquids at meals affect bloating or discomfort."
            avoid="Avoid aggressive fiber loading, laxative-style strategies, or forcing bowel movements. Do not add multiple digestive aids or supplements at the same time. Ignoring bloating, constipation, or heaviness in order to push through can increase stress rather than improve digestion."
            signs="Meals feel lighter and easier to digest, bloating is reduced, bowel movements become more complete or regular, and the feeling of heaviness or stagnation decreases. Progress may be gradual rather than dramatic."
            hardTitle="If This Phase Feels Hard"
            hardText="Resist the urge to add more interventions. Return to meal calm, consistent timing, hydration rhythm, and gentle movement. If symptoms increase, simplify rather than intensify."
            nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 3 focuses on nourishing the gut lining and supporting the microbiome once digestion and movement are more stable."
          />

          {/* Page 8 — Phase 3 */}
          <PhaseDetail
            pageNum={8}
            phaseLabel="Phase 3 — Gut Lining & Microbiome"
            phaseDays="Days 15–21"
            goal="The goal of Phase 3 is to gently nourish the gut lining and support beneficial bacteria once digestion and motility are more stable. This phase is about repair and nourishment, not stimulation. The body does its best healing work when it feels supported, not pressured."
            dailyFocus="During this phase, continue the timing, calm eating habits, and digestion support established in Phases 1 and 2. These remain the foundation. Introduce supportive foods or changes slowly and intentionally, one at a time, so your body's feedback is clear. Keep the rest of your routine steady while testing anything new. Focus on nourishment rather than aggressive strategies, and prioritize recovery states by protecting sleep quality, allowing calmer evenings, and giving the body space to rest after meals when possible."
            avoid="Avoid kill-off protocols, harsh cleanses, or forcing die-off reactions. Do not rapidly expand food variety or stack multiple new supplements at once. Ignoring subtle reactions or pushing through discomfort can disrupt the repair process."
            signs="Meals feel more nourishing than irritating, digestion feels steadier day to day, and sensitivity to previously tolerated foods may decrease. Progress often shows up as improved stability rather than dramatic changes."
            hardTitle="If This Phase Feels Hard"
            hardText="Treat reactions as information, not failure. Remove the most recent addition, return to what was stable, and allow the system to settle before reassessing. More gentleness usually leads to better results in this phase."
            nextText="If this phase does not feel stable yet, it is appropriate to stay here longer before moving on. Next, Phase 4 focuses on integrating what works and personalizing your new baseline moving forward."
          />

          {/* Page 9 — Phase 4 */}
          <PhaseDetail
            pageNum={9}
            phaseLabel="Phase 4 — Integrate & Personalize"
            phaseDays="Days 22–30"
            goal="The goal of Phase 4 is to integrate what has been working and begin forming a sustainable new baseline. This phase is not about doing more or pushing harder. It is about observing patterns, refining choices, and building a rhythm your body can maintain beyond the 30 days."
            dailyFocus="During this phase, continue the routines that have clearly supported digestion, energy, and calm. These become your non-negotiable anchors. Pay attention to patterns rather than isolated days, noticing which foods, timings, and habits improve digestion, mood, energy, cravings, and sleep, and which ones consistently create symptoms. Adjust gently based on these patterns, reducing or removing what repeatedly causes issues without fear or permanence. The goal is a routine that works on normal days, not just ideal ones."
            avoid="Avoid adding intensity, chasing perfection, or abandoning structure too quickly. Do not reintroduce multiple changes at once or dismiss subtle feedback from your body. This phase is about refinement, not testing limits."
            signs="You feel more confident interpreting your body's signals, symptoms are more predictable, and you have a clearer sense of what supports you and what does not. Digestion feels more responsive and less reactive overall."
            hardTitle="If This Phase Feels Unclear"
            hardText="Return to the basics that created stability earlier in the reset. Choose the option that lowers internal stress rather than increasing it. Personalization happens through consistency, not pressure."
            nextText="This phase marks the transition from a structured reset into an ongoing, individualized approach you can continue using moving forward."
          />

          {/* Pages 10-11 — Reflections */}
          <PageSection pageNum={10} title="Your Reflections — Phases 1 & 2">
            <ReflectionBlock
              phase="Phase 1 — Safety & Calm"
              prompt="What felt stabilizing or calming during this phase? What seemed to increase stress or symptoms? Note any changes in appetite, digestion, energy, or overall sense of calm."
            />
            <ReflectionBlock
              phase="Phase 2 — Digestion & Motility"
              prompt="What changes did you notice in digestion or bowel regularity? Which foods, timing, or routines felt supportive? Were there any patterns that stood out?"
            />
          </PageSection>

          <PageSection pageNum={11} title="Your Reflections — Phases 3 & 4">
            <ReflectionBlock
              phase="Phase 3 — Gut Lining & Microbiome"
              prompt="What felt nourishing or supportive during this phase? Did you notice any reactions or sensitivities? What seemed to help your body feel more resilient or steady?"
            />
            <ReflectionBlock
              phase="Phase 4 — Integrate & Personalize"
              prompt="Which habits or routines do you want to keep moving forward? What would you adjust if you repeated this reset? What signals from your body felt the most clear or reliable?"
            />
          </PageSection>

          {/* Page 12 — After Day 30 */}
          <PageSection pageNum={12} title="After Day 30">
            <p>
              Completing this 30-day roadmap does not mean the work is finished. It means your body has gathered information.
            </p>
            <p>
              Many people repeat phases, spend longer where their body needs support, or cycle back to earlier phases when
              symptoms change. Healing is not linear, and progress is not measured by staying on a calendar.
            </p>
            <p>If a phase felt incomplete, it is appropriate to return to it. Stability matters more than speed.</p>
            <p>
              As the gut becomes more regulated, some people naturally move into deeper work around metabolism and hormones.
              Others continue refining digestion, food tolerance, and nervous system regulation. There is no single correct
              next step.
            </p>
            <p>
              If you feel unsure what to adjust next, longer-term coaching can provide structure, personalization, and
              guidance as your body responds. Coaching is not about doing more or pushing harder. It is about having support
              so you are not navigating complex signals alone.
            </p>
            <p>
              This roadmap is designed to be reused. Let your body's feedback guide when to repeat phases, when to slow
              down, and when to seek additional support. You do not need to rush. The work continues at the pace your body
              allows.
            </p>

            <div className="mt-10 text-center space-y-3">
              <p className="font-display text-lg font-medium">Ready for personalized support?</p>
              <p className="text-muted-foreground">Choose the 4-week Gut & Hormone Coaching package at:</p>
              <a
                href="https://www.herwellnessharmony.com/#services"
                className="inline-block font-display text-accent hover:underline"
              >
                www.herwellnessharmony.com/services
              </a>
            </div>
          </PageSection>
        </div>
      </div>
    </div>
  );
}

/* ── Helper components ── */

function PageSection({
  pageNum,
  title,
  children,
}: {
  pageNum: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-10">
      <p className="text-xs text-muted-foreground mb-6">{pageNum}</p>
      <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 border-l-4 border-accent bg-muted/50 rounded-r-lg p-5">
      {children}
    </div>
  );
}

function PhaseOverview({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-xl font-medium mb-2">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

interface PhaseDetailProps {
  pageNum: number;
  phaseLabel: string;
  phaseDays: string;
  goal: string;
  dailyFocus: string;
  avoid: string;
  signs: string;
  hardTitle: string;
  hardText: string;
  nextText: string;
}

function PhaseDetail({
  pageNum,
  phaseLabel,
  phaseDays,
  goal,
  dailyFocus,
  avoid,
  signs,
  hardTitle,
  hardText,
  nextText,
}: PhaseDetailProps) {
  return (
    <section className="border-t border-border pt-10">
      <p className="text-xs text-muted-foreground mb-6">{pageNum}</p>
      <p className="section-label mb-2">{phaseLabel}</p>
      <p className="text-sm text-muted-foreground mb-6">({phaseDays})</p>

      <h3 className="font-display text-xl font-medium mb-3">Phase Goal</h3>
      <p className="mb-6">{goal}</p>

      <h3 className="font-display text-xl font-medium mb-3">Daily Focus</h3>
      <p className="mb-6">{dailyFocus}</p>

      <h3 className="font-display text-xl font-medium mb-3">What to Avoid</h3>
      <p className="mb-6">{avoid}</p>

      <h3 className="font-display text-xl font-medium mb-3">Signs This Phase Is Working</h3>
      <p className="mb-6">{signs}</p>

      <Callout>
        <h4 className="font-display font-medium mb-2">{hardTitle}</h4>
        <p>{hardText}</p>
      </Callout>

      <p className="mt-6 text-sm text-muted-foreground italic">{nextText}</p>
    </section>
  );
}

function ReflectionBlock({ phase, prompt }: { phase: string; prompt: string }) {
  return (
    <div className="mt-8">
      <h3 className="font-display text-xl font-medium mb-2">{phase}</h3>
      <p className="text-muted-foreground mb-4">{prompt}</p>
      <div className="border border-border rounded-lg p-4 min-h-[120px] bg-card">
        <p className="text-sm text-muted-foreground italic">Phase Notes & Body Feedback:</p>
      </div>
    </div>
  );
}

