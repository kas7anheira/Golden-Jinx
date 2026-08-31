"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useSiteSettings } from "@/components/hooks/useSiteSettings";

const defaults = {
  company_name: "Golden Jinx",
  company_slogan: "Sparkling Solutions",

  header_buy_label: "Comprar",
  header_rent_label: "Arrendar",
  header_projects_label: "Projetos",
  header_contacts_label: "Contactos",

  header_cta_label: "Avaliar Imóvel",
  header_cta_href: "/avaliar-imovel",
};

export default function Header() {
  const [open, setOpen] = useState(false);

  const { settings } =
    useSiteSettings(defaults);

  const menu = useMemo(
    () => [
      {
        label:
          settings.header_buy_label,
        href: "/comprar",
      },
      {
        label:
          settings.header_rent_label,
        href: "/arrendar",
      },
      {
        label:
          settings.header_projects_label,
        href: "/projetos",
      },
      {
        label:
          settings.header_contacts_label,
        href: "/contactos",
      },
    ],
    [settings]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full"
      style={{
        background:
          "rgba(0,0,0,.48)",

        backdropFilter:
          "blur(18px)",

        WebkitBackdropFilter:
          "blur(18px)",

        borderBottom:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* BARRA PRINCIPAL */}

      <div
        style={{
          maxWidth: 1500,
          margin: "auto",

          height:
            "clamp(78px, 10vw, 90px)",

          padding:
            "0 clamp(16px, 4vw, 24px)",

          display: "flex",

          alignItems:
            "center",

          boxSizing:
            "border-box",

          width: "100%",
        }}
      >
        {/* LOGO */}

        <Link
          href="/"
          onClick={() =>
            setOpen(false)
          }
          style={{
            color: "white",

            textDecoration:
              "none",

            display: "block",

            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily:
                "var(--font-title)",

              fontSize:
                "clamp(1.35rem, 5vw, 1.65rem)",

              letterSpacing:
                "clamp(1.5px, .7vw, 2px)",

              lineHeight: 1,

              whiteSpace:
                "nowrap",

              textTransform:
                "uppercase",
            }}
          >
            {renderCompanyName(
              settings.company_name
            )}
          </div>

          <div
            style={{
              marginTop: 5,

              color:
                "#d6d6d6",

              letterSpacing:
                "clamp(2px, .8vw, 3px)",

              textTransform:
                "uppercase",

              fontSize:
                "clamp(.5rem, 2vw, .58rem)",

              lineHeight: 1,

              whiteSpace:
                "nowrap",
            }}
          >
            {
              settings.company_slogan
            }
          </div>
        </Link>

        {/* MENU DESKTOP */}

        <nav
          className="hidden lg:flex"
          style={{
            alignItems:
              "center",

            gap: 42,

            marginLeft:
              "auto",
          }}
        >
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="golden-link"
              style={{
                color: "white",

                textDecoration:
                  "none",

                fontSize: 14,
              }}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={
              settings.header_cta_href
            }
            className="btn-primary"
            style={{
              textDecoration:
                "none",
            }}
          >
            {
              settings.header_cta_label
            }
          </Link>
        </nav>

        {/* BOTÃO MOBILE */}

        <div
          className="lg:hidden"
          style={{
            marginLeft:
              "auto",

            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setOpen(
                (value) =>
                  !value
              )
            }
            aria-label={
              open
                ? "Fechar menu"
                : "Abrir menu"
            }
            aria-expanded={open}
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              width:
                "clamp(44px, 11vw, 48px)",

              height:
                "clamp(44px, 11vw, 48px)",

              padding: 0,

              background:
                open
                  ? "rgba(200,162,74,.13)"
                  : "rgba(255,255,255,.08)",

              border:
                "1px solid rgba(255,255,255,.26)",

              borderRadius:
                10,

              color:
                "#D4AF37",

              fontSize:
                "clamp(27px, 8vw, 32px)",

              fontFamily:
                "Arial, sans-serif",

              fontWeight:
                "bold",

              cursor:
                "pointer",

              lineHeight: 1,

              boxSizing:
                "border-box",
            }}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}

      {open && (
        <div
          style={{
            width: "100%",

            height:
              "calc(100svh - clamp(78px, 10vw, 90px))",

            overflowY:
              "auto",

            background:
              "rgba(8,8,8,.985)",

            backdropFilter:
              "blur(20px)",

            WebkitBackdropFilter:
              "blur(20px)",

            borderTop:
              "1px solid rgba(255,255,255,.08)",

            padding:
              "14px clamp(18px, 5vw, 24px) max(28px, env(safe-area-inset-bottom))",

            boxSizing:
              "border-box",
          }}
        >
          <nav
            style={{
              display: "flex",

              flexDirection:
                "column",

              maxWidth: 700,

              margin:
                "0 auto",
            }}
          >
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setOpen(false)
                }
                style={{
                  display: "block",

                  color:
                    "#ffffff",

                  textDecoration:
                    "none",

                  fontSize: 16,

                  padding:
                    "18px 0",

                  borderBottom:
                    "1px solid rgba(255,255,255,.09)",
                }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={
                settings.header_cta_href
              }
              className="btn-primary"
              onClick={() =>
                setOpen(false)
              }
              style={{
                display: "block",

                textDecoration:
                  "none",

                textAlign:
                  "center",

                marginTop: 24,

                width: "100%",
              }}
            >
              {
                settings.header_cta_label
              }
            </Link>

            <div
              style={{
                marginTop: 32,

                color: "#666",

                fontSize: 10,

                letterSpacing:
                  2.5,

                textTransform:
                  "uppercase",

                textAlign:
                  "center",
              }}
            >
              {
                settings.company_name
              }{" "}
              ·{" "}
              {
                settings.company_slogan
              }
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function renderCompanyName(
  companyName: string
) {
  const words =
    companyName
      .trim()
      .split(/\s+/);

  if (words.length < 2) {
    return companyName.toUpperCase();
  }

  const lastWord =
    words.pop();

  const firstPart =
    words.join(" ");

  return (
    <>
      {firstPart.toUpperCase()}{" "}

      <span
        style={{
          color: "#C8A24A",
        }}
      >
        {lastWord?.toUpperCase()}
      </span>
    </>
  );
}