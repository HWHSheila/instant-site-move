import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
    if (!CLAUDE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI draft not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { post_type, title, topic_hint, pain_point, false_belief } = await req.json();

    const typeLabel = post_type === "weekly_note" ? "weekly coaching note" : "member article";

    const contextParts = [
      topic_hint ? `Topic: ${topic_hint}` : "",
      pain_point ? `Optional pain point to weave in: ${pain_point}` : "",
      false_belief ? `Optional false belief to address: ${false_belief}` : "",
    ].filter(Boolean);

    const anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: `You write educational member content for Her Wellness Harmony (Sheila McFarland). 
Write a ${typeLabel} in warm, pattern-based prose using the Gut → Metabolism → Hormones framework.
No medical advice, diagnoses, or supplement recommendations.
Return JSON only: {"title":"...","body":"..."}`,
      messages: [
        {
          role: "user",
          content: `Draft a ${typeLabel}.${title ? ` Working title: ${title}.` : ""}${contextParts.length ? "\n" + contextParts.join("\n") : "\nNo specific pain point required — general educational content is fine."}`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "{}";
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? text);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("draft-member-content error:", err);
    return new Response(
      JSON.stringify({ error: "Draft generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
