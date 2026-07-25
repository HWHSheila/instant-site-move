import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import type { AssessmentType } from "@/lib/mini-assessment-schedule";
import {
  getMemberDayNumber,
  getDueAssessment,
  dayNumberForType,
  type CompletedAssessment,
} from "@/lib/mini-assessment-schedule";
import { canAccessSymptomLog } from "@/lib/tier-access";
import { resolveEffectiveTier } from "@/lib/effective-tier";
import type { Subscriber, SubscriberProgress } from "./use-subscriber";

export interface MiniAssessment {
  id: string;
  subscriber_id: string;
  assessment_type: AssessmentType;
  day_number: number | null;
  ratings: Record<string, number>;
  open_text_improved: string | null;
  open_text_challenging: string | null;
  open_text_note_to_sheila: string | null;
  completed_at: string;
}

function parseAssessment(row: Record<string, unknown>): MiniAssessment {
  return {
    id: row.id as string,
    subscriber_id: row.subscriber_id as string,
    assessment_type: row.assessment_type as AssessmentType,
    day_number: row.day_number as number | null,
    ratings: (row.ratings as Record<string, number>) ?? {},
    open_text_improved: row.open_text_improved as string | null,
    open_text_challenging: row.open_text_challenging as string | null,
    open_text_note_to_sheila: row.open_text_note_to_sheila as string | null,
    completed_at: row.completed_at as string,
  };
}

export function useMiniAssessments(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["mini-assessments", subscriberId],
    queryFn: async (): Promise<MiniAssessment[]> => {
      if (!subscriberId) return [];

      const { data, error } = await supabase
        .from("mini_assessments" as any)
        .select("*")
        .eq("subscriber_id", subscriberId)
        .order("completed_at", { ascending: true });

      if (error) throw error;
      return (data ?? []).map((row) => parseAssessment(row as Record<string, unknown>));
    },
    enabled: !!subscriberId,
  });
}

export function useAssessmentSchedule(
  subscriber: Subscriber | undefined,
  progress: SubscriberProgress | null | undefined,
  assessments: MiniAssessment[] | undefined
) {
  const dayNumber = getMemberDayNumber(
    progress?.day_number,
    subscriber?.assessment_completed_at,
    subscriber?.trial_start_date
  );

  const completed: CompletedAssessment[] = (assessments ?? []).map((a) => ({
    assessment_type: a.assessment_type,
    completed_at: a.completed_at,
    day_number: a.day_number,
  }));

  const isPaidOrTrial = canAccessSymptomLog(
    resolveEffectiveTier({
      tier: subscriber?.tier,
      paymentStatus: subscriber?.payment_status,
      trialStartDate: subscriber?.trial_start_date,
    })
  );

  const dueType = getDueAssessment(dayNumber, completed, isPaidOrTrial);

  return { dayNumber, dueType, completed, assessments: assessments ?? [] };
}

export function useSubmitMiniAssessment(subscriberId: string | undefined) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      assessment_type: AssessmentType;
      day_number: number;
      ratings: Record<string, number>;
      open_text_improved: string;
      open_text_challenging: string;
      open_text_note_to_sheila: string;
    }) => {
      if (!subscriberId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("mini_assessments" as any)
        .insert({
          subscriber_id: subscriberId,
          assessment_type: payload.assessment_type,
          day_number: payload.day_number,
          ratings: payload.ratings,
          open_text_improved: payload.open_text_improved || null,
          open_text_challenging: payload.open_text_challenging || null,
          open_text_note_to_sheila: payload.open_text_note_to_sheila || null,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return parseAssessment(data as Record<string, unknown>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mini-assessments", subscriberId] });
    },
  });
}

export { dayNumberForType };
