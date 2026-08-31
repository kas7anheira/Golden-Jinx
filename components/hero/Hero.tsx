"use client";

import Link from "next/link";

import { useSiteSettings } from "@/components/hooks/useSiteSettings";

const defaults = {
  hero_eyebrow:
    "Golden Jinx · Sparkling Solutions",

  hero_title:
    "Transformamos\npotencial\nem brilho.",

  hero_text:
    "Identificamos oportunidades exclusivas.\nTransformamos imóveis em património com valor.\nCriamos espaços para viver e investir.",

  hero_background_image:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",

  hero_button_primary_label:
    "Explorar Imóveis",

  hero_button_primary_href:
    "/comprar",

  hero_button_secondary_label:
    "Conhecer Projetos",

  hero_button_secondary_href:
    "/projetos",
};

export default function Hero() {
  const { settings } =
    useSiteSettings(defaults);

  const backgroundImage =
    settings.hero_background_image?.trim() ||
    defaults.hero_background_image;

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",

        background: `
          linear-gradient(
            rgba(0,0,0,.55),
            rgba(0,0,0,.62)
          ),
          url("${backgroundImage}")
          center / cover no-repeat
        `,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1350,
          margin: "0 auto",

          padding:
            "clamp(125px, 18vh, 180px) clamp(20px, 5vw, 60px) clamp(70px, 10vh, 110px)",

          boxSizing: "border-box",
        }}
      >
        {/* PEQUENO TÍTULO */}

        <div
          style={{
            color: "#C8A24A",
            fontSize: 10,

            letterSpacing:
              "clamp(2.5px, 1vw, 4px)",

            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          {settings.hero_eyebrow}
        </div>

        {/* TÍTULO */}

        <h1
          style={{
            fontFamily:
              "var(--font-title)",

            fontSize:
              "clamp(3.1rem, 11vw, 5.5rem)",

            lineHeight: 0.95,
            fontWeight: 400,

            margin:
              "0 0 clamp(24px, 5vw, 30px)",

            maxWidth: 800,

            letterSpacing:
              "-0.02em",

            whiteSpace:
              "pre-line",
          }}
        >
          {settings.hero_title}
        </h1>

        {/* TEXTO */}

        <p
          style={{
            fontSize:
              "clamp(0.95rem, 3.4vw, 1.2rem)",

            lineHeight: 1.8,
            color: "#d0d0d0",

            margin:
              "0 0 clamp(30px, 6vw, 40px)",

            maxWidth: 620,

            whiteSpace:
              "pre-line",
          }}
        >
          {settings.hero_text}
        </p>

        {/* BOTÕES */}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Link
            className="btn-primary"
            href={
              settings.hero_button_primary_href
            }
            style={{
              textDecoration: "none",
              textAlign: "center",
              minWidth: 165,
            }}
          >
            {
              settings.hero_button_primary_label
            }
          </Link>

          <Link
            className="btn-secondary"
            href={
              settings.hero_button_secondary_href
            }
            style={{
              textDecoration: "none",
              textAlign: "center",
              minWidth: 165,
            }}
          >
            {
              settings.hero_button_secondary_label
            }
          </Link>
        </div>
      </div>

      {/* INDICADOR INFERIOR */}

      <div
        style={{
          position: "absolute",

          bottom: 24,

          left: "50%",

          transform:
            "translateX(-50%)",

          color:
            "rgba(255,255,255,.45)",

          fontSize: 18,

          pointerEvents: "none",
        }}
      >
        ↓
      </div>
    </section>
  );
}