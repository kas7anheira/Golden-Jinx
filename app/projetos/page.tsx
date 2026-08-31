"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import ProjectCard from "@/components/projects/ProjectCard";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/components/hooks/useSiteSettings";

type Project = {
  id: number;
  slug: string;
  title: string;
  location: string | null;
  description: string | null;
  before_image: string | null;
  after_image: string | null;
  published: boolean;
  created_at: string;
};

const defaults = {
  projects_page_eyebrow: "Sparkling Projects",
  projects_page_title:
    "Transformamos\npotencial em valor.",
  projects_page_intro:
    "Cada projeto Golden Jinx nasce de uma oportunidade. Identificamos potencial, transformamos o espaço e criamos imóveis preparados para uma nova vida.",

  projects_page_loading_text:
    "A carregar projetos...",

  projects_page_empty_title:
    "Novos projetos em breve.",

  projects_page_empty_text:
    "Estamos a preparar novas transformações Golden Jinx.",

  projects_page_cta_eyebrow:
    "Tem um imóvel com potencial?",

  projects_page_cta_title:
    "Talvez seja o nosso próximo projeto.",

  projects_page_cta_text:
    "Procuramos imóveis, moradias, edifícios e oportunidades com potencial de transformação e valorização.",

  projects_page_cta_button_label:
    "Falar com a Golden Jinx",

  projects_page_cta_button_href:
    "/contactos",
};

export default function ProjetosPage() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const { settings } =
    useSiteSettings(defaults);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } =
      await supabase
        .from("projects")
        .select(`
          id,
          slug,
          title,
          location,
          description,
          before_image,
          after_image,
          published,
          created_at
        `)
        .eq("published", true)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Erro ao carregar projetos:",
        error
      );

      setErrorMessage(
        "Não foi possível carregar os projetos."
      );

      setLoading(false);
      return;
    }

    setProjects(
      (data || []) as Project[]
    );

    setLoading(false);
  }

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "white",
          paddingTop:
            "clamp(78px, 10vw, 90px)",
        }}
      >
        {/* HERO */}

        <section
          style={{
            padding:
              "clamp(65px, 11vw, 110px) clamp(18px, 4vw, 40px) clamp(50px, 8vw, 80px)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#C8A24A",
                fontSize: 11,
                letterSpacing: 4,
                textTransform:
                  "uppercase",
                marginBottom: 20,
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_eyebrow
              }
            </div>

            <h1
              style={{
                fontFamily:
                  "var(--font-title)",
                fontSize:
                  "clamp(2.7rem, 10vw, 6rem)",
                fontWeight: 400,
                lineHeight: 0.98,
                margin: "0 0 30px",
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_title
              }
            </h1>

            <p
              style={{
                color: "#b8b8b8",
                maxWidth: 700,
                margin: "0 auto",
                lineHeight: 1.8,
                fontSize:
                  "clamp(14px, 3.4vw, 16px)",
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_intro
              }
            </p>
          </div>
        </section>

        {/* PROJETOS */}

        <section
          style={{
            padding:
              "clamp(20px, 5vw, 30px) clamp(18px, 4vw, 40px) clamp(80px, 11vw, 120px)",
          }}
        >
          <div
            style={{
              maxWidth: 1350,
              margin: "auto",
            }}
          >
            {loading && (
              <div style={messageStyle}>
                {
                  settings.projects_page_loading_text
                }
              </div>
            )}

            {!loading &&
              errorMessage && (
                <div style={errorStyle}>
                  {errorMessage}
                </div>
              )}

            {!loading &&
              !errorMessage &&
              projects.length === 0 && (
                <div style={messageStyle}>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-title)",
                      fontSize: "2rem",
                      color: "#ddd",
                      marginBottom: 10,
                      whiteSpace:
                        "pre-line",
                    }}
                  >
                    {
                      settings.projects_page_empty_title
                    }
                  </div>

                  <div
                    style={{
                      whiteSpace:
                        "pre-line",
                    }}
                  >
                    {
                      settings.projects_page_empty_text
                    }
                  </div>
                </div>
              )}

            {!loading &&
              !errorMessage &&
              projects.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap:
                      "clamp(45px, 8vw, 70px)",
                  }}
                >
                  {projects.map(
                    (project) => {
                      if (
                        !project.before_image ||
                        !project.after_image
                      ) {
                        return null;
                      }

                      return (
                        <ProjectCard
                          key={project.id}
                          before={
                            project.before_image
                          }
                          after={
                            project.after_image
                          }
                          title={
                            project.title
                          }
                          location={
                            project.location ||
                            ""
                          }
                          description={
                            project.description ||
                            ""
                          }
                        />
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </section>

        {/* CTA */}

        <section
          style={{
            padding:
              "0 clamp(18px, 4vw, 40px) clamp(80px, 11vw, 120px)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "auto",
              padding:
                "clamp(40px, 7vw, 70px) clamp(22px, 5vw, 45px)",
              borderRadius:
                "clamp(20px, 5vw, 28px)",
              textAlign: "center",
              background: "#161616",
              border:
                "1px solid rgba(200,162,74,.18)",
            }}
          >
            <div
              style={{
                color: "#C8A24A",
                fontSize: 11,
                letterSpacing: 3,
                textTransform:
                  "uppercase",
                marginBottom: 20,
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_cta_eyebrow
              }
            </div>

            <h2
              style={{
                fontFamily:
                  "var(--font-title)",
                fontSize:
                  "clamp(2rem, 8vw, 3.8rem)",
                fontWeight: 400,
                margin: "0 0 20px",
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_cta_title
              }
            </h2>

            <p
              style={{
                color: "#aaa",
                maxWidth: 650,
                margin:
                  "0 auto 35px",
                lineHeight: 1.8,
                fontSize:
                  "clamp(14px, 3.4vw, 16px)",
                whiteSpace:
                  "pre-line",
              }}
            >
              {
                settings.projects_page_cta_text
              }
            </p>

            <Link
              href={
                settings.projects_page_cta_button_href
              }
              className="btn-primary"
              style={{
                display:
                  "inline-block",
                textDecoration:
                  "none",
              }}
            >
              {
                settings.projects_page_cta_button_label
              }
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const messageStyle = {
  padding:
    "clamp(45px, 8vw, 70px) clamp(18px, 5vw, 30px)",

  textAlign:
    "center" as const,

  borderRadius: 20,

  background:
    "#151515",

  border:
    "1px solid rgba(255,255,255,.08)",

  color:
    "#888",

  lineHeight:
    1.7,
};

const errorStyle = {
  ...messageStyle,

  color:
    "#e6aaaa",

  border:
    "1px solid rgba(220,80,80,.30)",
};