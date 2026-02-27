import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEME_API_BASE = "https://api.systeme.io/api";
const DEFAULT_TAG_NAME = "HWH - Gut Repair Freebie";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_TAG_LENGTH = 100;

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
    const apiKey = Deno.env.get("SYSTEME_IO_API_KEY");
    if (!apiKey) {
      console.error("SYSTEME_IO_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, tagName } = await req.json();

    // Validate email
    if (!email || typeof email !== "string" || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "A valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate tagName if provided
    if (tagName !== undefined && tagName !== null) {
      if (typeof tagName !== "string" || tagName.length === 0 || tagName.length > MAX_TAG_LENGTH) {
        return new Response(
          JSON.stringify({ error: "Invalid tag name" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const resolvedTag = tagName || DEFAULT_TAG_NAME;

    const headers = {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    };

    // Step 1: Create contact
    const contactRes = await fetch(`${SYSTEME_API_BASE}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    });

    let contactId: number;

    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData.id;
      console.log("Contact created:", contactId);
    } else {
      const errorBody = await contactRes.text();
      if (contactRes.status === 422 || contactRes.status === 400) {
        console.log("Contact may already exist, searching...", errorBody);
        const searchRes = await fetch(
          `${SYSTEME_API_BASE}/contacts?email=${encodeURIComponent(email)}`,
          { headers }
        );
        if (!searchRes.ok) {
          console.error(`Failed to search contact [${searchRes.status}]:`, await searchRes.text());
          throw new Error("Failed to look up contact");
        }
        const searchData = await searchRes.json();
        const items = searchData.items || searchData;
        if (Array.isArray(items) && items.length > 0) {
          contactId = items[0].id;
          console.log("Found existing contact:", contactId);
        } else {
          console.error("Contact creation failed and not found:", errorBody);
          throw new Error("Failed to create contact");
        }
      } else {
        console.error(`Failed to create contact [${contactRes.status}]:`, errorBody);
        throw new Error("Failed to create contact");
      }
    }

    // Step 2: Find or create the tag
    const tagsRes = await fetch(`${SYSTEME_API_BASE}/tags`, { headers });
    if (!tagsRes.ok) {
      console.error(`Failed to list tags [${tagsRes.status}]:`, await tagsRes.text());
      throw new Error("Failed to process tags");
    }
    const tagsData = await tagsRes.json();
    const tagsList = tagsData.items || tagsData;
    let tag = Array.isArray(tagsList)
      ? tagsList.find((t: { name: string }) => t.name === resolvedTag)
      : undefined;

    if (!tag) {
      const createTagRes = await fetch(`${SYSTEME_API_BASE}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: resolvedTag }),
      });
      if (!createTagRes.ok) {
        console.error(`Failed to create tag [${createTagRes.status}]:`, await createTagRes.text());
        throw new Error("Failed to process tags");
      }
      tag = await createTagRes.json();
      console.log("Tag created:", tag.id);
    } else {
      console.log("Tag found:", tag.id);
    }

    // Step 3: Assign tag to contact
    const assignRes = await fetch(
      `${SYSTEME_API_BASE}/contacts/${contactId}/tags`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ tagId: tag.id }),
      }
    );

    if (!assignRes.ok) {
      const assignErr = await assignRes.text();
      if (assignRes.status !== 422) {
        console.error(`Failed to assign tag [${assignRes.status}]:`, assignErr);
        throw new Error("Failed to assign tag");
      }
      console.log("Tag may already be assigned:", assignErr);
    } else {
      console.log("Tag assigned to contact successfully");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in systeme-subscribe:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process subscription. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
