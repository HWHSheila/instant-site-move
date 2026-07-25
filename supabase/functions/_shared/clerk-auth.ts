/**
 * Clerk identity verification for portal edge functions.
 *
 * These functions run as service role, which bypasses row level security. They
 * were reading `subscriber_id` straight from the request body, so a signed-in
 * member could pass someone else's id and act as them. Every portal function
 * must now prove the caller owns the row it is about to touch.
 *
 * Two token shapes are accepted, because the frontend sends whichever exists:
 *   RS256, a Clerk session token, verified against Clerk's JWKS
 *   HS256, a Clerk "supabase" JWT template token, signed with the Supabase secret
 *
 * In both, `sub` is the Clerk user id, which is what subscribers.clerk_user_id
 * and the RLS helper already key on.
 *
 * Required secret: CLERK_ISSUER, for example https://clerk.your-domain.com.
 * Without it RS256 tokens are refused rather than trusted.
 */
import { createRemoteJWKSet, jwtVerify, decodeProtectedHeader } from "npm:jose@5.9.6";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export class AuthError extends Error {
  constructor(message: string, readonly status = 401) {
    super(message);
  }
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function jwksFor(issuer: string) {
  let jwks = jwksCache.get(issuer);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${issuer.replace(/\/$/, "")}/.well-known/jwks.json`));
    jwksCache.set(issuer, jwks);
  }
  return jwks;
}

function bearerToken(req: Request): string {
  const header = req.headers.get("Authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new AuthError("Missing bearer token");
  }
  return token;
}

/** Verifies the caller's token and returns their Clerk user id. */
export async function requireClerkUserId(req: Request): Promise<string> {
  const token = bearerToken(req);

  let alg: string | undefined;
  try {
    alg = decodeProtectedHeader(token).alg;
  } catch {
    throw new AuthError("Malformed token");
  }

  let payload: Record<string, unknown>;

  if (alg === "HS256") {
    const secret = Deno.env.get("SUPABASE_JWT_SECRET");
    if (!secret) throw new AuthError("Token verification is not configured", 500);
    try {
      ({ payload } = await jwtVerify(token, new TextEncoder().encode(secret)));
    } catch {
      throw new AuthError("Invalid token");
    }
  } else {
    const issuer = Deno.env.get("CLERK_ISSUER");
    if (!issuer) throw new AuthError("Token verification is not configured", 500);
    try {
      ({ payload } = await jwtVerify(token, jwksFor(issuer), { issuer }));
    } catch {
      throw new AuthError("Invalid token");
    }
  }

  const sub = typeof payload.sub === "string" ? payload.sub : "";
  if (!sub) throw new AuthError("Token carries no subject");
  return sub;
}

export interface OwnedSubscriber {
  id: string;
  clerk_user_id: string;
  email: string;
  tier: string | null;
  pending_tier: string | null;
  payment_status: string;
  trial_start_date: string | null;
}

/**
 * Verifies the caller and returns their subscriber row.
 *
 * When `claimedSubscriberId` is supplied it must match the caller's own row.
 * The row is always looked up by Clerk id, never by the id in the request, so
 * a mismatched or absent claim can never widen access.
 */
export async function requireOwnSubscriber(
  req: Request,
  supabase: SupabaseClient,
  claimedSubscriberId?: string | null
): Promise<OwnedSubscriber> {
  const clerkUserId = await requireClerkUserId(req);

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, clerk_user_id, email, tier, pending_tier, payment_status, trial_start_date")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw new AuthError("Could not resolve account", 500);
  if (!data) throw new AuthError("No account for this user", 403);

  if (claimedSubscriberId && claimedSubscriberId !== data.id) {
    throw new AuthError("Not your account", 403);
  }

  return data as OwnedSubscriber;
}

/** Verifies the caller is an admin and returns their Clerk user id. */
export async function requireAdmin(
  req: Request,
  supabase: SupabaseClient
): Promise<string> {
  const clerkUserId = await requireClerkUserId(req);

  const { data, error } = await supabase
    .from("admin_users")
    .select("clerk_user_id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw new AuthError("Could not verify admin access", 500);
  if (!data) throw new AuthError("Admin access required", 403);

  return clerkUserId;
}

/** Turns an AuthError into a response, and rethrows anything else. */
export function authErrorResponse(err: unknown, corsHeaders: Record<string, string>) {
  if (err instanceof AuthError) {
    return new Response(
      JSON.stringify({ data: null, error: { code: "UNAUTHORIZED", message: err.message } }),
      { status: err.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  return null;
}
