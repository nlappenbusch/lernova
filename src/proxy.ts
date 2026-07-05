import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "lernova_session";

/**
 * Leichte Vorab-Pruefung: ohne Session-Cookie kein Zugriff auf /tutor & /admin.
 * Die kryptografische Verifikation + Rollenpruefung passiert serverseitig in
 * den Layouts (requirePageUser) und API-Routen (requireApiUser).
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/tutor/:path*", "/admin/:path*"],
};
