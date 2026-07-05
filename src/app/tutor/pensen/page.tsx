// Offene Pensen — Umkreissuche mit Filterleiste (Client-Feed).

import { requirePageUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { PensenFeed } from "@/components/tutor/PensenFeed";

export const metadata = { title: "Offene Pensen" };

export default async function PensenPage() {
  const user = await requirePageUser("TUTOR");

  return (
    <div>
      <PageHeader
        title="Offene Pensen"
        subtitle="Nachhilfe-Anfragen in deinem Umkreis — bewirb dich direkt auf passende Pensen."
      />
      <PensenFeed defaultRadius={user.radiusKm} />
    </div>
  );
}
