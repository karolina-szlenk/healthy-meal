import { z } from "zod";
import type { APIRoute } from "astro";
import type { CreatePreferencesCommand, UpdatePreferencesCommand, PreferencesDTO } from "../../types";
import { getPreferences, createPreferences, updatePreferences } from "../../lib/services/preferences";
import { supabaseClient } from "../../db/supabase.client";
type SupabaseClient = typeof supabaseClient;

interface LocalsWithSupabase {
  supabase: SupabaseClient;
  user: { id: string };
}

export const prerender = false;

const createPreferencesSchema = z.object({
  diet_type: z.enum(["VEGETARIAN", "KETOGENIC", "PESCATARIAN"]),
  calorie_target: z.number(),
  allergies: z.optional(z.any()),
  excluded_ingredients: z.optional(z.any()),
});

const updatePreferencesSchema = z.object({
  diet_type: z.enum(["VEGETARIAN", "KETOGENIC", "PESCATARIAN"]).optional(),
  calorie_target: z.number().optional(),
  allergies: z.optional(z.any()),
  excluded_ingredients: z.optional(z.any()),
});

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { user, supabase } = locals as LocalsWithSupabase;
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const preferences: PreferencesDTO | null = await getPreferences(supabase, user.id);
    if (!preferences) {
      return new Response(
        JSON.stringify({
          user_id: user.id,
          diet_type: null,
          calorie_target: null,
          allergies: null,
          excluded_ingredients: null,
          initialized: false,
        }),
        { status: 200 }
      );
    }
    return new Response(JSON.stringify({ ...preferences, initialized: true }), { status: 200 });
  } catch (err) {
    console.error("GET /api/preferences error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { user, supabase } = locals as LocalsWithSupabase;
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const body = await request.json();
    const parsed = createPreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors }), { status: 400 });
    }
    const command: CreatePreferencesCommand = parsed.data;
    const newPreferences: PreferencesDTO = await createPreferences(supabase, user.id, command);
    return new Response(JSON.stringify(newPreferences), { status: 201 });
  } catch (err) {
    console.error("POST /api/preferences error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const { user, supabase } = locals as LocalsWithSupabase;
    console.log("PUT /api/preferences - user object:", user);

    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    console.log("PUT /api/preferences - user ID:", user.id);

    const body = await request.json();
    const parsed = updatePreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors }), { status: 400 });
    }
    const command: UpdatePreferencesCommand = parsed.data;
    const updatedPreferences: PreferencesDTO = await updatePreferences(supabase, user.id, command);
    return new Response(JSON.stringify(updatedPreferences), { status: 200 });
  } catch (err) {
    console.error("PUT /api/preferences error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
