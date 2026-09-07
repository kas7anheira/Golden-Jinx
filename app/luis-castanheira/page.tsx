import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/footer/Footer";
import Header from "@/components/layout/Header";
import profilePhoto from "@/public/luis-castanheira-profissional.png";

import styles from "../luis-filipe-madeira-castanheira/profile.module.css";

const siteUrl = (
  process.env.URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://goldenjinx.com"
).replace(/\/$/, "");

const profilePath = "/luis-castanheira";
const profileUrl = `${siteUrl}${profilePath}`;
const profileImageUrl = `${siteUrl}/luis-castanheira-profissional.png`;
const personalUrl = "https://luiscastanheira.com";

export const metadata: Metadata = {
  title: "Luís Castanheira | Economista e Sócio-Gerente da Golden Jinx",
  description:
    "Conheça Luís Castanheira, economista, empresário e sócio-gerente da Golden Jinx, com atividade em construção, remodelação e valorização imobiliária.",
  keywords: [
    "Luís Castanheira",
    "Luis Castanheira",
    "Golden Jinx",
    "economista",
    "empresário",
    "sócio-gerente",
    "construção",
    "remodelação",
    "valorização imobiliária",
  ],
  alternates: {
    canonical: profilePath,
  },
  authors: [{ name: "Luís Castanheira", url: personalUrl }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Luís Castanheira | Golden Jinx",
    description:
      "Economista, empresário e sócio-gerente da Golden Jinx. Uma abordagem orientada pelo rigor, pela execução e pela criação de valor imobiliário.",
    type: "profile",
    url: profileUrl,
    siteName: "Golden Jinx",
    locale: "pt_PT",
    images: [
      {
        url: profileImageUrl,
        width: 1254,
        height: 1254,
        alt: "Retrato profissional de Luís Castanheira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luís Castanheira | Golden Jinx",
    description:
      "Economista, empresário e sócio-gerente da Golden Jinx, dedicado à construção, remodelação e valorização de imóveis.",
    images: [profileImageUrl],
  },
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${profileUrl}#profile-page`,
  url: profileUrl,
  name: "Perfil profissional de Luís Castanheira",
  description:
    "Perfil profissional de Luís Castanheira, economista, empresário e sócio-gerente da Golden Jinx.",
  dateModified: "2026-09-06T12:00:00+01:00",
  mainEntity: {
    "@type": "Person",
    "@id": `${personalUrl}/#person`,
    name: "Luís Castanheira",
    alternateName: "Luis Castanheira",
    url: personalUrl,
    image: profileImageUrl,
    jobTitle: "Economista, empresário e sócio-gerente da Golden Jinx",
    description:
      "Economista e empresário com atividade em construção, remodelação e valorização imobiliária através da Golden Jinx.",
    worksFor: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Golden Jinx",
      url: siteUrl,
      slogan: "Sparkling Solutions",
    },
    sameAs: [personalUrl],
    knowsAbout: [
      "Economia",
      "Construção",
      "Remodelação",
      "Valorização de imóveis",
      "Gestão de projetos",
      "Análise económica",
      "Controlo de custos",
    ],
  },
};

const focusAreas = [
  {
    number: "01",
    title: "Economia e análise",
    text: "Leitura económica das oportunidades, avaliação de risco, controlo de custos e decisões sustentadas por critérios objetivos.",
  },
  {
    number: "02",
    title: "Construção e remodelação",
    text: "Planeamento e acompanhamento de projetos que transformam imóveis, melhorando a sua qualidade, funcionalidade e identidade.",
  },
  {
    number: "03",
    title: "Valorização imobiliária",
    text: "Identificação do potencial de cada ativo e definição da abordagem adequada para transformar, vender ou arrendar imóveis próprios.",
  },
  {
    number: "04",
    title: "Gestão e execução",
    text: "Coordenação de equipas, fornecedores, prazos e orçamento, com atenção permanente ao detalhe e à qualidade final.",
  },
];

const method = [
  ["Identificar", "Reconhecer o potencial real de cada imóvel ou projeto."],
  ["Analisar", "Medir viabilidade, risco, custos e valor esperado."],
  ["Planear", "Definir uma intervenção coerente com o ativo e o seu destino."],
  ["Executar", "Coordenar a obra com rigor, detalhe e controlo."],
  ["Valorizar", "Entregar um espaço mais funcional, diferenciador e valioso."],
];

export default function LuisCastanheiraPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profilePageSchema).replace(/</g, "\\u003c"),
          }}
        />

        <section className={styles.hero} aria-labelledby="profile-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Perfil profissional</p>
              <h1 id="profile-title">Luís Castanheira</h1>
              <p className={styles.role}>
                Economista <span aria-hidden="true">·</span> Empresário{" "}
                <span aria-hidden="true">·</span> Sócio-Gerente da Golden Jinx
              </p>
              <p className={styles.intro}>
                Economia aplicada à construção, à remodelação e à valorização
                imobiliária, com uma visão orientada para a execução e para a criação
                de valor sustentável.
              </p>

              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} href="/projetos">
                  Conhecer os projetos
                </Link>
                <a className={styles.secondaryAction} href={personalUrl}>
                  Site pessoal
                </a>
              </div>

              <dl className={styles.identityList}>
                <div>
                  <dt>Formação</dt>
                  <dd>Economia</dd>
                </div>
                <div>
                  <dt>Empresa</dt>
                  <dd>Golden Jinx</dd>
                </div>
                <div>
                  <dt>Função</dt>
                  <dd>Sócio-Gerente</dd>
                </div>
              </dl>
            </div>

            <figure className={styles.portraitFrame}>
              <div className={styles.portraitAccent} aria-hidden="true" />
              <Image
                className={styles.portrait}
                src={profilePhoto}
                alt="Luís Castanheira, economista e sócio-gerente da Golden Jinx"
                priority
                sizes="(max-width: 900px) 92vw, 42vw"
              />
              <figcaption>
                <span>Golden Jinx</span>
                <span>Sparkling Solutions</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.story} aria-labelledby="vision-title">
          <div className={styles.sectionLabel}>Visão</div>
          <div className={styles.storyContent}>
            <h2 id="vision-title">Rigor antes do brilho.</h2>
            <div className={styles.storyText}>
              <p>
                A formação em Economia trouxe uma forma concreta de olhar para cada
                oportunidade: perceber os números, antecipar o risco e garantir que
                cada decisão tem fundamento. No imobiliário, esse rigor começa antes
                da compra e acompanha todo o percurso do projeto.
              </p>
              <p>
                Como sócio-gerente da Golden Jinx, Luís Castanheira conjuga análise,
                planeamento e capacidade de execução. A atividade passa pela
                construção de moradias e pequenos edifícios, pela remodelação integral
                de casas e apartamentos e pela aquisição, transformação, venda e
                arrendamento de imóveis próprios.
              </p>
              <p>
                O objetivo é transformar potencial em espaços funcionais,
                diferenciadores e com valor duradouro.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.expertise} aria-labelledby="expertise-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Áreas de atuação</p>
            <h2 id="expertise-title">Uma abordagem integrada ao imobiliário</h2>
          </div>

          <div className={styles.focusGrid}>
            {focusAreas.map((area) => (
              <article className={styles.focusCard} key={area.number}>
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.company} aria-labelledby="company-title">
          <div className={styles.companyMark} aria-hidden="true">
            GJ
          </div>
          <div className={styles.companyCopy}>
            <p className={styles.eyebrow}>Golden Jinx</p>
            <h2 id="company-title">Transformamos potencial em brilho.</h2>
            <p>
              A Golden Jinx cria valor através da transformação efetiva dos imóveis
              que desenvolve e dos projetos que executa, reunindo visão económica,
              gestão de obra e atenção ao detalhe numa só abordagem.
            </p>
            <a href="https://goldenjinx.com" className={styles.textLink}>
              Conhecer a Golden Jinx <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className={styles.method} aria-labelledby="method-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Método</p>
            <h2 id="method-title">Da oportunidade ao valor final</h2>
          </div>

          <ol className={styles.methodList}>
            {method.map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.insight} aria-labelledby="insight-title">
          <div>
            <p className={styles.eyebrow}>Conhecimento e perspetiva</p>
            <h2 id="insight-title">Economia aplicada ao imobiliário</h2>
          </div>
          <div>
            <p>
              Reflexões assinadas por Luís Castanheira sobre análise de oportunidades,
              remodelação, custos, risco e valorização imobiliária.
            </p>
            <Link href="/artigos" className={styles.primaryAction}>
              Explorar os artigos
            </Link>
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <p className={styles.eyebrow}>Contacto profissional</p>
          <h2 id="contact-title">Projetos com potencial merecem uma análise rigorosa.</h2>
          <p>
            Para construção, remodelação, valorização de imóveis ou apresentação de
            oportunidades, contacte a Golden Jinx.
          </p>
          <Link href="/contactos" className={styles.primaryAction}>
            Falar com a Golden Jinx
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
