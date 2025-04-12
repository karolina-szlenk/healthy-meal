-- migration: 20250412113732_initial_schema.sql
-- description: creates the initial database schema for the healthy-meal application
-- including all tables, enum types, relationships, and row level security policies

-- create extension for uuid generation if not exists
create extension if not exists "uuid-ossp";

-- create custom enum types
create type diet_type_enum as enum ('VEGETARIAN', 'KETOGENIC', 'PESCATARIAN');
comment on type diet_type_enum is 'Types of diet preferences a user can select';

create type modification_type_enum as enum ('INGREDIENT_SWAP', 'REDUCE_TIME', 'DIET_ADAPTATION', 'FLAVOR_TWEAK', 'PORTION_CHANGE');
comment on type modification_type_enum is 'Types of modifications a recipe can undergo';

create type recipe_status_enum as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
comment on type recipe_status_enum is 'Status of a recipe in the publication lifecycle';

-- create users table
create table users (
  id uuid primary key not null default uuid_generate_v4(),
  email text not null unique,
  hashed_password text not null,
  username text not null unique check (char_length(username) between 3 and 30 and username ~ '^[a-z0-9_]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true,
  deleted_at timestamptz
);
comment on table users is 'Stores user account information';

-- enable row level security on users
alter table users enable row level security;

-- create preferences table
create table preferences (
  id uuid primary key not null default uuid_generate_v4(),
  user_id uuid not null unique references users(id) on delete cascade,
  diet_type diet_type_enum not null,
  allergies jsonb,
  excluded_ingredients jsonb,
  calorie_target integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table preferences is 'Stores user dietary preferences and restrictions';

-- enable row level security on preferences
alter table preferences enable row level security;

-- create recipes table
create table recipes (
  id uuid primary key not null default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null check (char_length(title) <= 100),
  ingredients jsonb not null,
  steps jsonb not null,
  macros jsonb not null,
  preparation_time integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_recipe unique (user_id, title)
);
comment on table recipes is 'Stores recipe information including ingredients, steps, and nutritional data';

-- enable row level security on recipes
alter table recipes enable row level security;

-- create modified_recipes table
create table modified_recipes (
  id uuid primary key not null default uuid_generate_v4(),
  parent_recipe_id uuid not null references recipes(id) on delete cascade,
  modification_type modification_type_enum not null,
  modification_comment text check (char_length(modification_comment) <= 500),
  status recipe_status_enum not null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table modified_recipes is 'Stores modifications to original recipes';

-- enable row level security on modified_recipes
alter table modified_recipes enable row level security;

-- create ratings table
create table ratings (
  id uuid primary key not null default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_edited boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table ratings is 'Stores user ratings and reviews for recipes';

-- enable row level security on ratings
alter table ratings enable row level security;

-- create indexes for better performance
create index idx_recipes_user_id on recipes(user_id);
create index idx_preferences_user_id on preferences(user_id);
create index idx_modified_recipes_parent_recipe_id on modified_recipes(parent_recipe_id);
create index idx_ratings_user_id on ratings(user_id);
create index idx_ratings_recipe_id on ratings(recipe_id);
create index idx_recipes_created_at on recipes(created_at);
create index idx_ratings_created_at on ratings(created_at);

-- create full text search index on recipe titles
create index idx_recipes_title_search on recipes using gin (to_tsvector('english', title));

-- create functions for updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- create triggers for updated_at
create trigger set_users_updated_at
before update on users
for each row execute function set_updated_at();

create trigger set_preferences_updated_at
before update on preferences
for each row execute function set_updated_at();

create trigger set_recipes_updated_at
before update on recipes
for each row execute function set_updated_at();

create trigger set_modified_recipes_updated_at
before update on modified_recipes
for each row execute function set_updated_at();

create trigger set_ratings_updated_at
before update on ratings
for each row execute function set_updated_at(); 