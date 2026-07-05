// Session-Handling: HMAC-signierte Cookies (kein externer Auth-Provider noetig).
// NUR serverseitig verwenden (Server Components, Route Handler, Server Actions).

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { config } from "./config";
import type { Role, SessionPayload } from "./types";

export const SESSION_COOKIE = "lernova_session";
const SESSION_DAYS = 30;

function sign(data: string): string {
  return createHmac("sha256", config.sessionSecret).update(data).digest("base64url");
}

export function createSessionToken(uid: string, role: Role): string {
  const payload: SessionPayload = {
    uid,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.uid || !payload.role) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(uid: string, role: Role): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(uid, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Laedt den eingeloggten User frisch aus der DB (active-Check inklusive). */
export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.uid } });
  if (!user || !user.active) return null;
  return user;
}

/**
 * Fuer Seiten/Layouts: erzwingt Login (+ optional Rolle), sonst Redirect.
 * Gibt den DB-User zurueck.
 */
export async function requirePageUser(role?: Role) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (role && user.role !== role) {
    redirect(user.role === "ADMIN" ? "/admin" : "/tutor");
  }
  return user;
}

/**
 * Fuer API-Routen: gibt User oder null zurueck (Caller antwortet mit 401/403).
 */
export async function requireApiUser(role?: Role) {
  const user = await getSessionUser();
  if (!user) return null;
  if (role && user.role !== role) return null;
  return user;
}

/** Login-Pruefung. Gibt User bei Erfolg zurueck, sonst null. */
export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
