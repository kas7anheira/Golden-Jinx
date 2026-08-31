import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Luís Filipe Madeira Castanheira | Golden Jinx",
  description:
    "Perfil profissional de Luís Filipe Madeira Castanheira, economista e empresário ligado à Golden Jinx e ao setor imobiliário.",
  keywords: [
    "Luís Filipe Madeira Castanheira",
    "Luis Filipe Madeira Castanheira",
    "Luís Castanheira",
    "Luis Castanheira",
    "Golden Jinx",
    "investimento imobiliário",
    "remodelação",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Luís Filipe Madeira Castanheira | Golden Jinx",
    description:
      "Perfil profissional de Luís Filipe Madeira Castanheira e atividade desenvolvida através da Golden Jinx.",
    type: "profile",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Luís Filipe Madeira Castanheira",
    alternateName: [
      "Luís Castanheira",
      "Luis Filipe Madeira Castanheira",
      "Luis Castanheira",
    ],
    jobTitle: "Empresário",
    description:
      "Economista e empresário ligado à Golden Jinx, com atividade no setor imobiliário, remodelação e valorização de imóveis.",
    worksFor: {
      "@type": "Organization",
      name: "Golden Jinx",
    },
    knowsAbout: [
      "Economia",
      "Investimento imobiliário",
      "Remodelação",
      "Valorização de imóveis",
      "Gestão de projetos",
    ],
  },
};

export default function LuisFilipeMadeiraCastanheiraPage() {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

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
            Golden Jinx · Perfil profissional
          </p>

          <h1
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.7rem, 7vw, 5.8rem)",
              fontWeight: 500,
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 980,
            }}
          >
            Luís Filipe Madeira Castanheira
          </h1>

          <p
            style={{
              marginTop: 34,
              maxWidth: 760,
              color: "#b9b9b9",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.85,
            }}
          >
            Economista e empresário ligado à Golden Jinx, com atividade focada
            em investimento, remodelação, transformação e valorização de imóveis.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 28,
              marginTop: 70,
            }}
          >
            <section
              style={{
                borderTop: "1px solid rgba(200,162,74,.45)",
                paddingTop: 28,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: 32,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Percurso profissional
              </h2>
              <p style={{ color: "#aaa", lineHeight: 1.85, marginTop: 18 }}>
                A formação em Economia complementa uma abordagem orientada para
                análise, investimento, execução e criação de valor em projetos
                imobiliários desenvolvidos através da Golden Jinx.
              </p>
            </section>

            <section
              style={{
                borderTop: "1px solid rgba(255,255,255,.16)",
                paddingTop: 28,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: 32,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Áreas de atividade
              </h2>
              <ul
                style={{
                  color: "#aaa",
                  lineHeight: 1.9,
                  paddingLeft: 20,
                  marginTop: 18,
                }}
              >
                <li>Investimento e valorização imobiliária</li>
                <li>Remodelação e transformação de imóveis</li>
                <li>Compra, venda e exploração de imóveis próprios</li>
                <li>Gestão e desenvolvimento de projetos</li>
              </ul>
            </section>
          </div>

          <section
            style={{
              marginTop: 72,
              padding: "clamp(28px, 5vw, 48px)",
              border: "1px solid rgba(200,162,74,.24)",
              background: "rgba(200,162,74,.045)",
            }}
          >
            <p
              style={{
                color: "#C8A24A",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontSize: 10,
                margin: 0,
              }}
            >
              Conteúdo profissional
            </p>
            <h2
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "clamp(2rem, 4vw, 3.3rem)",
                fontWeight: 500,
                margin: "15px 0 12px",
              }}
            >
              Economia aplicada ao imobiliário
            </h2>
            <p style={{ color: "#aaa", lineHeight: 1.8, maxWidth: 720 }}>
              Artigos sobre análise de oportunidades, remodelação, controlo de
              custos, valorização e decisões de investimento imobiliário.
            </p>
            <Link
              href="/artigos"
              style={{
                display: "inline-block",
                marginTop: 18,
                color: "#C8A24A",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Ver artigos →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
