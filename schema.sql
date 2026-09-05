-- Run this entire file once in Supabase -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.rooms (
  code text primary key,
  host_key text not null,
  status text not null default 'lobby' check (status in ('lobby','running','finished')),
  current_question integer not null default -1,
  question_started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  room_code text not null references public.rooms(code) on delete cascade,
  name text not null,
  player_token text not null,
  yards integer not null default 0 check (yards between 0 and 100),
  finish_place integer,
  joined_at timestamptz not null default now()
);

create unique index if not exists players_room_name_unique
on public.players (room_code, lower(name));

create table if not exists public.answers (
  id bigserial primary key,
  room_code text not null references public.rooms(code) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  question_index integer not null,
  answer_index integer not null,
  correct boolean not null,
  awarded_yards integer not null default 0,
  answered_at timestamptz not null default now(),
  unique(room_code, player_id, question_index)
);

-- Server-side function: records an answer, awards 10 yards for correct answers,
-- plus a +3/+2/+1 speed bonus to the first three correct answers on each question.
create or replace function public.apply_answer(
  p_room_code text,
  p_player_id uuid,
  p_question_index integer,
  p_answer_index integer,
  p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  prior_correct integer := 0;
  bonus integer := 0;
  awarded integer := 0;
  old_yards integer := 0;
  new_yards integer := 0;
  place integer := null;
begin
  -- Serialize answer processing within a room so speed bonuses and finish places stay deterministic.
  perform 1 from rooms where code=p_room_code for update;

  if exists (
    select 1 from answers
    where room_code=p_room_code and player_id=p_player_id and question_index=p_question_index
  ) then
    raise exception 'duplicate answer';
  end if;

  select yards into old_yards
  from players
  where id=p_player_id and room_code=p_room_code
  for update;

  if old_yards is null then
    raise exception 'player not found';
  end if;

  if p_correct then
    select count(*) into prior_correct
    from answers
    where room_code=p_room_code and question_index=p_question_index and correct=true;
    bonus := greatest(0, 3 - prior_correct);
    awarded := 10 + bonus;
  end if;

  insert into answers(room_code,player_id,question_index,answer_index,correct,awarded_yards)
  values(p_room_code,p_player_id,p_question_index,p_answer_index,p_correct,awarded);

  new_yards := least(100, old_yards + awarded);
  update players set yards=new_yards where id=p_player_id;

  if new_yards >= 100 then
    select finish_place into place from players where id=p_player_id;
    if place is null then
      select coalesce(max(finish_place),0)+1 into place
      from players where room_code=p_room_code;
      update players set finish_place=place where id=p_player_id;
    end if;
  end if;

  return jsonb_build_object(
    'awardedYards',awarded,
    'speedBonus',bonus,
    'yards',new_yards,
    'finishPlace',place
  );
end;
$$;

-- Only the Vercel server uses the service role key. Browser users never receive it.
alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.answers enable row level security;
