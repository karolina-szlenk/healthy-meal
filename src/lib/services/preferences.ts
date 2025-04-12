import { supabaseClient } from "../../db/supabase.client";

type SupabaseClient = typeof supabaseClient;

import type { CreatePreferencesCommand, UpdatePreferencesCommand, PreferencesDTO } from "../../types";

// Implementacja pobierania preferencji użytkownika
export async function getPreferences(supabase: SupabaseClient, userId: string): Promise<PreferencesDTO | null> {
  const { data, error } = await supabase.from("preferences").select("*").eq("user_id", userId).single();
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
  const payload = {
    user_id: userId,
    diet_type: command.diet_type,
    calorie_target: command.calorie_target,
    allergies: command.allergies ?? null,
    excluded_ingredients: command.excluded_ingredients ?? null,
  };
  const { data, error } = await supabase.from("preferences").insert(payload).select().single();
  if (error) {
    throw new Error("Error creating preferences: " + error.message);
  }
  return data;
}

// Implementacja aktualizacji preferencji użytkownika
export async function updatePreferences(
  supabase: SupabaseClient,
  userId: string,
  command: UpdatePreferencesCommand
): Promise<PreferencesDTO> {
  const { data, error } = await supabase.from("preferences").update(command).eq("user_id", userId).select().single();
  if (error) {
    throw new Error("Error updating preferences: " + error.message);
  }
  return data;
}
