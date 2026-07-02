import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Loader2, PlayCircle, Video } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { usePreviewTier } from "@/components/portal/PortalLayout";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContentPiece = Tables<"content_pieces">;

const pillarColors: Record<string, string> = {
  "Gut Function": "bg-violet-100 text-violet-700",
  "Blood Sugar": "bg-amber-100 text-amber-700",
  "Inflammation": "bg-red-100 text-red-700",
  "Metabolic Instability": "bg-emerald-100 text-emerald-700",
  "Chronic Fatigue": "bg-blue-100 text-blue-700",
};

// Tier access map — what each tier can see (cumulative up the stack)
const TIER_ACCESS: Record<string, string[]> = {
  admin: ["awareness", "foundation", "guided", "restoration", "integration"],
  integration: ["awareness", "foundation", "guided", "restoration", "integration"],
  restoration: ["awareness", "foundation", "guided", "restoration"],
  guided: ["awareness", "foundation", "guided"],
  foundation: ["awareness", "foundation"],
  awareness: ["awareness"],
};

export default function PortalContent() {
  const supabase = useSupabase();
  const { previewTier, isAdmin } = usePreviewTier();
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<ContentPiece | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("content_pieces")
        .select("*")
        .eq("portal_published", true)
        .eq("content_lane", "member")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Could not load content");
      } else {
        setContent(data ?? []);
      }
      setLoading(false);
    };
    fetchContent();
  }, [supabase]);

  const allowedTiers = TIER_ACCESS[previewTier] ?? TIER_ACCESS["admin"];

  const pillars = Array.from(new Set(content.map(c => c.pillar_name).filter(Boolean))) as string[];

  const filtered = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPillar = activeTab === "all" || item.pillar_name === activeTab;
    // When admin is previewing a specific tier, apply tier access filter
    const matchesTier = !isAdmin || previewTier === "admin" || allowedTiers.includes(item.content_lane ?? "awareness");
    return matchesSearch && matchesPillar && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Member Content</h1>
        <p className="text-muted-foreground">
          In-depth resources curated exclusively for members
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search content..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {pillars.map(p => (
            <TabsTrigger key={p} value={p}>{p}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchQuery ? "No content matches your search." : "No member content published yet. Check back soon."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map(item => (
                <Card
                  key={item.id}
                  className="hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.pillar_name && (
                        <Badge className={pillarColors[item.pillar_name] ?? "bg-gray-100 text-gray-700"}>
                          {item.pillar_name}
                        </Badge>
                      )}
                      {item.post_type && (
                        <Badge variant="outline" className="capitalize">{item.post_type}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base leading-snug flex items-center gap-2">
                      {item.title}
                      {item.video_url && <Video className="w-4 h-4 text-orange-500 shrink-0" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{item.caption}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Full content dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg leading-snug">{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-sm leading-relaxed">
              {selected.video_url && (
                <div className="aspect-video rounded-lg overflow-hidden border bg-black">
                  {selected.video_url.includes("youtube") ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${selected.video_url.match(/(?:watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1]}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : selected.video_url.includes("vimeo") ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${selected.video_url.match(/vimeo\.com\/(\d+)/)?.[1]}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={selected.video_url} controls className="w-full h-full" />
                  )}
                </div>
              )}
              {selected.script_hook && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Opening</p>
                  <p className="font-medium">{selected.script_hook}</p>
                </div>
              )}
              {selected.script_bridge && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Context</p>
                  <p>{selected.script_bridge}</p>
                </div>
              )}
              {selected.script_authority_anchor && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Why This Matters</p>
                  <p className="italic text-muted-foreground">{selected.script_authority_anchor}</p>
                </div>
              )}
              {selected.script_education && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Education</p>
                  <p>{selected.script_education}</p>
                </div>
              )}
              {selected.script_pattern_expansion && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pattern</p>
                  <p>{selected.script_pattern_expansion}</p>
                </div>
              )}
              {selected.script_cta && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Next Step</p>
                  <p className="font-medium">{selected.script_cta}</p>
                </div>
              )}
              {selected.hashtags && selected.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selected.hashtags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
