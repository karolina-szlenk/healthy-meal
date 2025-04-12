-- migration: 20250412113733_row_level_security_policies.sql
-- description: sets up row level security policies for all tables
-- creates granular policies for each operation (select, insert, update, delete)
-- for both anon and authenticated roles

-- users table policies
-- select: authenticated users can only view their own profile
create policy "users_select_own" 
on users for select 
to authenticated 
using (auth.uid() = id and is_active = true);

-- select: anon users cannot view any users
create policy "users_select_anon" 
on users for select 
to anon 
using (false);

-- insert: authenticated users can only insert their own profile
create policy "users_insert_own" 
on users for insert 
to authenticated 
with check (auth.uid() = id);

-- insert: anon users cannot insert users
create policy "users_insert_anon" 
on users for insert 
to anon 
with check (false);

-- update: authenticated users can only update their own profile
create policy "users_update_own" 
on users for update 
to authenticated 
using (auth.uid() = id and is_active = true)
with check (auth.uid() = id);

-- update: anon users cannot update users
create policy "users_update_anon" 
on users for update 
to anon 
using (false);

-- delete: authenticated users can only delete their own profile
create policy "users_delete_own" 
on users for delete 
to authenticated 
using (auth.uid() = id and is_active = true);

-- delete: anon users cannot delete users
create policy "users_delete_anon" 
on users for delete 
to anon 
using (false);

-- preferences table policies
-- select: authenticated users can only view their own preferences
create policy "preferences_select_own" 
on preferences for select 
to authenticated 
using (auth.uid() = user_id);

-- select: anon users cannot view any preferences
create policy "preferences_select_anon" 
on preferences for select 
to anon 
using (false);

-- insert: authenticated users can only insert their own preferences
create policy "preferences_insert_own" 
on preferences for insert 
to authenticated 
with check (auth.uid() = user_id);

-- insert: anon users cannot insert preferences
create policy "preferences_insert_anon" 
on preferences for insert 
to anon 
with check (false);

-- update: authenticated users can only update their own preferences
create policy "preferences_update_own" 
on preferences for update 
to authenticated 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- update: anon users cannot update preferences
create policy "preferences_update_anon" 
on preferences for update 
to anon 
using (false);

-- delete: authenticated users can only delete their own preferences
create policy "preferences_delete_own" 
on preferences for delete 
to authenticated 
using (auth.uid() = user_id);

-- delete: anon users cannot delete preferences
create policy "preferences_delete_anon" 
on preferences for delete 
to anon 
using (false);

-- recipes table policies
-- select: authenticated users can view all published recipes
create policy "recipes_select_all" 
on recipes for select 
to authenticated 
using (true);

-- select: anon users can view all published recipes too
create policy "recipes_select_anon" 
on recipes for select 
to anon 
using (true);

-- insert: authenticated users can only insert their own recipes
create policy "recipes_insert_own" 
on recipes for insert 
to authenticated 
with check (auth.uid() = user_id);

-- insert: anon users cannot insert recipes
create policy "recipes_insert_anon" 
on recipes for insert 
to anon 
with check (false);

-- update: authenticated users can only update their own recipes
create policy "recipes_update_own" 
on recipes for update 
to authenticated 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- update: anon users cannot update recipes
create policy "recipes_update_anon" 
on recipes for update 
to anon 
using (false);

-- delete: authenticated users can only delete their own recipes
create policy "recipes_delete_own" 
on recipes for delete 
to authenticated 
using (auth.uid() = user_id);

-- delete: anon users cannot delete recipes
create policy "recipes_delete_anon" 
on recipes for delete 
to anon 
using (false);

-- modified_recipes table policies
-- select: authenticated users can view all modified recipes
create policy "modified_recipes_select_all" 
on modified_recipes for select 
to authenticated 
using (true);

-- select: anon users can view all published modified recipes
create policy "modified_recipes_select_anon" 
on modified_recipes for select 
to anon 
using (status = 'PUBLISHED');

-- insert: authenticated users can insert modified recipes
create policy "modified_recipes_insert_own" 
on modified_recipes for insert 
to authenticated 
with check (true);

-- insert: anon users cannot insert modified recipes
create policy "modified_recipes_insert_anon" 
on modified_recipes for insert 
to anon 
with check (false);

-- update: authenticated users can only update their own modified recipes
-- this requires a join to determine ownership
create policy "modified_recipes_update_own" 
on modified_recipes for update 
to authenticated 
using (exists (
  select 1 from recipes 
  where recipes.id = modified_recipes.parent_recipe_id 
  and recipes.user_id = auth.uid()
))
with check (exists (
  select 1 from recipes 
  where recipes.id = modified_recipes.parent_recipe_id 
  and recipes.user_id = auth.uid()
));

-- update: anon users cannot update modified recipes
create policy "modified_recipes_update_anon" 
on modified_recipes for update 
to anon 
using (false);

-- delete: authenticated users can only delete their own modified recipes
create policy "modified_recipes_delete_own" 
on modified_recipes for delete 
to authenticated 
using (exists (
  select 1 from recipes 
  where recipes.id = modified_recipes.parent_recipe_id 
  and recipes.user_id = auth.uid()
));

-- delete: anon users cannot delete modified recipes
create policy "modified_recipes_delete_anon" 
on modified_recipes for delete 
to anon 
using (false);

-- ratings table policies
-- select: authenticated users can view all ratings
create policy "ratings_select_all" 
on ratings for select 
to authenticated 
using (is_active = true);

-- select: anon users can view all active ratings
create policy "ratings_select_anon" 
on ratings for select 
to anon 
using (is_active = true);

-- insert: authenticated users can insert their own ratings
create policy "ratings_insert_own" 
on ratings for insert 
to authenticated 
with check (auth.uid() = user_id);

-- insert: anon users cannot insert ratings
create policy "ratings_insert_anon" 
on ratings for insert 
to anon 
with check (false);

-- update: authenticated users can only update their own ratings
create policy "ratings_update_own" 
on ratings for update 
to authenticated 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- update: anon users cannot update ratings
create policy "ratings_update_anon" 
on ratings for update 
to anon 
using (false);

-- delete: authenticated users can only delete their own ratings
create policy "ratings_delete_own" 
on ratings for delete 
to authenticated 
using (auth.uid() = user_id);

-- delete: anon users cannot delete ratings
create policy "ratings_delete_anon" 
on ratings for delete 
to anon 
using (false); 