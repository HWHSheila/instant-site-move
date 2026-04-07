import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

export default function AdminContent() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ topic_seed: "", pillar: "P1", post_type: "authority", hook_style: "pattern" });

  const { data: drafts = [], isLoading } = useQuery({
    queryKey: ["admin-content-drafts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_drafts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (draft: Record<string, unknown>) => {
      const { error: insertErr } = await supabase.from("content_items").insert({
        title: draft.topic_seed as string,
        type: "guide",
        pillar: draft.pillar as string,
        tier_access: ["awareness", "foundation", "guided", "restoration", "integration"],
        description: draft.generated_script as string,
        approved: true,
      });
      if (insertErr) throw insertErr;

      const { error: updateErr } = await supabase
        .from("content_drafts")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", draft.id);
      if (updateErr) throw updateErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-drafts"] });
      toast.success("Content approved and published!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_drafts")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-drafts"] });
      toast.success("Content rejected");
    },
  });

  async function handleGenerate() {
    if (!genForm.topic_seed) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: genForm,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-content-drafts"] });
      setGenForm({ ...genForm, topic_seed: "" });
      toast.success("Content generated! Review it below.");
    } catch (err) {
      console.error("Generate error:", err);
      toast.error("Content generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  const pending = drafts.filter((d: Record<string, unknown>) => d.status === "pending");
  const reviewed = drafts.filter((d: Record<string, unknown>) => d.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Content Approval</h1>
        <p className="text-muted-foreground">Generate, review, and publish subscriber content.</p>
      </div>

      {/* Generate Content Form */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Generate New Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Topic Seed</Label>
            <Textarea placeholder="e.g., Why bloating is a signal, not a sentence..."
              value={genForm.topic_seed}
              onChange={(e) => setGenForm({ ...genForm, topic_seed: e.target.value })}
              rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Pillar</Label>
              <Select value={genForm.pillar} onValueChange={(v) => setGenForm({ ...genForm, pillar: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["P1", "P2", "P3", "P4", "P5"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={genForm.post_type} onValueChange={(v) => setGenForm({ ...genForm, post_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="authority">Authority</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hook Style</Label>
              <Select value={genForm.hook_style} onValueChange={(v) => setGenForm({ ...genForm, hook_style: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="symptom">Symptom</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                  <SelectItem value="false_belief">False Belief</SelectItem>
                  <SelectItem value="confusion">Confusion</SelectItem>
                  <SelectItem value="observation">Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating || !genForm.topic_seed}>
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      {/* Pending Drafts */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Pending Review ({pending.length})</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : pending.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No pending drafts</CardContent></Card>
        ) : (
          pending.map((draft: Record<string, unknown>) => {
            const isExpanded = expandedId === (draft.id as string);
            return (
              <Card key={draft.id as string}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{draft.pillar as string}</Badge>
                        <Badge variant="outline">{draft.post_type as string}</Badge>
                        <Badge>Pending</Badge>
                      </div>
                      <p className="text-sm font-medium mt-2">{draft.topic_seed as string}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(isExpanded ? null : draft.id as string)}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                      {[
                        ["Hook", draft.script_hook],
                        ["Bridge", draft.script_bridge],
                        ["Education", draft.script_education],
                        ["CTA", draft.script_cta],
                      ].map(([label, text]) => text ? (
                        <div key={label as string}>
                          <p className="text-xs font-medium text-muted-foreground mb-1">{label as string}</p>
                          <p>{text as string}</p>
                        </div>
                      ) : null)}
                      {draft.generated_caption && (
                        <div><p className="text-xs font-medium text-muted-foreground mb-1">Caption</p><p>{draft.generated_caption as string}</p></div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveMutation.mutate(draft)}
                      disabled={approveMutation.isPending}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />Approve & Publish
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(draft.id as string)}
                      disabled={rejectMutation.isPending}>
                      <XCircle className="w-4 h-4 mr-1" />Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Reviewed ({reviewed.length})</h2>
          {reviewed.slice(0, 10).map((draft: Record<string, unknown>) => (
            <Card key={draft.id as string} className="opacity-70">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <Badge variant={draft.status === "approved" ? "default" : "destructive"}>
                    {draft.status as string}
                  </Badge>
                  <span className="text-sm">{draft.topic_seed as string}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
