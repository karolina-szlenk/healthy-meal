-- migration: 20250412113734_public_recipe_view.sql
-- description: creates a public view for recipes with limited information
-- and adds utility functions for recipe management

-- create a public view for recipes
create view recipes_public_view as
select
  r.id,
  r.title,
  r.preparation_time,
  r.macros,
  r.created_at,
  u.username as author,
  (
    select avg(rt.rating)
    from ratings rt
    where rt.recipe_id = r.id and rt.is_active = true
  ) as average_rating,
  (
    select count(rt.id)
    from ratings rt
    where rt.recipe_id = r.id and rt.is_active = true
  ) as rating_count
from recipes r
join users u on r.user_id = u.id
where u.is_active = true;

comment on view recipes_public_view is 'Public view of recipes with limited information for display';

-- grant access to the public view
grant select on recipes_public_view to anon, authenticated;

-- create function to get recipe details by id
create or replace function get_recipe_details(recipe_id uuid)
returns jsonb
security definer
language sql
as $$
  select 
    jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'ingredients', r.ingredients,
      'steps', r.steps,
      'macros', r.macros,
      'preparation_time', r.preparation_time,
      'created_at', r.created_at,
      'author', u.username,
      'ratings', (
        select jsonb_agg(
          jsonb_build_object(
            'rating', rt.rating,
            'comment', rt.comment,
            'user', rtu.username,
            'created_at', rt.created_at
          )
        )
        from ratings rt
        join users rtu on rt.user_id = rtu.id
        where rt.recipe_id = r.id and rt.is_active = true
      ),
      'average_rating', (
        select avg(rt.rating)
        from ratings rt
        where rt.recipe_id = r.id and rt.is_active = true
      ),
      'modifications', (
        select jsonb_agg(
          jsonb_build_object(
            'id', mr.id,
            'type', mr.modification_type,
            'comment', mr.modification_comment,
            'status', mr.status,
            'is_verified', mr.is_verified,
            'created_at', mr.created_at
          )
        )
        from modified_recipes mr
        where mr.parent_recipe_id = r.id and mr.status = 'PUBLISHED'
      )
    )
    from recipes r
    join users u on r.user_id = u.id
    where r.id = recipe_id and u.is_active = true;
$$;

comment on function get_recipe_details is 'Get detailed information about a recipe including ratings and modifications';

-- create function to search recipes based on ingredients and preferences
create or replace function search_recipes(
  search_term text default null,
  diet_type diet_type_enum default null,
  excluded_ingredients jsonb default null,
  min_rating integer default null
)
returns setof recipes_public_view
security definer
language sql
as $$
  select rpv.*
  from recipes_public_view rpv
  where 
    (search_term is null or rpv.title ilike '%' || search_term || '%')
    and (diet_type is null or exists (
      select 1
      from recipes r
      where r.id = rpv.id
      and exists (
        select 1
        from modified_recipes mr
        where mr.parent_recipe_id = r.id
        and mr.modification_type = 'DIET_ADAPTATION'
        and mr.status = 'PUBLISHED'
      )
    ))
    and (excluded_ingredients is null or not exists (
      select 1
      from recipes r, jsonb_array_elements(r.ingredients) as ingredient
      where r.id = rpv.id
      and (ingredient->>'name')::text in (
        select jsonb_array_elements_text(excluded_ingredients)
      )
    ))
    and (min_rating is null or rpv.average_rating >= min_rating)
  order by 
    rpv.average_rating desc nulls last,
    rpv.created_at desc;
$$;

comment on function search_recipes is 'Search recipes based on various criteria including diet preferences';

-- create function to add a rating to a recipe
create or replace function add_recipe_rating(
  p_recipe_id uuid,
  p_rating integer,
  p_comment text default null
)
returns uuid
security definer
language plpgsql
as $$
declare
  new_rating_id uuid;
begin
  -- verify user is authenticated
  if auth.uid() is null then
    raise exception 'User must be authenticated to rate recipes';
  end if;
  
  -- verify rating is within valid range
  if p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  
  -- insert the rating
  insert into ratings (
    user_id,
    recipe_id,
    rating,
    comment
  ) values (
    auth.uid(),
    p_recipe_id,
    p_rating,
    p_comment
  )
  returning id into new_rating_id;
  
  return new_rating_id;
end;
$$;

comment on function add_recipe_rating is 'Add a rating to a recipe with optional comment'; 