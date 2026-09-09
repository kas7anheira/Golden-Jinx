import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://luiscastanheira.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Luís Castanheira | Economista e Sócio-Gerente da Golden Jinx",
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
  authors: [{ name: "Luís Castanheira", url: siteUrl }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg"
  },
  openGraph: {
    title: "Luís Castanheira | Economista e Sócio-Gerente da Golden Jinx",
    description:
      "Economista, empresário e sócio-gerente da Golden Jinx. Rigor económico aplicado à construção, remodelação e valorização imobiliária.",
    url: siteUrl,
    type: "profile",
    locale: "pt_PT",
    siteName: "Luís Castanheira",
    images: [
      {
        url: "/luis-castanheira-profissional.png",
        width: 1254,
        height: 1254,
        alt: "Retrato profissional de Luís Castanheira"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Luís Castanheira | Economista e Sócio-Gerente da Golden Jinx",
    description:
      "Economista, empresário e sócio-gerente da Golden Jinx, com atividade em construção, remodelação e valorização imobiliária.",
    images: ["/luis-castanheira-profissional.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Luís Castanheira",
      inLanguage: "pt-PT",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile-page`,
      url: siteUrl,
      name: "Perfil profissional de Luís Castanheira",
      description:
        "Perfil profissional de Luís Castanheira, economista, empresário e sócio-gerente da Golden Jinx.",
      inLanguage: "pt-PT",
      dateModified: "2026-09-09T22:55:00+01:00",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Luís Castanheira",
      alternateName: "Luis Castanheira",
      url: siteUrl,
      mainEntityOfPage: {
        "@id": `${siteUrl}/#profile-page`,
      },
      image: `${siteUrl}/luis-castanheira-profissional.png`,
      jobTitle: "Economista, empresário e sócio-gerente da Golden Jinx",
      description:
        "Economista e empresário com atividade em construção, remodelação e valorização imobiliária.",
      worksFor: {
        "@type": "Organization",
        "@id": "https://goldenjinx.com/#organization",
        name: "Golden Jinx",
        url: "https://goldenjinx.com",
        slogan: "Sparkling Solutions",
      },
      sameAs: [
        "https://goldenjinx.com/luis-castanheira",
        "https://www.linkedin.com/in/luiscastanheira/",
      ],
      knowsAbout: [
        "Economia",
        "Construção",
        "Remodelação",
        "Valorização imobiliária",
        "Gestão de projetos",
        "Análise económica",
        "Controlo de custos",
      ],
      subjectOf: [
        {
          "@type": "CollectionPage",
          url: `${siteUrl}/artigos`,
          name: "Artigos de Luís Castanheira",
        },
        {
          "@type": "ProfilePage",
          url: "https://goldenjinx.com/luis-castanheira",
          name: "Perfil de Luís Castanheira na Golden Jinx",
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
          }}
        />
        {children}
      </body>
    </html>
  );
}
