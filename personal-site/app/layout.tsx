import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://luiscastanheira.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Luís Castanheira | Economista e Empresário",
  description:
    "Site oficial de Luís Castanheira, economista, empresário e sócio-gerente da Golden Jinx, com atividade em construção, remodelação e valorização imobiliária.",
  keywords: [
    "Luís Castanheira",
    "Luis Castanheira",
    "Golden Jinx",
    "economista",
    "empresário",
    "sócio-gerente",
    "construção",
    "remodelação",
    "valorização imobiliária"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Luís Castanheira | Economista e Empresário",
    description:
      "Economista, empresário e sócio-gerente da Golden Jinx. Rigor económico aplicado à construção, remodelação e valorização imobiliária.",
    url: siteUrl,
    type: "profile",
    locale: "pt_PT",
    siteName: "Luís Castanheira"
  },
  robots: { index: true, follow: true }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Luís Castanheira",
  alternateName: "Luis Castanheira",
  url: siteUrl,
  jobTitle: "Economista, empresário e sócio-gerente da Golden Jinx",
  description:
    "Economista e empresário com atividade em construção, remodelação e valorização imobiliária.",
  worksFor: {
    "@type": "Organization",
    "@id": "https://goldenjinx.com/#organization",
    name: "Golden Jinx",
    url: "https://goldenjinx.com",
    slogan: "Sparkling Solutions"
  },
  sameAs: [
    "https://goldenjinx.com/luis-castanheira"
  ],
  knowsAbout: [
    "Economia",
    "Construção",
    "Remodelação",
    "Valorização imobiliária",
    "Gestão de projetos",
    "Controlo de custos"
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c")
          }}
        />
        {children}
      </body>
    </html>
  );
}
