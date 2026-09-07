import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const siteUrl = (
  process.env.URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://goldenjinx.com"
).replace(/\/$/, "");

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

const organizationSchema = {
  "@context": "https://schema.org",
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
    "@type": "Person",
    "@id": "https://luiscastanheira.com/#person",
    name: "Luís Castanheira",
    url: "https://luiscastanheira.com",
    sameAs: [
      "https://www.linkedin.com/in/luiscastanheira/",
    ],
    jobTitle: "Sócio-Gerente",
  },
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
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
