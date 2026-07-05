// Sitemap: statische Seiten + komplette Programmatic-SEO-Struktur
// (/nachhilfe, [fach], [fach]/[stufe], [fach]/[stufe]/[ort] fuer SEO-Staedte).

import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { SUBJECTS, LEVELS, SEO_CITY_SLUGS } from "@/lib/subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.baseUrl.replace(/\/$/, "");
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/nachhilfe`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/anfrage`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fuer-tutoren`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const subject of SUBJECTS) {
    entries.push({
      url: `${base}/nachhilfe/${subject.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const level of LEVELS) {
      entries.push({
        url: `${base}/nachhilfe/${subject.slug}/${level.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const citySlug of SEO_CITY_SLUGS) {
        entries.push({
          url: `${base}/nachhilfe/${subject.slug}/${level.slug}/${citySlug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
