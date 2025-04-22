import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return new Response(JSON.stringify({ error: "Nie udało się zalogować." }), { status: 400 });
    }

    // Set cookies to store session tokens
    cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    cookies.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return new Response(JSON.stringify({ user: data.user }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Błąd serwera, spróbuj ponownie później." }), { status: 500 });
  }
};
