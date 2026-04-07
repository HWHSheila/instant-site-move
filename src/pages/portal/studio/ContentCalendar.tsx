import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useSupabase, useClerkUserId } from "@/hooks/use-supabase";

const postTypeColors: Record<string, string> = {
  authority: "bg-blue-500",
  sales: "bg-green-500",
  engagement: "bg-purple-500",
};

interface CalendarEntry {
  id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  platform: string | null;
  content_pieces: {
    title: string;
    post_type: string;
  } | null;
}

export default function ContentCalendar() {
  const supabase = useSupabase();
  const userId = useClerkUserId();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["calendar-entries", userId, currentDate.getMonth(), currentDate.getFullYear()],
    queryFn: async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month + 2, 0).toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("calendar_entries")
        .select("id, scheduled_date, scheduled_time, platform, content_pieces(title, post_type)")
        .gte("scheduled_date", startDate)
        .lte("scheduled_date", endDate)
        .order("scheduled_date");
      if (error) throw error;
      return (data || []) as CalendarEntry[];
    },
    enabled: !!userId,
  });

  const { data: weekStats = { authority: 0, sales: 0, engagement: 0 } } = useQuery({
    queryKey: ["content-week-stats", userId],
    queryFn: async () => {
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - now.getDay() + 1);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const { data, error } = await supabase
        .from("content_pieces")
        .select("post_type")
        .gte("scheduled_date", monday.toISOString().split("T")[0])
        .lte("scheduled_date", sunday.toISOString().split("T")[0]);

      if (error) return { authority: 0, sales: 0, engagement: 0 };
      const counts = { authority: 0, sales: 0, engagement: 0 };
      (data || []).forEach((p: { post_type: string }) => {
        if (p.post_type in counts) counts[p.post_type as keyof typeof counts]++;
      });
      return counts;
    },
    enabled: !!userId,
  });

  const entriesByDate = useMemo(() => {
    const map: Record<string, CalendarEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.scheduled_date]) map[e.scheduled_date] = [];
      map[e.scheduled_date].push(e);
    });
    return map;
  }, [entries]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return d;
    });
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const days: Array<{ date: Date; isCurrentMonth: boolean; isToday: boolean; content: CalendarEntry[] }> = [];

    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false, isToday: false, content: [] });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateKey = d.toISOString().split("T")[0];
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
        content: entriesByDate[dateKey] || [],
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, isToday: false, content: [] });
    }
    return days;
  };

  const days = getMonthDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground">Plan and schedule your content for optimal engagement</p>
        </div>
        <Link to="/portal/studio/generate">
          <Button><Plus className="w-4 h-4 mr-2" />Schedule Content</Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Week's Mix</CardTitle>
          <CardDescription>Target: 50% Authority - 30% Sales - 20% Engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Authority: {weekStats.authority}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Sales: {weekStats.sales}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">Engagement: {weekStats.engagement}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant={viewMode === "week" ? "secondary" : "outline"} size="sm" onClick={() => setViewMode("week")}>Week</Button>
              <Button variant={viewMode === "month" ? "secondary" : "outline"} size="sm" onClick={() => setViewMode("month")}>Month</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div key={index} className={cn(
                    "min-h-[100px] p-2 border rounded-lg",
                    day.isCurrentMonth ? "bg-background" : "bg-muted/30",
                    day.isToday && "border-primary"
                  )}>
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      !day.isCurrentMonth && "text-muted-foreground",
                      day.isToday && "text-primary"
                    )}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.content.slice(0, 3).map((item) => (
                        <div key={item.id} className={cn(
                          "text-xs p-1 rounded truncate text-white",
                          postTypeColors[item.content_pieces?.post_type || "authority"]
                        )} title={item.content_pieces?.title}>
                          {item.scheduled_time && <span className="font-medium">{item.scheduled_time} </span>}
                          {item.content_pieces?.title || "Untitled"}
                        </div>
                      ))}
                      {day.content.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{day.content.length - 3} more</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" />Authority (50%)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" />Sales (30%)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" />Engagement (20%)</div>
      </div>
    </div>
  );
}
