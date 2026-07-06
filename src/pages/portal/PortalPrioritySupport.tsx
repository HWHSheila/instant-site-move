import { SEO } from "@/components/SEO";
import { useSubscriber } from "@/hooks/use-subscriber";
import { usePreviewTier } from "@/components/portal/PortalLayout";
import {
  usePrioritySupportMessages,
  usePrioritySupportUsage,
  useSendPriorityMessage,
} from "@/hooks/use-priority-support";
import { PRIORITY_SUPPORT_CALENDLY_URL } from "@/lib/ai-coach-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock, MessageCircle, Calendar, ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ELIGIBLE_TIERS = ["restoration", "integration"];

export default function PortalPrioritySupport() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const { previewTier, isAdmin } = usePreviewTier();
  const { data: messages = [], isLoading } = usePrioritySupportMessages(subscriber?.id);

  const effectiveTier =
    isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier;
  const hasAccess = ELIGIBLE_TIERS.includes(effectiveTier ?? "");

  const { data: usage } = usePrioritySupportUsage(subscriber?.id, effectiveTier);
  const sendMessage = useSendPriorityMessage(subscriber?.id);
  const [text, setText] = useState("");

  const atLimit = usage ? usage.remaining <= 0 : false;

  const handleSend = async () => {
    if (!text.trim() || atLimit) return;
    try {
      await sendMessage.mutateAsync(text);
      setText("");
      toast.success("Message sent to Sheila.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <>
        <SEO title="Priority Support" noindex />
        <div className="space-y-6 max-w-lg mx-auto text-center py-12">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Priority Support</h1>
          <p className="text-muted-foreground">
            Direct messaging to Sheila is available on Restoration ($119/mo) and Integration ($299/mo) tiers.
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
      <SEO title="Priority Support" noindex />
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary" />
            Priority Support
          </h1>
          <p className="text-muted-foreground mt-1">
            Send Sheila a direct message. She reads these on her phone and replies through the portal.
          </p>
          {usage && (
            <p className="text-xs text-muted-foreground mt-2">
              {usage.remaining} of {usage.limit} messages remaining this month
            </p>
          )}
        </div>

        <Card>
          <CardContent className="pt-4">
            <a
              href={PRIORITY_SUPPORT_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Calendar className="w-4 h-4" />
              Book a Priority Support Strategy Session (15 min)
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message Sheila</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What would you like Sheila to know?"
              rows={4}
              disabled={atLimit || sendMessage.isPending}
            />
            <Button onClick={handleSend} disabled={!text.trim() || atLimit || sendMessage.isPending}>
              {sendMessage.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send Message
            </Button>
            {atLimit && (
              <p className="text-xs text-muted-foreground">
                You have reached your monthly message limit. It resets next month.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Conversation
          </h2>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <Card
                key={msg.id}
                className={msg.direction === "member_to_sheila" ? "ml-4" : "mr-4 border-primary/20 bg-primary/5"}
              >
                <CardContent className="pt-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {msg.direction === "member_to_sheila" ? "You" : "Sheila"} ·{" "}
                    {new Date(msg.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.message_text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
