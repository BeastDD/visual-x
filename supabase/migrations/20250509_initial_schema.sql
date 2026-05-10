-- Visual X Supabase Schema

-- Enable RLS
alter table if exists public.channels enable row level security;
alter table if exists public.user_channels enable row level security;
alter table if exists public.share_codes enable row level security;

-- Channels table (premade + custom)
create table if not exists public.channels (
  id text primary key,
  name text not null,
  icon text,
  description text,
  is_nsfw boolean default false,
  is_custom boolean default false,
  owner_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- User custom channels linking
create table if not exists public.user_channels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  channel_id text references public.channels(id),
  custom_handle text,
  created_at timestamp with time zone default now()
);

-- Shareable codes
create table if not exists public.share_codes (
  code text primary key,
  channel_id text references public.channels(id),
  created_by uuid references auth.users(id),
  expires_at timestamp with time zone default (now() + interval '30 days'),
  created_at timestamp with time zone default now()
);

-- RLS Policies
create policy "Public channels readable" on public.channels for select using (true);
create policy "Users can insert own custom channels" on public.channels for insert with check (auth.uid() = owner_id);

create policy "Users can manage own user_channels" on public.user_channels for all using (auth.uid() = user_id);

create policy "Share codes readable" on public.share_codes for select using (true);
create policy "Users can create share codes" on public.share_codes for insert with check (auth.uid() = created_by);

-- Indexes
create index if not exists idx_user_channels_user on public.user_channels(user_id);
create index if not exists idx_share_codes_code on public.share_codes(code);

-- Seed premade channels (run once)
insert into public.channels (id, name, icon, description, is_nsfw, is_custom)
values 
  ('news', 'News', '📰', 'Breaking news clips', false, false),
  ('popmusic', 'Pop Music', '🎵', 'Latest pop hits', false, false),
  ('adult', 'Adult X', '🔞', '18+ content', true, false),
  ('docusserie', 'DocuSerie', '🎥', 'Documentaries', false, false),
  ('cartoon', 'Cartoon', '🦸', 'Cartoons', false, false),
  ('anime', 'Anime', '🌸', 'Anime clips', false, false),
  ('sports', 'Sports Highlights', '⚽', 'Sports moments', false, false),
  ('tech', 'Tech & Gadgets', '💻', 'Tech reviews', false, false),
  ('gaming', 'Gaming Clips', '🎮', 'Gaming highlights', false, false)
on conflict (id) do nothing;