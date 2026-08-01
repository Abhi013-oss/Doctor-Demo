import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require doctor/admin authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/appointments",
  "/patients",
  "/messages",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if requested path starts with any protected route prefix
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const adminSession = request.cookies.get("doctor_admin_session")?.value;
    const sbAccessToken = request.cookies.get("sb-access-token")?.value;

    const isAuthenticated = Boolean(adminSession || sbAccessToken);

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and tries to visit /login, redirect to /dashboard
  if (pathname === "/login") {
    const adminSession = request.cookies.get("doctor_admin_session")?.value;
    const sbAccessToken = request.cookies.get("sb-access-token")?.value;
    if (adminSession || sbAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/appointments/:path*",
    "/patients/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/login",
  ],
};
