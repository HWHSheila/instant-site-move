// Portal Script Generator — Educational lesson scripts for portal videos
// 6-section structure + action items + reflection prompt
// Primary strength: Command (locked). Secondary: Analytical | Relator | Futuristic

import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGAL_DISCLAIMER = `Everything I share with you in this program is for educational and informational purposes only and is not medical advice. I am a wellness educator, not a licensed healthcare provider. Please continue to work with your licensed healthcare provider alongside your journey here.`;

const SYSTEM_PROMPT = `You are a script writer for Her Wellness Harmony, a women's health coaching portal run by Sheila McFarland. You write educational lesson scripts for portal coursework — not social media content.

=== CORE FRAMEWORK ===
All content connects: Gut → Metabolism → Hormones (the GMH Cascade)
This is the root-cause approach that differentiates this program from other wellness content.

=== TONE RULES ===
- Sound like a scientist explaining physiology to someone who trusts you
- Pattern-based communication (connect gut → metabolism → hormones)
- Validate emotions without reinforcing helplessness
- Female-forward language ("Many women notice...", "When a woman experiences...")
- Accessible science (translate jargon into everyday language)
- Use phrases like: "the body often shifts...", "when stress signals increase...", "metabolic signaling responds to..."
- Portal members already know and trust the educator — NO social media hooks, NO CTAs to purchase, NO authority anchors

=== FORBIDDEN LANGUAGE ===
Never use: "eat less move more", "burn fat", "cheat meal", "good vs bad foods", "hack your metabolism", "biohack", "secret trick", "game changer", "this cures", "this fixes", "this treats", "you caused this", "you ruined", "this always works", "everyone should", "guaranteed", "your hormones are destroyed", "broken forever", "damaged metabolism", "it's too late"

=== GALLUP STRENGTH TONE ===
Primary strength is always Command: bold, direct, confident delivery. The secondary strength shapes nuance:
- Analytical: logical cause-and-effect, data-driven explanations, precise language
- Relator: warm personal connection, relatable stories, "I see this in women all the time"
- Futuristic: forward-looking vision, possibility, "imagine what happens when..."

=== SCRIPT STRUCTURE (6 SECTIONS — follow exactly) ===

1. LEARNING OBJECTIVE — One clear sentence: what the member will understand by the end of this lesson.

2. INTRODUCTION — 2-3 sentences connecting this lesson to where the member is in their journey. Reference the phase and what they've been working on.

3. CORE EDUCATIONAL CONTENT — 5-8 sentences. The root cause explanation, physiology, and pattern awareness. This is the meat of the lesson. Always connect to the GMH cascade where relevant.

4. PRACTICAL APPLICATION — 3-5 sentences. What the member should do, observe, or try after watching. Concrete, actionable steps.

5. GMH CASCADE CONNECTION — 2-3 sentences. How this specific lesson connects to the broader gut → metabolism → hormone axis. Help the member see the bigger picture.

6. TRANSITION — 1-2 sentences. What comes next in their roadmap. Keep momentum and curiosity.

=== ACTION ITEMS ===
If this lesson has practical steps the member should take, output them as a JSON array of short checklist strings. Not every lesson needs action items — only include them when the lesson content naturally produces specific things to do or observe. If none, return an empty array.

=== REFLECTION PROMPT ===
If appropriate for this lesson, generate ONE open-ended reflection question that helps the member connect the lesson content to their own experience. Not every lesson needs a reflection — only include one when it adds value. If none, return null.

=== OUTPUT FORMAT ===
Return ONLY a JSON object:
{
  "learning_objective": "...",
  "introduction": "...",
  "core_educational_content": "...",
  "practical_application": "...",
  "gmh_cascade_connection": "...",
  "transition": "...",
  "action_items": ["step 1", "step 2"] or [],
  "reflection_prompt": "..." or null
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
    if (!CLAUDE_API_KEY) {
      throw new Error("CLAUDE_API_KEY not configured");
    }

    const { videoCode, videoTitle, phase, subCategory, secondaryStrength } = await req.json();

    if (!videoCode || !videoTitle) {
      throw new Error("videoCode and videoTitle are required");
    }

    if (secondaryStrength && !["analytical", "relator", "futuristic"].includes(secondaryStrength.toLowerCase())) {
      throw new Error("secondaryStrength must be one of: analytical, relator, futuristic");
    }

    const userPrompt = `Generate an educational lesson script for the following portal video:

VIDEO CODE: ${videoCode}
TITLE: ${videoTitle}
PHASE: ${phase || "Not specified"}
SUB-CATEGORY: ${subCategory || "Not specified"}
PRIMARY STRENGTH: Command (locked)
SECONDARY STRENGTH: ${secondaryStrength || "Analytical"}

REQUIREMENTS:
1. Follow the 6-section structure precisely
2. Use Command as the primary tone with ${secondaryStrength || "Analytical"} as the secondary tone
3. Make the content specific to "${videoTitle}" — not generic
4. Connect to the GMH Cascade (gut → metabolism → hormones) where relevant to this topic
5. If this lesson has practical steps, include action items as a checklist array
6. If a reflection question would help the member connect this to their experience, include one
7. DO NOT include any social media hooks, purchase CTAs, or authority anchors
8. Return valid JSON only`;

    const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }]
    });

    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    let scriptData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scriptData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      scriptData = {
        learning_objective: responseText,
        introduction: "",
        core_educational_content: "",
        practical_application: "",
        gmh_cascade_connection: "",
        transition: "",
        action_items: [],
        reflection_prompt: null,
        parse_error: "Response was not valid JSON"
      };
    }

    scriptData.legal_disclaimer = LEGAL_DISCLAIMER;

    return new Response(
      JSON.stringify({
        success: true,
        script: scriptData,
        metadata: {
          videoCode,
          videoTitle,
          phase,
          subCategory,
          secondaryStrength: secondaryStrength || "analytical",
          generatedAt: new Date().toISOString()
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Portal script generation error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
