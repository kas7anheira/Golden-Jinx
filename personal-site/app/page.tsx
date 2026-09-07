const areas = [
  {
    number: "01",
    title: "Economia",
    text: "Análise, controlo de custos e decisões sustentadas por critérios objetivos."
  },
  {
    number: "02",
    title: "Construção",
    text: "Planeamento e acompanhamento de projetos residenciais com foco na qualidade final."
  },
  {
    number: "03",
    title: "Remodelação",
    text: "Transformação integral de imóveis, conciliando função, identidade e valor."
  },
  {
    number: "04",
    title: "Valorização",
    text: "Leitura do potencial de cada ativo e definição da estratégia adequada para o tornar mais competitivo."
  }
];

const method = [
  ["Analisar", "Perceber números, contexto, risco e potencial."],
  ["Planear", "Definir prioridades, custos e uma direção clara."],
  ["Executar", "Acompanhar cada etapa com proximidade e rigor."],
  ["Valorizar", "Transformar o potencial inicial em valor real."]
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Luís Castanheira">
          <span className="brandMark">LC</span>
          <span>Luís Castanheira</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#perfil">Perfil</a>
          <a href="#atividade">Atividade</a>
          <a href="#golden-jinx">Golden Jinx</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="heroGlow" aria-hidden="true" />
        <div className="heroInner">
          <div className="heroCopy">
            <p className="eyebrow">Economia · Gestão · Imobiliário</p>
            <h1>Luís<br />Castanheira</h1>
            <p className="role">Economista · Empresário · Sócio-Gerente da Golden Jinx</p>
            <p className="lead">
              Uma abordagem assente em análise, execução e criação de valor. Da leitura económica de uma oportunidade à transformação concreta de um imóvel.
            </p>
            <div className="actions">
              <a className="primary" href="https://goldenjinx.com">Conhecer a Golden Jinx</a>
              <a className="secondary" href="#perfil">Conhecer o perfil</a>
            </div>
          </div>

          <figure className="portraitCard" aria-label="Retrato profissional de Luís Castanheira">
            <div className="portraitAccent" aria-hidden="true" />
            <img
              className="portraitImage"
              src="/luis-castanheira-profissional.png"
              alt="Luís Castanheira"
            />
            <figcaption>
              <div>
                <span>Luís Castanheira</span>
                <strong>Economista · Empresário</strong>
              </div>
              <div>
                <span>Golden Jinx</span>
                <strong>Sócio-Gerente</strong>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="profile section" id="perfil">
        <p className="sectionLabel">Perfil</p>
        <div className="profileGrid">
          <h2>Rigor económico aplicado à execução.</h2>
          <div className="bodyCopy">
            <p>
              Luís Castanheira é economista e empresário. A sua atividade profissional cruza análise económica, gestão e imobiliário, com especial enfoque na construção, remodelação e valorização de ativos.
            </p>
            <p>
              Na Golden Jinx, enquanto sócio-gerente, acompanha oportunidades desde a avaliação inicial até à execução, articulando custos, equipas, prazos e qualidade final.
            </p>
            <p>
              A lógica é simples: compreender bem antes de decidir, planear antes de executar e criar valor que sobreviva ao brilho da primeira impressão.
            </p>
          </div>
        </div>
      </section>

      <section className="section activity" id="atividade">
        <div className="sectionIntro">
          <p className="eyebrow">Áreas de atuação</p>
          <h2>Uma visão transversal sobre o imobiliário.</h2>
        </div>
        <div className="areaGrid">
          {areas.map((area) => (
            <article key={area.number}>
              <span>{area.number}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="golden section" id="golden-jinx">
        <div className="goldenMark">GJ</div>
        <div>
          <p className="eyebrow">Golden Jinx · Sparkling Solutions</p>
          <h2>Transformamos potencial em brilho.</h2>
          <p>
            A Golden Jinx desenvolve projetos de construção, remodelação e valorização imobiliária, além da compra, venda e arrendamento de imóveis próprios. Luís Castanheira exerce funções de sócio-gerente da empresa.
          </p>
          <a className="textLink" href="https://goldenjinx.com">Visitar goldenjinx.com <span>↗</span></a>
          <a className="textLink" href="https://goldenjinx.com/luis-castanheira">Perfil na Golden Jinx <span>↗</span></a>
        </div>
      </section>

      <section className="section methodSection">
        <div className="sectionIntro">
          <p className="eyebrow">Método</p>
          <h2>Da análise à criação de valor.</h2>
        </div>
        <ol className="methodList">
          {method.map(([title, text], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="contact" id="contacto">
        <p className="eyebrow">Contacto profissional</p>
        <h2>Projetos e oportunidades começam por uma boa conversa.</h2>
        <p>
          Para assuntos profissionais relacionados com a Golden Jinx, construção, remodelação ou valorização imobiliária, utilize os contactos oficiais da empresa.
        </p>
        <a className="primary" href="https://goldenjinx.com/contactos">Contactar através da Golden Jinx</a>
      </section>

      <footer>
        <span>© 2026 Luís Castanheira</span>
        <a href="https://goldenjinx.com/luis-castanheira">Perfil na Golden Jinx</a>
      </footer>
    </main>
  );
}
