import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "./use-supabase";

export interface Subscriber {
  id: string;
  clerk_user_id: string;
  email: string;
  tier: string | null;
  track: string | null;
  intake_completed: boolean;
  payment_status: string;
  trial_start_date: string | null;
  trial_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface PatternMap {
  id: string;
  subscriber_id: string;
  gut_patterns: Array<{ issue: string; severity: string; rank: number }>;
  metabolic_patterns: Array<{ issue: string; severity: string; rank: number }>;
  hormonal_patterns: Array<{ issue: string; severity: string; rank: number }>;
  primary_focus: string;
  secondary_focus: string;
  watch_area: string;
  recommended_tier: string;
  ai_reasoning: string;
}

export interface SubscriberProgress {
  id: string;
  subscriber_id: string;
  day_number: number;
  current_phase: string;
  last_check_in: string | null;
  check_in_data: Record<string, unknown>;
}

/**
 * Ensures a subscriber record exists for the current Clerk user.
 * Creates one on first portal visit if missing (ambiguity A-6 resolution).
 */
export function useSubscriber() {
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: subscriber, isLoading, error } = useQuery({
    queryKey: ["subscriber", user?.id],
    queryFn: async (): Promise<Subscriber> => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .eq("clerk_user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) return data as Subscriber;

      const { data: newSub, error: insertErr } = await supabase
        .from("subscribers")
        .insert({
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          intake_completed: false,
          payment_status: "none",
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return newSub as Subscriber;
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return { subscriber, isLoading, error };
}

/**
 * Fetches the pattern map for the current subscriber.
 */
export function usePatternMap(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["pattern-map", subscriberId],
    queryFn: async (): Promise<PatternMap | null> => {
      if (!subscriberId) return null;

      const { data, error } = await supabase
        .from("pattern_maps")
        .select("*")
        .eq("subscriber_id", subscriberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as PatternMap | null;
    },
    enabled: !!subscriberId,
  });
}

/**
 * Fetches journey progress for the current subscriber.
 */
export function useJourneyProgress(subscriberId: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["journey-progress", subscriberId],
    queryFn: async (): Promise<SubscriberProgress | null> => {
      if (!subscriberId) return null;

      const { data, error } = await supabase
        .from("subscriber_progress")
        .select("*")
        .eq("subscriber_id", subscriberId)
        .maybeSingle();

      if (error) throw error;
      return data as SubscriberProgress | null;
    },
    enabled: !!subscriberId,
  });
}

/**
 * Checks if the current user is an admin.
 */
export function useIsAdmin() {
  const { user } = useUser();
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("clerk_user_id", user.id)
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}
