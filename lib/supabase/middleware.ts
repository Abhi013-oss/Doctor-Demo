import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-supabase-project-id.supabase.co"
);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const pathname = request.nextUrl.pathname;

  // Static assets & API route exemption
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return response;
  }

  const isPublicAuthRoute = pathname === "/login" || pathname === "/forgot-password";

  let isAuthenticated = false;

  // Check Supabase session via cookie if Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });

    const token = request.cookies.get("sb-access-token")?.value || request.cookies.get("doctor_admin_session")?.value;
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      if (data?.user) {
        isAuthenticated = true;
      }
    }
  }

  // Fallback session check (cookie set during login for demo/dev mode persistence)
  const fallbackSession = request.cookies.get("doctor_admin_session")?.value;
  if (fallbackSession === "active" || fallbackSession?.length! > 5) {
    isAuthenticated = true;
  }

  // Unauthenticated user attempting to access protected route -> Redirect to /login
  if (!isAuthenticated && !isPublicAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user attempting to access /login or /forgot-password -> Redirect to /dashboard
  if (isAuthenticated && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
