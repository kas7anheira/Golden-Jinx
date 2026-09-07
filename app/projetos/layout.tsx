import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos e Transformações | Golden Jinx",
  description:
    "Conheça projetos Golden Jinx de construção, remodelação e transformação imobiliária, do potencial inicial ao resultado final.",
  alternates: { canonical: "/projetos" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Projetos e Transformações | Golden Jinx",
    description:
      "Construção, remodelação e transformação imobiliária pela Golden Jinx.",
    url: "/projetos",
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
};

export default function ProjetosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
