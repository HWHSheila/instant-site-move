import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle,
  Globe,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ContentPiece = Tables<"content_pieces">;

const postTypeColors: Record<string, string> = {
  authority: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sales: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  engagement: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  ready: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  posted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<ContentPiece | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_pieces")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load content");
    } else {
      setContent(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const updateStatus = async (id: string, status: ContentPiece["status"]) => {
    const { error } = await supabase
      .from("content_pieces")
      .update({ status })
      .eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(`Marked as ${status}`);
    setContent(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const togglePortalPublish = async (item: ContentPiece) => {
    const next = !item.portal_published;
    const { error } = await supabase
      .from("content_pieces")
      .update({ portal_published: next, content_lane: next ? "member" : "attract" })
      .eq("id", item.id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(next ? "Published to member portal" : "Removed from portal");
    setContent(prev =>
      prev.map(p => p.id === item.id ? { ...p, portal_published: next, content_lane: next ? "member" : "attract" } : p)
    );
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("content_pieces").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Deleted");
    setContent(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground">View and manage all your generated content</p>
        </div>
        <Link to="/portal/studio/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No content found</p>
                <Link to="/portal/studio/generate">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Script
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {item.post_type && (
                            <Badge className={postTypeColors[item.post_type]}>
                              {item.post_type.charAt(0).toUpperCase() + item.post_type.slice(1)}
                            </Badge>
                          )}
                          <Badge className={statusColors[item.status]}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                          {item.portal_published && (
                            <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                              <Globe className="w-3 h-3 mr-1" />
                              Portal
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          {item.pillar_name && <span>{item.pillar_name}</span>}
                          <span>•</span>
                          <span>
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                          {item.scheduled_date && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {item.scheduled_date}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewItem(item)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Script
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(item.full_script ?? "")}
                            disabled={!item.full_script}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Script
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status !== "ready" && (
                            <DropdownMenuItem onClick={() => updateStatus(item.id, "ready")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Ready
                            </DropdownMenuItem>
                          )}
                          {item.status !== "posted" && (
                            <DropdownMenuItem onClick={() => updateStatus(item.id, "posted")}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Mark Posted
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => togglePortalPublish(item)}>
                            <Globe className="w-4 h-4 mr-2" />
                            {item.portal_published ? "Remove from Portal" : "Publish to Portal"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewItem?.title}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4 text-sm">
              {previewItem.hook && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">HOOK</p>
                  <p>{previewItem.hook}</p>
                </div>
              )}
              {previewItem.bridge && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">BRIDGE</p>
                  <p>{previewItem.bridge}</p>
                </div>
              )}
              {previewItem.education && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">EDUCATION</p>
                  <p>{previewItem.education}</p>
                </div>
              )}
              {previewItem.cta && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">CTA</p>
                  <p className="font-medium">{previewItem.cta}</p>
                </div>
              )}
              {previewItem.caption && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">CAPTION</p>
                  <p>{previewItem.caption}</p>
                </div>
              )}
              {previewItem.hashtags && previewItem.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {previewItem.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(previewItem.full_script ?? "")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Full Script
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
