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
  const blocked = ["/admin", "/admin/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: blocked },
      { userAgent: "Googlebot", allow: "/", disallow: blocked },
      { userAgent: "Bingbot", allow: "/", disallow: blocked },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: blocked },
      { userAgent: "ChatGPT-User", allow: "/", disallow: blocked },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
