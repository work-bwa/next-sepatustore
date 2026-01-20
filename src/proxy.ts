// proxy.ts (atau middleware.ts)
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  protectedRoutes,
} from "./routes";

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const isApiAuth = pathname.startsWith(apiAuthPrefix);

  // Cek protected routes DULU (sebelum public check)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((path) => pathname.startsWith(path));

  // Public route check - EXCLUDE protected routes
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    (/^\/[^/]+$/.test(pathname) && !isProtectedRoute); // 👈 Exclude protected

  // 1. API Auth - allow
  if (isApiAuth) {
    return NextResponse.next();
  }

  // 2. Auth routes (signin/register) - redirect jika sudah login
  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );
    }
    return NextResponse.next();
  }

  // 3. Protected routes - harus login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(authRoutes[0], request.url));
  }

  // 4. Non-public routes tanpa session - redirect ke login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL(authRoutes[0], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
