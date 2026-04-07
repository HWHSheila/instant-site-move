// Admin Content Generation Pipeline
// Implements [API s9] -- generate-content for Sheila's content approval workflow
// Creates content_drafts that Sheila reviews before publishing to content_items

import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a content writer for Her Wellness Harmony, a women's health coaching brand.

FRAMEWORK: All content connects Gut → Metabolism → Hormones.

TONE:
- Sound like a scientist explaining physiology
- Use pattern-based communication
- Validate emotions without reinforcing helplessness
- Female-forward language
- Accessible science

SCRIPT FORMAT (5 parts):
1. HOOK: Opening that stops the scroll (2-3 sentences)
2. BRIDGE: Connects hook to education (1-2 sentences)
3. AUTHORITY ANCHOR: "My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women."
4. EDUCATION: Core science explained simply (3-5 sentences)
5. CTA: Call to action (1-2 sentences)

Also generate:
- CAPTION: 2-3 sentence social media caption
- HASHTAGS: 5 relevant hashtags

Respond ONLY with valid JSON:
{
  "hook": string,
  "bridge": string,
  "authority_anchor": string,
  "education": string,
  "cta": string,
  "full_script": string,
  "caption": string,
  "hashtags": string[]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { topic_seed, pillar, post_type, hook_style } = await req.json();

    if (!topic_seed || !pillar) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "VALIDATION_ERROR", message: "topic_seed and pillar are required" },
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
    if (!claudeApiKey) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "CONFIG_ERROR", message: "CLAUDE_API_KEY not configured" },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: claudeApiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a ${post_type || "authority"} script about: "${topic_seed}"
Pillar: ${pillar}
Hook style: ${hook_style || "pattern"}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    let script;
    try {
      script = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) script = JSON.parse(match[0]);
      else throw new Error("Failed to parse Claude response");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: draft, error: insertErr } = await supabase
      .from("content_drafts")
      .insert({
        topic_seed,
        pillar,
        post_type: post_type || "authority",
        hook_style: hook_style || "pattern",
        generated_script: script.full_script,
        script_hook: script.hook,
        script_bridge: script.bridge,
        script_authority_anchor: script.authority_anchor,
        script_education: script.education,
        script_cta: script.cta,
        generated_caption: script.caption,
        hashtags: script.hashtags,
        status: "pending",
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({ data: { draft_id: draft.id, script } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Content generation error:", err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: "GENERATION_FAILED", message: "Content generation failed" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
