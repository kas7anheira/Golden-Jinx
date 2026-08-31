import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";

const siteUrl = (
  process.env.URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://golden-jinx.netlify.app"
).replace(/\/$/, "");

const profileUrl = `${siteUrl}/luis-filipe-madeira-castanheira`;
const articleUrl = `${siteUrl}/artigos/avaliar-potencial-valorizacao-imovel`;

export const metadata: Metadata = {
  title:
    "Como avaliar o potencial de valorização de um imóvel | Luís Filipe Madeira Castanheira",
  description:
    "Luís Filipe Madeira Castanheira explica critérios práticos para avaliar o potencial de valorização de um imóvel antes da compra.",
  alternates: { canonical: "/artigos/avaliar-potencial-valorizacao-imovel" },
  authors: [{ name: "Luís Filipe Madeira Castanheira", url: profileUrl }],
  robots: { index: true, follow: true },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${articleUrl}#article`,
  url: articleUrl,
  headline: "Como avaliar o potencial de valorização de um imóvel antes de comprar",
  author: {
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: "Luís Filipe Madeira Castanheira",
    url: profileUrl,
  },
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Golden Jinx",
    url: siteUrl,
  },
  about: [
    "Investimento imobiliário",
    "Valorização de imóveis",
    "Remodelação",
    "Análise de investimento",
  ],
};

export default function ArticlePage() {
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
          }}
        />

        <article style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link
            href="/artigos"
            style={{ color: "#C8A24A", textDecoration: "none", fontSize: 13 }}
          >
            ← Artigos
          </Link>

          <p
            style={{
              color: "#C8A24A",
              textTransform: "uppercase",
              letterSpacing: 3,
              fontSize: 10,
              marginTop: 34,
            }}
          >
            Investimento imobiliário
          </p>

          <h1
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontWeight: 500,
              lineHeight: 1.02,
              margin: "16px 0 24px",
            }}
          >
            Como avaliar o potencial de valorização de um imóvel antes de comprar
          </h1>

          <p style={{ color: "#888", lineHeight: 1.7 }}>
            Por {" "}
            <Link
              href="/luis-filipe-madeira-castanheira"
              style={{ color: "#C8A24A", textDecoration: "none" }}
            >
              Luís Filipe Madeira Castanheira
            </Link>
          </p>

          <div
            style={{
              marginTop: 48,
              color: "#c3c3c3",
              fontSize: "clamp(1rem, 2vw, 1.08rem)",
              lineHeight: 1.95,
            }}
          >
            <p>
              Uma boa compra imobiliária começa muito antes da obra. O preço de
              aquisição é apenas uma parte da equação. Para perceber o verdadeiro
              potencial de um imóvel é necessário cruzar localização, estado de
              conservação, procura, custo provável da intervenção e valor de mercado
              depois da transformação.
            </p>

            <h2 style={headingStyle}>1. Começar pelo valor de saída</h2>
            <p>
              Antes de estimar quanto gastar, importa perceber quanto o mercado pode
              pagar por um imóvel comparável já renovado. Comparáveis reais e recentes
              são mais úteis do que expectativas. O valor de saída deve funcionar como
              âncora da análise, porque condiciona o preço máximo de compra e a margem
              disponível para obra, impostos, financiamento e imprevistos.
            </p>

            <h2 style={headingStyle}>2. Separar estética de risco técnico</h2>
            <p>
              Pinturas, pavimentos, cozinhas e iluminação tendem a ser relativamente
              previsíveis. Estrutura, coberturas, infiltrações, instalações antigas e
              patologias construtivas podem alterar completamente a rentabilidade. Uma
              visita técnica cuidadosa vale mais do que uma estimativa otimista feita a
              partir de fotografias.
            </p>

            <h2 style={headingStyle}>3. Orçamentar com margem para imprevistos</h2>
            <p>
              Nenhuma obra relevante deve ser analisada apenas pelo orçamento mais
              baixo. Uma avaliação responsável inclui margem para trabalhos não
              previstos. Sem essa reserva, pequenas surpresas tornam-se erosão direta
              da margem do investimento.
            </p>

            <h2 style={headingStyle}>4. Procurar valor, não apenas área</h2>
            <p>
              Distribuição, luz natural, acessos, estacionamento, eficiência energética
              e qualidade percebida podem pesar mais do que alguns metros quadrados
              adicionais. Um imóvel bem resolvido pode ter maior procura do que outro
              maior, mas com circulação deficiente ou pouca luz.
            </p>

            <h2 style={headingStyle}>5. Definir a estratégia antes da compra</h2>
            <p>
              Um imóvel destinado a venda, arrendamento ou exploração própria pode
              justificar decisões diferentes. A intervenção deve nascer da estratégia
              e do público-alvo. Só depois faz sentido escolher materiais, nível de
              acabamento e profundidade da remodelação.
            </p>

            <h2 style={headingStyle}>6. Medir a margem antes de se apaixonar pelo projeto</h2>
            <p>
              Uma oportunidade pode ser visualmente apelativa e ainda assim ser um mau
              investimento. O exercício económico deve sobreviver a cenários menos
              favoráveis, como uma venda mais lenta, aumento de custos ou necessidade de
              trabalhos adicionais. Se a margem desaparecer ao primeiro desvio, o risco
              está provavelmente demasiado concentrado.
            </p>

            <p
              style={{
                marginTop: 46,
                paddingTop: 28,
                borderTop: "1px solid rgba(255,255,255,.12)",
                color: "#aaa",
              }}
            >
              Na Golden Jinx, a análise de um projeto procura equilibrar potencial,
              custo de transformação e valor final, com uma abordagem orientada para
              decisões economicamente sustentáveis.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

const headingStyle = {
  fontFamily: "var(--font-title)",
  color: "white",
  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
  fontWeight: 500,
  lineHeight: 1.15,
  margin: "48px 0 16px",
};
