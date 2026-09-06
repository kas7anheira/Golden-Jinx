import type { MetadataRoute } from "next";

function getSiteUrl() {
  return (
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://goldenjinx.com"
  ).replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
