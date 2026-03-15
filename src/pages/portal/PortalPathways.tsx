import { SEO } from "@/components/SEO";
import { CheckCircle2, Circle } from "lucide-react";

const pathways = [
  {
    phase: "Phase 1",
    title: "Digestion Rhythm",
    description: "Establish foundational digestive stability...meal timing, motility support, and identifying common triggers.",
    status: "available",
  },
  {
    phase: "Phase 2",
    title: "Stress Load",
    description: "Understand how your nervous system patterns influence digestion, sleep, and recovery signals.",
    status: "coming",
  },
  {
    phase: "Phase 3",
    title: "Metabolic Stability",
    description: "Build consistent energy by supporting blood sugar balance, nutrient absorption, and metabolic pacing.",
    status: "coming",
  },
  {
    phase: "Phase 4",
    title: "Hormone Pattern Awareness",
    description: "Connect the patterns from Phases 1 through 3 to understand what is driving hormonal shifts.",
    status: "coming",
  },
];

export default function PortalPathways() {
  return (
    <>
      <SEO title="Guided Pathways" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Guided Pathways</h1>
          <p className="text-muted-foreground mt-1">
            Follow the stabilization sequence from digestion through hormone awareness.
          </p>
        </div>

        <div className="space-y-4">
          {pathways.map((p) => (
            <div
              key={p.phase}
              className={`flex gap-4 p-5 rounded-xl border bg-card ${
                p.status === "available" ? "border-primary/30" : "border-border opacity-75"
              }`}
            >
              <div className="pt-0.5">
                {p.status === "available" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{p.phase}</p>
                <p className="font-display text-base font-semibold text-foreground mt-0.5">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                {p.status === "coming" && (
                  <span className="inline-block mt-2 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
