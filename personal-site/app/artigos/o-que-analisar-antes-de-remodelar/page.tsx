import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://luiscastanheira.com";
const articleUrl = `${siteUrl}/artigos/o-que-analisar-antes-de-remodelar`;

export const metadata: Metadata = {
  title: "O que analisar antes de avançar com uma remodelação | Luís Castanheira",
  description: "Luís Castanheira apresenta os principais pontos a analisar antes de iniciar uma remodelação: estado técnico, layout, objetivo, custos e valor final.",
  alternates: { canonical: "/artigos/o-que-analisar-antes-de-remodelar" },
  authors: [{ name: "Luís Castanheira", url: siteUrl }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "O que analisar antes de avançar com uma remodelação | Luís Castanheira",
    description: "Luís Castanheira apresenta os principais pontos a analisar antes de iniciar uma remodelação: estado técnico, layout, objetivo, custos e valor final.",
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
  headline: "O que analisar antes de avançar com uma remodelação",
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
        <h1 style={titleStyle}>O que analisar antes de avançar com uma remodelação</h1>
        <p style={bylineStyle}>
          Por <Link href="/" style={authorStyle}>Luís Castanheira</Link>
        </p>

        <div style={bodyStyle}>

          <p>
            Uma remodelação começa com perguntas, não com catálogos. Antes de escolher
            materiais é necessário perceber o estado do imóvel, a finalidade da
            intervenção e as limitações que podem condicionar o projeto.
          </p>

          <h2 style={headingStyle}>1. Estado técnico do imóvel</h2>
          <p>
            Infiltrações, fissuras, cobertura, caixilharias, redes técnicas e sinais de
            humidade devem ser observados com atenção. Um problema técnico ignorado
            pode consumir rapidamente a margem destinada aos acabamentos.
          </p>

          <h2 style={headingStyle}>2. Distribuição e circulação</h2>
          <p>
            A forma como os espaços se relacionam influencia a funcionalidade e a
            perceção de qualidade. Muitas vezes, pequenas alterações de layout criam
            mais valor do que intervenções visualmente mais caras.
          </p>

          <h2 style={headingStyle}>3. Objetivo do imóvel</h2>
          <p>
            Um imóvel para habitação própria, venda ou arrendamento pode justificar
            níveis de acabamento e decisões diferentes. A estratégia deve existir antes
            da escolha das soluções.
          </p>

          <h2 style={headingStyle}>4. Custos invisíveis</h2>
          <p>
            Licenças, projetos, demolições, transporte de resíduos, trabalhos
            preparatórios e correções técnicas devem entrar na análise. Ignorá-los cria
            uma falsa sensação de orçamento disponível.
          </p>

          <h2 style={headingStyle}>5. Valor final esperado</h2>
          <p>
            A profundidade da remodelação deve ser coerente com a localização e com o
            valor que o mercado reconhece. Nem todo o investimento adicional se
            transforma em valorização equivalente.
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
