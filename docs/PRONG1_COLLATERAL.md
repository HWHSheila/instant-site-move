# HWH Content Generation System -- Prong 1 Collateral

Everything that exists today, why it exists, how it works, and where Prong 2 plugs in.

---

## 1. Business model: Why this system exists

HWH has two audiences that need content:

**Prong 1 (built and working)**: Generate short, punchy social scripts that make women think "that's exactly what I experience." Goal: attract followers and convert them to subscribers.

**Prong 2 (planned)**: Generate deeper portal content -- articles, guides, modules -- that give paying members the detailed education and roadmaps. Goal: retain subscribers and justify tier upgrades.

**The key principle**: Both prongs share the same brand voice, the same 5 pillars, the same pain points, and the same Gut → Metabolism → Hormones framework. Prong 2 is not a different system -- it is the same system producing longer, deeper output for a different audience at a different stage.

### How the two prongs connect

```
Prong 1: Attract
  Short scripts for Instagram / TikTok
    → Stranger sees post
    → Recognizes her own symptoms
    → Follows / saves / comments
    → Signs up for free guide or trial

Prong 2: Retain
  Detailed content inside the member portal
    → Paying subscriber reads
    → Gets physiology education + guidance
    → Stays subscribed / upgrades tier
```

---

## 2. Content workflow (end to end)

### Current workflow (Prong 1 only)

```
Topic idea
  → Open Script Generator wizard
  → Pick: Pillar + Pain Point + Post Type + Strength + Hook Style
  → AI generates 6-section script
  → Review output in the UI
      → Copy to clipboard and edit externally if needed
      → Regenerate if not right
      → Save to Content Library as Draft
  → Mark as Ready when satisfied
  → Set scheduled date on calendar
  → Record video using the script
  → Post to Instagram / TikTok
  → Mark as Posted in calendar

  (Optionally from Draft: Publish to Portal → Members see it)
```

### What the content creator decides at each step

- **Pillar**: What broad topic area (educational? myth-busting? coaching pitch?)
- **Pain Point**: What specific symptom to address (from audience DMs and comments)
- **Post Type**: What business goal -- teach (authority), sell (sales), or build community (engagement)
- **Strength**: What personal tone to lead with (Gallup profile)
- **Hook Style**: How to open the post (pattern-based, myth challenge, symptom callout, etc.)
- **Save vs. Regenerate**: Whether the AI output matches voice and intent
- **Publish to Portal**: Whether this script is also valuable for paying members (currently a simple toggle, no tier gating yet)

### What the system handles

- AI generation with enforced brand voice rules (tone, forbidden language, script structure)
- Persistent storage of all content with metadata (pillar, pain point, post type, etc.)
- Status lifecycle tracking (draft → ready → scheduled → posted)
- Calendar visualization with content mix tracking (50/30/20 ratio)
- Portal publication toggle (attract vs. member lane)

---

## 3. End-goals accomplished by generation

### For a social script (Prong 1)

A successful generation produces a **ready-to-record video script** that:

1. **Opens with recognition** -- the hook makes a woman stop scrolling because she sees her own experience
2. **Validates without victimizing** -- the bridge says "you're not alone, this is common" without reinforcing helplessness
3. **Establishes credibility** -- the authority anchor positions HWH as a scientist-practitioner who walks the walk (105 lbs lost)
4. **Educates on root cause** -- the education section teaches physiology (Gut → Metabolism → Hormones) in accessible language
5. **Connects the dots** -- pattern expansion shows the symptom isn't random, it's a signal
6. **Drives action** -- CTA matches the business goal (follow, engage, or buy)

The script also produces a **caption** (shorter text version for the post) and **hashtags** (5 fixed branded tags).

### For portal content (Prong 2 -- planned)

A successful generation would produce a **detailed member article or module** that:

1. Goes deeper than the social script on the same topic
2. Provides actionable guidance (meal timing, sleep protocols, stress regulation)
3. Is gated by subscription tier
4. Can reference or expand on a social script that attracted the member in the first place

---

## 4. The AI brain: Brand voice and generation rules

**File**: `supabase/functions/generate-script/index.ts`

- **Model**: `claude-sonnet-4-6` via Anthropic SDK
- **API key**: Supabase secret `CLAUDE_API_KEY`

### Core framework (shared by both prongs)

Everything connects: **Gut → Metabolism → Hormones**. This is HWH's root-cause differentiation. Every piece of content -- social or portal -- ties symptoms back to this chain.

### Brand voice rules (shared by both prongs)

**Always do:**
- Sound like a scientist explaining physiology
- Use pattern-based communication
- Validate emotions without reinforcing helplessness
- Female-forward language ("Many women notice...")
- Accessible science (translate jargon to everyday language)
- Phrases like: "the body often shifts...", "when stress signals increase...", "metabolic signaling responds to..."

**Never do (6 categories, ~30 banned phrases):**
- Diet culture: "eat less move more", "burn fat", "cheat meal", "clean eating", "detox"
- Influencer hype: "hack your metabolism", "biohack", "secret trick", "game changer"
- Medical claims: "this cures", "this fixes", "this treats", "this heals"
- Shame language: "you caused this", "you need more discipline", "it's your fault"
- Absolutes: "this always works", "everyone should", "the only solution"
- Fear-based: "your hormones are destroyed", "broken forever", "it's too late"

