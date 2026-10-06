-- Classroom game rooms. Rows are unowned (no Better Auth user_id).
-- Access is gated by opaque seat / instructor tokens, not by identity.

create table if not exists game_sessions (
  id text primary key,
  room_code text not null unique,
  instructor_pin text not null,
  instructor_token text not null unique,
  status text not null default 'lobby',
  week int not null default 0,
  team_count int not null,
  total_weeks int not null default 12,
  demand_revealed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists game_seats (
  id serial primary key,
  session_id text not null references game_sessions(id) on delete cascade,
  team_index int not null,
  role text not null,
  handle text,
  token text unique,
  is_bot boolean not null default false,
  unique (session_id, team_index, role)
);

create table if not exists game_teams (
  session_id text not null references game_sessions(id) on delete cascade,
  team_index int not null,
  state_json text not null,
  updated_at timestamptz not null default now(),
  primary key (session_id, team_index)
);

create index if not exists game_seats_session_idx on game_seats (session_id);
create index if not exists game_seats_token_idx on game_seats (token);
