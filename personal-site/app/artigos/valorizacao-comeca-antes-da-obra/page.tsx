import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "../AuthorBox";

const siteUrl = "https://luiscastanheira.com";
const articleUrl = `${siteUrl}/artigos/valorizacao-comeca-antes-da-obra`;

export const metadata: Metadata = {
  title: "Porque a valorização de um imóvel começa antes da obra | Luís Castanheira",
  description: "Luís Castanheira explica por que a valorização imobiliária depende da decisão inicial, estratégia, orçamento e qualidade da execução.",
  alternates: { canonical: "/artigos/valorizacao-comeca-antes-da-obra" },
  authors: [{ name: "Luís Castanheira", url: siteUrl }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Porque a valorização de um imóvel começa antes da obra | Luís Castanheira",
    description: "Luís Castanheira explica por que a valorização imobiliária depende da decisão inicial, estratégia, orçamento e qualidade da execução.",
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
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": articleUrl,
  },
  isPartOf: {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
  },
  inLanguage: "pt-PT",
  about: [
    "Economia aplicada ao imobiliário",
    "Remodelação",
    "Valorização imobiliária",
    "Gestão de projetos",
    "Controlo de custos",
  ],
  headline: "Porque a valorização de um imóvel começa antes da obra",
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
        <h1 style={titleStyle}>Porque a valorização de um imóvel começa antes da obra</h1>
        <p style={bylineStyle}>
          Por <Link href="/" style={authorStyle}>Luís Castanheira</Link>
          {" · "}Publicado em 7 de setembro de 2026
        </p>

        <div style={bodyStyle}>

          <p>
            É fácil associar valorização à obra concluída, mas grande parte do resultado
            é decidido antes de começar. A qualidade da compra, do diagnóstico e do
            plano condiciona tudo o que vem depois.
          </p>

          <h2 style={headingStyle}>1. Comprar bem continua a ser determinante</h2>
          <p>
            Um imóvel com boa localização, distribuição corrigível e margem para
            intervenção oferece condições diferentes de um ativo cujo preço já incorpora
            todo o potencial futuro.
          </p>

          <h2 style={headingStyle}>2. Definir o público-alvo</h2>
          <p>
            A intervenção deve responder a quem vai usar o espaço. Tipologia, arrumação,
            materiais, eficiência e nível de acabamento ganham sentido quando existe
            uma ideia clara de utilização.
          </p>

          <h2 style={headingStyle}>3. Concentrar investimento onde é percebido</h2>
          <p>
            Cozinhas funcionais, casas de banho bem resolvidas, luz, conforto e boa
            execução tendem a ter impacto real na experiência. O valor nasce da soma de
            decisões coerentes, não de um único elemento caro.
          </p>

          <h2 style={headingStyle}>4. Evitar excesso de intervenção</h2>
          <p>
            Remodelar mais não significa valorizar mais. Uma intervenção deve respeitar
            o potencial económico do imóvel e evitar custos que o mercado provavelmente
            não reconhecerá.
          </p>

          <h2 style={headingStyle}>5. Pensar na saída desde o início</h2>
          <p>
            A análise do valor final ajuda a limitar o orçamento e a testar cenários
            menos favoráveis. Uma boa decisão deve continuar a fazer sentido mesmo com
            algum desvio de custos ou prazo.
          </p>

          <h2 style={headingStyle}>Valorização não é apenas acabamento</h2>
          <p>
            No meu trabalho, valorização significa resolver problemas reais do imóvel:
            distribuição, funcionalidade, conforto, custos de utilização e qualidade de
            execução. O acabamento é importante, mas deve fechar uma estratégia que já fazia
            sentido antes da obra começar.
          </p>

          <p style={closingStyle}>
            Esta perspetiva faz parte do trabalho profissional de Luís Castanheira
            na interseção entre economia, gestão e imobiliário. Para conhecer a
            atividade da Golden Jinx, visite{" "}
            <a href="https://goldenjinx.com" style={inlineLinkStyle}>goldenjinx.com</a>.
          </p>
        </div>

        <AuthorBox />
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
