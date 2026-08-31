import type { MetadataRoute } from "next";

function getSiteUrl() {
  return (process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/comprar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/arrendar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/projetos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contactos`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/avaliar-imovel`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/luis-filipe-madeira-castanheira`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/artigos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/artigos/avaliar-potencial-valorizacao-imovel`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
