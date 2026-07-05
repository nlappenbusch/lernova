// Tutor:innen: Übersicht mit Aktiv-Toggle + Formular zum Anlegen.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSubject } from "@/lib/subjects";
import {
  Badge,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { TutorActiveToggle } from "@/components/admin/TutorActiveToggle";
import { TutorCreateForm } from "@/components/admin/TutorCreateForm";
import { parseSubjectSlugs } from "@/components/admin/utils";

export default async function TutorenPage() {
  const tutors = await prisma.user.findMany({
    where: { role: "TUTOR" },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { contracts: { where: { status: "ACTIVE" } } } },
    },
  });

  return (
    <>
      <PageHeader title="Tutor:innen" subtitle={`${tutors.length} Tutor:innen im System`} />

      <div className="space-y-6">
        {tutors.length === 0 ? (
          <EmptyState
            title="Noch keine Tutor:innen"
            description="Lege unten die erste Tutor:in an."
          />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Name</TH>
                <TH>E-Mail</TH>
                <TH>Ort</TH>
                <TH className="text-right">Radius</TH>
                <TH>Fächer</TH>
                <TH className="text-right">Aktive Verträge</TH>
                <TH>Aktiv</TH>
                <TH />
              </tr>
            </THead>
            <TBody>
              {tutors.map((t) => {
                const subjects = parseSubjectSlugs(t.subjects);
                return (
                  <TR key={t.id}>
                    <TD>
                      <Link
                        href={`/admin/tutoren/${t.id}`}
                        className="font-medium text-ink hover:text-accent"
                      >
                        {t.name}
                      </Link>
                    </TD>
                    <TD>{t.email}</TD>
                    <TD className="whitespace-nowrap">
                      {t.plz} {t.city}
                    </TD>
                    <TD className="text-right tabular-nums">{t.radiusKm} km</TD>
                    <TD>
                      {subjects.length === 0 ? (
                        <span className="text-faint">—</span>
                      ) : (
                        <span className="flex flex-wrap gap-1">
                          {subjects.slice(0, 3).map((slug) => (
                            <Badge key={slug} tone="teal">
                              {getSubject(slug)?.name ?? slug}
                            </Badge>
                          ))}
                          {subjects.length > 3 ? (
                            <Badge>+{subjects.length - 3}</Badge>
                          ) : null}
                        </span>
                      )}
                    </TD>
                    <TD className="text-right tabular-nums">{t._count.contracts}</TD>
                    <TD>
                      <TutorActiveToggle tutorId={t.id} active={t.active} />
                    </TD>
                    <TD className="text-right">
                      <ButtonLink href={`/admin/tutoren/${t.id}`} variant="ghost" size="sm">
                        Detail
                      </ButtonLink>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}

        <Card>
          <CardHeader
            title="Neue:r Tutor:in"
            subtitle="Legt einen TUTOR-Account mit Start-Passwort an; Koordinaten werden aus der PLZ geokodiert."
          />
          <CardBody>
            <TutorCreateForm />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
