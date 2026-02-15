import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEME_API_BASE = "https://api.systeme.io/api";
const DEFAULT_TAG_NAME = "HWH - Gut Repair Freebie";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("SYSTEME_IO_API_KEY");
    if (!apiKey) {
      throw new Error("SYSTEME_IO_API_KEY is not configured");
    }

    const { email, tagName } = await req.json();
    const resolvedTag = tagName || DEFAULT_TAG_NAME;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "A valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          const searchErr = await searchRes.text();
          throw new Error(`Failed to search contact [${searchRes.status}]: ${searchErr}`);
        }
        const searchData = await searchRes.json();
        const items = searchData.items || searchData;
        if (Array.isArray(items) && items.length > 0) {
          contactId = items[0].id;
          console.log("Found existing contact:", contactId);
        } else {
          throw new Error(`Contact creation failed and not found: ${errorBody}`);
        }
      } else {
        throw new Error(`Failed to create contact [${contactRes.status}]: ${errorBody}`);
      }
    }

    // Step 2: Find or create the tag
    const tagsRes = await fetch(`${SYSTEME_API_BASE}/tags`, { headers });
    if (!tagsRes.ok) {
      const tagsErr = await tagsRes.text();
      throw new Error(`Failed to list tags [${tagsRes.status}]: ${tagsErr}`);
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
        const tagErr = await createTagRes.text();
        throw new Error(`Failed to create tag [${createTagRes.status}]: ${tagErr}`);
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
        throw new Error(`Failed to assign tag [${assignRes.status}]: ${assignErr}`);
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
