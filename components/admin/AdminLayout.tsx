"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Building2,
  FolderKanban,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const navigation = [
  {
    label: "Visão Geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: Mail,
  },
  {
    label: "Imóveis",
    href: "/admin/imoveis",
    icon: Building2,
  },
  {
    label: "Sparkling Projects",
    href: "/admin/projetos",
    icon: FolderKanban,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    label: "Site / Conteúdos",
    href: "/admin/site",
    icon: BarChart3,
  },
  {
    label: "Definições",
    href: "/admin/definicoes",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
  title = "Visão Geral",
  subtitle = "Gestão Golden Jinx",
}: AdminLayoutProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href =
      "/admin";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
      }}
    >
      {/* SIDEBAR DESKTOP */}

      <aside
        className="hidden lg:flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,

          width: 270,

          flexDirection: "column",

          background: "#101010",

          borderRight:
            "1px solid rgba(200,162,74,.14)",

          zIndex: 100,
        }}
      >
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* TOPBAR MOBILE */}

      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,

          height: 74,

          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",

          padding: "0 18px",

          background:
            "rgba(10,10,10,.96)",

          backdropFilter:
            "blur(18px)",

          WebkitBackdropFilter:
            "blur(18px)",

          borderBottom:
            "1px solid rgba(200,162,74,.14)",

          zIndex: 120,
        }}
      >
        <div>
          <div
            style={{
              fontFamily:
                "var(--font-title)",

              fontSize: "1.2rem",

              letterSpacing: 2,
            }}
          >
            GOLDEN{" "}
            <span
              style={{
                color: "#C8A24A",
              }}
            >
              JINX
            </span>
          </div>

          <div
            style={{
              marginTop: 4,

              color: "#777",

              fontSize: 8,

              letterSpacing: 2.5,

              textTransform:
                "uppercase",
            }}
          >
            Back-office
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Abrir menu do back-office"
          style={{
            width: 44,
            height: 44,

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",

            borderRadius: 10,

            border:
              "1px solid rgba(255,255,255,.14)",

            background:
              "rgba(255,255,255,.05)",

            color: "#C8A24A",

            cursor: "pointer",
          }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENU MOBILE */}

      {mobileOpen && (
        <>
          <div
            onClick={() =>
              setMobileOpen(false)
            }
            style={{
              position: "fixed",

              inset: 0,

              background:
                "rgba(0,0,0,.70)",

              zIndex: 130,
            }}
          />

          <aside
            style={{
              position: "fixed",

              top: 0,
              left: 0,
              bottom: 0,

              width:
                "min(88vw, 310px)",

              background:
                "#101010",

              borderRight:
                "1px solid rgba(200,162,74,.18)",

              zIndex: 140,

              overflowY: "auto",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Fechar menu"
              style={{
                position:
                  "absolute",

                top: 17,
                right: 17,

                width: 40,
                height: 40,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                borderRadius: 10,

                border:
                  "1px solid rgba(255,255,255,.12)",

                background:
                  "rgba(255,255,255,.04)",

                color: "#aaa",

                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <SidebarContent
              pathname={pathname}
              onLogout={
                handleLogout
              }
            />
          </aside>
        </>
      )}

      {/* CONTEÚDO */}

      <main
        className="admin-main"
        style={{
          minHeight: "100vh",
          background: "#0b0b0b",
        }}
      >
        <style jsx>{`
          .admin-main {
            width: 100%;
            padding-left: 0;
            box-sizing: border-box;
          }

          @media (min-width: 1024px) {
            .admin-main {
              margin-left: 270px;
              width: calc(100% - 270px);
            }
          }
        `}</style>

        <div
          style={{
            padding:
              "clamp(105px, 12vw, 125px) clamp(18px, 4vw, 42px) 90px",

            width: "100%",
            maxWidth: 1550,
            boxSizing: "border-box",

            margin: "0 auto",
          }}
        >
          {/* CABEÇALHO DA SECÇÃO */}

          <div
            style={{
              marginBottom:
                "clamp(30px, 6vw, 50px)",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "flex-end",

              gap: 20,

              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#C8A24A",

                  fontSize: 10,

                  letterSpacing: 3,

                  textTransform:
                    "uppercase",

                  marginBottom: 10,
                }}
              >
                {subtitle}
              </div>

              <h1
                style={{
                  fontFamily:
                    "var(--font-title)",

                  fontSize:
                    "clamp(2.5rem, 6vw, 4rem)",

                  fontWeight: 400,

                  lineHeight: 1,

                  margin: 0,
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100%",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* MARCA */}

      <div
        style={{
          padding:
            "34px 28px 28px",

          borderBottom:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <Link
          href="/admin"
          style={{
            color: "white",

            textDecoration: "none",
          }}
        >
          <div
            style={{
              fontFamily:
                "var(--font-title)",

              fontSize: "1.45rem",

              letterSpacing: 2,
            }}
          >
            GOLDEN{" "}
            <span
              style={{
                color: "#C8A24A",
              }}
            >
              JINX
            </span>
          </div>

          <div
            style={{
              marginTop: 6,

              color: "#666",

              fontSize: 9,

              letterSpacing: 3,

              textTransform:
                "uppercase",
            }}
          >
            Back-office
          </div>
        </Link>
      </div>

      {/* MENU */}

      <nav
        style={{
          display: "flex",

          flexDirection: "column",

          padding: "24px 14px",

          gap: 5,
        }}
      >
        {navigation.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              item.href === "/admin"
                ? pathname ===
                  "/admin"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: 13,

                  padding:
                    "13px 14px",

                  borderRadius:
                    11,

                  textDecoration:
                    "none",

                  color: active
                    ? "#E4C56D"
                    : "#aaa",

                  background:
                    active
                      ? "rgba(200,162,74,.10)"
                      : "transparent",

                  border: active
                    ? "1px solid rgba(200,162,74,.20)"
                    : "1px solid transparent",

                  fontSize: 13,

                  transition:
                    "background .2s ease, color .2s ease",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={
                    1.7
                  }
                />

                <span>
                  {item.label}
                </span>
              </Link>
            );
          }
        )}
      </nav>

      {/* FUNDO DA SIDEBAR */}

      <div
        style={{
          marginTop: "auto",

          padding:
            "20px 14px 24px",
        }}
      >
        <div
          style={{
            height: 1,

            background:
              "rgba(255,255,255,.06)",

            marginBottom: 18,
          }}
        />

        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",

            display: "flex",

            alignItems: "center",

            gap: 12,

            padding:
              "12px 14px",

            borderRadius: 10,

            background:
              "transparent",

            border:
              "1px solid rgba(255,255,255,.08)",

            color: "#888",

            cursor: "pointer",

            fontSize: 13,

            textAlign: "left",
          }}
        >
          <LogOut
            size={17}
            strokeWidth={1.7}
          />

          Terminar sessão
        </button>

        <div
          style={{
            textAlign: "center",

            color: "#444",

            fontSize: 8,

            letterSpacing: 2,

            textTransform:
              "uppercase",

            marginTop: 20,
          }}
        >
          Sparkling Solutions
        </div>
      </div>
    </div>
  );
}