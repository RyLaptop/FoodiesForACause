-- Run in the Supabase SQL editor (service role, so RLS doesn't block the select).
-- FTV associate screeners for one event. needs_training = no vitals cert, so email them 1 week before the event to schedule the 1-hour in-person training.
select name, email, phone, vitals_cert, coalesce(vitals_trained, false) = false as needs_training, created_at
from signups_ftv
where associate_screener is true
  and event_date = date '2026-12-05'
order by needs_training desc, created_at;
