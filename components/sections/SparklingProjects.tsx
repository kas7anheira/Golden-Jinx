"use client";

import { useEffect, useState } from "react";

import ProjectCard from "../projects/ProjectCard";
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
  projects_eyebrow: "Antes & Depois",

  projects_title:
    "Sparkling Projects",

  projects_text:
    "Cada imóvel tem potencial.\nO nosso trabalho consiste em fazê-lo brilhar.",
};

export default function SparklingProjects() {
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
        "Erro ao carregar Sparkling Projects:",
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
    <section
      style={{
        background: "#0d0d0d",
        color: "white",

        padding:
          "clamp(75px, 10vw, 120px) clamp(18px, 4vw, 40px)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
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
              settings.projects_eyebrow
            }
          </div>

          <h2
            style={{
              fontSize:
                "clamp(2.4rem, 8vw, 3rem)",

              fontFamily:
                "var(--font-title)",

              fontWeight: 400,

              lineHeight: 1.05,

              margin:
                "0 0 18px",

              whiteSpace:
                "pre-line",
            }}
          >
            {
              settings.projects_title
            }
          </h2>

          <p
            style={{
              color: "#bdbdbd",

              fontSize:
                "clamp(14px, 3.4vw, 16px)",

              lineHeight: 1.8,

              margin: 0,

              whiteSpace:
                "pre-line",
            }}
          >
            {
              settings.projects_text
            }
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div style={messageStyle}>
            A carregar projetos...
          </div>
        )}

        {/* ERRO */}

        {!loading &&
          errorMessage && (
            <div style={errorStyle}>
              {errorMessage}
            </div>
          )}

        {/* SEM PROJETOS */}

        {!loading &&
          !errorMessage &&
          projects.length === 0 && (
            <div style={messageStyle}>
              <div
                style={{
                  fontFamily:
                    "var(--font-title)",

                  fontSize:
                    "1.8rem",

                  color: "#ddd",

                  marginBottom: 8,
                }}
              >
                Novos projetos em breve.
              </div>

              <div>
                Estamos a preparar novas transformações Golden Jinx.
              </div>
            </div>
          )}

        {/* PROJETOS */}

        {!loading &&
          !errorMessage &&
          projects.length > 0 && (
            <div
              style={{
                display:
                  "grid",

                gap:
                  "clamp(45px, 8vw, 80px)",
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
                      key={
                        project.id
                      }

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
  );
}

const messageStyle = {
  padding:
    "clamp(40px, 7vw, 65px) clamp(18px, 5vw, 30px)",

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