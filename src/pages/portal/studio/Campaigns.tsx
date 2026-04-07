import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Target,
  Calendar,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabase, useClerkUserId } from "@/hooks/use-supabase";
import { toast } from "sonner";

const campaignTypeLabels: Record<string, string> = {
  themed_week: "Themed Week",
  product_launch: "Product Launch",
  evergreen_funnel: "Evergreen Funnel",
};

const campaignTypeColors: Record<string, string> = {
  themed_week: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  product_launch: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  evergreen_funnel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const statusIcons: Record<string, typeof Clock> = { planning: Clock, active: Play, completed: CheckCircle, paused: Pause };
const statusColors: Record<string, string> = { planning: "text-yellow-600", active: "text-green-600", completed: "text-blue-600", paused: "text-gray-600" };

export default function Campaigns() {
  const supabase = useSupabase();
  const userId = useClerkUserId();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "", description: "", type: "themed_week" as string, startDate: "", endDate: "", targetPosts: 7,
  });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("campaigns").insert({
        name: newCampaign.name,
        description: newCampaign.description,
        type: newCampaign.type,
        start_date: newCampaign.startDate || null,
        end_date: newCampaign.endDate || null,
        target_posts: newCampaign.targetPosts,
        status: "planning",
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setIsDialogOpen(false);
      setNewCampaign({ name: "", description: "", type: "themed_week", startDate: "", endDate: "", targetPosts: 7 });
      toast.success("Campaign created!");
    },
    onError: () => toast.error("Failed to create campaign"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("campaigns").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted");
    },
  });

  const activeCt = campaigns.filter((c: Record<string, unknown>) => c.status === "active").length;
  const planningCt = campaigns.filter((c: Record<string, unknown>) => c.status === "planning").length;
  const completedCt = campaigns.filter((c: Record<string, unknown>) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Create themed content campaigns for focused messaging</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a themed content campaign to focus your messaging.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" placeholder="e.g., Gut Reset Week" value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="What's this campaign about?" value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign({ ...newCampaign, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="themed_week">Themed Week</SelectItem>
                    <SelectItem value="product_launch">Product Launch</SelectItem>
                    <SelectItem value="evergreen_funnel">Evergreen Funnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPosts">Target Posts</Label>
                <Input id="targetPosts" type="number" min={1} value={newCampaign.targetPosts}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetPosts: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate()} disabled={!newCampaign.name || createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>Active</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{activeCt}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Planning</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{planningCt}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Completed</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{completedCt}</p></CardContent></Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : campaigns.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No campaigns yet</p>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Your First Campaign</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign: Record<string, unknown>) => {
            const status = campaign.status as string;
            const type = campaign.type as string;
            const StatusIcon = statusIcons[status] || Clock;
            const targetPosts = (campaign.target_posts as number) || 7;

            return (
              <Card key={campaign.id as string} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={campaignTypeColors[type] || ""}>{campaignTypeLabels[type] || type}</Badge>
                        <div className={`flex items-center gap-1 ${statusColors[status] || ""}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm capitalize">{status}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg">{campaign.name as string}</h3>
                      {campaign.description && <p className="text-sm text-muted-foreground mt-1">{campaign.description as string}</p>}
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {campaign.start_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {campaign.start_date as string}{campaign.end_date ? ` - ${campaign.end_date as string}` : ""}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />{targetPosts} posts
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {status === "planning" && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: campaign.id as string, status: "active" })}>Start Campaign</DropdownMenuItem>
                        )}
                        {status === "active" && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: campaign.id as string, status: "paused" })}>Pause Campaign</DropdownMenuItem>
                        )}
                        {status === "paused" && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: campaign.id as string, status: "active" })}>Resume Campaign</DropdownMenuItem>
                        )}
                        {status === "active" && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: campaign.id as string, status: "completed" })}>Mark Complete</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(campaign.id as string)}>
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
    </div>
  );
}
