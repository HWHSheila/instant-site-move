import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ScheduledContent {
  id: string;
  title: string;
  postType: "authority" | "sales" | "engagement";
  time?: string;
}

interface CalendarDay {
  date: Date;
  content: ScheduledContent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

const postTypeColors = {
  authority: "bg-blue-500",
  sales: "bg-green-500",
  engagement: "bg-purple-500",
};

const mockScheduledContent: Record<string, ScheduledContent[]> = {
  "2024-03-11": [
    { id: "1", title: "Gut-hormone connection", postType: "authority", time: "9:00 AM" },
  ],
  "2024-03-13": [
    { id: "2", title: "Comment ROADMAP", postType: "sales", time: "12:00 PM" },
    { id: "3", title: "Energy patterns poll", postType: "engagement", time: "5:00 PM" },
  ],
  "2024-03-15": [
    { id: "4", title: "Metabolic adaptation", postType: "authority", time: "10:00 AM" },
  ],
  "2024-03-18": [
    { id: "5", title: "Weekly check-in", postType: "engagement", time: "3:00 PM" },
  ],
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const getMonthDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    const days: CalendarDay[] = [];
    
    // Add days from previous month
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        content: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayDate = new Date(year, month, i);
      const dateKey = dayDate.toISOString().split("T")[0];
      days.push({
        date: dayDate,
        content: mockScheduledContent[dateKey] || [],
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        content: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const days = getMonthDays(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate weekly stats
  const weekStats = {
    authority: 0,
    sales: 0,
    engagement: 0,
  };
  Object.values(mockScheduledContent).flat().forEach(content => {
    weekStats[content.postType]++;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground">
            Plan and schedule your content for optimal engagement
          </p>
        </div>
        <Link to="/portal/studio/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </Link>
      </div>

      {/* Post Mix Tracker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Week's Mix</CardTitle>
          <CardDescription>Target: 50% Authority • 30% Sales • 20% Engagement</CardDescription>
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

      {/* Calendar */}
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
              <Button
                variant={viewMode === "week" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
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
                  {day.content.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      className={cn(
                        "text-xs p-1 rounded truncate text-white",
                        postTypeColors[item.postType]
                      )}
                      title={item.title}
                    >
                      {item.time && <span className="font-medium">{item.time} </span>}
                      {item.title}
                    </div>
                  ))}
                  {day.content.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.content.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          Authority (50%)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Sales (30%)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          Engagement (20%)
        </div>
      </div>
    </div>
  );
}
