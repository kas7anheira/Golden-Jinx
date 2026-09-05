import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const siteUrl = (
  process.env.URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://golden-jinx.netlify.app"
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
    "Transformamos potencial em brilho. Compra, venda, arrendamento e remodelação de imóveis.",
  icons: {
    icon: [
      {
        url: "/golden-jinx-favicon.png?v=8",
        type: "image/png",
        sizes: "128x128",
      },
    ],
    shortcut: "/golden-jinx-favicon.png?v=8",
    apple: "/golden-jinx-favicon.png?v=8",
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
    "Empresa portuguesa dedicada à construção, remodelação, investimento e valorização imobiliária.",
  email: "info@goldenjinx.pt",
  areaServed: {
    "@type": "Country",
    name: "Portugal",
  },
  founder: {
    "@type": "Person",
    "@id": `${siteUrl}/luis-filipe-madeira-castanheira#person`,
    name: "Luís Filipe Madeira Castanheira",
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
