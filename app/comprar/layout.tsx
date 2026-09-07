import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprar Imóveis | Golden Jinx",
  description:
    "Descubra imóveis Golden Jinx disponíveis para compra, selecionados, transformados ou desenvolvidos com foco em qualidade e valorização.",
  alternates: { canonical: "/comprar" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Comprar Imóveis | Golden Jinx",
    description:
      "Imóveis Golden Jinx disponíveis para compra, com foco em qualidade, transformação e valorização.",
    url: "/comprar",
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
};

export default function ComprarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
