import { SEO } from "@/components/SEO";
import { Bot } from "lucide-react";

export default function PortalAICoaching() {
  return (
    <>
      <SEO title="AI Coaching Assistant" noindex />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">AI Coaching Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Ask questions and receive guidance based on the root-cause coaching framework.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 md:p-12 flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <Bot className="w-8 h-8" />
          </div>
          <p className="font-display text-lg font-medium text-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            The AI Coaching Assistant will help you explore patterns, understand connections between your symptoms, and guide you through your coaching journey...all based on the Gut → Metabolism → Hormones framework.
          </p>
        </div>
      </div>
    </>
  );
}
