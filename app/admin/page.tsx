"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: number;
  created_at: string;
  source: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  property_type: string | null;
  property_location: string | null;
  property_area: string | null;
  property_condition: string | null;
  status: string;
};

type Property = {
  id: number;
  published: boolean;
};

type Project = {
  id: number;
  published: boolean;
};

export default function AdminPage() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const loggedIn = Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await loadDashboardData();
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Email ou palavra-passe incorretos.");
      setLoggingIn(false);
      return;
    }

    setAuthenticated(true);
    setPassword("");
    setLoggingIn(false);

    await loadDashboardData();
  }

  async function loadDashboardData() {
    setLoadingData(true);

    const [leadsResult, propertiesResult, projectsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),

      supabase
        .from("properties")
        .select("id,published"),

      supabase
        .from("projects")
        .select("id,published"),
    ]);

    if (leadsResult.error) {
      console.error("Erro ao carregar leads:", leadsResult.error);
    }

    if (propertiesResult.error) {
      console.error("Erro ao carregar imóveis:", propertiesResult.error);
    }

    if (projectsResult.error) {
      console.error("Erro ao carregar projetos:", projectsResult.error);
    }

    setLeads((leadsResult.data || []) as Lead[]);
    setProperties((propertiesResult.data || []) as Property[]);
    setProjects((projectsResult.data || []) as Project[]);

    setLoadingData(false);
  }

  const stats = useMemo(() => {
    return {
      leads: leads.length,
      novos: leads.filter(
        (lead) => (lead.status || "").toLowerCase() === "novo"
      ).length,
      properties: properties.length,
      propertiesPublished: properties.filter((item) => item.published).length,
      projects: projects.length,
      projectsPublished: projects.filter((item) => item.published).length,
    };
  }, [leads, properties, projects]);

  if (loadingSession) {
    return (
      <main style={loadingPageStyle}>
        <div style={{ color: "#C8A24A" }}>A carregar Golden Jinx...</div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <>
        <Header />

        <main style={loginPageStyle}>
          <section style={loginCardStyle}>
            <div style={eyebrowStyle}>Golden Jinx</div>

            <h1 style={loginTitleStyle}>Back-office</h1>

            <p style={loginTextStyle}>
              Área reservada à gestão da Golden Jinx.
            </p>

            <form
              onSubmit={handleLogin}
              style={{
                display: "grid",
                gap: 18,
                marginTop: 35,
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Palavra-passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={inputStyle}
              />

              {loginError && <div style={errorStyle}>{loginError}</div>}

              <button
                type="submit"
                disabled={loggingIn}
                className="btn-primary"
                style={{
                  border: "none",
                  cursor: loggingIn ? "not-allowed" : "pointer",
                  opacity: loggingIn ? 0.65 : 1,
                }}
              >
                {loggingIn ? "A entrar..." : "Entrar"}
              </button>
            </form>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <AdminLayout
      title="Visão Geral"
      subtitle="Golden Jinx Back-office"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
          gap: 18,
          marginBottom: 34,
        }}
      >
        <DashboardCard
          label="Leads recentes"
          value={stats.leads}
          detail={`${stats.novos} novos`}
          href="/admin/leads"
        />

        <DashboardCard
          label="Imóveis"
          value={stats.properties}
          detail={`${stats.propertiesPublished} publicados`}
          href="/admin/imoveis"
        />

        <DashboardCard
          label="Sparkling Projects"
          value={stats.projects}
          detail={`${stats.projectsPublished} publicados`}
          href="/admin/projetos"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
          gap: 22,
        }}
      >
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>Atividade</div>
              <h2 style={panelTitleStyle}>Últimos leads</h2>
            </div>

            <Link href="/admin/leads" style={smallLinkStyle}>
              Ver todos →
            </Link>
          </div>

          {loadingData ? (
            <div style={emptyStyle}>A carregar...</div>
          ) : leads.length === 0 ? (
            <div style={emptyStyle}>Ainda não existem leads.</div>
          ) : (
            <div>
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 15,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "#ddd",
                          fontSize: 14,
                          marginBottom: 5,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          color: "#777",
                          fontSize: 11,
                          lineHeight: 1.5,
                        }}
                      >
                        {lead.source === "avaliacao" ? "Avaliação" : "Contacto"} ·{" "}
                        {new Date(lead.created_at).toLocaleDateString("pt-PT")}
                      </div>
                    </div>

                    <span
                      style={{
                        color:
                          (lead.status || "").toLowerCase() === "novo"
                            ? "#C8A24A"
                            : "#888",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.status || "Novo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <div style={panelEyebrowStyle}>Atalhos</div>
              <h2 style={panelTitleStyle}>Gestão rápida</h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <QuickLink
              href="/admin/imoveis"
              title="Gerir imóveis"
              text="Criar, editar, publicar e gerir fotografias."
            />

            <QuickLink
              href="/admin/projetos"
              title="Gerir Sparkling Projects"
              text="Criar projetos e controlar imagens Antes / Depois."
            />

            <QuickLink
              href="/admin/site"
              title="Conteúdos do site"
              text="Área preparada para textos, contactos e configurações."
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: number;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#151515",
          border: "1px solid rgba(200,162,74,.16)",
          borderRadius: 20,
          padding: "24px 25px",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontFamily: "var(--font-title)",
            color: "#C8A24A",
            fontSize: "2.7rem",
            lineHeight: 1,
            marginBottom: 10,
          }}
        >
          {value}
        </div>

        <div style={{ color: "#666", fontSize: 12 }}>{detail}</div>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "17px 18px",
        background: "#101010",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 14,
      }}
    >
      <div style={{ color: "#ddd", fontSize: 14, marginBottom: 6 }}>
        {title}
      </div>

      <div style={{ color: "#777", fontSize: 12, lineHeight: 1.6 }}>
        {text}
      </div>
    </Link>
  );
}

