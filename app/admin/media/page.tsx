"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type Property = {
  id: number;
  title: string;
  location: string;
  slug: string;
  cover_image: string | null;
};

type PropertyImage = {
  id: number;
  property_id: number;
  image_url: string;
  position: number | null;
};

type Project = {
  id: number;
  title: string;
  location: string | null;
  slug: string;
  before_image: string | null;
  after_image: string | null;
};

type MediaItem = {
  key: string;
  imageUrl: string;
  kind: "Capa de imóvel" | "Galeria de imóvel" | "Antes" | "Depois";
  sourceType: "Imóvel" | "Projeto";
  title: string;
  location: string;
  href: string;
};

type FilterValue = "Todos" | "Imóveis" | "Projetos";

export default function AdminMediaPage() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("Todos");

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const loggedIn = Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await loadMedia();
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

  async function loadMedia() {
    setLoading(true);
    setErrorMessage("");

    const [
      propertiesResult,
      galleryResult,
      projectsResult,
    ] = await Promise.all([
      supabase
        .from("properties")
        .select("id,title,location,slug,cover_image")
        .order("created_at", { ascending: false }),

      supabase
        .from("property_images")
        .select("id,property_id,image_url,position")
        .order("position", { ascending: true }),

      supabase
        .from("projects")
        .select("id,title,location,slug,before_image,after_image")
        .order("created_at", { ascending: false }),
    ]);

    if (propertiesResult.error) {
      console.error(
        "Erro ao carregar capas dos imóveis:",
        propertiesResult.error
      );
    }

    if (galleryResult.error) {
      console.error(
        "Erro ao carregar galerias dos imóveis:",
        galleryResult.error
      );
    }

    if (projectsResult.error) {
      console.error(
        "Erro ao carregar imagens dos projetos:",
        projectsResult.error
      );
    }

    const hasError =
      propertiesResult.error ||
      galleryResult.error ||
      projectsResult.error;

    if (hasError) {
      setErrorMessage(
        "Não foi possível carregar toda a biblioteca de Media. Confirme as permissões das tabelas."
      );
    }

    setProperties(
      (propertiesResult.data || []) as Property[]
    );

    setPropertyImages(
      (galleryResult.data || []) as PropertyImage[]
    );

    setProjects(
      (projectsResult.data || []) as Project[]
    );

    setLoading(false);
  }

  const mediaItems = useMemo(() => {
    const items: MediaItem[] = [];

    const propertyMap = new Map(
      properties.map((property) => [
        property.id,
        property,
      ])
    );

    properties.forEach((property) => {
      const imageUrl = property.cover_image?.trim();

      if (!imageUrl) return;

      items.push({
        key: `property-cover-${property.id}`,
        imageUrl,
        kind: "Capa de imóvel",
        sourceType: "Imóvel",
        title: property.title,
        location: property.location || "",
        href: `/admin/imoveis`,
      });
    });

    propertyImages.forEach((image) => {
      const imageUrl = image.image_url?.trim();

      if (!imageUrl) return;

      const property = propertyMap.get(
        image.property_id
      );

      items.push({
        key: `property-gallery-${image.id}`,
        imageUrl,
        kind: "Galeria de imóvel",
        sourceType: "Imóvel",
        title:
          property?.title ||
          `Imóvel #${image.property_id}`,
        location:
          property?.location || "",
        href: `/admin/imoveis`,
      });
    });

    projects.forEach((project) => {
      const beforeImage =
        project.before_image?.trim();

      const afterImage =
        project.after_image?.trim();

      if (beforeImage) {
        items.push({
          key: `project-before-${project.id}`,
          imageUrl: beforeImage,
          kind: "Antes",
          sourceType: "Projeto",
          title: project.title,
          location: project.location || "",
          href: `/admin/projetos`,
        });
      }

      if (afterImage) {
        items.push({
          key: `project-after-${project.id}`,
          imageUrl: afterImage,
          kind: "Depois",
          sourceType: "Projeto",
          title: project.title,
          location: project.location || "",
          href: `/admin/projetos`,
        });
      }
    });

    return items;
  }, [properties, propertyImages, projects]);

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return mediaItems.filter((item) => {
      const matchesFilter =
        filter === "Todos" ||
        (filter === "Imóveis" &&
          item.sourceType === "Imóvel") ||
        (filter === "Projetos" &&
          item.sourceType === "Projeto");

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable =
        `${item.title} ${item.location} ${item.kind} ${item.sourceType}`.toLowerCase();

      return searchable.includes(
        normalizedSearch
      );
    });
  }, [mediaItems, search, filter]);

  const totals = useMemo(() => {
    return {
      total: mediaItems.length,

      properties: mediaItems.filter(
        (item) =>
          item.sourceType === "Imóvel"
      ).length,

      projects: mediaItems.filter(
        (item) =>
          item.sourceType === "Projeto"
      ).length,
    };
  }, [mediaItems]);

  if (loadingSession) {
    return (
      <main style={centerPageStyle}>
        <div style={{ color: "#C8A24A" }}>
          A carregar Golden Jinx...
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main style={centerPageStyle}>
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            textAlign: "center",
          }}
        >
          <h1 style={reservedTitleStyle}>
            Área reservada
          </h1>

          <p
            style={{
              color: "#999",
              marginBottom: 30,
            }}
          >
            Entre primeiro no back-office.
          </p>

          <Link
            href="/admin"
            className="btn-primary"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Ir para o login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AdminLayout
      title="Media"
      subtitle="Biblioteca de imagens"
    >
      {/* RESUMO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total de imagens"
          value={totals.total}
        />

        <StatCard
          label="Imóveis"
          value={totals.properties}
        />

        <StatCard
          label="Projetos"
          value={totals.projects}
        />
      </div>

      {/* FILTROS */}

      <div
        style={{
          background: "#151515",
          border:
            "1px solid rgba(200,162,74,.16)",
          borderRadius: 20,
          padding:
            "clamp(16px, 4vw, 22px)",
          marginBottom: 28,
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <input
          type="search"
          placeholder="Pesquisar por imóvel, projeto ou localização..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {(
            [
              "Todos",
              "Imóveis",
              "Projetos",
            ] as FilterValue[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFilter(item)
              }
              style={{
                border:
                  filter === item
                    ? "1px solid rgba(200,162,74,.38)"
                    : "1px solid rgba(255,255,255,.10)",
                background:
                  filter === item
                    ? "rgba(200,162,74,.12)"
                    : "#0f0f0f",
                color:
                  filter === item
                    ? "#C8A24A"
                    : "#999",
                borderRadius: 999,
                padding: "11px 14px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div style={errorStyle}>
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div style={emptyStyle}>
          A carregar biblioteca...
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={emptyStyle}>
          {mediaItems.length === 0
            ? "Ainda não existem imagens na biblioteca."
            : "Não foram encontradas imagens com estes filtros."}
        </div>
      ) : (
        <>
          <div
            style={{
              color: "#777",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {filteredItems.length}{" "}
            {filteredItems.length === 1
              ? "imagem"
              : "imagens"}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
              gap: 18,
            }}
          >
            {filteredItems.map(
              (item) => (
                <MediaCard
                  key={item.key}
                  item={item}
                />
              )
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function MediaCard({
  item,
}: {
  item: MediaItem;
}) {
  return (
    <article
      style={{
        background: "#151515",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius: 18,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          height:
            "clamp(190px, 24vw, 250px)",
          background: "#0d0d0d",
        }}
      >
        <img
          src={item.imageUrl}
          alt={`${item.title} - ${item.kind}`}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "7px 9px",
            borderRadius: 999,
            background:
              "rgba(0,0,0,.70)",
            color: "#C8A24A",
            fontSize: 9,
            letterSpacing: 1.2,
            textTransform:
              "uppercase",
            backdropFilter:
              "blur(8px)",
            WebkitBackdropFilter:
              "blur(8px)",
          }}
        >
          {item.kind}
        </div>
      </div>

      <div
        style={{
          padding: "17px 17px 18px",
        }}
      >
        <div
          style={{
            color: "#777",
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform:
              "uppercase",
            marginBottom: 7,
          }}
        >
          {item.sourceType}
        </div>

        <div
          style={{
            color: "#eee",
            fontSize: 15,
            lineHeight: 1.45,
            marginBottom: 6,
            overflowWrap: "anywhere",
          }}
        >
          {item.title}
        </div>

        {item.location && (
          <div
            style={{
              color: "#888",
              fontSize: 12,
              marginBottom: 16,
              overflowWrap: "anywhere",
            }}
          >
            {item.location}
          </div>
        )}

        <Link
          href={item.href}
          style={{
            display: "inline-block",
            color: "#C8A24A",
            textDecoration: "none",
            fontSize: 11,
            letterSpacing: 1,
            textTransform:
              "uppercase",
          }}
        >
          Gerir origem →
        </Link>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#151515",
        border:
          "1px solid rgba(200,162,74,.16)",
        borderRadius: 18,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 9,
          letterSpacing: 1.8,
          textTransform:
            "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily:
            "var(--font-title)",
          color: "#C8A24A",
          fontSize: "2.2rem",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box" as const,
  background: "#0f0f0f",
  border:
    "1px solid rgba(255,255,255,.12)",
  borderRadius: 12,
  padding: "14px 16px",
  color: "white",
  fontSize: 16,
  minHeight: 48,
  outline: "none",
};

const errorStyle = {
  padding: "15px 17px",
  borderRadius: 12,
  background:
    "rgba(180,50,50,.10)",
  border:
    "1px solid rgba(220,80,80,.30)",
  color: "#e6aaaa",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 25,
};

const emptyStyle = {
  padding:
    "clamp(48px, 8vw, 70px) 24px",
  textAlign: "center" as const,
  color: "#888",
  background: "#151515",
  border:
    "1px solid rgba(255,255,255,.07)",
  borderRadius: 20,
};

const centerPageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 30,
};

const reservedTitleStyle = {
  fontFamily:
    "var(--font-title)",
  fontWeight: 400,
  fontSize:
    "clamp(2.4rem, 8vw, 3rem)",
  margin: "0 0 15px",
};