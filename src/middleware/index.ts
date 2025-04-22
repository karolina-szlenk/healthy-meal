import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

// Define the User type based on what's needed in the app
interface User {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  aud?: string;
}

// Add to the global Astro namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user: User | null;
    }
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Create Supabase server client with cookies
  const supabase = createSupabaseServerInstance({
    headers: context.request.headers,
    cookies: context.cookies,
  });
  context.locals.supabase = supabase;

  // Get user from session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  context.locals.user = user;

  return next();
});