### Script structure (Prong 1 specific -- Prong 2 would define its own)

| Section | What it does | Length |
|---------|-------------|--------|
| Hook | Makes her think "that's exactly me" | 1-2 sentences |
| Bridge | Validates, normalizes, transitions to education | 2-3 sentences |
| Authority Anchor | Fixed bio line (never modified) | 1 sentence |
| Education | Physiology explanation (Gut→Metabolism→Hormones) | 3-5 sentences |
| Pattern Expansion | Connects symptoms to root causes, offers hope | 2-3 sentences |
| CTA | Varies by post type (follow / engage / buy) | 1-2 sentences |

Plus: caption (short social text), hashtags (5 branded), full_script (all sections combined).

### Gallup Strength tone mapping

The selected Gallup Strength adjusts the *tone* of the output:
- Authority posts + Analytical/Learner/Strategic = logical cause-and-effect
- Engagement posts + Relator/Responsibility = personal, emotional connection
- Sales posts + Command/Focus/Futuristic = bold, direct statements

---

## 5. Data model: How content flows

### Single table: `content_pieces`

All generated content (both prongs) lives in one table. Key columns organized by purpose:

**Identity and origin:**
- `pillar_name`, `pain_point`, `post_type`, `hook_style`, `primary_strength` -- wizard selections stored for reference and filtering

**Content body:**
- `full_script` -- combined output
- `script_hook`, `script_bridge`, `script_authority_anchor`, `script_education`, `script_pattern_expansion`, `script_cta` -- individual sections (enables section-level editing)
- `caption`, `hashtags` -- social metadata

**Lane and visibility:**
- `content_lane`: `"attract"` (social, default on creation) or `"member"` (portal)
- `portal_published`: boolean, toggled from Content Library
- `content_format`: currently always `"script"`, extensible to `"article"`, `"guide"`, `"module"` for Prong 2

**Lifecycle:**
- `status`: draft → ready → scheduled → posted
- `review_status`: pending / approved / rejected
- `scheduled_date`, `scheduled_time` -- calendar placement
- `posted_at` -- when actually published

**Media:**
- `video_url`, `video_status` -- video attachment (upload or YouTube/Vimeo link)

### Content lifecycle flow

```
[New] → Draft (AI generates, content_lane = attract)
  → Ready (reviewed and approved)
  → Scheduled (calendar date set)
  → Posted (recorded and published)

Draft → Member Lane (Publish to Portal toggle, content_lane = member)
  → Members see content in portal
```

### Missing for Prong 2 (not yet built)

- `tier_access text[]` column -- which subscription tiers can see this content (backlog item ARCH-1)
- Longer-form content fields -- the existing `script_*` columns are structured for 6-section social scripts; portal articles may need a different field structure or a single `body_markdown` field

---

## 6. The wizard: Input collection pattern

### Current wizard steps (Prong 1)

```
Step 1: Pillar (5 options)
  → Step 2: Pain Point (7 presets + custom free-text)
  → Step 3: Post Type (3 options)
  → Step 4: Gallup Strength (12 options, filtered by Post Type)
  → Step 5: Hook Style (5 options)
  → Step 6: Review selections + Generate
```

All options are **hardcoded arrays** in the React component (not database-driven). This is intentional -- the pillars, pain points, strengths, and hook styles are a fixed brand framework, not user-configurable.

### The 5 Pillars

| ID | Name | Purpose | Example Topics |
|----|------|---------|----------------|
| P1 | Root Cause Education | Teach physiology | Blood sugar, digestion, metabolic adaptation |
| P2 | Personal Story & Validation | Emotional connection | Feeling broken, dismissed, confused |
| P3 | Practical Support | Daily behaviors | Meal timing, sleep, stress regulation |
| P4 | Myth Busting | Correct misinformation | Diet culture lies, medical myths |
| P5 | Coaching & Guidance | Position the offer | Need for roadmap, structured support |

### The 7 Pain Points (presets)

- Bloating every night
- Energy crashes mid-day
- Cycle symptoms shifting wildly
- Water retention / inflammation
- Hair shedding, sleep disruption
- Feeling dismissed by doctors
- "I've tried everything"

(Custom free-text input is also available as an alternative.)

### Post Types and target mix

| Type | Goal | Target share |
|------|------|-------------|
| Authority | Educational content | 50% |
| Sales | Conversion-focused | 30% |
| Engagement | Community building | 20% |

### Hook Styles

| Style | Opening pattern | Example |
|-------|----------------|---------|
| Symptom Recognition | Point out body patterns | "Have you ever noticed your body..." |
| Pattern Recognition | Highlight system connections | "The body usually communicates through patterns..." |
| False Belief | Challenge a misconception | "Many women are told that..." |
| Confusion | Address "body doesn't make sense" feeling | "Have you ever felt like something isn't right..." |
| Observation | Scientist sharing what they see | "One thing I see women experience..." |

