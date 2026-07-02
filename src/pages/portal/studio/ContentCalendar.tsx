import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ContentPiece = Tables<"content_pieces">;

interface CalendarDay {
  date: Date;
  items: ContentPiece[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

const postTypeColors: Record<string, string> = {
  authority: "bg-blue-500",
  sales: "bg-green-500",
  engagement: "bg-purple-500",
};

export default function ContentCalendar() {
  const supabase = useSupabase();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduled = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_pieces")
      .select("*")
      .not("scheduled_date", "is", null)
      .order("scheduled_date", { ascending: true });

    if (error) {
      toast.error("Failed to load calendar");
    } else {
      setScheduled(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchScheduled(); }, [supabase]);

  const markPosted = async (id: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("content_pieces")
      .update({ status: "posted", posted_at: now })
      .eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success("Marked as posted");
    setScheduled(prev => prev.map(p => p.id === id ? { ...p, status: "posted", posted_at: now } : p));
  };

  const getMonthDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const days: CalendarDay[] = [];

    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), items: [], isCurrentMonth: false, isToday: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayDate = new Date(year, month, i);
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        date: dayDate,
        items: scheduled.filter(p => p.scheduled_date === dateKey),
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), items: [], isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  const navigateMonth = (dir: "prev" | "next") => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (dir === "next" ? 1 : -1));
      return d;
    });
  };

  const days = getMonthDays(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weekStats = scheduled.reduce(
    (acc, p) => {
      if (p.post_type) acc[p.post_type] = (acc[p.post_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground">Plan and schedule your content for optimal engagement</p>
        </div>
        <Link to="/portal/studio/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </Link>
      </div>

      {/* Mix tracker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Scheduled Mix</CardTitle>
          <CardDescription>Target: 50% Authority · 30% Sales · 20% Engagement</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Authority: {weekStats.authority ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Sales: {weekStats.sales ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">Engagement: {weekStats.engagement ?? 0}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar grid */}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] p-2 border rounded-lg",
                    day.isCurrentMonth ? "bg-background" : "bg-muted/30",
                    day.isToday && "border-primary"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    !day.isCurrentMonth && "text-muted-foreground",
                    day.isToday && "text-primary"
                  )}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.items.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          "text-xs p-1 rounded truncate text-white group relative",
                          item.post_type ? postTypeColors[item.post_type] : "bg-gray-400"
                        )}
                        title={item.title}
                      >
                        <span>{item.scheduled_time && `${item.scheduled_time} `}{item.title}</span>
                        {item.status !== "posted" && (
                          <button
                            className="hidden group-hover:inline-flex ml-1 opacity-80 hover:opacity-100"
                            onClick={() => markPosted(item.id)}
                            title="Mark as posted"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {day.items.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{day.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
