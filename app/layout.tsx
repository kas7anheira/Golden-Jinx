import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

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
  title: "Golden Jinx | Sparkling Solutions",
  description:
    "Transformamos potencial em brilho. Compra, venda, arrendamento e remodelação de imóveis.",
  verification: {
    google: "OTQ2lgwaAK0JkD76jFONYumBIKzq5u6fWVqV7LbOnBI",
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
        {children}
      </body>
    </html>
  );
}