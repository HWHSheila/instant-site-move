import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import {
  currentBillingMonth,
  getMonthlyLimit,
  isAiCoachAvailable,
} from "@/lib/ai-coach-config";

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachUsageSummary {
  used: number;
  limit: number | null;
  remaining: number | null;
  billingMonth: string;
  available: boolean;
}

export function useAiCoachUsage(
  subscriberId: string | undefined,
  tier: string | null | undefined,
  paymentStatus: string | null | undefined,
  trialStartDate: string | null | undefined
) {
  const supabase = useSupabase();
  const billingMonth = currentBillingMonth();
  const limit = getMonthlyLimit(tier);
  const available = isAiCoachAvailable(tier, paymentStatus, trialStartDate);

  return useQuery({
    queryKey: ["ai-coach-usage", subscriberId, billingMonth],
    queryFn: async (): Promise<CoachUsageSummary> => {
      if (!subscriberId) {
        return { used: 0, limit, remaining: limit, billingMonth, available: false };
      }

      const { data, error } = await supabase
        .from("ai_coach_usage" as any)
        .select("id")
        .eq("subscriber_id", subscriberId)
        .eq("billing_month", billingMonth);

      if (error) throw error;

      const used = data?.length ?? 0;
      const remaining = limit == null ? null : Math.max(0, limit - used);

      return { used, limit, remaining, billingMonth, available };
    },
    enabled: !!subscriberId,
  });
}

export function useAskAiCoach(subscriberId: string | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      question,
      history,
    }: {
      question: string;
      history: CoachMessage[];
    }) => {
      if (!subscriberId) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { subscriber_id: subscriberId, question, history },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data as { response: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-coach-usage", subscriberId] });
    },
  });
}
