import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
  Upload,
  Link as LinkIcon,
  Library,
  Filter,
  Video,
  Edit,
  CheckCircle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

type PortalVideo = {
  id: string;
  video_code: string;
  title: string;
  phase: string;
  sub_category: string;
  sequence_order: number;
  is_foundation_layer: boolean;
  production_status: string;
  secondary_strength: string | null;
  video_url: string | null;
  supabase_storage_path: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const PHASES = [
  "Nervous System Foundation",
  "Gut Function",
  "Metabolic Repair",
  "Hormonal Balancing",
  "Maintenance",
];

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started", color: "bg-gray-100 text-gray-700" },
  { value: "scripted", label: "Scripted", color: "bg-yellow-100 text-yellow-700" },
  { value: "recorded", label: "Recorded", color: "bg-blue-100 text-blue-700" },
  { value: "uploaded", label: "Uploaded", color: "bg-purple-100 text-purple-700" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-700" },
];

function getStatusBadge(status: string) {
  const opt = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  return <Badge className={opt.color}>{opt.label}</Badge>;
}

export default function PortalVideoLibrary() {
  const supabase = useSupabase();
  const [videos, setVideos] = useState<PortalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [detailVideo, setDetailVideo] = useState<PortalVideo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  const [videoDialogItem, setVideoDialogItem] = useState<PortalVideo | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portal_videos")
      .select("*")
      .order("phase")
      .order("sequence_order");
    if (error) { toast.error("Failed to load videos"); }
    else { setVideos((data as PortalVideo[]) ?? []); }
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, [supabase]);

  const filtered = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase())
      || v.video_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = phaseFilter === "all" || v.phase === phaseFilter;
    const matchesStatus = statusFilter === "all" || v.production_status === statusFilter;
    return matchesSearch && matchesPhase && matchesStatus;
  });

  const subCategories = [...new Set(filtered.map(v => v.sub_category))];

  const stats = {
    total: videos.length,
    published: videos.filter(v => v.production_status === "published").length,
    scripted: videos.filter(v => v.production_status === "scripted").length,
    recorded: videos.filter(v => v.production_status === "recorded").length,
    uploaded: videos.filter(v => v.production_status === "uploaded").length,
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: Record<string, unknown> = { production_status: status };
    if (status === "published") updates.published_at = new Date().toISOString();
    const { error } = await supabase.from("portal_videos").update(updates).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(`Status updated to ${status}`);
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } as PortalVideo : v));
  };

  const deleteVideo = async (id: string) => {
    const { error } = await supabase.from("portal_videos").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Video deleted");
    setVideos(prev => prev.filter(v => v.id !== id));
    if (detailVideo?.id === id) setDetailVideo(null);
  };

  const saveDetail = async () => {
    if (!detailVideo) return;
    const { error } = await supabase.from("portal_videos")
      .update({ title: editTitle, sub_category: editSubCategory })
      .eq("id", detailVideo.id);
    if (error) { toast.error("Save failed"); return; }
    toast.success("Video updated");
    setVideos(prev => prev.map(v => v.id === detailVideo.id
      ? { ...v, title: editTitle, sub_category: editSubCategory } : v));
    setDetailVideo(null);
  };

  const addVideo = async () => {
    if (!newCode || !newTitle || !newPhase || !newSubCategory) {
      toast.error("All fields are required"); return;
    }
    const { data, error } = await supabase.from("portal_videos")
      .insert({
        video_code: newCode,
        title: newTitle,
        phase: newPhase,
        sub_category: newSubCategory,
        sequence_order: videos.filter(v => v.phase === newPhase).length + 1,
        is_foundation_layer: newPhase === "Nervous System Foundation",
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Video code already exists" : "Failed to add video");
      return;
    }
    toast.success("Video added");
    setVideos(prev => [...prev, data as PortalVideo]);
    setAddDialogOpen(false);
    setNewCode(""); setNewTitle(""); setNewPhase(""); setNewSubCategory("");
  };

  const openVideoUpload = (v: PortalVideo) => {
    setVideoDialogItem(v);
    setVideoUrl(v.video_url ?? "");
  };

  const saveVideoUrl = async () => {
    if (!videoDialogItem) return;
    const updates: Record<string, unknown> = { video_url: videoUrl || null };
    if (videoUrl && videoDialogItem.production_status === "not_started") {
      updates.production_status = "uploaded";
    }
    const { error } = await supabase.from("portal_videos").update(updates).eq("id", videoDialogItem.id);
    if (error) { toast.error("Failed to save video"); return; }
    toast.success("Video saved");
    setVideos(prev => prev.map(v => v.id === videoDialogItem.id ? { ...v, ...updates } as PortalVideo : v));
    setVideoDialogItem(null);
  };

  const uploadVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !videoDialogItem) return;
    setUploading(true);
    const path = `${videoDialogItem.video_code}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("portal-videos").upload(path, file);
    if (upErr) { toast.error("Upload failed: " + upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("portal-videos").getPublicUrl(path);
    const url = data.publicUrl;
    setVideoUrl(url);
    const updates: Record<string, unknown> = {
      video_url: url,
      supabase_storage_path: path,
      production_status: "uploaded",
    };
    const { error } = await supabase.from("portal_videos").update(updates).eq("id", videoDialogItem.id);
    if (error) { toast.error("Failed to save video URL"); setUploading(false); return; }
    toast.success("Video uploaded");
    setVideos(prev => prev.map(v => v.id === videoDialogItem.id ? { ...v, ...updates } as PortalVideo : v));
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Library className="w-6 h-6" />
            Portal Video Library
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats.published} of {stats.total} published
            {stats.scripted > 0 && ` · ${stats.scripted} scripted`}
            {stats.recorded > 0 && ` · ${stats.recorded} recorded`}
            {stats.uploaded > 0 && ` · ${stats.uploaded} uploaded`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/portal/studio/portal-generate">
            <Button variant="outline">Generate Script</Button>
          </Link>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Video
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title or code..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-[200px]"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Phase" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            {PHASES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Video list */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No videos match your filters</p>
          </CardContent>
        </Card>
      ) : (
        subCategories.map(sc => (
          <div key={sc} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">{sc}</h3>
            <div className="space-y-2">
              {filtered.filter(v => v.sub_category === sc).map(v => (
                <Card key={v.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{v.video_code}</span>
                        <span className="text-sm font-medium text-foreground truncate">{v.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {v.video_url && (
                          <Badge className="bg-orange-100 text-orange-700"><Video className="w-3 h-3 mr-1" />Video</Badge>
                        )}
                        {getStatusBadge(v.production_status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setDetailVideo(v); setEditTitle(v.title); setEditSubCategory(v.sub_category); }}>
                              <Edit className="w-4 h-4 mr-2" />Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openVideoUpload(v)}>
                              <Video className="w-4 h-4 mr-2" />{v.video_url ? "Update Video" : "Add Video"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {STATUS_OPTIONS.filter(s => s.value !== v.production_status).map(s => (
                              <DropdownMenuItem key={s.value} onClick={() => updateStatus(v.id, s.value)}>
                                <CheckCircle className="w-4 h-4 mr-2" />Mark {s.label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteVideo(v.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Edit Detail Dialog */}
      <Dialog open={!!detailVideo} onOpenChange={() => setDetailVideo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit — {detailVideo?.video_code}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Sub-Category</Label>
              <Input value={editSubCategory} onChange={e => setEditSubCategory(e.target.value)} />
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Phase: {detailVideo?.phase}</p>
              <p>Foundation Layer: {detailVideo?.is_foundation_layer ? "Yes" : "No"}</p>
              <p>Status: {detailVideo?.production_status}</p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDetailVideo(null)}>Cancel</Button>
            <Button onClick={saveDetail}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Video</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Video Code (unique, e.g. GF-06)</Label>
              <Input placeholder="XX-00" value={newCode} onChange={e => setNewCode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Lesson title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phase</Label>
              <Select value={newPhase} onValueChange={setNewPhase}>
                <SelectTrigger><SelectValue placeholder="Select phase" /></SelectTrigger>
                <SelectContent>
                  {PHASES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub-Category</Label>
              <Input placeholder="e.g. Gut Lining Permeability" value={newSubCategory} onChange={e => setNewSubCategory(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addVideo}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Upload/URL Dialog */}
      <Dialog open={!!videoDialogItem} onOpenChange={() => { setVideoDialogItem(null); setVideoUrl(""); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Video for "{videoDialogItem?.title}"</DialogTitle></DialogHeader>
          <Tabs defaultValue="url" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-2" />Paste URL</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-2" />Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Direct video URL (YouTube, Vimeo, or file link)</Label>
                <Input placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload video file (MP4, MOV, WebM — max 500MB)</Label>
                <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={uploadVideoFile} />
                <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Choose File</>}
                </Button>
              </div>
              {videoUrl && (
                <div className="text-sm text-muted-foreground truncate">
                  Current: <span className="text-foreground">{videoUrl.split("/").pop()}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setVideoDialogItem(null); setVideoUrl(""); }}>Cancel</Button>
            <Button onClick={saveVideoUrl} disabled={uploading}>Save Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
