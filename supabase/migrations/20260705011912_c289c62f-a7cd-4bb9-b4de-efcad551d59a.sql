GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO PUBLIC, anon, authenticated;