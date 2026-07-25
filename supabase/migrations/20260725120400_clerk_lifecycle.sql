-- Track Clerk account deletion without destroying membership history.
--
-- Email was copied into subscribers once at row creation and never re-synced,
-- and there was nothing listening for account deletion, so a member who deleted
-- their Clerk account left a live subscriber row behind with a working tier.
--
-- Deletion is recorded rather than executed. Wiping the row would cascade away
-- intake responses, pattern maps and progress, including for someone who paid.
-- Access is revoked immediately; erasing the data stays a deliberate act.

ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS clerk_deleted_at TIMESTAMPTZ;

COMMENT ON COLUMN subscribers.clerk_deleted_at IS
  'Set when Clerk reports the account deleted. Access is revoked; the row is kept.';

CREATE INDEX IF NOT EXISTS idx_subscribers_clerk_deleted
  ON subscribers(clerk_deleted_at)
  WHERE clerk_deleted_at IS NOT NULL;
