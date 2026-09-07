import type { Metadata } from "next";

import { supabase } from "@/lib/supabase";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("properties")
    .select("title,description,cover_image,location,status,property_type")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) {
    return {
      title: "Imóvel | Golden Jinx",
      robots: { index: false, follow: true },
    };
  }

  const description =
    data.description?.trim() ||
    `${data.property_type} em ${data.location}, disponível para ${data.status.toLowerCase()} através da Golden Jinx.`;

  return {
    title: `${data.title} | Golden Jinx`,
    description,
    alternates: {
      canonical: `/imoveis/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${data.title} | Golden Jinx`,
      description,
      url: `/imoveis/${slug}`,
      siteName: "Golden Jinx",
      locale: "pt_PT",
      type: "website",
      images: data.cover_image
        ? [
            {
              url: data.cover_image,
              alt: data.title,
            },
          ]
        : undefined,
    },
  };
}

export default function PropertyLayout({
  children,
}: LayoutProps) {
  return children;
}
