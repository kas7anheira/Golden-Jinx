import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://luiscastanheira.com";
const articleUrl = `${siteUrl}/artigos/controlar-custos-remodelacao`;

export const metadata: Metadata = {
  title: "Como controlar custos numa remodelação sem sacrificar valor | Luís Castanheira",
  description: "Luís Castanheira explica como controlar custos numa remodelação através de prioridades, margem de segurança e acompanhamento do orçamento.",
  alternates: { canonical: "/artigos/controlar-custos-remodelacao" },
  authors: [{ name: "Luís Castanheira", url: siteUrl }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como controlar custos numa remodelação sem sacrificar valor | Luís Castanheira",
    description: "Luís Castanheira explica como controlar custos numa remodelação através de prioridades, margem de segurança e acompanhamento do orçamento.",
    url: articleUrl,
    siteName: "Luís Castanheira",
    locale: "pt_PT",
    type: "article"
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${articleUrl}#article`,
  url: articleUrl,
  headline: "Como controlar custos numa remodelação sem sacrificar valor",
  datePublished: "2026-09-07T23:10:00+01:00",
  dateModified: "2026-09-07T23:10:00+01:00",
  author: {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Luís Castanheira",
    url: siteUrl
  },
  publisher: {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Luís Castanheira",
    url: siteUrl
  }
};

export default function ArticlePage() {
  return (
    <main style={pageStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c")
        }}
      />

      <header style={headerStyle}>
        <Link href="/" style={brandStyle}>
          <span style={markStyle}>LC</span>
          <span>Luís Castanheira</span>
        </Link>
        <nav style={navStyle}>
          <Link href="/artigos" style={navLinkStyle}>Artigos</Link>
          <Link href="https://goldenjinx.com" style={navLinkStyle}>Golden Jinx</Link>
        </nav>
      </header>

      <article style={articleStyle}>
        <Link href="/artigos" style={backStyle}>← Artigos</Link>
        <p style={eyebrowStyle}>Economia · Imobiliário · Execução</p>
        <h1 style={titleStyle}>Como controlar custos numa remodelação sem sacrificar valor</h1>
        <p style={bylineStyle}>
          Por <Link href="/" style={authorStyle}>Luís Castanheira</Link>
        </p>

        <div style={bodyStyle}>

          <p>
            O controlo de custos numa remodelação começa antes da primeira encomenda.
            Um orçamento útil deve permitir perceber onde o dinheiro cria valor, onde
            existe risco e quais as decisões que podem ser adiadas sem comprometer o
            resultado final.
          </p>

          <h2 style={headingStyle}>1. Separar o essencial do desejável</h2>
          <p>
            Estrutura, impermeabilizações, instalações elétricas, redes de água e
            outros elementos técnicos devem ser tratados antes dos acabamentos.
            Poupar numa patologia escondida para gastar mais num revestimento é uma
            inversão de prioridades.
          </p>

          <h2 style={headingStyle}>2. Trabalhar com uma margem de segurança</h2>
          <p>
            Obras de remodelação têm variáveis que só aparecem depois da demolição ou
            da abertura de paredes. Uma reserva para imprevistos evita que cada surpresa
            obrigue a cortar elementos importantes do projeto.
          </p>

          <h2 style={headingStyle}>3. Comparar soluções, não apenas preços</h2>
          <p>
            Duas propostas podem ter valores semelhantes e cobrir trabalhos muito
            diferentes. É importante comparar quantidades, materiais, exclusões,
            prazos e responsabilidades. O preço isolado raramente conta a história toda.
          </p>

          <h2 style={headingStyle}>4. Proteger os pontos que o utilizador sente todos os dias</h2>
          <p>
            Circulação, iluminação, armazenamento, conforto térmico e qualidade de
            execução tendem a ter mais impacto do que decisões puramente decorativas.
            Controlar custos não é nivelar tudo por baixo. É gastar melhor.
          </p>

          <h2 style={headingStyle}>5. Acompanhar o orçamento durante a obra</h2>
          <p>
            O orçamento deve ser atualizado à medida que decisões são tomadas.
            Pequenos desvios repetidos podem transformar-se num problema grande quando
            só são somados no final.
          </p>

          <p style={closingStyle}>
            Esta perspetiva faz parte do trabalho profissional de Luís Castanheira
            na interseção entre economia, gestão e imobiliário. Para conhecer a
            atividade da Golden Jinx, visite{" "}
            <a href="https://goldenjinx.com" style={inlineLinkStyle}>goldenjinx.com</a>.
          </p>
        </div>
      </article>

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
const articleStyle = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "clamp(95px, 12vw, 150px) clamp(20px, 5vw, 70px) 120px"
};
const backStyle = { color: "#9e8b58", textDecoration: "none", fontSize: ".8rem" };
const eyebrowStyle = {
  margin: "44px 0 0",
  color: "#c8a24a",
  fontSize: ".66rem",
  fontWeight: 700,
  letterSpacing: ".25em",
  textTransform: "uppercase" as const
};
const titleStyle = {
  margin: "18px 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontWeight: 400,
  fontSize: "clamp(3rem, 7vw, 5.8rem)",
  lineHeight: .98,
  letterSpacing: "-.04em"
};
const bylineStyle = { marginTop: 28, color: "#7f7c75", fontSize: ".8rem" };
const authorStyle = { color: "#c8a24a", textDecoration: "none" };
const bodyStyle = {
  marginTop: 54,
  color: "#b3b0a9",
  fontSize: "clamp(1rem, 1.7vw, 1.08rem)",
  lineHeight: 1.95
};
const closingStyle = {
  marginTop: 52,
  paddingTop: 28,
  borderTop: "1px solid rgba(255,255,255,.12)",
  color: "#9d9a93"
};
const inlineLinkStyle = { color: "#c8a24a" };
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

const headingStyle = {
  margin: "44px 0 14px",
  color: "#f6f2e8",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontWeight: 400,
  fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
  lineHeight: 1.12
};
