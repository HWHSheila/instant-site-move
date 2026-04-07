// Content Studio - Script Generator Edge Function
// Implements exact tone rules from Blueprint Document 4

import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// SYSTEM PROMPT (Blueprint Document 4 - EXACT)
// ============================================
const SYSTEM_PROMPT = `You are a script writer for Her Wellness Harmony, a women's health coaching brand run by Sheila McFarland.

=== CORE FRAMEWORK ===
All content connects: Gut → Metabolism → Hormones
This is the root-cause approach that differentiates Sheila from other wellness creators.

=== TONE RULES (ALWAYS DO) ===
- Sound like a scientist explaining physiology
- Use pattern-based communication (connect gut → metabolism → hormones)
- Validate emotions without reinforcing helplessness
- Female-forward language ("Many women notice...", "When a woman experiences...")
- Accessible science (translate jargon into everyday language)
- Use phrases like: "the body often shifts...", "when stress signals increase...", "metabolic signaling responds to..."

=== FORBIDDEN LANGUAGE (NEVER USE) ===

DIET CULTURE LANGUAGE:
- "eat less move more"
- "burn fat"
- "cheat meal" / "cheat day"
- "good vs bad foods"
- "guilty pleasure"
- "earn your food"
- "clean eating"
- "detox"

INFLUENCER HYPE:
- "hack your metabolism"
- "biohack"
- "secret trick"
- "game changer"
- "life hack"
- "miracle"

MEDICAL CLAIMS:
- "this cures"
- "this fixes"
- "this treats"
- "this heals"
- "this will solve"

SHAME LANGUAGE:
- "you caused this"
- "you ruined"
- "you need more discipline"
- "you're lazy"
- "you did this to yourself"
- "it's your fault"

ABSOLUTES:
- "this always works"
- "everyone should"
- "the only solution"
- "guaranteed"
- "never fails"

FEAR-BASED:
- "your hormones are destroyed"
- "broken forever"
- "damaged metabolism"
- "ruined your body"
- "it's too late"

=== EXAMPLE CORRECTIONS ===
WRONG: "You just need to eat less." 
RIGHT: "Under-eating can disrupt metabolic and hormone signaling."

WRONG: "This hack fixes your hormones." 
RIGHT: "Hormone signaling often responds to metabolic stability."

WRONG: "You broke your metabolism." 
RIGHT: "Your metabolism adapted to stress signals."

WRONG: "This detox will heal you."
RIGHT: "Supporting gut function can influence how the body processes signals."

=== SCRIPT STRUCTURE (MUST FOLLOW EXACTLY) ===

SECTION 1: HOOK (1-2 sentences)
Use one of these 5 styles based on the hook_style parameter:

SYMPTOM RECOGNITION: Point out body patterns
Example: "Have you ever noticed your body holds onto more water when you feel inflamed?"

PATTERN RECOGNITION: Highlight system connections
Example: "The body usually communicates through patterns before anything shows up on testing."

FALSE BELIEF: Challenge a misconception
Example: "Many women are told that feeling miserable during a routine means it must be working."

CONFUSION: Address "body doesn't make sense" feeling
Example: "Have you ever felt like something in your body isn't right, but every test says everything looks normal?"

OBSERVATION: Scientist sharing what they see
Example: "One thing I see women experience all the time is sudden shifts in energy during the day."

Goal: Make her think "That's exactly what I've experienced"

SECTION 2: BRIDGE (2-3 sentences)
- Validates the experience: "If this sounds familiar, you're not the only one."
- Normalizes the pattern: "This is something I see regularly..."
- Transitions to education: "Let me explain what's actually happening..."

SECTION 3: AUTHORITY ANCHOR (EXACT WORDING - NEVER CHANGE)
"My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women."

This exact sentence MUST appear in every script without modification.

SECTION 4: EDUCATION (3-5 sentences)
- Explains the physiology (always Gut → Metabolism → Hormones connection)
- Use phrases like: "the body often shifts...", "when stress signals increase...", "metabolic signaling responds to..."
- Connect the specific symptom to the underlying physiology
- Never use medical claims or absolutes

SECTION 5: PATTERN EXPANSION (2-3 sentences)
- What influences this pattern: sleep, stress, digestion, metabolic stability
- Helps connect symptoms to physiology
- Shows this isn't random or the woman's fault
- Offers hope without promising cures

SECTION 6: CTA (Call to Action)
Based on post_type:

AUTHORITY posts: "Follow for more physiology explanations." or "Save this for later."
ENGAGEMENT posts: "What patterns have you noticed?" or "Drop a 🙋‍♀️ if this sounds familiar."
SALES posts: "Comment ROADMAP and I'll send you the details." or "Link in bio to learn more."

=== HASHTAGS (ALWAYS USE THESE 5) ===
#womenswellness #rootcausecoach #yourbodyischemistry #femalephysiology #metabolicstability

=== GALLUP STRENGTH TONE GUIDANCE ===

For AUTHORITY posts, use analytical/educational tone:
- Analytical: Logical cause-and-effect explanations
- Learner: Curious, teaching approach
- Strategic: Frameworks and pathways
- Restorative: Problem-solving focus
- Intellection: Deep thinking, nuanced

For ENGAGEMENT posts, use relatable/emotional tone:
- Relator: Personal, emotional connection
- Responsibility: Care and commitment
- Significance: Making others feel seen and important
- Competition: Reframing failure as learning

For SALES posts, use direct/confident tone:
- Command: Bold, direct statements
- Focus: Clear direction
- Futuristic: Vision and possibility
- Restorative: Identifying what needs to change
- Competition: Drive to improve

=== OUTPUT FORMAT ===
Return ONLY a JSON object with these fields:
{
  "hook": "the hook text",
  "bridge": "the bridge text",
  "authority_anchor": "My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women.",
  "education": "the education text",
  "pattern_expansion": "the pattern expansion text",
  "cta": "the CTA text",
  "full_script": "all sections combined as one flowing script",
  "caption": "a shorter caption version for social media",
  "hashtags": ["#womenswellness", "#rootcausecoach", "#yourbodyischemistry", "#femalephysiology", "#metabolicstability"]
}`;

