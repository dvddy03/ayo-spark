create extension if not exists pgcrypto;

create table if not exists athletes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  pays text not null,
  code_pays text not null,
  sport text not null,
  langue_native text not null,
  type text not null default 'athlete' check (type in ('athlete', 'reporter', 'benevole')),
  est_refugie boolean default false,
  photo_url text,
  position_actuelle text default 'Diamniadio',
  created_at timestamptz default now()
);

create table if not exists audio_entries (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  audio_url text,
  transcription text,
  langue_detectee text,
  emotions jsonb,
  themes jsonb,
  extrait_fort text,
  intensite integer check (intensite between 0 and 10),
  connexions_potentielles jsonb,
  jour_joj integer check (jour_joj between 1 and 13),
  created_at timestamptz default now()
);

create table if not exists sparks (
  id uuid primary key default gen_random_uuid(),
  athlete1_id uuid references athletes(id) on delete cascade,
  athlete2_id uuid references athletes(id) on delete cascade,
  type text not null check (type in ('culturel', 'olympique', 'teranga')),
  score integer not null check (score between 0 and 100),
  lien_commun text not null,
  lieu_suggere text,
  heure_suggeree text,
  statut text not null default 'pending' check (statut in ('pending', 'accepted', 'declined', 'completed')),
  created_at timestamptz default now()
);

create table if not exists capsules (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  narrative_fr text not null,
  narrative_en text,
  narrative_native text,
  nb_journaux integer default 0,
  created_at timestamptz default now()
);

create table if not exists conversations_guide (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete set null,
  message text not null,
  reponse text not null,
  langue text,
  categorie text,
  created_at timestamptz default now()
);

insert into athletes (id, nom, pays, code_pays, sport, langue_native, type, est_refugie, position_actuelle)
values
  ('11111111-1111-4111-8111-111111111111', 'Amara Diallo', 'Senegal', 'SN', 'Judo', 'fr', 'athlete', false, 'Diamniadio'),
  ('22222222-2222-4222-8222-222222222222', 'Yuki Tanaka', 'Japon', 'JP', 'Natation', 'ja', 'athlete', false, 'Dakar'),
  ('33333333-3333-4333-8333-333333333333', 'Sofia Mendes', 'Bresil', 'BR', 'Athletisme', 'pt', 'athlete', false, 'Saly'),
  ('44444444-4444-4444-8444-444444444444', 'Hassan Omar', 'Equipe Refugees', 'RF', 'Boxe', 'so', 'athlete', true, 'Diamniadio'),
  ('55555555-5555-4555-8555-555555555555', 'Emma Larsson', 'Suede', 'SE', 'Escrime', 'sv', 'athlete', false, 'Dakar')
on conflict (id) do update set
  nom = excluded.nom,
  pays = excluded.pays,
  code_pays = excluded.code_pays,
  sport = excluded.sport,
  langue_native = excluded.langue_native,
  type = excluded.type,
  est_refugie = excluded.est_refugie,
  position_actuelle = excluded.position_actuelle;

insert into sparks (id, athlete1_id, athlete2_id, type, score, lien_commun, lieu_suggere, heure_suggeree, statut)
values
  ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'teranga', 94, 'Deux Africains, deux realites, une meme flamme pour prouver que leur peuple existe.', 'Corniche de Dakar', '18:30', 'pending'),
  ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333', 'culturel', 87, 'La peur de decevoir leurs parents traverse les cultures japonaise et bresilienne.', 'Village Olympique - Jardin central', '16:00', 'pending'),
  ('aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '55555555-5555-4555-8555-555555555555', '11111111-1111-4111-8111-111111111111', 'olympique', 79, 'Visualisation pre-combat et routines de concentration a partager entre escrime et judo.', 'Dakar Arena', '11:15', 'pending')
on conflict (id) do update set
  athlete1_id = excluded.athlete1_id,
  athlete2_id = excluded.athlete2_id,
  type = excluded.type,
  score = excluded.score,
  lien_commun = excluded.lien_commun,
  lieu_suggere = excluded.lieu_suggere,
  heure_suggeree = excluded.heure_suggeree,
  statut = excluded.statut;

insert into audio_entries (
  id,
  athlete_id,
  transcription,
  langue_detectee,
  emotions,
  themes,
  extrait_fort,
  intensite,
  connexions_potentielles,
  jour_joj
)
values
  (
    'bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '44444444-4444-4444-8444-444444444444',
    'Je me bats pour tous ceux qui ne peuvent pas etre ici.',
    'fr',
    '[{"nom":"Resilience","score":87,"couleur":"#2ecc71"},{"nom":"Espoir","score":74,"couleur":"#f39c12"}]'::jsonb,
    '["Exil","Voix","Dignite","Representation"]'::jsonb,
    'Je me bats pour tous ceux qui ne peuvent pas etre ici.',
    8,
    '["Resilience","Afrique","Courage partage"]'::jsonb,
    3
  )
on conflict (id) do update set
  transcription = excluded.transcription,
  langue_detectee = excluded.langue_detectee,
  emotions = excluded.emotions,
  themes = excluded.themes,
  extrait_fort = excluded.extrait_fort,
  intensite = excluded.intensite,
  connexions_potentielles = excluded.connexions_potentielles,
  jour_joj = excluded.jour_joj;

insert into capsules (id, athlete_id, narrative_fr, nb_journaux)
values
  (
    'ccccccc1-cccc-4ccc-8ccc-ccccccccccc1',
    '44444444-4444-4444-8444-444444444444',
    'Il est arrive a Dakar sans famille pour l''applaudir. Juste lui, ses gants, et quelque chose a prouver au monde : non pas qu''il etait le meilleur, mais qu''il existait. Le jour de sa defaite en quart de finale, Hassan Omar n''a pas pleure devant les cameras. Il a attendu le silence, puis l''eau froide, puis cette phrase qui est sortie comme une promesse : "Je me bats pour tous ceux qui ne peuvent pas etre ici." Trois jours plus tard, sur la Corniche, il parlait avec un judoka senegalais qu''il ne connaissait pas encore la veille. Dakar 2026 ne lui a pas offert une medaille. Il lui a offert une trace, une preuve, une voix qui restera dans la memoire du Village olympique.',
    1
  )
on conflict (id) do update set
  narrative_fr = excluded.narrative_fr,
  nb_journaux = excluded.nb_journaux;

