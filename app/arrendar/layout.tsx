import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arrendar Imóveis | Golden Jinx",
  description:
    "Consulte imóveis Golden Jinx disponíveis para arrendamento, preparados para oferecer qualidade, funcionalidade e conforto.",
  alternates: { canonical: "/arrendar" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Arrendar Imóveis | Golden Jinx",
    description:
      "Imóveis Golden Jinx disponíveis para arrendamento.",
    url: "/arrendar",
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
};

export default function ArrendarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
