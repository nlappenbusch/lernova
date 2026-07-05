// Admin-Layout: erzwingt ADMIN-Login und rendert die Sidebar-Shell.

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requirePageUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requirePageUser("ADMIN");
  return <AdminShell userName={user.name}>{children}</AdminShell>;
}
