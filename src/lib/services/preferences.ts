import { supabaseClient } from "../../db/supabase.client";

type SupabaseClient = typeof supabaseClient;

import type { CreatePreferencesCommand, UpdatePreferencesCommand, PreferencesDTO } from "../../types";

// Implementacja pobierania preferencji użytkownika
export async function getPreferences(supabase: SupabaseClient, userId: string): Promise<PreferencesDTO | null> {
  const { data, error } = await supabase.from("preferences").select("*").eq("user_id", userId).maybeSingle();
  if (error) {
    throw new Error("Error fetching preferences: " + error.message);
  }
  return data;
}

// Implementacja tworzenia nowych preferencji użytkownika
export async function createPreferences(
  supabase: SupabaseClient,
  userId: string,
  command: CreatePreferencesCommand
): Promise<PreferencesDTO> {
  // Najpierw sprawdzamy, czy użytkownik istnieje w tabeli users
  const { data: user } = await supabase.from("users").select("id").eq("id", userId).maybeSingle();

  // Jeśli nie znaleziono użytkownika w tabeli public.users, sprawdźmy czy istnieje w auth.users
  if (!user) {
    console.log("User not found in public.users table. Checking auth user...");

    // Pobierz informacje o użytkowniku z auth.users
    const { data: authUser } = await supabase.auth.getUser();

    if (authUser && authUser.user) {
      console.log("Found auth user. Creating user in public.users table...");

      // Utwórz użytkownika w tabeli public.users
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: authUser.user.email || `user_${userId.substring(0, 8)}@example.com`, // Fallback
          username: `user_${userId.substring(0, 8)}`, // Tymczasowa nazwa użytkownika (tylko małe litery, cyfry i podkreślniki)
          hashed_password: "placeholder_hash", // Placeholder, bo używamy auth Supabase
        })
        .select()
        .single();

      if (createUserError) {
        console.error("Error creating user:", createUserError);
        throw new Error("Failed to create user record: " + createUserError.message);
      }

      console.log("User created successfully:", newUser);
    } else {
      throw new Error(`User with ID ${userId} does not exist.`);
    }
  }

  // Teraz możemy utworzyć preferencje
  const payload = {
    user_id: userId,
    diet_type: command.diet_type,
    calorie_target: command.calorie_target,
    allergies: command.allergies ?? null,
    excluded_ingredients: command.excluded_ingredients ?? null,
  };

  console.log("Creating preferences for user:", userId, "with payload:", payload);

  const { data, error } = await supabase.from("preferences").insert(payload).select().single();
  if (error) {
    throw new Error("Error creating preferences: " + error.message);
  }
  return data as PreferencesDTO;
}

// Implementacja aktualizacji preferencji użytkownika
export async function updatePreferences(
  supabase: SupabaseClient,
  userId: string,
  command: UpdatePreferencesCommand
): Promise<PreferencesDTO> {
  // Najpierw sprawdźmy, czy preferencje istnieją
  const { data: existingPrefs } = await supabase.from("preferences").select("*").eq("user_id", userId).maybeSingle();

  if (!existingPrefs) {
    // Jeśli preferencje nie istnieją, tworzymy nowe z podanymi danymi
    return createPreferences(supabase, userId, command as CreatePreferencesCommand);
  }

  // Jeśli preferencje istnieją, aktualizujemy je
  const { data, error } = await supabase.from("preferences").update(command).eq("user_id", userId).select().single();

  if (error) {
    throw new Error("Error updating preferences: " + error.message);
  }
  return data;
}
