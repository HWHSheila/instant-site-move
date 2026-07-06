-- Q1: Member Content + Weekly Notes authoring
-- Q2: Priority Support telegram threading columns

CREATE TABLE IF NOT EXISTS public.member_content_posts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type         text        NOT NULL CHECK (post_type IN ('article', 'weekly_note')),
  title             text        NOT NULL,
  body              text        NOT NULL DEFAULT '',
  status            text        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'published')),
  tier_access       text[]      NOT NULL DEFAULT ARRAY['awareness','foundation','guided','restoration','integration'],
  published_at      timestamptz,
  author_clerk_id   text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_content_posts_type
  ON public.member_content_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_member_content_posts_status
  ON public.member_content_posts(status);

ALTER TABLE public.member_content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_member_content_posts"
  ON public.member_content_posts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE clerk_user_id = auth.jwt()->>'sub')
  );

CREATE POLICY "member_read_published_content_posts"
  ON public.member_content_posts FOR SELECT
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- Priority Support: telegram threading
ALTER TABLE public.priority_support_messages
  ADD COLUMN IF NOT EXISTS telegram_message_id bigint,
  ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES public.priority_support_messages(id);

CREATE INDEX IF NOT EXISTS idx_priority_messages_telegram
  ON public.priority_support_messages(telegram_message_id)
  WHERE telegram_message_id IS NOT NULL;

CREATE OR REPLACE TRIGGER update_member_content_posts_updated_at
  BEFORE UPDATE ON public.member_content_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
