import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useSubscriber } from "@/hooks/use-subscriber";
import { useEffectiveTier } from "@/hooks/use-effective-tier";
import { useSymptomLogs, useAddSymptomLog } from "@/hooks/use-symptom-logs";
import { canAccessSymptomLog } from "@/lib/tier-access";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock, NotebookPen, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

export default function PortalSymptomLog() {
  const navigate = useNavigate();
  const { subscriber } = useSubscriber();
  const { tier: effectiveTier, isAdmin, isPreviewing } = useEffectiveTier();
  const { data: logs = [], isLoading } = useSymptomLogs(subscriber?.id);
  const addLog = useAddSymptomLog(subscriber?.id);
  const [text, setText] = useState("");

  const hasAccess = isAdmin && !isPreviewing ? true : canAccessSymptomLog(effectiveTier);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a note before saving.");
      return;
    }
    try {
      await addLog.mutateAsync(text);
      setText("");
      toast.success("Symptom log saved.");
    } catch {
      toast.error("Could not save your log. Please try again.");
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
        <SEO title="Symptom Log" noindex />
        <div className="space-y-6 max-w-lg mx-auto text-center py-12">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-display text-2xl font-semibold">Symptom Log</h1>
          <p className="text-muted-foreground">
            Free-form symptom tracking is available on paid membership tiers ($9 and above).
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
      <SEO title="Symptom Log" noindex />
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <NotebookPen className="w-7 h-7 text-primary" />
            Symptom Log
          </h1>
          <p className="text-muted-foreground mt-1">
            Track how you feel day to day. These notes stay in your portal history.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are you noticing today? Patterns, shifts, triggers..."
              rows={4}
            />
            <Button onClick={handleSubmit} disabled={addLog.isPending}>
              {addLog.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Your History
          </h2>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No entries yet. Your first log will appear here.
            </p>
          ) : (
            logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.logged_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{log.log_text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
