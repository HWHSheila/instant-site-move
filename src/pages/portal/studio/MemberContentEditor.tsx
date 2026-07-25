import { useState } from "react";
import { SEO } from "@/components/SEO";
import { useSupabase } from "@/hooks/use-supabase";
import {
  useMemberContentPosts,
  useSaveMemberContentPost,
  type MemberContentPost,
} from "@/hooks/use-member-content-posts";
import {
  MEMBER_CONTENT_PAIN_POINTS,
  MEMBER_CONTENT_FALSE_BELIEFS,
  TIER_OPTIONS,
  type MemberPostType,
} from "@/lib/member-content-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Save, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";

const TYPE_LABELS: Record<MemberPostType, { title: string; singular: string; icon: typeof BookOpen }> = {
  article: { title: "Member Content", singular: "article", icon: BookOpen },
  weekly_note: { title: "Weekly Coaching Notes", singular: "note", icon: FileText },
};

interface Props {
  postType: MemberPostType;
}

export default function MemberContentEditor({ postType }: Props) {
  const supabase = useSupabase();
  const { data: posts = [], isLoading } = useMemberContentPosts(postType, true);
  const savePost = useSaveMemberContentPost();

  const [editing, setEditing] = useState<Partial<MemberContentPost> | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [painPoint, setPainPoint] = useState("");
  const [falseBelief, setFalseBelief] = useState("");
  const [topicHint, setTopicHint] = useState("");

  const meta = TYPE_LABELS[postType];
  const Icon = meta.icon;

  const startNew = () => {
    setEditing({
      post_type: postType,
      title: "",
      body: "",
      status: "draft",
      tier_access: [...TIER_OPTIONS],
    });
  };

  const toggleTier = (tier: string) => {
    if (!editing) return;
    const current = editing.tier_access ?? [];
    setEditing({
      ...editing,
      tier_access: current.includes(tier)
        ? current.filter((t) => t !== tier)
        : [...current, tier],
    });
  };

  const handleAiDraft = async () => {
    if (!editing) return;
    setDrafting(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-member-content", {
        body: {
          post_type: postType,
          title: editing.title,
          topic_hint: topicHint,
          pain_point: painPoint || undefined,
          false_belief: falseBelief || undefined,
        },
      });
      if (error) throw error;
      if (data?.body) {
        setEditing({ ...editing, body: data.body, title: data.title || editing.title });
        toast.success("Draft generated — edit and save when ready.");
      }
    } catch {
      toast.error("Could not generate draft. You can still write manually.");
    } finally {
      setDrafting(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!editing?.title?.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      await savePost.mutateAsync({
        ...editing,
        post_type: postType,
        title: editing.title,
        status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      } as any);
      toast.success(publish ? "Published!" : "Saved as draft.");
      setEditing(null);
    } catch {
      toast.error("Save failed.");
    }
  };

  return (
    <>
      <SEO title={`Portal Studio — ${meta.title}`} noindex />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
              <Icon className="w-7 h-7 text-primary" />
              {meta.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Write and publish {meta.singular}s for your members. AI assist is optional.
            </p>
          </div>
          <Button onClick={startNew}>New {meta.singular}</Button>
        </div>

        {editing && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/40 border">
                <p className="sm:col-span-2 text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Optional AI draft assist
                </p>
                <div>
                  <Label>Pain point (optional)</Label>
                  <Select value={painPoint} onValueChange={setPainPoint}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Skip — not required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None — write freely</SelectItem>
                      {MEMBER_CONTENT_PAIN_POINTS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>False belief (optional)</Label>
                  <Select value={falseBelief} onValueChange={setFalseBelief}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Skip — not required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {MEMBER_CONTENT_FALSE_BELIEFS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="topic">Topic hint (optional)</Label>
                  <Input
                    id="topic"
                    value={topicHint}
                    onChange={(e) => setTopicHint(e.target.value)}
                    placeholder="e.g. new research on gut lining, general tip about sleep..."
                    className="mt-1"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAiDraft}
                  disabled={drafting}
                  className="sm:col-span-2"
                >
                  {drafting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate draft with AI
                </Button>
              </div>

              <div>
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  rows={12}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label className="mb-2 block">Visible to tiers</Label>
                <div className="flex flex-wrap gap-3">
                  {TIER_OPTIONS.map((tier) => (
                    <label key={tier} className="flex items-center gap-2 text-sm capitalize">
                      <Checkbox
                        checked={(editing.tier_access ?? []).includes(tier)}
                        onCheckedChange={() => toggleTier(tier)}
                      />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleSave(false)} disabled={savePost.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Save draft
                </Button>
                <Button variant="default" onClick={() => handleSave(true)} disabled={savePost.isPending}>
                  Publish
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Your posts
          </h2>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:border-primary/30" onClick={() => setEditing(post)}>
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.body}</p>
                  </div>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
