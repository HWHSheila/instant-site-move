-- Phase 2D/3A: RLS fixes for member roadmap writes + progress reflection fields

ALTER TABLE public.member_content_progress
  ADD COLUMN IF NOT EXISTS reflection_response text,
  ADD COLUMN IF NOT EXISTS action_items_completed jsonb DEFAULT '[]'::jsonb;

-- Members need to create their roadmap on assessment completion
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'member_roadmaps' AND policyname = 'member_insert_own_roadmap'
  ) THEN
    CREATE POLICY "member_insert_own_roadmap" ON public.member_roadmaps
      FOR INSERT TO authenticated
      WITH CHECK (
        subscriber_id IN (
          SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'member_roadmaps' AND policyname = 'member_update_own_roadmap'
  ) THEN
    CREATE POLICY "member_update_own_roadmap" ON public.member_roadmaps
      FOR UPDATE TO authenticated
      USING (
        subscriber_id IN (
          SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
        )
      )
      WITH CHECK (
        subscriber_id IN (
          SELECT id FROM public.subscribers WHERE clerk_user_id = auth.jwt()->>'sub'
        )
      );
  END IF;
END $$;
