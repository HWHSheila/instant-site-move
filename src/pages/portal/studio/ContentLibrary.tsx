import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Video
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface ContentPiece {
  id: string;
  title: string;
  postType: "authority" | "sales" | "engagement";
  pillar: string;
  status: "draft" | "ready" | "scheduled" | "posted";
  createdAt: string;
  scheduledDate?: string;
}

const mockContent: ContentPiece[] = [
  {
    id: "1",
    title: "Why your body holds onto weight when you're stressed",
    postType: "authority",
    pillar: "Metabolic Instability",
    status: "ready",
    createdAt: "2024-03-10",
  },
  {
    id: "2",
    title: "The gut-hormone connection nobody talks about",
    postType: "authority",
    pillar: "Gut Function",
    status: "scheduled",
    createdAt: "2024-03-09",
    scheduledDate: "2024-03-15",
  },
  {
    id: "3",
    title: "Comment ROADMAP for your personalized plan",
    postType: "sales",
    pillar: "Blood Sugar",
    status: "posted",
    createdAt: "2024-03-08",
  },
  {
    id: "4",
    title: "What patterns have you noticed with your energy?",
    postType: "engagement",
    pillar: "Chronic Fatigue",
    status: "draft",
    createdAt: "2024-03-07",
  },
];

const postTypeColors = {
  authority: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sales: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  engagement: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  ready: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  posted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContent = mockContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground">
            View and manage all your generated content
          </p>
        </div>
        <Link to="/portal/studio/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredContent.length === 0 ? (
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={postTypeColors[item.postType]}>
                            {item.postType.charAt(0).toUpperCase() + item.postType.slice(1)}
                          </Badge>
                          <Badge className={statusColors[item.status]}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{item.pillar}</span>
                          <span>•</span>
                          <span>Created {item.createdAt}</span>
                          {item.scheduledDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {item.scheduledDate}
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Script
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Video className="w-4 h-4 mr-2" />
                            Generate Video
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}
