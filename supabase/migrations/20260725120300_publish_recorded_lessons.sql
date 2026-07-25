-- Make finished lessons visible to members.
--
-- Members are restricted by RLS to production_status = 'published', and the
-- seeds default every row to 'not_started'. Nothing was ever moved off that
-- default, so the roadmap was empty for everyone except admins, who bypass RLS.
-- That is why the roadmap looked broken during UAT.
--
-- Only rows that actually have a video are published. A lesson with a script
-- and no recording would otherwise appear watchable and then fail. Anything
-- without a video stays hidden, and the roadmap now says so explicitly rather
-- than rendering an empty page.

UPDATE portal_videos
SET production_status = 'published'
WHERE video_url IS NOT NULL
  AND video_url <> ''
  AND production_status <> 'published';
