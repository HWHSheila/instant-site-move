import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

const TIERS = ["awareness", "foundation", "guided", "restoration", "integration"];
const TRACKS = ["gut_focused", "metabolic", "hormonal", "comprehensive"];

const tierColors: Record<string, string> = {
  awareness: "bg-gray-100 text-gray-700",
  foundation: "bg-blue-100 text-blue-700",
  guided: "bg-green-100 text-green-700",
  restoration: "bg-purple-100 text-purple-700",
  integration: "bg-amber-100 text-amber-700",
};

export default function AdminSubscribers() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*, pattern_maps(primary_focus, recommended_tier), subscriber_progress(day_number, current_phase)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase.from("subscribers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.success("Subscriber updated");
    },
  });

  const filtered = subscribers.filter((s: Record<string, unknown>) =>
    (s.email as string)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Subscribers</h1>
        <p className="text-muted-foreground">Manage member tiers, tracks, and overrides.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by email..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No subscribers found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub: Record<string, unknown>) => {
            const patternMaps = sub.pattern_maps as Array<Record<string, unknown>> || [];
            const progress = (sub.subscriber_progress as Array<Record<string, unknown>> || [])[0];
            const latestMap = patternMaps[0];
            const tier = sub.tier as string || "none";
            const track = sub.track as string || "none";

            return (
              <Card key={sub.id as string}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{sub.email as string}</p>
                        <Badge className={tierColors[tier] || "bg-gray-100 text-gray-700"} variant="secondary">
                          {tier === "none" ? "No tier" : tier}
                        </Badge>
                        {sub.intake_completed && <Badge variant="outline" className="text-xs">Intake done</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Track: {track}</span>
                        <span>Payment: {sub.payment_status as string || "none"}</span>
                        {progress && <span>Day {progress.day_number as number} ({progress.current_phase as string})</span>}
                        {latestMap && <span>Focus: {latestMap.primary_focus as string}</span>}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Override Tier</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {TIERS.map((t) => (
                              <DropdownMenuItem key={t} onClick={() => updateMutation.mutate({ id: sub.id as string, updates: { tier: t } })}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                {tier === t && " (current)"}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Override Track</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {TRACKS.map((t) => (
                              <DropdownMenuItem key={t} onClick={() => updateMutation.mutate({ id: sub.id as string, updates: { track: t } })}>
                                {t.replace("_", " ")}
                                {track === t && " (current)"}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
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
