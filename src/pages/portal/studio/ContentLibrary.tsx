import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useSupabase, useClerkUserId } from "@/hooks/use-supabase";
import { toast } from "sonner";

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
  const supabase = useSupabase();
  const userId = useClerkUserId();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: contentPieces = [], isLoading } = useQuery({
    queryKey: ["content-pieces", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_pieces")
        .select("*, pillars(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const duplicateMutation = useMutation({
    mutationFn: async (piece: Record<string, unknown>) => {
      const { error } = await supabase.from("content_pieces").insert({
        title: `${piece.title} (Copy)`,
        pillar_id: piece.pillar_id,
        pain_point_id: piece.pain_point_id,
        false_belief_id: piece.false_belief_id,
        post_type: piece.post_type,
        hook_style: piece.hook_style,
        primary_strength: piece.primary_strength,
        script_hook: piece.script_hook,
        script_bridge: piece.script_bridge,
        script_authority_anchor: piece.script_authority_anchor,
        script_education: piece.script_education,
        script_pattern_expansion: piece.script_pattern_expansion,
        script_cta: piece.script_cta,
        full_script: piece.full_script,
        caption: piece.caption,
        hashtags: piece.hashtags,
        status: "draft",
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-pieces"] });
      toast.success("Script duplicated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_pieces").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-pieces"] });
      toast.success("Script deleted");
    },
  });

  const filteredContent = contentPieces.filter((item: Record<string, unknown>) => {
    const title = (item.title as string) || "";
    const status = (item.status as string) || "";
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || status === activeTab;
    return matchesSearch && matchesTab;
  });

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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({contentPieces.length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
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
              {filteredContent.map((item: Record<string, unknown>) => {
                const postType = (item.post_type as string) || "authority";
                const status = (item.status as string) || "draft";
                const pillarName = (item.pillars as Record<string, unknown>)?.name as string || "";
                const createdAt = item.created_at ? new Date(item.created_at as string).toLocaleDateString() : "";
                const scheduledDate = item.scheduled_date as string || "";

                return (
                  <Card key={item.id as string} className="hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={postTypeColors[postType] || ""}>
                              {postType.charAt(0).toUpperCase() + postType.slice(1)}
                            </Badge>
                            <Badge className={statusColors[status] || ""}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground truncate">{item.title as string}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {pillarName && <span>{pillarName}</span>}
                            {createdAt && <><span>·</span><span>Created {createdAt}</span></>}
                            {scheduledDate && (
                              <><span>·</span><span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{scheduledDate}</span></>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => duplicateMutation.mutate(item)}>
                              <Copy className="w-4 h-4 mr-2" />Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(item.id as string)}>
                              <Trash2 className="w-4 h-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
