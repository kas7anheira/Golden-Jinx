import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contactos | Golden Jinx",
  description:
    "Contacte a Golden Jinx para construção, remodelação, valorização imobiliária, imóveis disponíveis ou apresentação de oportunidades.",
  alternates: { canonical: "/contactos" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contactos | Golden Jinx",
    description:
      "Entre em contacto com a Golden Jinx.",
    url: "/contactos",
    siteName: "Golden Jinx",
    locale: "pt_PT",
    type: "website",
  },
};

export default function ContactosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#0d0d0d",
            color: "white",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ color: "#C8A24A" }}>A carregar Golden Jinx...</div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
