import { useState } from "react";
import { SEO } from "@/components/SEO";
import { useSubscriber } from "@/hooks/use-subscriber";
import { usePreviewTier } from "@/components/portal/PortalLayout";
import { useAiCoachUsage, useAskAiCoach, type CoachMessage } from "@/hooks/use-ai-coach";
import { isAiCoachAvailable } from "@/lib/ai-coach-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Lock, Send, ArrowUpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PortalAICoaching() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const { previewTier, isAdmin } = usePreviewTier();
  const { data: usage, isLoading: usageLoading } = useAiCoachUsage(
    subscriber?.id,
    subscriber?.tier,
    subscriber?.payment_status,
    subscriber?.trial_start_date
  );
  const askCoach = useAskAiCoach(subscriber?.id);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoachMessage[]>([]);

  const effectiveTier =
    isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier;
  const hasAccess =
    isAdmin && previewTier === "admin"
      ? true
      : isAiCoachAvailable(
          effectiveTier,
          subscriber?.payment_status,
          subscriber?.trial_start_date
        );

  const atLimit =
    usage?.limit != null && usage.remaining != null && usage.remaining <= 0;

  const handleSend = async () => {
    if (!input.trim() || atLimit) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const { response } = await askCoach.mutateAsync({ question, history: messages });
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  if (usageLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <>
        <SEO title="Ask the HWH Coach" noindex />
        <div className="space-y-6 max-w-lg mx-auto text-center py-12">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Ask the HWH Coach</h1>
          <p className="text-muted-foreground">
            The AI Coaching Assistant is available on all paid membership tiers.
          </p>
          <Button onClick={() => navigate("/portal/coaching")}>
            View Membership Options
            <ArrowUpCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Ask the HWH Coach" noindex />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary" />
            Ask the HWH Coach
          </h1>
          <p className="text-muted-foreground mt-1">
            Get guidance on your roadmap, patterns, and next steps — grounded in the
            Gut → Metabolism → Hormones framework.
          </p>
          {usage && (
            <p className="text-xs text-muted-foreground mt-2">
              {usage.limit == null
                ? "Unlimited questions this month"
                : `${usage.remaining ?? 0} of ${usage.limit} questions remaining this month`}
            </p>
          )}
        </div>

        <Card className="bg-muted/30">
          <CardContent className="pt-4 text-xs text-muted-foreground">
            This assistant provides educational wellness guidance only — not medical advice,
            diagnoses, or supplement recommendations. Always work with your licensed
            healthcare provider for medical decisions.
          </CardContent>
        </Card>

        <div className="space-y-4 min-h-[200px]">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Ask about a lesson concept, your symptom patterns, or what to focus on next.
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted border border-border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {askCoach.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              atLimit
                ? "Monthly question limit reached."
                : "Ask your coaching question..."
            }
            rows={2}
            disabled={atLimit || askCoach.isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            className="shrink-0 self-end"
            onClick={handleSend}
            disabled={!input.trim() || atLimit || askCoach.isPending}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
