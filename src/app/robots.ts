// robots.txt: alles erlaubt ausser Portale & API; Verweis auf die Sitemap.

import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = config.baseUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/tutor", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