### Key design choices

- **Progressive disclosure**: Each step shows only what's relevant (e.g., Strengths are filtered by Post Type)
- **Custom input**: Pain Point step allows free-text as an alternative to presets
- **Review before generate**: Step 6 shows all selections as badges before the AI call
- **Post-generation actions**: Copy to clipboard, Save to library, Regenerate with same inputs

### What Prong 2 could reuse vs. change

- **Reuse**: Pillar selection, Pain Point selection (same framework)
- **Change**: Post Type (portal content may use "Deep Dive" / "Guide" / "Module" instead of Authority/Sales/Engagement)
- **Change**: Hook Style (social-specific; portal content may not need a "hook" at all, or may use a different set)
- **Add**: Content format selector (article, guide, module), tier assignment, length/depth control

---

## 7. Content management: Library and Calendar

**Content Library** (`src/pages/portal/studio/ContentLibrary.tsx`):
- Lists all `content_pieces`, searchable, filterable by status tab (All / Drafts / Ready / Scheduled / Posted)
- Per-item actions: View script sections, Copy full script, Add/update video, Mark Ready/Posted, Publish to Portal, Delete
- "Publish to Portal" is the bridge between prongs -- it flips `content_lane` to `"member"` and sets `portal_published = true`

**Content Calendar** (`src/pages/portal/studio/ContentCalendar.tsx`):
- Monthly grid with color-coded items (blue = Authority, green = Sales, purple = Engagement)
- Mix tracker showing current ratio vs. target (50/30/20)
- One-click "Mark as Posted" on hover

**Member Content page** (`src/pages/portal/PortalContent.tsx`):
- What paying members see -- reads `content_pieces` where `portal_published = true`
- Currently does not filter by tier (tier gating not yet built)

---

## 8. API contract: Request and response

### Request (frontend → edge function)

```json
{
  "pillar": { "id": "P1", "name": "Root Cause Education", "description": "...", "color": "#8B5CF6" },
  "painPoint": "Bloating every night",
  "postType": "authority",
  "hookStyle": "symptom",
  "primaryStrength": "Analytical"
}
```

### Response (edge function → frontend)

```json
{
  "success": true,
  "script": {
    "hook": "Have you ever noticed your stomach swells after almost every meal...",
    "bridge": "If this sounds familiar, you are not the only one...",
    "authority_anchor": "My name is Sheila, and I've dropped over 105 pounds...",
    "education": "When gut function is disrupted, the body's metabolic signaling...",
    "pattern_expansion": "This pattern often connects to sleep quality, stress...",
    "cta": "Follow for more physiology explanations like this one...",
    "full_script": "...all sections combined...",
    "caption": "If your stomach swells after almost every meal...",
    "hashtags": ["#womenswellness", "#rootcausecoach", "#yourbodyischemistry", "#femalephysiology", "#metabolicstability"]
  },
  "metadata": {
    "postType": "authority",
    "hookStyle": "symptom",
    "pillar": "Root Cause Education",
    "primaryStrength": "Analytical",
    "generatedAt": "2026-07-02T22:43:00.000Z"
  }
}
```

---

## 9. What Prong 2 can build on (reuse map)

**Fully reusable (don't rebuild):**
- Brand voice rules (system prompt tone and forbidden language)
- Core framework (Gut → Metabolism → Hormones)
- 5 Pillars (same organizational structure)
- Pain Points (same audience symptoms)
- `content_pieces` table and `content_lane` column
- Content Library with portal publish toggle
- Supabase + Clerk auth plumbing
- Edge function infrastructure (same pattern: receive inputs, call Claude, return JSON)

**Partially reusable (extend, don't replace):**
- `generate-script` edge function -- same system prompt base, but needs alternate output structures for long-form content (more `max_tokens`, different section definitions)
- Gallup Strengths -- still relevant for tone, but may not need a separate wizard step for portal content
- Wizard pattern -- progressive step-by-step input works, but steps differ for portal content

**Not reusable (build new for Prong 2):**
- Script structure (6 short sections is social-specific; portal content needs its own structure)
- Hook Styles (social-specific opening patterns)
- Post Types (Authority/Sales/Engagement is a social content mix strategy; portal needs content type categories like Guide/Module/Deep Dive)
- Tier gating (does not exist yet)

---

## 10. Key files reference

| File | Role |
|------|------|
| `src/pages/portal/studio/ScriptGenerator.tsx` | 6-step wizard UI, all hardcoded option arrays |
| `supabase/functions/generate-script/index.ts` | AI edge function, full system prompt, brand voice rules |
| `src/pages/portal/studio/ContentLibrary.tsx` | Content list, status management, portal publish toggle, video attachment |
| `src/pages/portal/studio/ContentCalendar.tsx` | Calendar view, mix tracker, mark-as-posted |
| `src/pages/portal/PortalContent.tsx` | Member-facing content display |
| `src/integrations/supabase/types.ts` | TypeScript types for `content_pieces` (lines 17-77) |
| `docs/BACKLOG.md` | Full backlog including ARCH-1 decision and all pending items |
