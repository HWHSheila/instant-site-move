import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileCheck, BarChart3, CalendarDays, Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const supabase = useSupabase();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-analytics");
      if (error) throw error;
      return data?.data || {};
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const tierBreakdown = analytics?.tier_breakdown || {};
  const paymentBreakdown = analytics?.payment_breakdown || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of Her Wellness Harmony portal metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><Users className="w-4 h-4" />Subscribers</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{analytics?.total_subscribers || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />Active Journeys</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{analytics?.active_journeys || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><FileCheck className="w-4 h-4" />Pending Drafts</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{analytics?.pending_drafts || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><BarChart3 className="w-4 h-4" />Content Items</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-bold">{analytics?.total_content_items || 0}</p></CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Tier Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(tierBreakdown).length > 0 ? (
              Object.entries(tierBreakdown).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between py-1">
                  <span className="text-sm capitalize">{tier === "null" ? "No tier" : tier}</span>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No subscribers yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Payment Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(paymentBreakdown).length > 0 ? (
              Object.entries(paymentBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <span className="text-sm capitalize">{status}</span>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No payments yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/subscribers">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Manage Subscribers</h3>
                <p className="text-sm text-muted-foreground">View, search, override tiers</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/content">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 flex items-center gap-4">
              <FileCheck className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Content Approval</h3>
                <p className="text-sm text-muted-foreground">Review and publish AI-generated content</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
