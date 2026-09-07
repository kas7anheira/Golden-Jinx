import type { MetadataRoute } from "next";

import { supabase } from "@/lib/supabase";

function getSiteUrl() {
  return (
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://goldenjinx.com"
  ).replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/comprar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/arrendar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/projetos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contactos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/avaliar-imovel`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/luis-castanheira`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/artigos`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${baseUrl}/artigos/avaliar-potencial-valorizacao-imovel`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const { data, error } = await supabase
    .from("properties")
    .select("slug")
    .eq("published", true);

  if (error || !data) {
    return staticPages;
  }

  const propertyPages: MetadataRoute.Sitemap = data
    .filter((property) => Boolean(property.slug))
    .map((property) => ({
      url: `${baseUrl}/imoveis/${property.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...propertyPages];
}
