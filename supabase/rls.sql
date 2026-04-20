revoke all on table athletes from anon, authenticated;
revoke all on table audio_entries from anon, authenticated;
revoke all on table sparks from anon, authenticated;
revoke all on table capsules from anon, authenticated;
revoke all on table conversations_guide from anon, authenticated;

grant select on table athletes to anon, authenticated;
grant select on table sparks to anon, authenticated;
grant select on table capsules to anon, authenticated;

alter table athletes enable row level security;
alter table audio_entries enable row level security;
alter table sparks enable row level security;
alter table capsules enable row level security;
alter table conversations_guide enable row level security;

drop policy if exists athletes_public_read on athletes;
create policy athletes_public_read
on athletes
for select
to anon, authenticated
using (true);

drop policy if exists sparks_public_read on sparks;
create policy sparks_public_read
on sparks
for select
to anon, authenticated
using (true);

drop policy if exists capsules_public_read on capsules;
create policy capsules_public_read
on capsules
for select
to anon, authenticated
using (true);

-- No public direct access to:
-- audio_entries
-- conversations_guide
--
-- The app writes and reads those via server routes that use the service role key.
