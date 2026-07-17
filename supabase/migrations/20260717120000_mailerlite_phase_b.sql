-- Phase B MailerLite: cancelled_at for win-back; scheduled-triggers cron.
-- last_login_at column already exists (phase2 migration) — portal must write it.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'subscribers'
      AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN cancelled_at timestamptz;
  END IF;
END $$;

COMMENT ON COLUMN public.subscribers.cancelled_at IS
  'Set when Stripe subscription deleted; used for cancellation_win_back at +30d';
COMMENT ON COLUMN public.subscribers.last_login_at IS
  'Touched on authenticated portal load (throttled); used for inactivity_* triggers';

-- Daily cron: mailerlite-scheduled-triggers at 7 AM UTC (after advance-journey-day at 6)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Remove prior schedule if re-applied
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'mailerlite-scheduled-triggers';

    PERFORM cron.schedule(
      'mailerlite-scheduled-triggers',
      '0 7 * * *',
      format(
        'SELECT net.http_post(
          url := %L,
          headers := jsonb_build_object(
            %L, %L || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = %L)
          ),
          body := %L::jsonb
        )',
        'https://joxwjoboqkcenmphbtpi.supabase.co/functions/v1/mailerlite-scheduled-triggers',
        'Authorization',
        'Bearer ',
        'email_queue_service_role_key',
        '{}'
      )
    );
    RAISE NOTICE 'Cron job mailerlite-scheduled-triggers scheduled at 0 7 * * *';
  ELSE
    RAISE NOTICE 'pg_cron not available — schedule mailerlite-scheduled-triggers externally';
  END IF;
END $$;
