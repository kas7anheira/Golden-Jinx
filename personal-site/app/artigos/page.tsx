import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artigos | Luís Castanheira",
  description:
    "Artigos de Luís Castanheira sobre economia aplicada ao imobiliário, remodelação, controlo de custos e valorização de imóveis.",
  alternates: { canonical: "/artigos" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Artigos | Luís Castanheira",
    description:
      "Perspetiva profissional sobre imobiliário, remodelação, custos e criação de valor.",
    url: "/artigos",
    siteName: "Luís Castanheira",
    locale: "pt_PT",
    type: "website"
  }
};

const articles = [
  {
    href: "/artigos/controlar-custos-remodelacao",
    title: "Como controlar custos numa remodelação sem sacrificar valor",
    excerpt:
      "Um orçamento útil não é apenas uma soma de preços. É uma ferramenta de decisão, prioridade e proteção da margem."
  },
  {
    href: "/artigos/o-que-analisar-antes-de-remodelar",
    title: "O que analisar antes de avançar com uma remodelação",
    excerpt:
      "Antes de escolher materiais ou acabamentos, importa perceber o imóvel, o objetivo da intervenção e os riscos que podem alterar o projeto."
  },
  {
    href: "/artigos/valorizacao-comeca-antes-da-obra",
    title: "Porque a valorização de um imóvel começa antes da obra",
    excerpt:
      "A criação de valor nasce da qualidade da decisão inicial: localização, distribuição, estratégia, orçamento e público-alvo."
  }
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://luiscastanheira.com/artigos#collection",
  url: "https://luiscastanheira.com/artigos",
  name: "Artigos de Luís Castanheira",
  description:
    "Artigos de Luís Castanheira sobre economia aplicada ao imobiliário, remodelação, controlo de custos e valorização de imóveis.",
  inLanguage: "pt-PT",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://luiscastanheira.com/#website",
  },
  about: {
    "@type": "Person",
    "@id": "https://luiscastanheira.com/#person",
    name: "Luís Castanheira",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://luiscastanheira.com${article.href}`,
      name: article.title,
    })),
  },
};

export default function ArtigosPage() {
  return (
    <main style={pageStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c")
        }}
      />
      <header style={headerStyle}>
        <Link href="/" style={brandStyle}>
          <span style={markStyle}>LC</span>
          <span>Luís Castanheira</span>
        </Link>
        <nav style={navStyle}>
          <Link href="/" style={navLinkStyle}>Perfil</Link>
          <Link href="https://goldenjinx.com" style={navLinkStyle}>Golden Jinx</Link>
        </nav>
      </header>

      <section style={heroStyle}>
        <p style={eyebrowStyle}>Perspetiva profissional</p>
        <h1 style={titleStyle}>Artigos</h1>
        <p style={introStyle}>
          Economia aplicada ao imobiliário, remodelação, controlo de custos e
          valorização de imóveis. Conteúdo assinado por Luís Castanheira.
        </p>
      </section>

      <section style={listStyle}>
        {articles.map((article, index) => (
          <article key={article.href} style={cardStyle}>
            <span style={numberStyle}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <Link href={article.href} style={articleLinkStyle}>
                <h2 style={articleTitleStyle}>{article.title}</h2>
              </Link>
              <p style={articleExcerptStyle}>{article.excerpt}</p>
              <Link href={article.href} style={readStyle}>Ler artigo →</Link>
            </div>
          </article>
        ))}
      </section>

      <footer style={footerStyle}>
        <span>© 2026 Luís Castanheira</span>
        <Link href="https://goldenjinx.com/luis-castanheira" style={footerLinkStyle}>
          Perfil na Golden Jinx
        </Link>
      </footer>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#070707",
  color: "#f6f2e8",
  fontFamily: "Arial, Helvetica, sans-serif"
};

const headerStyle = {
  minHeight: 78,
  padding: "0 clamp(20px, 5vw, 70px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  position: "sticky" as const,
  top: 0,
  zIndex: 10,
  background: "rgba(7,7,7,.9)",
  backdropFilter: "blur(18px)"
};

const brandStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  fontSize: ".88rem",
  fontWeight: 700
};

const markStyle = {
  display: "grid",
  placeItems: "center",
  width: 34,
  height: 34,
  border: "1px solid #c8a24a",
  borderRadius: "50%",
  color: "#c8a24a",
  fontFamily: "Georgia, serif",
  fontStyle: "italic"
};

const navStyle = { display: "flex", gap: 24 };
const navLinkStyle = { color: "#aaa69d", textDecoration: "none", fontSize: ".78rem" };

const heroStyle = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "clamp(100px, 13vw, 170px) clamp(20px, 5vw, 70px) 70px"
};

const eyebrowStyle = {
  margin: 0,
  color: "#c8a24a",
  fontSize: ".66rem",
  fontWeight: 700,
  letterSpacing: ".28em",
  textTransform: "uppercase" as const
};

const titleStyle = {
  margin: "18px 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontWeight: 400,
  fontSize: "clamp(4rem, 10vw, 8.5rem)",
  lineHeight: .88,
  letterSpacing: "-.045em"
};

const introStyle = {
  maxWidth: 760,
  marginTop: 30,
  color: "#aaa8a2",
  fontSize: "clamp(1rem, 1.8vw, 1.16rem)",
  lineHeight: 1.85
};

const listStyle = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 clamp(20px, 5vw, 70px) 120px"
};

const cardStyle = {
  display: "grid",
  gridTemplateColumns: "70px minmax(0, 1fr)",
  gap: 24,
  padding: "34px 0",
  borderTop: "1px solid rgba(255,255,255,.12)"
};

const numberStyle = {
  color: "#c8a24a",
  fontSize: ".7rem",
  fontWeight: 700,
  letterSpacing: ".14em",
  paddingTop: 9
};

const articleLinkStyle = { color: "inherit", textDecoration: "none" };
const articleTitleStyle = {
  margin: 0,
  maxWidth: 900,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontWeight: 400,
  fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
  lineHeight: 1.08
};
const articleExcerptStyle = { maxWidth: 760, color: "#96948f", lineHeight: 1.8 };
const readStyle = { color: "#c8a24a", textDecoration: "none", fontWeight: 700, fontSize: ".84rem" };

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap" as const,
  padding: "28px clamp(20px, 5vw, 70px)",
  borderTop: "1px solid rgba(255,255,255,.08)",
  color: "#716f69",
  fontSize: ".72rem"
};
const footerLinkStyle = { color: "#9e8b58", textDecoration: "none" };
