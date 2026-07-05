// Tutor-Profil: Kontakt, Standort, Radius, Fächer, Bio, IBAN.

import { requirePageUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { ProfileForm } from "@/components/tutor/ProfileForm";

export const metadata = { title: "Profil" };

function parseSubjectSlugs(raw: string): string[] {
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export default async function ProfilPage() {
  const user = await requirePageUser("TUTOR");

  return (
    <div>
      <PageHeader
        title="Profil"
        subtitle="Deine Angaben für Umkreissuche, Matching und Auszahlung."
      />
      <ProfileForm
        name={user.name}
        email={user.email}
        initial={{
          phone: user.phone ?? "",
          street: user.street ?? "",
          plz: user.plz ?? "",
          city: user.city ?? "",
          radiusKm: user.radiusKm,
          subjects: parseSubjectSlugs(user.subjects),
          bio: user.bio ?? "",
          iban: user.iban ?? "",
        }}
      />
    </div>
  );
}
