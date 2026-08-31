import Link from "next/link";

export default function FounderProfile() {
  return (
    <section
      style={{
        background: "#0a0a0a",
        color: "white",
        padding: "clamp(64px, 9vw, 110px) 24px",
        borderTop: "1px solid rgba(255,255,255,.07)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(34px, 6vw, 72px)",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              color: "#C8A24A",
              textTransform: "uppercase",
              letterSpacing: 4,
              fontSize: 10,
              margin: "0 0 18px",
            }}
          >
            Perfil profissional
          </p>
          <h2
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
              fontWeight: 500,
              lineHeight: 1,
              margin: 0,
            }}
          >
            Luís Filipe Madeira Castanheira
          </h2>
        </div>

        <div>
          <p
            style={{
              color: "#aaa",
              lineHeight: 1.85,
              margin: 0,
              maxWidth: 560,
            }}
          >
            Economista e empresário ligado à Golden Jinx, com atividade em
            investimento, remodelação e valorização imobiliária.
          </p>
          <Link
            href="/luis-filipe-madeira-castanheira"
            style={{
              display: "inline-block",
              marginTop: 22,
              color: "#C8A24A",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Conhecer o perfil →
          </Link>
        </div>
      </div>
    </section>
  );
}
