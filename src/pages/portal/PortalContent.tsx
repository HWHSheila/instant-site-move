import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

export default function PortalContent() {
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
  }, []);

  const pillars = Array.from(new Set(content.map(c => c.pillar_name).filter(Boolean))) as string[];

  const filtered = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPillar = activeTab === "all" || item.pillar_name === activeTab;
    return matchesSearch && matchesPillar;
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
                    <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
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
              {selected.hook && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Opening</p>
                  <p className="font-medium">{selected.hook}</p>
                </div>
              )}
              {selected.bridge && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Context</p>
                  <p>{selected.bridge}</p>
                </div>
              )}
              {selected.authority_anchor && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Why This Matters</p>
                  <p className="italic text-muted-foreground">{selected.authority_anchor}</p>
                </div>
              )}
              {selected.education && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Education</p>
                  <p>{selected.education}</p>
                </div>
              )}
              {selected.pattern_expansion && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pattern</p>
                  <p>{selected.pattern_expansion}</p>
                </div>
              )}
              {selected.cta && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Next Step</p>
                  <p className="font-medium">{selected.cta}</p>
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
