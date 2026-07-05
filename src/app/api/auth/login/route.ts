import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, verifyLogin } from "@/lib/auth";
import type { Role } from "@/lib/types";

const loginSchema = z.object({
  email: z.string().min(3).max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-Mail und Passwort angeben." }, { status: 400 });
  }

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
  }

  await setSessionCookie(user.id, user.role as Role);
  return NextResponse.json({
    ok: true,
    redirect: user.role === "ADMIN" ? "/admin" : "/tutor",
  });
}
