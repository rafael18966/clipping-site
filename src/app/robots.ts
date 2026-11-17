import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/login", "/signup", "/mot-de-passe-oublie", "/nouveau-mot-de-passe", "/auth"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
