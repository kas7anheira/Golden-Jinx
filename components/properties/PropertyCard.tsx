"use client";

import Link from "next/link";

type PropertyCardProps = {
  image?: string | null;
  status: "Venda" | "Arrendamento";
  type: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: string;
  slug: string;
};

export default function PropertyCard({
  image,
  status,
  type,
  title,
  location,
  price,
  area,
  bedrooms,
  slug,
}: PropertyCardProps) {
  const hasImage =
    typeof image === "string" &&
    image.trim().length > 0;

  return (
    <article
      style={{
        background: "#151515",
        borderRadius: 22,
        overflow: "hidden",
        border: "1px solid rgba(200,162,74,.16)",
        boxShadow: "0 20px 60px rgba(0,0,0,.28)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* IMAGEM */}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 330,
          overflow: "hidden",
          background: "#111",
        }}
      >
        {hasImage ? (
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .6s ease",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background:
                "linear-gradient(135deg, #111111, #1a1a1a)",
              color: "#777",
            }}
          >
            <div
              style={{
                color: "#C8A24A",
                fontSize: 34,
                opacity: 0.7,
              }}
            >
              ⌂
            </div>

            <div
              style={{
                fontSize: 10,
                letterSpacing: 2.5,
                textTransform: "uppercase",
              }}
            >
              Fotografia em breve
            </div>
          </div>
        )}

        {/* GRADIENTE */}

        {hasImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,.15), transparent 45%, rgba(0,0,0,.45))",
              pointerEvents: "none",
            }}
          />
        )}

        {/* ESTADO */}

        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "9px 14px",
            borderRadius: 999,
            background:
              status === "Venda"
                ? "rgba(200,162,74,.95)"
                : "rgba(10,10,10,.78)",
            color:
              status === "Venda"
                ? "#111"
                : "#fff",
            border:
              status === "Venda"
                ? "none"
                : "1px solid rgba(255,255,255,.18)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {status}
        </div>

        {/* TIPO */}

        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            color: "white",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,.7)",
          }}
        >
          {type}
        </div>
      </div>

      {/* INFORMAÇÃO */}

      <div
        style={{
          padding: "28px 28px 30px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "1.65rem",
            fontWeight: 400,
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#C8A24A",
            fontSize: 13,
            letterSpacing: 1,
            margin: 0,
            marginBottom: 22,
          }}
        >
          {location}
        </p>

        {/* CARACTERÍSTICAS */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            paddingTop: 18,
            paddingBottom: 20,
            borderTop:
              "1px solid rgba(255,255,255,.08)",
            borderBottom:
              "1px solid rgba(255,255,255,.08)",
            color: "#bdbdbd",
            fontSize: 13,
          }}
        >
          <span>{bedrooms}</span>
          <span>{area}</span>
        </div>

        {/* RODAPÉ */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
            marginTop: "auto",
            paddingTop: 25,
          }}
        >
          <div>
            <div
              style={{
                color: "#888",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 5,
              }}
            >
              {status === "Venda"
                ? "Preço"
                : "Renda mensal"}
            </div>

            <div
              style={{
                color: "#C8A24A",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {price}
            </div>
          </div>

          <Link
            href={`/imoveis/${slug}`}
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: 12,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              paddingBottom: 5,
              borderBottom: "1px solid #C8A24A",
            }}
          >
            Ver imóvel →
          </Link>
        </div>
      </div>
    </article>
  );
}