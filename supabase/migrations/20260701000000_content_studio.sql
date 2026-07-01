-- Content Studio: content_pieces + calendar_entries
-- Lane: 'attract' = social/short-form  |  'member' = portal long-form

CREATE TABLE public.content_pieces (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now(),
  title              text        NOT NULL DEFAULT '',
  pillar_id          text,
  pillar_name        text,
  pain_point         text,
  post_type          text        CHECK (post_type IN ('authority','sales','engagement')),
  hook_style         text,
  strength           text,
  content_lane       text        NOT NULL DEFAULT 'attract'
                                 CHECK (content_lane IN ('attract','member')),
  content_format     text        NOT NULL DEFAULT 'script'
                                 CHECK (content_format IN ('script','video','carousel','article')),
  status             text        NOT NULL DEFAULT 'draft'
                                 CHECK (status IN ('draft','ready','scheduled','posted')),
  review_status      text        NOT NULL DEFAULT 'pending'
                                 CHECK (review_status IN ('pending','approved','rejected')),
  portal_published   boolean     NOT NULL DEFAULT false,
  full_script        text,
  hook               text,
  bridge             text,
  authority_anchor   text,
  education          text,
  pattern_expansion  text,
  cta                text,
  caption            text,
  hashtags           text[],
  scheduled_date     date,
  scheduled_time     text,
  posted_at          timestamptz
);

CREATE TABLE public.calendar_entries (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz DEFAULT now(),
  content_piece_id   uuid        REFERENCES public.content_pieces(id) ON DELETE CASCADE,
  scheduled_date     date        NOT NULL,
  scheduled_time     text,
  platform           text        DEFAULT 'instagram'
                                 CHECK (platform IN ('instagram','facebook','tiktok','youtube','email')),
  posted_at          timestamptz,
  status             text        NOT NULL DEFAULT 'scheduled'
                                 CHECK (status IN ('scheduled','posted','cancelled'))
);

-- RLS: app-level auth is handled by Clerk; allow anon key full access
ALTER TABLE public.content_pieces   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "studio_full_access" ON public.content_pieces
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "calendar_full_access" ON public.calendar_entries
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_pieces_updated_at
  BEFORE UPDATE ON public.content_pieces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
