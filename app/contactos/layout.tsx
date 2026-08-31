import { Suspense } from "react";

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