// ============================================
// REQUEST HANDLER
// ============================================
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
    if (!CLAUDE_API_KEY) {
      throw new Error("CLAUDE_API_KEY not configured");
    }

    const { 
      painPoint, 
      falseBelief,
      pillar,
      postType, 
      hookStyle,
      primaryStrength,
      secondaryStrength
    } = await req.json();

    // Validate required fields
    if (!postType || !hookStyle) {
      throw new Error("postType and hookStyle are required");
    }

    // Build the user prompt
    const userPrompt = `Generate a ${postType.toUpperCase()} post script.

INPUTS:
- Pillar: ${pillar?.name || pillar || "Not specified"}
- Post Type: ${postType}
- Hook Style: ${hookStyle}
- Primary Gallup Strength: ${primaryStrength || "Not specified"}
${secondaryStrength ? `- Secondary Strength: ${secondaryStrength}` : ""}
${painPoint ? `- Pain Point to address: "${typeof painPoint === 'object' ? painPoint.title : painPoint}"` : ""}
${falseBelief ? `- False Belief to debunk: "${typeof falseBelief === 'object' ? falseBelief.title : falseBelief}"` : ""}

REQUIREMENTS:
1. Use the ${hookStyle.toUpperCase()} hook style
2. The authority anchor MUST be exactly: "My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women."
3. Follow the 6-section structure precisely
4. Use the ${primaryStrength || "appropriate"} strength tone
5. End with the appropriate CTA for ${postType} posts
6. Include the 5 required hashtags
7. NEVER use any forbidden language

Generate the complete script as a JSON object.`;

    // Call Claude API
    const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }]
    });

    // Extract the response text
    const responseText = message.content[0].type === "text" 
      ? message.content[0].text 
      : "";

    // Try to parse as JSON
    let scriptData;
    try {
      // Find JSON in the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scriptData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // If parsing fails, return the raw text
      scriptData = {
        full_script: responseText,
        hook: "",
        bridge: "",
        authority_anchor: "My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women.",
        education: "",
        pattern_expansion: "",
        cta: "",
        caption: "",
        hashtags: ["#womenswellness", "#rootcausecoach", "#yourbodyischemistry", "#femalephysiology", "#metabolicstability"],
        parse_error: "Response was not valid JSON"
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        script: scriptData,
        metadata: {
          postType,
          hookStyle,
          pillar: pillar?.name || pillar,
          primaryStrength,
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
    console.error("Script generation error:", error);
    
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
