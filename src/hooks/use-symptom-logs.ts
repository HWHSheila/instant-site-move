import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";

export interface SymptomLog {
  id: string;
  subscriber_id: string;
  log_text: string;
  logged_at: string;
}

export function useSymptomLogs(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["symptom-logs", subscriberId],
    queryFn: async (): Promise<SymptomLog[]> => {
      if (!subscriberId) return [];

      const { data, error } = await supabase
        .from("symptom_logs" as any)
        .select("id, subscriber_id, log_text, logged_at")
        .eq("subscriber_id", subscriberId)
        .order("logged_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as SymptomLog[];
    },
    enabled: !!subscriberId,
  });
}

export function useAddSymptomLog(subscriberId: string | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logText: string) => {
      if (!subscriberId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("symptom_logs" as any)
        .insert({ subscriber_id: subscriberId, log_text: logText.trim() } as any)
        .select()
        .single();

      if (error) throw error;
      return data as SymptomLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptom-logs", subscriberId] });
    },
  });
}
