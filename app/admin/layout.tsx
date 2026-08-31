import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área reservada | Golden Jinx",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
