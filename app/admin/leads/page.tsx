"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

type LeadImage = {
  id: number;
  lead_id: number;
  image_url: string;
  storage_path: string;
  created_at: string;
};

const statusOptions = [
  "Novo",
  "Contactado",
  "Em Análise",
  "Concluído",
];

export default function AdminLeadsPage() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadsError, setLeadsError] = useState("");

  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null);

  const [leadImages, setLeadImages] =
    useState<Record<number, LeadImage[]>>({});

  const [loadingImagesLeadId, setLoadingImagesLeadId] =
    useState<number | null>(null);

  const [imagesErrorLeadId, setImagesErrorLeadId] =
    useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const loggedIn = Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await loadLeads();
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

  async function loadLeads() {
    setLoadingLeads(true);
    setLeadsError("");

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar leads:", error);

      setLeadsError(
        "Não foi possível carregar os leads. Confirme as permissões do utilizador."
      );

      setLoadingLeads(false);
      return;
    }

    setLeads((data || []) as Lead[]);
    setLoadingLeads(false);
  }

  async function loadLeadImages(
    leadId: number
  ) {
    if (leadImages[leadId]) {
      return;
    }

    setLoadingImagesLeadId(
      leadId
    );

    setImagesErrorLeadId(
      null
    );

    const { data, error } =
      await supabase
        .from("lead_images")
        .select("*")
        .eq(
          "lead_id",
          leadId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {
      console.error(
        "Erro ao carregar fotografias do lead:",
        error
      );

      setImagesErrorLeadId(
        leadId
      );

      setLoadingImagesLeadId(
        null
      );

      return;
    }

    setLeadImages(
      (current) => ({
        ...current,
        [leadId]:
          (data ||
            []) as LeadImage[],
      })
    );

    setLoadingImagesLeadId(
      null
    );
  }

  async function toggleLeadDetails(
    lead: Lead
  ) {
    const isExpanded =
      expandedLeadId === lead.id;

    if (isExpanded) {
      setExpandedLeadId(
        null
      );
      return;
    }

    setExpandedLeadId(
      lead.id
    );

    if (
      lead.source ===
      "avaliacao"
    ) {
      await loadLeadImages(
        lead.id
      );
    }
  }

  async function updateLeadStatus(leadId: number, newStatus: string) {
    setUpdatingLeadId(leadId);

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      console.error("Erro ao atualizar lead:", error);
      alert("Não foi possível atualizar o estado do lead.");
      setUpdatingLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );

    setUpdatingLeadId(null);
  }

  if (loadingSession) {
    return (
      <main style={centerPageStyle}>
        <div style={{ color: "#C8A24A" }}>A carregar Golden Jinx...</div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main style={centerPageStyle}>
        <div style={{ textAlign: "center" }}>
          <h1 style={reservedTitleStyle}>Área reservada</h1>

          <p style={{ color: "#999", marginBottom: 28 }}>
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
      title="Leads"
      subtitle="Contactos e oportunidades"
    >
      <section
        style={{
          background: "#151515",
          border: "1px solid rgba(200,162,74,.16)",
          borderRadius: 22,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px clamp(18px, 4vw, 28px)",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "1.8rem",
              }}
            >
              Leads recebidos
            </div>

            <div style={{ color: "#777", fontSize: 12, marginTop: 5 }}>
              {leads.length} {leads.length === 1 ? "lead" : "leads"}
            </div>
          </div>

          <button
            type="button"
            onClick={loadLeads}
            style={goldOutlineButtonStyle}
          >
            Atualizar
          </button>
        </div>

        {loadingLeads && <div style={emptyStyle}>A carregar leads...</div>}

        {leadsError && (
          <div style={emptyStyle}>
            <div style={errorStyle}>{leadsError}</div>
          </div>
        )}

        {!loadingLeads && !leadsError && leads.length === 0 && (
          <div style={emptyStyle}>Ainda não existem leads.</div>
        )}

        {!loadingLeads && !leadsError && leads.length > 0 && (
          <div>
            {leads.map((lead) => {
              const expanded = expandedLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                      gap: 20,
                      alignItems: "center",
                      padding: "22px clamp(18px, 4vw, 28px)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#C8A24A",
                          fontSize: 10,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          marginBottom: 7,
                        }}
                      >
                        {lead.source === "avaliacao" ? "Avaliação" : "Contacto"}
                      </div>

                      <div style={{ fontSize: 16, marginBottom: 5 }}>
                        {lead.name}
                      </div>

                      <div style={{ color: "#888", fontSize: 12 }}>
                        {new Date(lead.created_at).toLocaleString("pt-PT")}
                      </div>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "#ddd",
                          fontSize: 13,
                          marginBottom: 7,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {lead.email}
                      </div>

                      {lead.phone && (
                        <div style={{ color: "#999", fontSize: 13 }}>
                          {lead.phone}
                        </div>
                      )}

                      {lead.property_location && (
                        <div
                          style={{
                            color: "#999",
                            fontSize: 13,
                            marginTop: 7,
                          }}
                        >
                          {lead.property_type} · {lead.property_location}
                        </div>
                      )}
                    </div>

                    <div>
                      <select
                        value={lead.status || "Novo"}
                        disabled={updatingLeadId === lead.id}
                        onChange={(event) =>
                          updateLeadStatus(lead.id, event.target.value)
                        }
                        style={{
                          width: "100%",
                          maxWidth: 190,
                          background: "#0f0f0f",
                          color: "#C8A24A",
                          border: "1px solid rgba(200,162,74,.25)",
                          borderRadius: 10,
                          padding: "11px 12px",
                          cursor:
                            updatingLeadId === lead.id ? "wait" : "pointer",
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingLeadId === lead.id && (
                        <div
                          style={{
                            color: "#777",
                            fontSize: 11,
                            marginTop: 7,
                          }}
                        >
                          A guardar...
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleLeadDetails(lead)
                        }
                        style={secondaryButtonStyle}
                      >
                        {expanded ? "Fechar" : "Ver detalhes"}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div
                      style={{
                        padding:
                          "0 clamp(18px, 4vw, 28px) clamp(22px, 4vw, 30px)",
                      }}
                    >
                      <div
                        style={{
                          background: "#101010",
                          border: "1px solid rgba(255,255,255,.07)",
                          borderRadius: 16,
                          padding: "clamp(18px, 4vw, 25px)",
                          display: "grid",
                          gap: 22,
                        }}
                      >
                        {lead.subject && (
                          <Detail label="Assunto" value={lead.subject} />
                        )}

                        {lead.message && (
                          <Detail label="Mensagem" value={lead.message} />
                        )}

                        {lead.property_type && (
                          <Detail
                            label="Tipo de imóvel"
                            value={lead.property_type}
                          />
                        )}

                        {lead.property_location && (
                          <Detail
                            label="Localização"
                            value={lead.property_location}
                          />
                        )}

                        {lead.property_area && (
                          <Detail label="Área" value={lead.property_area} />
                        )}

                        {lead.property_condition && (
                          <Detail
                            label="Estado do imóvel"
                            value={lead.property_condition}
                          />
                        )}

                        {lead.source === "avaliacao" && (
                          <div>
                            <div
                              style={{
                                color: "#777",
                                fontSize: 10,
                                letterSpacing: 2,
                                textTransform:
                                  "uppercase",
                                marginBottom: 12,
                              }}
                            >
                              Fotografias do imóvel
                            </div>

                            {loadingImagesLeadId ===
                            lead.id ? (
                              <div
                                style={{
                                  color: "#777",
                                  fontSize: 13,
                                }}
                              >
                                A carregar fotografias...
                              </div>
                            ) : imagesErrorLeadId ===
                              lead.id ? (
                              <div
                                style={errorStyle}
                              >
                                Não foi possível carregar as fotografias.
                              </div>
                            ) : (
                              <LeadImagesGallery
                                images={
                                  leadImages[
                                    lead.id
                                  ] || []
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

function LeadImagesGallery({
  images,
}: {
  images: LeadImage[];
}) {
  if (images.length === 0) {
    return (
      <div
        style={{
          color: "#666",
          fontSize: 13,
        }}
      >
        Não foram enviadas fotografias.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
        gap: 12,
      }}
    >
      {images.map(
        (image, index) => (
          <a
            key={image.id}
            href={image.image_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              textDecoration:
                "none",
            }}
          >
            <div
              style={{
                height: 150,
                borderRadius: 12,
                overflow: "hidden",
                border:
                  "1px solid rgba(200,162,74,.18)",
                background:
                  "#0d0d0d",
              }}
            >
              <img
                src={image.image_url}
                alt={`Fotografia do imóvel ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    "cover",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 7,
                color: "#777",
                fontSize: 10,
                textAlign:
                  "center",
              }}
            >
              Abrir fotografia
            </div>
          </a>
        )
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          color: "#777",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#d5d5d5",
          lineHeight: 1.7,
          fontSize: 14,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const goldOutlineButtonStyle = {
  background: "transparent",
  border: "1px solid rgba(200,162,74,.30)",
  borderRadius: 10,
  color: "#C8A24A",
  padding: "10px 16px",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid rgba(255,255,255,.12)",
  background: "transparent",
  borderRadius: 10,
  color: "#ddd",
  padding: "10px 14px",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
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
  padding: "55px 22px",
  textAlign: "center" as const,
  color: "#888",
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
  fontFamily: "var(--font-title)",
  fontWeight: 400,
  fontSize: "clamp(2.4rem, 8vw, 3rem)",
  margin: "0 0 15px",
};