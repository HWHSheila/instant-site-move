import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Library, Calendar, Target, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { useSupabase, useClerkUserId } from "@/hooks/use-supabase";

export default function StudioDashboard() {
  const supabase = useSupabase();
  const userId = useClerkUserId();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["studio-stats", userId],
    queryFn: async () => {
      const [draftsRes, scheduledRes, postedRes, weekRes] = await Promise.all([
        supabase.from("content_pieces").select("id", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("content_pieces").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase.from("content_pieces").select("id", { count: "exact", head: true }).eq("status", "posted"),
        (() => {
          const now = new Date();
          const monday = new Date(now);
          monday.setDate(now.getDate() - now.getDay() + 1);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          return supabase
            .from("content_pieces")
            .select("post_type")
            .gte("created_at", monday.toISOString())
            .lte("created_at", sunday.toISOString());
        })(),
      ]);

      const weekData = weekRes.data || [];
      const thisWeek = { authority: 0, sales: 0, engagement: 0 };
      weekData.forEach((p: { post_type: string }) => {
        if (p.post_type in thisWeek) thisWeek[p.post_type as keyof typeof thisWeek]++;
      });

      return {
        drafted: draftsRes.count || 0,
        scheduled: scheduledRes.count || 0,
        posted: postedRes.count || 0,
        thisWeek,
      };
    },
    enabled: !!userId,
  });

  const quickActions = [
    { title: "Generate Script", description: "Create a new content script using AI", icon: Sparkles, to: "/portal/studio/generate", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    { title: "Content Library", description: "View and manage all your content", icon: Library, to: "/portal/studio/library", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { title: "Content Calendar", description: "Plan and schedule your content", icon: Calendar, to: "/portal/studio/calendar", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { title: "Campaigns", description: "Create themed content campaigns", icon: Target, to: "/portal/studio/campaigns", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  const d = stats?.drafted ?? 0;
  const s = stats?.scheduled ?? 0;
  const p = stats?.posted ?? 0;
  const tw = stats?.thisWeek ?? { authority: 0, sales: 0, engagement: 0 };
  const totalWeek = tw.authority + tw.sales + tw.engagement;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Content Studio</h1>
        <p className="text-muted-foreground mt-2">Create, manage, and schedule your content with AI-powered script generation.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardHeader className="pb-2"><CardDescription>Drafts</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{d}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>Scheduled</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{s}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>Posted</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold">{p}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>This Week</CardDescription></CardHeader>
              <CardContent className="flex gap-2">
                <Badge variant="secondary" className="text-xs">A: {tw.authority}</Badge>
                <Badge variant="secondary" className="text-xs">S: {tw.sales}</Badge>
                <Badge variant="secondary" className="text-xs">E: {tw.engagement}</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" />Weekly Post Mix (Target: 50/30/20)</CardTitle>
              <CardDescription>Authority (50%) - Sales (30%) - Engagement (20%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-0.5 h-8 rounded-full overflow-hidden bg-muted">
                {totalWeek > 0 ? (
                  <>
                    {tw.authority > 0 && (
                      <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(tw.authority / totalWeek) * 100}%` }}>
                        {Math.round((tw.authority / totalWeek) * 100)}%
                      </div>
                    )}
                    {tw.sales > 0 && (
                      <div className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(tw.sales / totalWeek) * 100}%` }}>
                        {Math.round((tw.sales / totalWeek) * 100)}%
                      </div>
                    )}
                    {tw.engagement > 0 && (
                      <div className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(tw.engagement / totalWeek) * 100}%` }}>
                        {Math.round((tw.engagement / totalWeek) * 100)}%
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center text-xs text-muted-foreground">No content this week</div>
                )}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" />Authority</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" />Sales</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500" />Engagement</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.color}`}><action.icon className="w-6 h-6" /></div>
                      <div>
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
