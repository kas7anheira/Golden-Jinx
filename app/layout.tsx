import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const siteUrl = (
  process.env.URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://goldenjinx.com"
).replace(/\/$/, "");

const personalUrl = "https://luiscastanheira.com";
const personId = `${personalUrl}/#person`;
const goldenJinxProfileUrl = `${siteUrl}/luis-castanheira`;
const linkedInUrl = "https://www.linkedin.com/in/luiscastanheira/";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golden Jinx | Sparkling Solutions",
  description:
    "Transformamos potencial em brilho. Compra, venda, arrendamento, construção e remodelação de imóveis.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Golden Jinx | Sparkling Solutions",
    description:
      "Transformamos potencial em brilho através da construção, remodelação e valorização imobiliária.",
    url: siteUrl,
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Golden Jinx | Sparkling Solutions",
    description:
      "Construção, remodelação e valorização imobiliária com foco na criação de valor.",
  },
  icons: {
    icon: [
      {
        url: "/golden-jinx-favicon-glow.png",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    shortcut: "/golden-jinx-favicon-glow.png",
  },
  verification: {
    google: "OTQ2lgwaAK0JkD76jFONYumBIKzq5u6fWVqV7LbOnBI",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Golden Jinx",
      url: siteUrl,
      slogan: "Sparkling Solutions",
      description:
        "Empresa portuguesa dedicada à construção, remodelação e valorização imobiliária.",
      email: "info@goldenjinx.pt",
      areaServed: {
        "@type": "Country",
        name: "Portugal",
      },
      employee: {
        "@id": personId,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Golden Jinx",
      inLanguage: "pt-PT",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Luís Castanheira",
      alternateName: "Luis Castanheira",
      url: personalUrl,
      image: `${siteUrl}/luis-castanheira-profissional.png`,
      jobTitle: "Economista, empresário e sócio-gerente da Golden Jinx",
      description:
        "Economista e empresário com atividade em construção, remodelação e valorização imobiliária através da Golden Jinx.",
      worksFor: {
        "@id": `${siteUrl}/#organization`,
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universidade de Évora",
      },
      sameAs: [
        goldenJinxProfileUrl,
        linkedInUrl,
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
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
