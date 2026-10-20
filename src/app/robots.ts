import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:43127";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
