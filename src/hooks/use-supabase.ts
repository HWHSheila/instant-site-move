import { useSession, useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Returns a Supabase client authenticated with the current Clerk session token.
 * The Clerk JWT template must be configured with "supabase" as the name,
 * and Supabase must be configured to accept Clerk JWTs.
 *
 * For unauthenticated (anon) access, use the static client from
 * @/integrations/supabase/client instead.
 */
export function useSupabase() {
  const { session } = useSession();

  const client = useMemo(() => {
    return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          const headers = new Headers(options.headers);
          if (clerkToken) {
            headers.set("Authorization", `Bearer ${clerkToken}`);
          }

          return fetch(url, { ...options, headers });
        },
      },
    });
  }, [session]);

  return client;
}

/**
 * Returns the current subscriber's Clerk user ID, used as the key
 * for the subscribers table and RLS policies.
 */
export function useClerkUserId(): string | null {
  const { user } = useUser();
  return user?.id ?? null;
}
