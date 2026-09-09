export default function AuthorBox() {
  return (
    <aside
      aria-label="Sobre o autor"
      style={{
        display: "grid",
        gridTemplateColumns: "88px minmax(0, 1fr)",
        gap: 22,
        alignItems: "center",
        marginTop: 56,
        padding: "24px",
        border: "1px solid rgba(200,162,74,.22)",
        background: "rgba(200,162,74,.045)",
      }}
    >
      <img
        src="/luis-castanheira-profissional.png"
        alt="Luís Castanheira"
        width="88"
        height="88"
        style={{
          width: 88,
          height: 88,
          objectFit: "cover",
          borderRadius: "50%",
          border: "1px solid rgba(200,162,74,.45)",
        }}
      />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#c8a24a",
            fontSize: ".66rem",
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
          }}
        >
          Sobre o autor
        </div>

        <h2
          style={{
            margin: "8px 0 6px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "1.8rem",
            color: "#f6f2e8",
          }}
        >
          Luís Castanheira
        </h2>

        <p
          style={{
            margin: 0,
            color: "#9d9a93",
            lineHeight: 1.7,
            fontSize: ".92rem",
          }}
        >
          Economista, empresário e Sócio-Gerente da Golden Jinx, com atividade em
          construção, remodelação, valorização imobiliária, gestão de projetos e
          controlo de custos.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginTop: 14,
            fontSize: ".78rem",
          }}
        >
          <a href="/" style={{ color: "#c8a24a" }}>Perfil profissional</a>
          <a href="https://goldenjinx.com/luis-castanheira" style={{ color: "#c8a24a" }}>
            Golden Jinx
          </a>
          <a href="https://www.linkedin.com/in/luiscastanheira/" style={{ color: "#c8a24a" }}>
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}
