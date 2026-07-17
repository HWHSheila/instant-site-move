-- pg_cron job: advance-journey-day runs daily at 6 AM UTC
-- Calls the advance-journey-day edge function via net.http_post
-- Uses vault secret 'email_queue_service_role_key' (same as email queue cron)

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'advance-journey-day',
      '0 6 * * *',
      format(
        'SELECT net.http_post(
          url := %L,
          headers := jsonb_build_object(
            %L, %L || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = %L)
          ),
          body := %L::jsonb
        )',
        'https://joxwjoboqkcenmphbtpi.supabase.co/functions/v1/advance-journey-day',
        'Authorization',
        'Bearer ',
        'email_queue_service_role_key',
        '{}'
      )
    );
    RAISE NOTICE 'Cron job advance-journey-day scheduled at 0 6 * * *';
  ELSE
    RAISE NOTICE 'pg_cron not available — schedule advance-journey-day externally';
  END IF;
END $$;
