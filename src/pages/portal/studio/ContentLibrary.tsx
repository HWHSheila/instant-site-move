import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Video,
  Upload,
  Link as LinkIcon,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
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

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.includes("supabase") || url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm")) return url;
  return null;
}

export default function ContentLibrary() {
  const supabase = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<ContentPiece | null>(null);
  const [videoItem, setVideoItem] = useState<ContentPiece | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_pieces")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load content"); }
    else { setContent(data ?? []); }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, [supabase]);

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const updateStatus = async (id: string, status: ContentPiece["status"]) => {
    const { error } = await supabase.from("content_pieces").update({ status }).eq("id", id);
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
    setContent(prev => prev.map(p => p.id === item.id
      ? { ...p, portal_published: next, content_lane: next ? "member" : "attract" } : p));
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("content_pieces").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Deleted");
    setContent(prev => prev.filter(p => p.id !== id));
  };

  const openVideoDialog = (item: ContentPiece) => {
    setVideoItem(item);
    setVideoUrl(item.video_url ?? "");
  };

  const saveVideoUrl = async () => {
    if (!videoItem) return;
    const { error } = await supabase
      .from("content_pieces")
      .update({ video_url: videoUrl || null, video_status: videoUrl ? "uploaded" : null })
      .eq("id", videoItem.id);
    if (error) { toast.error("Failed to save video"); return; }
    toast.success("Video saved");
    setContent(prev => prev.map(p => p.id === videoItem.id
      ? { ...p, video_url: videoUrl || null, video_status: videoUrl ? "uploaded" : null } : p));
    setVideoItem(null);
  };

  const uploadVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !videoItem) return;
    setUploading(true);
    const path = `${videoItem.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("content-videos").upload(path, file);
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }
    const { data } = supabase.storage.from("content-videos").getPublicUrl(path);
    const url = data.publicUrl;
    setVideoUrl(url);
    const { error } = await supabase
      .from("content_pieces")
      .update({ video_url: url, video_status: "uploaded" })
      .eq("id", videoItem.id);
    if (error) { toast.error("Failed to save video URL"); setUploading(false); return; }
    toast.success("Video uploaded");
    setContent(prev => prev.map(p => p.id === videoItem!.id
      ? { ...p, video_url: url, video_status: "uploaded" } : p));
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground">View and manage all your generated content</p>
        </div>
        <Link to="/portal/studio/generate">
          <Button><Plus className="w-4 h-4 mr-2" />New Script</Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
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
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No content found</p>
                <Link to="/portal/studio/generate">
                  <Button><Plus className="w-4 h-4 mr-2" />Create Your First Script</Button>
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
                          {item.video_url && (
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                              <Video className="w-3 h-3 mr-1" />Video
                            </Badge>
                          )}
                          {item.portal_published && (
                            <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                              <Globe className="w-3 h-3 mr-1" />Portal
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          {item.pillar_name && <span>{item.pillar_name}</span>}
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          {item.scheduled_date && (
                            <><span>•</span><span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{item.scheduled_date}</span></>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewItem(item)}>
                            <Eye className="w-4 h-4 mr-2" />View Script
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.full_script ?? "")} disabled={!item.full_script}>
                            <Copy className="w-4 h-4 mr-2" />Copy Script
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openVideoDialog(item)}>
                            <Video className="w-4 h-4 mr-2" />{item.video_url ? "Update Video" : "Add Video"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status !== "ready" && (
                            <DropdownMenuItem onClick={() => updateStatus(item.id, "ready")}>
                              <CheckCircle className="w-4 h-4 mr-2" />Mark Ready
                            </DropdownMenuItem>
                          )}
                          {item.status !== "posted" && (
                            <DropdownMenuItem onClick={() => updateStatus(item.id, "posted")}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />Mark Posted
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => togglePortalPublish(item)}>
                            <Globe className="w-4 h-4 mr-2" />{item.portal_published ? "Remove from Portal" : "Publish to Portal"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />Delete
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

      {/* Script Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{previewItem?.title}</DialogTitle></DialogHeader>
          {previewItem && (
            <div className="space-y-4 text-sm">
              {previewItem.script_hook && <div><p className="text-xs font-medium text-muted-foreground mb-1">HOOK</p><p>{previewItem.script_hook}</p></div>}
              {previewItem.script_bridge && <div><p className="text-xs font-medium text-muted-foreground mb-1">BRIDGE</p><p>{previewItem.script_bridge}</p></div>}
              {previewItem.script_education && <div><p className="text-xs font-medium text-muted-foreground mb-1">EDUCATION</p><p>{previewItem.script_education}</p></div>}
              {previewItem.script_cta && <div><p className="text-xs font-medium text-muted-foreground mb-1">CTA</p><p className="font-medium">{previewItem.script_cta}</p></div>}
              {previewItem.caption && <div><p className="text-xs font-medium text-muted-foreground mb-1">CAPTION</p><p>{previewItem.caption}</p></div>}
              {previewItem.hashtags && previewItem.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {previewItem.hashtags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                </div>
              )}
              <Button className="w-full" variant="outline" onClick={() => navigator.clipboard.writeText(previewItem.full_script ?? "")}>
                <Copy className="w-4 h-4 mr-2" />Copy Full Script
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={!!videoItem} onOpenChange={() => { setVideoItem(null); setVideoUrl(""); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Video to "{videoItem?.title}"</DialogTitle></DialogHeader>
          <Tabs defaultValue="url" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-2" />Paste URL</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-2" />Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>YouTube, Vimeo, or direct video URL</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
              </div>
              {videoUrl && getEmbedUrl(videoUrl) && (
                <div className="aspect-video rounded-lg overflow-hidden border">
                  {videoUrl.includes("supabase") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".mov") ? (
                    <video src={videoUrl} controls className="w-full h-full" />
                  ) : (
                    <iframe src={getEmbedUrl(videoUrl)!} className="w-full h-full" allowFullScreen />
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload video file (MP4, MOV, WebM — max 500MB)</Label>
                <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={uploadVideoFile} />
                <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Choose Video File</>}
                </Button>
              </div>
              {videoUrl && (
                <div className="text-sm text-muted-foreground truncate">
                  Uploaded: <span className="text-foreground">{videoUrl.split("/").pop()}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setVideoItem(null); setVideoUrl(""); }}>Cancel</Button>
            <Button onClick={saveVideoUrl} disabled={uploading}>Save Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
