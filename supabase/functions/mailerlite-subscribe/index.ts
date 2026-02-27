import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_GROUP_LENGTH = 200;

// In-memory rate limiter: IP -> { count, resetTime }
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") || "unknown";

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("MAILERLITE_API_KEY");
    if (!apiKey) {
      console.error("MAILERLITE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, groupName } = await req.json();

    // Validate email
    if (!email || typeof email !== "string" || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "A valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate groupName
    if (!groupName || typeof groupName !== "string" || groupName.length > MAX_GROUP_LENGTH) {
      return new Response(
        JSON.stringify({ error: "A valid group name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Step 1: Find or create the group
    const groupsRes = await fetch(`${MAILERLITE_API_BASE}/groups?filter[name]=${encodeURIComponent(groupName)}&limit=100`, {
      headers,
    });

    if (!groupsRes.ok) {
      console.error(`Failed to list groups [${groupsRes.status}]:`, await groupsRes.text());
      throw new Error("Failed to look up group");
    }

    const groupsData = await groupsRes.json();
    let group = groupsData.data?.find((g: { name: string }) => g.name === groupName);

    if (!group) {
      // Create the group
      const createGroupRes = await fetch(`${MAILERLITE_API_BASE}/groups`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: groupName }),
      });

      if (!createGroupRes.ok) {
        console.error(`Failed to create group [${createGroupRes.status}]:`, await createGroupRes.text());
        throw new Error("Failed to create group");
      }

      const createGroupData = await createGroupRes.json();
      group = createGroupData.data;
      console.log("Group created:", group.id);
    } else {
      console.log("Group found:", group.id);
    }

    // Step 2: Add subscriber to the group
    const subscriberRes = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        groups: [group.id],
      }),
    });

    if (!subscriberRes.ok) {
      const errBody = await subscriberRes.text();
      console.error(`Failed to add subscriber [${subscriberRes.status}]:`, errBody);
      throw new Error("Failed to add subscriber");
    }

    const subscriberData = await subscriberRes.json();
    console.log("Subscriber added/updated:", subscriberData.data?.id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in mailerlite-subscribe:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process subscription. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
