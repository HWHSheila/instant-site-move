import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock
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

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "themed_week" | "product_launch" | "evergreen_funnel";
  status: "planning" | "active" | "completed" | "paused";
  startDate: string;
  endDate: string;
  targetPosts: number;
  completedPosts: number;
  focusPainPoint?: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Gut Reset Week",
    description: "7-day focus on gut health and digestion",
    type: "themed_week",
    status: "active",
    startDate: "2024-03-11",
    endDate: "2024-03-17",
    targetPosts: 7,
    completedPosts: 3,
    focusPainPoint: "Bloating after most meals",
  },
  {
    id: "2",
    name: "90-Day Roadmap Launch",
    description: "Product launch campaign for the roadmap",
    type: "product_launch",
    status: "planning",
    startDate: "2024-03-25",
    endDate: "2024-04-01",
    targetPosts: 10,
    completedPosts: 0,
    focusPainPoint: "Weight fluctuates despite consistent eating",
  },
  {
    id: "3",
    name: "Metabolic Stability Funnel",
    description: "Evergreen content driving to free guide",
    type: "evergreen_funnel",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    targetPosts: 12,
    completedPosts: 12,
  },
];

const campaignTypeLabels = {
  themed_week: "Themed Week",
  product_launch: "Product Launch",
  evergreen_funnel: "Evergreen Funnel",
};

const campaignTypeColors = {
  themed_week: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  product_launch: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  evergreen_funnel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const statusIcons = {
  planning: Clock,
  active: Play,
  completed: CheckCircle,
  paused: Pause,
};

const statusColors = {
  planning: "text-yellow-600",
  active: "text-green-600",
  completed: "text-blue-600",
  paused: "text-gray-600",
};

export default function Campaigns() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "themed_week" as Campaign["type"],
    startDate: "",
    endDate: "",
    targetPosts: 7,
  });

  const handleCreateCampaign = () => {
    // TODO: Save to database
    console.log("Creating campaign:", newCampaign);
    setIsDialogOpen(false);
    setNewCampaign({
      name: "",
      description: "",
      type: "themed_week",
      startDate: "",
      endDate: "",
      targetPosts: 7,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">
            Create themed content campaigns for focused messaging
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a themed content campaign to focus your messaging.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Gut Reset Week"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's this campaign about?"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value: Campaign["type"]) => setNewCampaign({ ...newCampaign, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPosts">Target Posts</Label>
                <Input
                  id="targetPosts"
                  type="number"
                  min={1}
                  value={newCampaign.targetPosts}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetPosts: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} disabled={!newCampaign.name}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockCampaigns.filter(c => c.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Planning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockCampaigns.filter(c => c.status === "planning").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockCampaigns.filter(c => c.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {mockCampaigns.map((campaign) => {
          const StatusIcon = statusIcons[campaign.status];
          const progress = (campaign.completedPosts / campaign.targetPosts) * 100;

          return (
            <Card key={campaign.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={campaignTypeColors[campaign.type]}>
                        {campaignTypeLabels[campaign.type]}
                      </Badge>
                      <div className={`flex items-center gap-1 ${statusColors[campaign.status]}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm capitalize">{campaign.status}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {campaign.startDate} - {campaign.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {campaign.completedPosts}/{campaign.targetPosts} posts
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {campaign.focusPainPoint && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Focus: {campaign.focusPainPoint}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Add Content</DropdownMenuItem>
                      {campaign.status === "active" && (
                        <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                      )}
                      {campaign.status === "planning" && (
                        <DropdownMenuItem>Start Campaign</DropdownMenuItem>
                      )}
                      {campaign.status === "paused" && (
                        <DropdownMenuItem>Resume Campaign</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
