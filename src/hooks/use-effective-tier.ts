import { useSubscriber } from "./use-subscriber";
import { usePreviewTier } from "@/components/portal/PortalLayout";
import { resolveEffectiveTier, type Tier } from "@/lib/effective-tier";

export interface EffectiveTier {
  /** The tier whose content may be shown. Null means a free account. */
  tier: Tier | null;
  /** True while an admin is previewing as a member. */
  isPreviewing: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

/**
 * Single source of truth for what a member may see.
 *
 * Replaces the ad-hoc `isAdmin && previewTier !== "admin" ? previewTier : subscriber?.tier`
 * that was repeated across portal pages, each with slightly different trial handling.
 * Admin preview wins when active, so previewing a tier applies that tier's real limits.
 */
export function useEffectiveTier(): EffectiveTier {
  const { subscriber, isLoading } = useSubscriber();
  const { previewTier, isAdmin } = usePreviewTier();

  const isPreviewing = isAdmin && previewTier !== "admin";

  if (isPreviewing) {
    return {
      tier: previewTier === "free" ? null : (previewTier as Tier),
      isPreviewing: true,
      isAdmin,
      isLoading: false,
    };
  }

  // Admins are not members; they see everything unless previewing.
  if (isAdmin) {
    return { tier: "integration", isPreviewing: false, isAdmin, isLoading };
  }

  return {
    tier: resolveEffectiveTier({
      tier: subscriber?.tier,
      paymentStatus: subscriber?.payment_status,
      trialStartDate: subscriber?.trial_start_date,
    }),
    isPreviewing: false,
    isAdmin,
    isLoading,
  };
}
