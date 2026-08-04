import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const isProtectedRoute =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/appointments" ||
      pathname.startsWith("/appointments/") ||
      pathname === "/patients" ||
      pathname.startsWith("/patients/") ||
      pathname === "/messages" ||
      pathname.startsWith("/messages/") ||
      pathname === "/settings" ||
      pathname.startsWith("/settings/");

    if (isProtectedRoute) {
      const adminSession = request.cookies.get("doctor_admin_session")?.value;
      const sbAccessToken = request.cookies.get("sb-access-token")?.value;

      if (!adminSession && !sbAccessToken) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.warn("Middleware error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/appointments/:path*",
    "/patients/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};
