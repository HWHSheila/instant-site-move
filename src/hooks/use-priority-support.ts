import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import { currentBillingMonth } from "@/lib/ai-coach-config";
import { PRIORITY_SUPPORT_LIMITS } from "@/lib/ai-coach-config";

export interface PriorityMessage {
  id: string;
  subscriber_id: string;
  direction: "member_to_sheila" | "sheila_to_member";
  message_text: string;
  billing_month: string;
  created_at: string;
  parent_message_id: string | null;
}

export function usePrioritySupportMessages(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["priority-support", subscriberId],
    queryFn: async (): Promise<PriorityMessage[]> => {
      if (!subscriberId) return [];

      const { data, error } = await supabase
        .from("priority_support_messages" as any)
        .select("*")
        .eq("subscriber_id", subscriberId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as PriorityMessage[];
    },
    enabled: !!subscriberId,
  });
}

export function usePrioritySupportUsage(
  subscriberId: string | undefined,
  tier: string | null | undefined
) {
  const supabase = useSupabase();
  const month = currentBillingMonth();
  const limit = tier ? PRIORITY_SUPPORT_LIMITS[tier] ?? 0 : 0;

  return useQuery({
    queryKey: ["priority-support-usage", subscriberId, month],
    queryFn: async () => {
      if (!subscriberId || !limit) return { used: 0, limit: 0, remaining: 0, month };

      const { data, error } = await supabase
        .from("priority_support_messages" as any)
        .select("id")
        .eq("subscriber_id", subscriberId)
        .eq("billing_month", month)
        .eq("direction", "member_to_sheila");

      if (error) throw error;
      const used = data?.length ?? 0;
      return { used, limit, remaining: Math.max(0, limit - used), month };
    },
    enabled: !!subscriberId && limit > 0,
  });
}

export function useSendPriorityMessage(subscriberId: string | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const month = currentBillingMonth();

  return useMutation({
    mutationFn: async (messageText: string) => {
      if (!subscriberId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("priority_support_messages" as any)
        .insert({
          subscriber_id: subscriberId,
          direction: "member_to_sheila",
          message_text: messageText.trim(),
          billing_month: month,
        } as any)
        .select()
        .single();

      if (error) throw error;

      try {
        await supabase.functions.invoke("telegram-priority-support", {
          body: { message_id: (data as any).id, subscriber_id: subscriberId },
        });
      } catch {
        // Non-blocking until Telegram token configured
      }

      return data as PriorityMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["priority-support", subscriberId] });
      queryClient.invalidateQueries({ queryKey: ["priority-support-usage", subscriberId] });
    },
  });
}
