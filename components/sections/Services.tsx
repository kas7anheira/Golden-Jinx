"use client";

import Link from "next/link";

import {
  Home,
  Hammer,
  KeyRound,
} from "lucide-react";

import { useSiteSettings } from "@/components/hooks/useSiteSettings";

const defaults = {
  services_eyebrow:
    "Golden Jinx",

  services_title:
    "O que fazemos",

  services_text:
    "Descobrimos oportunidades, transformamos imóveis e criamos património com valor.",

  service_buy_title:
    "Comprar",

  service_buy_text:
    "Selecionamos imóveis com elevado potencial de valorização.",

  service_buy_href:
    "/comprar",

  service_transform_title:
    "Transformar",

  service_transform_text:
    "Remodelamos e construímos espaços que ganham uma nova vida.",

  service_transform_href:
    "/projetos",

  service_rent_title:
    "Arrendar",

  service_rent_text:
    "Disponibilizamos imóveis modernos e preparados para viver.",

  service_rent_href:
    "/arrendar",

  service_more_label:
    "Saber mais",
};

export default function Services() {
  const { settings } =
    useSiteSettings(defaults);

  const services = [
    {
      icon: Home,
      title:
        settings.service_buy_title,
      text:
        settings.service_buy_text,
      href:
        settings.service_buy_href,
    },

    {
      icon: Hammer,
      title:
        settings.service_transform_title,
      text:
        settings.service_transform_text,
      href:
        settings.service_transform_href,
    },

    {
      icon: KeyRound,
      title:
        settings.service_rent_title,
      text:
        settings.service_rent_text,
      href:
        settings.service_rent_href,
    },
  ];

  return (
    <section
      style={{
        background: "#111111",
        color: "white",

        padding:
          "clamp(75px, 10vw, 120px) clamp(18px, 4vw, 40px)",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "auto",
        }}
      >
        {/* TÍTULO */}

        <div
          style={{
            textAlign: "center",
            maxWidth: 760,

            margin:
              "0 auto clamp(45px, 7vw, 70px)",
          }}
        >
          <div
            style={{
              color: "#C8A24A",
              fontSize: 10,
              letterSpacing: 3,
              textTransform:
                "uppercase",
              marginBottom: 15,
              whiteSpace:
                "pre-line",
            }}
          >
            {
              settings.services_eyebrow
            }
          </div>

          <h2
            style={{
              fontSize:
                "clamp(2.4rem, 8vw, 3rem)",

              margin:
                "0 0 18px",

              fontFamily:
                "var(--font-title)",

              fontWeight: 400,

              whiteSpace:
                "pre-line",
            }}
          >
            {
              settings.services_title
            }
          </h2>

          <p
            style={{
              color: "#bbbbbb",

              fontSize:
                "clamp(.95rem, 3.4vw, 1.15rem)",

              lineHeight: 1.8,

              margin: 0,

              whiteSpace:
                "pre-line",
            }}
          >
            {
              settings.services_text
            }
          </p>
        </div>

        {/* SERVIÇOS */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",

            gap:
              "clamp(18px, 4vw, 30px)",
          }}
        >
          {services.map(
            (service) => {
              const Icon =
                service.icon;

              return (
                <Link
                  key={
                    service.title
                  }
                  href={
                    service.href
                  }
                  style={{
                    textDecoration:
                      "none",

                    color:
                      "inherit",
                  }}
                >
                  <article
                    style={{
                      height:
                        "100%",

                      boxSizing:
                        "border-box",

                      background:
                        "#1b1b1b",

                      borderRadius:
                        "clamp(16px, 4vw, 18px)",

                      padding:
                        "clamp(28px, 6vw, 45px)",

                      border:
                        "1px solid rgba(255,255,255,.08)",

                      transition:
                        "transform .3s ease, border-color .3s ease",
                    }}
                  >
                    <Icon
                      size={42}
                      color="#C8A24A"
                      strokeWidth={
                        1.5
                      }
                      style={{
                        marginBottom:
                          "clamp(20px, 4vw, 25px)",
                      }}
                    />

                    <h3
                      style={{
                        fontSize:
                          "clamp(1.45rem, 5vw, 1.7rem)",

                        margin:
                          "0 0 15px",

                        fontWeight:
                          500,

                        color:
                          "#ffffff",

                        whiteSpace:
                          "pre-line",
                      }}
                    >
                      {
                        service.title
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "#bdbdbd",

                        lineHeight:
                          1.8,

                        fontSize:
                          14,

                        margin: 0,

                        whiteSpace:
                          "pre-line",
                      }}
                    >
                      {
                        service.text
                      }
                    </p>

                    <div
                      style={{
                        marginTop:
                          25,

                        color:
                          "#C8A24A",

                        fontSize:
                          11,

                        letterSpacing:
                          1.5,

                        textTransform:
                          "uppercase",
                      }}
                    >
                      {
                        settings.service_more_label
                      }{" "}
                      →
                    </div>
                  </article>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}