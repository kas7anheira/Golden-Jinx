import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "../AuthorBox";

const siteUrl = "https://luiscastanheira.com";
const articleUrl = `${siteUrl}/artigos/porque-preco-metro-quadrado-nao-chega`;

export const metadata: Metadata = {
  title: "Porque o preço por metro quadrado não chega para avaliar uma remodelação | Luís Castanheira",
  description: "Luís Castanheira explica por que o custo por metro quadrado é insuficiente para comparar remodelações e como analisar escopo, risco, qualidade e valor criado.",
  alternates: { canonical: "/artigos/porque-preco-metro-quadrado-nao-chega" },
  authors: [{ name: "Luís Castanheira", url: siteUrl }],
  robots: { index: true, follow: true },
  openGraph: { title: "Porque o preço por metro quadrado não chega para avaliar uma remodelação | Luís Castanheira", description: "O €/m² é uma referência rápida, mas pode esconder diferenças decisivas de escopo, risco e qualidade.", url: articleUrl, siteName: "Luís Castanheira", locale: "pt_PT", type: "article" }
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article", "@id": `${articleUrl}#article`, url: articleUrl,
  mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl }, isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website` }, inLanguage: "pt-PT",
  headline: "Porque o preço por metro quadrado não chega para avaliar uma remodelação",
  datePublished: "2026-09-22T08:51:00+01:00", dateModified: "2026-09-22T08:51:00+01:00",
  about: ["Economia aplicada ao imobiliário", "Remodelação", "Controlo de custos", "Gestão de projetos"],
  author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Luís Castanheira", url: siteUrl, sameAs: ["https://goldenjinx.com/luis-castanheira", "https://www.linkedin.com/in/luiscastanheira/"] },
  publisher: { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Luís Castanheira", url: siteUrl }
};

export default function ArticlePage() {
  return <main style={pageStyle}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    <header style={headerStyle}><Link href="/" style={brandStyle}><span style={markStyle}>LC</span><span>Luís Castanheira</span></Link><nav style={navStyle}><Link href="/artigos" style={navLinkStyle}>Artigos</Link><Link href="https://goldenjinx.com" style={navLinkStyle}>Golden Jinx</Link></nav></header>
    <article style={articleStyle}>
      <Link href="/artigos" style={backStyle}>← Artigos</Link>
      <p style={eyebrowStyle}>Economia · Remodelação · Decisão</p>
      <h1 style={titleStyle}>Porque o preço por metro quadrado não chega para avaliar uma remodelação</h1>
      <p style={bylineStyle}>Por <Link href="/" style={authorStyle}>Luís Castanheira</Link>{" · "}Publicado em 22 de setembro de 2026</p>
      <div style={bodyStyle}>
        <p>O custo por metro quadrado é sedutor porque transforma uma obra complexa num número simples. Serve para uma primeira referência, mas torna-se perigoso quando passa de indicador a critério de decisão. Duas remodelações com a mesma área podem exigir trabalhos, níveis de risco e soluções tão diferentes que comparar apenas o €/m² é comparar embalagens e ignorar o conteúdo.</p>
        <h2 style={headingStyle}>1. A área não descreve o que vai ser feito</h2>
        <p>Cem metros quadrados podem significar pintura e substituição de pavimentos ou uma intervenção com demolições, novas redes de água e eletricidade, caixilharias, climatização, cozinha e instalações sanitárias. A área é igual; o escopo não é. Antes de perguntar quanto custa o metro quadrado, importa definir o que esse metro quadrado contém.</p>
        <h2 style={headingStyle}>2. Cozinhas e casas de banho distorcem a média</h2>
        <p>Há zonas onde a intensidade de trabalho e de materiais é muito superior. Uma cozinha concentra mobiliário, equipamentos, redes, revestimentos e várias decisões técnicas num espaço relativamente pequeno. O mesmo acontece nas casas de banho. Dois imóveis de dimensão semelhante podem, por isso, ter estruturas de custo muito diferentes.</p>
        <h2 style={headingStyle}>3. O estado inicial altera o risco económico</h2>
        <p>Um imóvel aparentemente simples pode esconder humidades, redes degradadas, pavimentos desnivelados ou outras necessidades que só ficam claras depois de remover elementos existentes. Esse risco não desaparece por ser dividido pela área. Uma análise económica útil deve reconhecer a incerteza e reservar margem para ela.</p>
        <h2 style={headingStyle}>4. Um preço baixo pode estar apenas incompleto</h2>
        <p>Quando comparo propostas, interessa-me perceber inclusões, exclusões, quantidades, materiais, preparação dos suportes, remoção de resíduos e responsabilidades. Um valor global mais baixo pode deixar trabalhos relevantes de fora. O problema surge mais tarde, quando os adicionais começam a preencher aquilo que o número inicial não mostrava.</p>
        <h2 style={headingStyle}>5. O custo deve ser lido ao lado do valor criado</h2>
        <p>Nem todas as poupanças têm o mesmo efeito. Cortar numa solução decorativa e cortar numa impermeabilização podem reduzir o orçamento pelo mesmo montante, mas não têm o mesmo impacto no risco, na utilização ou no valor final. Prefiro analisar custo e consequência em conjunto. O objetivo não é encontrar sempre a solução mais barata; é evitar pagar por aquilo que não cria valor e proteger aquilo que sustenta o resultado.</p>
        <h2 style={headingStyle}>Como uso o €/m² sem lhe pedir aquilo que não consegue dar</h2>
        <p>Uso-o como instrumento de controlo, não como orçamento. Depois de o escopo estar definido, o valor por metro quadrado pode ajudar a comparar cenários, identificar desvios e testar se uma estimativa merece ser revista. Mas a decisão deve regressar sempre às perguntas fundamentais: o que está incluído, que riscos existem, onde se concentra o custo e que valor se pretende criar.</p>
        <p>Esta lógica complementa <Link href="/artigos/o-que-analisar-antes-de-remodelar" style={inlineLinkStyle}>o que analisar antes de avançar com uma remodelação</Link> e o método para <Link href="/artigos/controlar-custos-remodelacao" style={inlineLinkStyle}>controlar custos sem sacrificar valor</Link>.</p>
        <p style={closingStyle}>A métrica certa simplifica uma decisão sem apagar o que é importante. No imobiliário, os números são mais úteis quando ajudam a fazer melhores perguntas. Esta é a perspetiva que procuro aplicar na interseção entre economia, gestão e execução. Para conhecer a atividade da Golden Jinx, visite <a href="https://goldenjinx.com" style={inlineLinkStyle}>goldenjinx.com</a>.</p>
      </div>
      <AuthorBox />
    </article>
    <footer style={footerStyle}><span>© 2026 Luís Castanheira</span><Link href="https://goldenjinx.com/luis-castanheira" style={footerLinkStyle}>Perfil na Golden Jinx</Link></footer>
  </main>;
}

const pageStyle={minHeight:"100vh",background:"#070707",color:"#f6f2e8",fontFamily:"Arial, Helvetica, sans-serif"};
const headerStyle={minHeight:78,padding:"0 clamp(20px, 5vw, 70px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,borderBottom:"1px solid rgba(255,255,255,.08)",position:"sticky" as const,top:0,zIndex:10,background:"rgba(7,7,7,.9)",backdropFilter:"blur(18px)"};
const brandStyle={display:"inline-flex",alignItems:"center",gap:12,textDecoration:"none",fontSize:".88rem",fontWeight:700};
const markStyle={display:"grid",placeItems:"center",width:34,height:34,border:"1px solid #c8a24a",borderRadius:"50%",color:"#c8a24a",fontFamily:"Georgia, serif",fontStyle:"italic"};
const navStyle={display:"flex",flexWrap:"wrap" as const,gap:"12px 24px"}; const navLinkStyle={color:"#aaa69d",textDecoration:"none",fontSize:".78rem"};
const articleStyle={maxWidth:900,margin:"0 auto",padding:"clamp(95px, 12vw, 150px) clamp(20px, 5vw, 70px) 120px"};
const backStyle={color:"#9e8b58",textDecoration:"none",fontSize:".8rem"}; const eyebrowStyle={margin:"44px 0 0",color:"#c8a24a",fontSize:".66rem",fontWeight:700,letterSpacing:".25em",textTransform:"uppercase" as const};
const titleStyle={margin:"18px 0 0",fontFamily:"Georgia, 'Times New Roman', serif",fontWeight:400,fontSize:"clamp(2.65rem, 7vw, 5.8rem)",lineHeight:.98,letterSpacing:"-.04em",overflowWrap:"anywhere" as const};
const bylineStyle={marginTop:28,color:"#7f7c75",fontSize:".8rem",lineHeight:1.6}; const authorStyle={color:"#c8a24a",textDecoration:"none"};
const bodyStyle={marginTop:54,color:"#b3b0a9",fontSize:"clamp(1rem, 1.7vw, 1.08rem)",lineHeight:1.95};
const headingStyle={margin:"44px 0 14px",color:"#f6f2e8",fontFamily:"Georgia, 'Times New Roman', serif",fontWeight:400,fontSize:"clamp(1.8rem, 3.4vw, 2.6rem)",lineHeight:1.12};
const closingStyle={marginTop:52,paddingTop:28,borderTop:"1px solid rgba(255,255,255,.12)",color:"#9d9a93"}; const inlineLinkStyle={color:"#c8a24a"};
const footerStyle={display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap" as const,padding:"28px clamp(20px, 5vw, 70px)",borderTop:"1px solid rgba(255,255,255,.08)",color:"#716f69",fontSize:".72rem"}; const footerLinkStyle={color:"#9e8b58",textDecoration:"none"};