const panelStyle = {
  background: "#151515",
  border: "1px solid rgba(200,162,74,.16)",
  borderRadius: 22,
  padding: "clamp(20px, 4vw, 28px)",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  marginBottom: 12,
};

const panelEyebrowStyle = {
  color: "#C8A24A",
  fontSize: 9,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

const panelTitleStyle = {
  fontFamily: "var(--font-title)",
  fontWeight: 400,
  fontSize: "1.7rem",
  margin: 0,
};

const smallLinkStyle = {
  color: "#C8A24A",
  textDecoration: "none",
  fontSize: 12,
  whiteSpace: "nowrap" as const,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#0f0f0f",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 12,
  padding: "16px 18px",
  color: "white",
  fontSize: 16,
  outline: "none",
};

const eyebrowStyle = {
  color: "#C8A24A",
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase" as const,
  marginBottom: 15,
};

const loginPageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "140px 25px 80px",
};

const loginCardStyle = {
  width: "100%",
  maxWidth: 460,
  background: "#151515",
  border: "1px solid rgba(200,162,74,.18)",
  borderRadius: 26,
  padding: "clamp(28px, 6vw, 45px)",
  boxSizing: "border-box" as const,
};

const loginTitleStyle = {
  fontFamily: "var(--font-title)",
  fontSize: "clamp(2.5rem, 9vw, 3rem)",
  fontWeight: 400,
  margin: 0,
};

const loginTextStyle = {
  color: "#999",
  lineHeight: 1.7,
};

const loadingPageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const errorStyle = {
  padding: "14px 16px",
  borderRadius: 10,
  background: "rgba(180,50,50,.10)",
  border: "1px solid rgba(220,80,80,.30)",
  color: "#e6aaaa",
  fontSize: 13,
};

const emptyStyle = {
  padding: "32px 0",
  textAlign: "center" as const,
  color: "#777",
  fontSize: 13,
};