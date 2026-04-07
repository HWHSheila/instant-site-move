# Content Studio - Her Wellness Harmony

AI-powered content creation system for generating talking-head video scripts using Sheila's exact brand voice and methodology.

## Features

### Script Generator (6-Step Wizard)
1. **Choose Pillar** - Select from 5 content pillars (Gut Function, Blood Sugar, Inflammation, Metabolic Instability, Chronic Fatigue)
2. **Select Pain Point** - Choose from pre-defined pain points or describe your own
3. **Post Type** - Authority (50%), Sales (30%), or Engagement (20%)
4. **Gallup Strength** - Select primary strength for tone guidance
5. **Hook Style** - Symptom Recognition, Pattern Recognition, False Belief, Confusion, or Observation
6. **Generate** - AI creates script following exact brand guidelines

### Content Library
- View all generated scripts
- Filter by status (draft, ready, scheduled, posted)
- Search content
- Duplicate or schedule scripts

### Content Calendar
- Monthly/weekly view
- 50/30/20 post mix tracking
- Drag-and-drop scheduling (coming soon)

### Campaigns
- Themed week campaigns
- Product launch campaigns
- Evergreen funnel campaigns
- Progress tracking

## Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 2. Database Setup
Run the SQL scripts in Supabase SQL Editor:
```bash
# 1. Create tables
sql/content_studio_schema.sql

# 2. Seed data
sql/seed_data.sql
```

### 3. Edge Function Secret
In Supabase Dashboard → Edge Functions → Secrets, add:
- `CLAUDE_API_KEY`: Your Anthropic Claude API key

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Docker (Local Testing)
```bash
docker-compose up
```

## Script Structure (from Blueprint Document 4)

Every script follows this exact 6-section structure:

1. **HOOK** (1-2 sentences) - Grab attention using one of 5 hook styles
2. **BRIDGE** (2-3 sentences) - Validate and normalize the experience
3. **AUTHORITY ANCHOR** (exact wording):
   > "My name is Sheila, and I've dropped over 105 pounds by combining my background as a scientist with root cause wellness for women."
4. **EDUCATION** (3-5 sentences) - Explain the Gut → Metabolism → Hormones connection
5. **PATTERN EXPANSION** (2-3 sentences) - Connect to broader physiology
6. **CTA** - Post-type specific call to action

## Brand Voice Rules

### Always Do:
- Sound like a scientist explaining physiology
- Use pattern-based communication
- Female-forward language ("Many women notice...")
- Accessible science (translate jargon)

### Never Use:
- Diet culture language ("eat less move more", "cheat meal")
- Influencer hype ("hack", "biohack", "secret trick")
- Medical claims ("this cures", "this fixes")
- Shame language ("you caused this", "you ruined")
- Absolutes ("this always works", "guaranteed")
- Fear-based language ("broken forever", "damaged")

## Required Hashtags
Always include these 5:
- #womenswellness
- #rootcausecoach
- #yourbodyischemistry
- #femalephysiology
- #metabolicstability

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Auth**: Clerk
- **AI**: Claude API (via Supabase Edge Functions)
- **Deployment**: Vercel

## Git Workflow

1. Develop on `develop` branch
2. Test locally with Docker
3. Create PR to `main`
4. Merge triggers Vercel deployment
