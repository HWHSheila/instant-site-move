-- Publish lessons that already have scripts, even when the video file is not
-- uploaded yet. Members need something visible for the Batch 1 retest; the
-- lesson page already shows a video placeholder when video_url is empty.
-- Only the two scripted rows (NS-01, GL-01) are affected today. Everything
-- else stays hidden until it has a script or a recording.

UPDATE portal_videos
SET production_status = 'published'
WHERE production_status = 'scripted'
  AND production_status <> 'published';
