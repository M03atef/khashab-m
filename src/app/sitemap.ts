import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:43127";
  return [
    {
      url: base.replace(/\/$/, ""),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
