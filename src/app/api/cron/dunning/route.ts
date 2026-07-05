// Cron-Endpoint fuer den Mahnlauf.
// Auth: ?key= ODER Header x-cron-key === config.cronSecret ODER eingeloggter Admin.

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { requireApiUser } from "@/lib/auth";
import { runDunning } from "@/lib/dunning";

async function handle(req: NextRequest): Promise<NextResponse> {
  const key = req.nextUrl.searchParams.get("key") ?? req.headers.get("x-cron-key");
  let authorized = key !== null && key === config.cronSecret;

  if (!authorized) {
    const user = await requireApiUser("ADMIN");
    authorized = user !== null;
  }
  if (!authorized) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const result = await runDunning();
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
