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
  icons: {
    icon: [
      {
        url: "/golden-jinx-icon-v7.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/golden-jinx-icon-v7.svg",
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
  founder: {
    "@type": "Person",
    "@id": "https://luiscastanheira.com/#person",
    name: "Luís Castanheira",
    url: "https://luiscastanheira.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
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
