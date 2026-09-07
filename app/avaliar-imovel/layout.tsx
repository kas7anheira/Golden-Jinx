import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avaliar Imóvel | Golden Jinx",
  description:
    "Apresente o seu imóvel ou terreno à Golden Jinx para uma análise do seu potencial de transformação e valorização.",
  alternates: { canonical: "/avaliar-imovel" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Avaliar Imóvel | Golden Jinx",
    description:
      "Apresente o seu imóvel ou terreno para análise de potencial pela Golden Jinx.",
    url: "/avaliar-imovel",
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
};

export default function AvaliarImovelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
