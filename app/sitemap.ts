import type { MetadataRoute } from "next";

function getSiteUrl() {
  return (
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://goldenjinx.com"
  ).replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/comprar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/arrendar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/projetos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contactos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/avaliar-imovel`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/luis-castanheira`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/artigos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/artigos/avaliar-potencial-valorizacao-imovel`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
