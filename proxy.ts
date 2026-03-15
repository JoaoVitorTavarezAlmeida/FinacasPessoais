import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AUTH_ROUTE,
  PROTECTED_ROUTES,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  return response;
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const databaseEnabled = Boolean(process.env.DATABASE_URL);

  if (!databaseEnabled) {
    return applySecurityHeaders(response);
  }

  const pathname = request.nextUrl.pathname;
  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !hasSessionCookie) {
    const redirectUrl = new URL(AUTH_ROUTE, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
