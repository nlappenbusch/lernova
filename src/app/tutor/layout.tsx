import type { Metadata } from "next";
import { requirePageUser } from "@/lib/auth";
import { TutorShell } from "@/components/tutor/TutorShell";

export const metadata: Metadata = {
  title: "Tutor-Portal",
  robots: { index: false, follow: false },
};

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser("TUTOR");
  return <TutorShell userName={user.name}>{children}</TutorShell>;
}
