"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type FooterContent = {
  companyName: string;
  slogan: string;
  footerText: string;
  email: string;
  phone: string;
  location: string;
};

const defaultContent: FooterContent = {
  companyName: "Golden Jinx",
  slogan: "Sparkling Solutions",
  footerText:
    "Transformamos potencial em brilho. Descobrimos oportunidades, criamos valor e construímos património.",
  email: "info@goldenjinx.pt",
  phone: "+351 XXX XXX XXX",
  location: "Portugal",
};

export default function Footer() {
  const [content, setContent] =
    useState<FooterContent>(defaultContent);

  useEffect(() => {
    loadFooterContent();
  }, []);

  async function loadFooterContent() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "company_name",
        "company_slogan",
        "footer_text",
        "contact_email",
        "contact_phone",
        "contact_location",
      ]);

    if (error) {
      console.error(
        "Erro ao carregar conteúdo do Footer:",
        error
      );

      return;
    }

    const settings = data || [];

    function getValue(
      key: string,
      fallback: string
    ) {
      const setting = settings.find(
        (item) =>
          item.setting_key === key
      );

      return (
        setting?.setting_value?.trim() ||
        fallback
      );
    }

    setContent({
      companyName: getValue(
        "company_name",
        defaultContent.companyName
      ),

      slogan: getValue(
        "company_slogan",
        defaultContent.slogan
      ),

      footerText: getValue(
        "footer_text",
        defaultContent.footerText
      ),

      email: getValue(
        "contact_email",
        defaultContent.email
      ),

      phone: getValue(
        "contact_phone",
        defaultContent.phone
      ),

      location: getValue(
        "contact_location",
        defaultContent.location
      ),
    });
  }

  return (
    <footer
      style={{
        background: "#080808",
        color: "white",
        borderTop:
          "1px solid rgba(200,162,74,.15)",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1350,
          margin: "auto",
          padding:
            "clamp(55px, 8vw, 90px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 60px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap:
              "clamp(35px, 6vw, 60px)",
            width: "100%",
          }}
        >
          {/* MARCA */}

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontFamily:
                  "var(--font-title)",
                fontSize:
                  "clamp(1.65rem, 4vw, 2rem)",
                letterSpacing:
                  "clamp(2px, .7vw, 4px)",
                marginBottom: 8,
                whiteSpace: "normal",
                textTransform:
                  "uppercase",
              }}
            >
              {renderCompanyName(
                content.companyName
              )}
            </div>

            <div
              style={{
                color: "#C8A24A",
                letterSpacing:
                  "clamp(2px, .7vw, 4px)",
                fontSize: 10,
                marginBottom: 25,
                textTransform:
                  "uppercase",
              }}
            >
              {content.slogan}
            </div>

            <p
              style={{
                color: "#999",
                lineHeight: 1.8,
                maxWidth: 400,
                margin: 0,
                fontSize: 14,
                whiteSpace:
                  "pre-line",
              }}
            >
              {content.footerText}
            </p>
          </div>

          {/* NAVEGAÇÃO */}

          <FooterColumn title="Explorar">
            <FooterLink href="/comprar">
              Comprar
            </FooterLink>

            <FooterLink href="/arrendar">
              Arrendar
            </FooterLink>

            <FooterLink href="/projetos">
              Projetos
            </FooterLink>

            <FooterLink href="/avaliar-imovel">
              Avaliar imóvel
            </FooterLink>
          </FooterColumn>

          {/* EMPRESA */}

          <FooterColumn title={content.companyName}>
            <FooterLink href="/projetos">
              Os nossos projetos
            </FooterLink>

            <FooterLink href="/avaliar-imovel">
              Avaliar imóvel
            </FooterLink>

            <FooterLink href="/contactos">
              Contactos
            </FooterLink>
          </FooterColumn>

          {/* CONTACTOS */}

          <FooterColumn title="Contactos">
            <FooterText>
              {content.location}
            </FooterText>

            <a
              href={`mailto:${content.email}`}
              style={linkStyle}
            >
              {content.email}
            </a>

            <a
              href={`tel:${cleanPhone(
                content.phone
              )}`}
              style={linkStyle}
            >
              {content.phone}
            </a>
          </FooterColumn>
        </div>

        <div
          style={{
            height: 1,
            background:
              "rgba(255,255,255,.08)",
            margin:
              "clamp(45px, 7vw, 70px) 0 30px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            color: "#666",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          <span>
            © {new Date().getFullYear()}{" "}
            {content.companyName}. Todos os direitos reservados.
          </span>

          <span>
            {content.slogan}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minWidth: 0,
      }}
    >
      <h3
        style={{
          margin: "0 0 22px",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection:
            "column",
          alignItems:
            "flex-start",
          gap: 14,
          color: "#999",
          fontSize: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={linkStyle}
    >
      {children}
    </Link>
  );
}

function FooterText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        color: "#999",
        overflowWrap:
          "anywhere",
      }}
    >
      {children}
    </span>
  );
}

function cleanPhone(
  phone: string
) {
  return phone.replace(
    /[^+\d]/g,
    ""
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

const linkStyle = {
  color: "#999",
  textDecoration: "none",
  overflowWrap:
    "anywhere" as const,
};