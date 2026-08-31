import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Artigos de Luís Filipe Madeira Castanheira | Golden Jinx",
  description:
    "Artigos de Luís Filipe Madeira Castanheira sobre investimento imobiliário, remodelação, custos e valorização de imóveis.",
  robots: { index: true, follow: true },
};

const articles = [
  {
    title: "Como avaliar o potencial de valorização de um imóvel antes de comprar",
    href: "/artigos/avaliar-potencial-valorizacao-imovel",
    excerpt:
      "Uma análise prática sobre valor de saída, custos de intervenção, risco e estratégia antes da compra.",
  },
];

export default function ArtigosPage() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "white",
          padding: "clamp(130px, 16vw, 180px) 24px 90px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <p
            style={{
              color: "#C8A24A",
              textTransform: "uppercase",
              letterSpacing: 4,
              fontSize: 11,
              marginBottom: 22,
            }}
          >
            Golden Jinx · Ideias e análise
          </p>
          <h1
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontWeight: 500,
              lineHeight: 1,
              margin: 0,
            }}
          >
            Artigos de Luís Filipe Madeira Castanheira
          </h1>
          <p
            style={{
              color: "#aaa",
              lineHeight: 1.85,
              maxWidth: 760,
              marginTop: 30,
            }}
          >
            Conteúdos sobre economia aplicada ao imobiliário, investimento,
            remodelação, valorização e gestão de projetos.
          </p>

          <div style={{ marginTop: 62, display: "grid", gap: 22 }}>
            {articles.map((article) => (
              <article
                key={article.href}
                style={{
                  borderTop: "1px solid rgba(255,255,255,.14)",
                  padding: "30px 0 12px",
                }}
              >
                <Link
                  href={article.href}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-title)",
                      fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    {article.title}
                  </h2>
                </Link>
                <p style={{ color: "#999", lineHeight: 1.8, maxWidth: 760 }}>
                  {article.excerpt}
                </p>
                <Link
                  href={article.href}
                  style={{ color: "#C8A24A", textDecoration: "none" }}
                >
                  Ler artigo →
                </Link>
              </article>
            ))}
          </div>

          <p style={{ marginTop: 54, color: "#777", lineHeight: 1.8 }}>
            Autor: {" "}
            <Link
              href="/luis-filipe-madeira-castanheira"
              style={{ color: "#C8A24A", textDecoration: "none" }}
            >
              Luís Filipe Madeira Castanheira
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
