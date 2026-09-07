import type { MetadataRoute } from "next";

const baseUrl = "https://luiscastanheira.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${baseUrl}/artigos`,
      lastModified: new Date("2026-09-07T23:10:00+01:00"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/artigos/controlar-custos-remodelacao`,
      lastModified: new Date("2026-09-07T23:10:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/artigos/o-que-analisar-antes-de-remodelar`,
      lastModified: new Date("2026-09-07T23:10:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/artigos/valorizacao-comeca-antes-da-obra`,
      lastModified: new Date("2026-09-07T23:10:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.8
    }
  ];
}
