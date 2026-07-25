-- Clear tiers that were never paid for.
--
-- The assessment used to write its recommendation into subscribers.tier, and
-- the day simulator used to force 'restoration' at day 19. Both are fixed, but
-- the rows they wrote are still there, which is why the membership badge showed
-- Restoration for accounts that had never paid anything.
--
-- Deliberately narrow. A row is only cleared when all three are true:
--   no Stripe subscription, no Stripe customer, payment_status 'none'.
-- Anyone in trial, active, past_due or cancelled is left completely alone,
-- so no paying member can lose their tier to this.

UPDATE subscribers
SET tier = NULL
WHERE tier IS NOT NULL
  AND stripe_subscription_id IS NULL
  AND stripe_customer_id IS NULL
  AND payment_status = 'none';
