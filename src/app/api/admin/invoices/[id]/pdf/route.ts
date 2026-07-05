// PDF-Download einer Rechnung (Admin-only). Gehoert der Billing-Engine.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiUser } from "@/lib/auth";
import { generateInvoicePdf } from "@/lib/billing";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const user = await requireApiUser("ADMIN");
  if (!user) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, number: true },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Rechnung nicht gefunden." }, { status: 404 });
  }

  const buffer = await generateInvoicePdf(invoice.id);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="Rechnung-${invoice.number}.pdf"`,
      "content-length": String(buffer.length),
    },
  });
}
