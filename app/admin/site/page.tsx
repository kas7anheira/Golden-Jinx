"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type SiteSetting = {
  id?: number;
  setting_key: string;
  setting_value: string | null;
  setting_group: string;
  label: string | null;
  updated_at?: string;
};

type FieldDefinition = {
  key: string;
  label: string;
  group: string;
  type?: "text" | "textarea";
  placeholder?: string;
  rows?: number;
  defaultValue?: string;
};

const fields: FieldDefinition[] = [
  {
    key: "company_name",
    label: "Nome da empresa",
    group: "geral",
    defaultValue: "Golden Jinx",
  },
  {
    key: "company_slogan",
    label: "Slogan",
    group: "geral",
    defaultValue: "Sparkling Solutions",
  },

  /* HEADER */
  {
    key: "header_buy_label",
    label: "Menu · Comprar",
    group: "header",
    defaultValue: "Comprar",
  },
  {
    key: "header_rent_label",
    label: "Menu · Arrendar",
    group: "header",
    defaultValue: "Arrendar",
  },
  {
    key: "header_projects_label",
    label: "Menu · Projetos",
    group: "header",
    defaultValue: "Projetos",
  },
  {
    key: "header_contacts_label",
    label: "Menu · Contactos",
    group: "header",
    defaultValue: "Contactos",
  },
  {
    key: "header_cta_label",
    label: "Botão principal · texto",
    group: "header",
    defaultValue: "Avaliar Imóvel",
  },
  {
    key: "header_cta_href",
    label: "Botão principal · link",
    group: "header",
    defaultValue: "/avaliar-imovel",
  },

  /* HERO */
  {
    key: "hero_eyebrow",
    label: "Hero · linha superior",
    group: "hero",
    defaultValue: "Golden Jinx · Sparkling Solutions",
  },
  {
    key: "hero_title",
    label: "Hero · título",
    group: "hero",
    type: "textarea",
    rows: 3,
    defaultValue: "Transformamos\npotencial\nem brilho.",
  },
  {
    key: "hero_text",
    label: "Hero · texto",
    group: "hero",
    type: "textarea",
    rows: 4,
    defaultValue:
      "Identificamos oportunidades exclusivas.\nTransformamos imóveis em património com valor.\nCriamos espaços para viver e investir.",
  },
  {
    key: "hero_background_image",
    label: "Hero · imagem de fundo (URL)",
    group: "hero",
    defaultValue:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    key: "hero_button_primary_label",
    label: "Hero · botão 1 · texto",
    group: "hero",
    defaultValue: "Explorar Imóveis",
  },
  {
    key: "hero_button_primary_href",
    label: "Hero · botão 1 · link",
    group: "hero",
    defaultValue: "/comprar",
  },
  {
    key: "hero_button_secondary_label",
    label: "Hero · botão 2 · texto",
    group: "hero",
    defaultValue: "Conhecer Projetos",
  },
  {
    key: "hero_button_secondary_href",
    label: "Hero · botão 2 · link",
    group: "hero",
    defaultValue: "/projetos",
  },

  /* SERVIÇOS */
  {
    key: "services_eyebrow",
    label: "Serviços · linha superior",
    group: "servicos",
    defaultValue: "Golden Jinx",
  },
  {
    key: "services_title",
    label: "Serviços · título",
    group: "servicos",
    defaultValue: "O que fazemos",
  },
  {
    key: "services_text",
    label: "Serviços · introdução",
    group: "servicos",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Descobrimos oportunidades, transformamos imóveis e criamos património com valor.",
  },
  {
    key: "service_buy_title",
    label: "Comprar · título",
    group: "servicos",
    defaultValue: "Comprar",
  },
  {
    key: "service_buy_text",
    label: "Comprar · texto",
    group: "servicos",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Selecionamos imóveis com elevado potencial de valorização.",
  },
  {
    key: "service_buy_href",
    label: "Comprar · link",
    group: "servicos",
    defaultValue: "/comprar",
  },
  {
    key: "service_transform_title",
    label: "Transformar · título",
    group: "servicos",
    defaultValue: "Transformar",
  },
  {
    key: "service_transform_text",
    label: "Transformar · texto",
    group: "servicos",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Remodelamos e construímos espaços que ganham uma nova vida.",
  },
  {
    key: "service_transform_href",
    label: "Transformar · link",
    group: "servicos",
    defaultValue: "/projetos",
  },
  {
    key: "service_rent_title",
    label: "Arrendar · título",
    group: "servicos",
    defaultValue: "Arrendar",
  },
  {
    key: "service_rent_text",
    label: "Arrendar · texto",
    group: "servicos",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Disponibilizamos imóveis modernos e preparados para viver.",
  },
  {
    key: "service_rent_href",
    label: "Arrendar · link",
    group: "servicos",
    defaultValue: "/arrendar",
  },
  {
    key: "service_more_label",
    label: "Serviços · texto do link",
    group: "servicos",
    defaultValue: "Saber mais",
  },





  /* PÁGINA AVALIAR IMÓVEL */
  {
    key: "valuation_eyebrow",
    label: "Avaliar · linha superior",
    group: "avaliar",
    defaultValue: "Avaliar Imóvel",
  },
  {
    key: "valuation_title",
    label: "Avaliar · título principal",
    group: "avaliar",
    type: "textarea",
    rows: 3,
    defaultValue:
      "O seu imóvel pode ter\nmais potencial do que imagina.",
  },
  {
    key: "valuation_intro",
    label: "Avaliar · texto introdutório",
    group: "avaliar",
    type: "textarea",
    rows: 4,
    defaultValue:
      "Apresente-nos o seu imóvel ou terreno. Analisamos a localização, características e potencial para perceber se poderá enquadrar-se numa oportunidade Golden Jinx.",
  },
  {
    key: "valuation_step_1_title",
    label: "Passo 1 · título",
    group: "avaliar",
    defaultValue: "Envie os dados",
  },
  {
    key: "valuation_step_1_text",
    label: "Passo 1 · texto",
    group: "avaliar",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Indique-nos as principais características do imóvel.",
  },
  {
    key: "valuation_step_2_title",
    label: "Passo 2 · título",
    group: "avaliar",
    defaultValue: "Analisamos",
  },
  {
    key: "valuation_step_2_text",
    label: "Passo 2 · texto",
    group: "avaliar",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Avaliamos localização, características e potencial.",
  },
  {
    key: "valuation_step_3_title",
    label: "Passo 3 · título",
    group: "avaliar",
    defaultValue: "Entramos em contacto",
  },
  {
    key: "valuation_step_3_text",
    label: "Passo 3 · texto",
    group: "avaliar",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Se existir enquadramento, falamos consigo sobre os próximos passos.",
  },
  {
    key: "valuation_form_eyebrow",
    label: "Formulário · linha superior",
    group: "avaliar",
    defaultValue: "Apresente o seu imóvel",
  },
  {
    key: "valuation_form_title",
    label: "Formulário · título",
    group: "avaliar",
    defaultValue: "Conte-nos o essencial.",
  },
  {
    key: "valuation_success_text",
    label: "Mensagem de sucesso",
    group: "avaliar",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Imóvel enviado com sucesso. Vamos analisar a informação e entraremos em contacto consigo.",
  },
  {
    key: "valuation_submit_label",
    label: "Botão · enviar",
    group: "avaliar",
    defaultValue: "Enviar imóvel para análise",
  },
  {
    key: "valuation_sending_label",
    label: "Botão · durante envio",
    group: "avaliar",
    defaultValue: "A enviar...",
  },


  /* PÁGINA INDIVIDUAL DO IMÓVEL */
  {
    key: "property_detail_back_label",
    label: "Voltar aos imóveis · texto",
    group: "imovel",
    defaultValue: "Voltar aos imóveis",
  },
  {
    key: "property_detail_bedrooms_label",
    label: "Quartos · etiqueta",
    group: "imovel",
    defaultValue: "Quartos",
  },
  {
    key: "property_detail_bathrooms_label",
    label: "Casas de banho · etiqueta",
    group: "imovel",
    defaultValue: "Casas de banho",
  },
  {
    key: "property_detail_area_label",
    label: "Área · etiqueta",
    group: "imovel",
    defaultValue: "Área",
  },
  {
    key: "property_detail_on_request_label",
    label: "Valor em falta · texto",
    group: "imovel",
    defaultValue: "Sob consulta",
  },
  {
    key: "property_detail_about_label",
    label: "Descrição · título",
    group: "imovel",
    defaultValue: "Sobre o imóvel",
  },
  {
    key: "property_detail_features_label",
    label: "Características · título",
    group: "imovel",
    defaultValue: "Características",
  },
  {
    key: "property_detail_price_label",
    label: "Venda · etiqueta do preço",
    group: "imovel",
    defaultValue: "Preço",
  },
  {
    key: "property_detail_rent_label",
    label: "Arrendamento · etiqueta da renda",
    group: "imovel",
    defaultValue: "Renda",
  },
  {
    key: "property_detail_cta_title",
    label: "Contacto · título",
    group: "imovel",
    defaultValue: "Interessado neste imóvel?",
  },
  {
    key: "property_detail_cta_text",
    label: "Contacto · texto",
    group: "imovel",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Entre em contacto connosco para obter mais informações ou marcar uma visita.",
  },
  {
    key: "property_detail_info_button",
    label: "Contacto · botão principal",
    group: "imovel",
    defaultValue: "Pedir informações",
  },
  {
    key: "property_detail_contact_button",
    label: "Contacto · botão secundário",
    group: "imovel",
    defaultValue: "Contactar Golden Jinx",
  },
  {
    key: "property_detail_unavailable_title",
    label: "Imóvel indisponível · título",
    group: "imovel",
    defaultValue: "Imóvel não disponível",
  },
  {
    key: "property_detail_view_properties_button",
    label: "Imóvel indisponível · botão",
    group: "imovel",
    defaultValue: "Ver imóveis",
  },
  {
    key: "property_detail_loading_label",
    label: "Carregamento · texto",
    group: "imovel",
    defaultValue: "A carregar imóvel...",
  },
  {
    key: "property_detail_photos_soon_label",
    label: "Sem fotografias · texto",
    group: "imovel",
    defaultValue: "Fotografias em breve",
  },

  /* CONTACTOS */
  {
    key: "contact_email",
    label: "Email",
    group: "contactos",
    defaultValue: "info@goldenjinx.pt",
  },
  {
    key: "contact_phone",
    label: "Telefone",
    group: "contactos",
    defaultValue: "+351 XXX XXX XXX",
  },
  {
    key: "contact_location",
    label: "Localização",
    group: "contactos",
    defaultValue: "Portugal",
  },

  /* FOOTER */
  {
    key: "footer_text",
    label: "Footer · texto institucional",
    group: "footer",
    type: "textarea",
    rows: 4,
    defaultValue:
      "Transformamos potencial em brilho. Descobrimos oportunidades, criamos valor e construímos património.",
  },
];

const groupLabels: Record<string, string> = {
  geral: "Geral",
  header: "Header / Navegação",
  hero: "Home · Hero",
  servicos: "Home · Serviços",
  avaliar: "Página Avaliar Imóvel",
  imovel: "Página Individual do Imóvel",
  contactos: "Contactos",
  footer: "Footer",
};

export default function AdminSitePage() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const loggedIn = Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await loadSettings();
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

  async function loadSettings() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("setting_group", { ascending: true });

    if (error) {
      console.error("Erro ao carregar conteúdos:", error);

      setErrorMessage(
        `Não foi possível carregar os conteúdos: ${error.message}`
      );

      setLoading(false);
      return;
    }

    const existing = (data || []) as SiteSetting[];

    const nextValues: Record<string, string> = {};

    fields.forEach((field) => {
      const setting = existing.find(
        (item) => item.setting_key === field.key
      );

      nextValues[field.key] =
        setting?.setting_value ??
        field.defaultValue ??
        "";
    });

    setValues(nextValues);
    setLoading(false);
  }

  const groups = useMemo(() => {
    return Array.from(
      new Set(fields.map((field) => field.group))
    );
  }, []);

  function updateValue(key: string, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveGroup(group: string) {
    setSavingGroup(group);
    setSuccessMessage("");
    setErrorMessage("");

    const groupFields = fields.filter(
      (field) => field.group === group
    );

    const rows = groupFields.map((field) => ({
      setting_key: field.key,
      setting_value: values[field.key] ?? "",
      setting_group: field.group,
      label: field.label,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, {
        onConflict: "setting_key",
      });

    if (error) {
      console.error("Erro ao guardar conteúdos:", error);

      setErrorMessage(
        `Não foi possível guardar: ${error.message}`
      );

      setSavingGroup(null);
      return;
    }

    setSuccessMessage(
      `${groupLabels[group] || group} guardado com sucesso.`
    );

    setSavingGroup(null);
  }

  async function saveAll() {
    setSavingGroup("__all__");
    setSuccessMessage("");
    setErrorMessage("");

    const rows = fields.map((field) => ({
      setting_key: field.key,
      setting_value: values[field.key] ?? "",
      setting_group: field.group,
      label: field.label,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, {
        onConflict: "setting_key",
      });

    if (error) {
      console.error("Erro ao guardar conteúdos:", error);

      setErrorMessage(
        `Não foi possível guardar os conteúdos: ${error.message}`
      );

      setSavingGroup(null);
      return;
    }

    setSuccessMessage(
      "Conteúdos do site guardados com sucesso."
    );

    setSavingGroup(null);
  }

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
      title="Site / Conteúdos"
      subtitle="Conteúdo editável"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 28,
        }}
      >
        <button
          type="button"
          onClick={saveAll}
          disabled={savingGroup !== null || loading}
          className="btn-primary"
          style={{
            border: "none",
            cursor:
              savingGroup !== null || loading
                ? "not-allowed"
                : "pointer",
            opacity:
              savingGroup !== null || loading
                ? 0.65
                : 1,
          }}
        >
          {savingGroup === "__all__"
            ? "A guardar..."
            : "Guardar tudo"}
        </button>
      </div>

      {successMessage && (
        <div style={successStyle}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={errorStyle}>
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div style={emptyStyle}>
          A carregar conteúdos...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {groups.map((group) => {
            const groupFields = fields.filter(
              (field) => field.group === group
            );

            return (
              <section
                key={group}
                style={panelStyle}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                    flexWrap: "wrap",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div style={eyebrowStyle}>
                      Conteúdos
                    </div>

                    <h2 style={panelTitleStyle}>
                      {groupLabels[group] || group}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => saveGroup(group)}
                    disabled={savingGroup !== null}
                    style={secondaryButtonStyle}
                  >
                    {savingGroup === group
                      ? "A guardar..."
                      : "Guardar secção"}
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 18,
                  }}
                >
                  {groupFields.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? ""}
                      onChange={(value) =>
                        updateValue(
                          field.key,
                          value
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          padding: "17px 18px",
          borderRadius: 14,
          background: "rgba(200,162,74,.06)",
          border: "1px solid rgba(200,162,74,.16)",
          color: "#8e8e8e",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        Esta área já guarda os conteúdos no Supabase. No passo seguinte
        ligamos cada componente público do site a estes valores, para que
        as alterações feitas aqui apareçam automaticamente no website.
      </div>
    </AdminLayout>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 8,
      }}
    >
      <span style={labelStyle}>
        {field.label}
      </span>

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={field.rows || 4}
          placeholder={field.placeholder}
          style={{
            ...inputStyle,
            minHeight: 110,
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={field.placeholder}
          style={inputStyle}
        />
      )}
    </label>
  );
}

const panelStyle = {
  background: "#151515",
  border: "1px solid rgba(200,162,74,.16)",
  borderRadius: 22,
  padding: "clamp(20px, 5vw, 30px)",
};

const panelTitleStyle = {
  fontFamily: "var(--font-title)",
  fontWeight: 400,
  fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
  margin: 0,
};

const eyebrowStyle = {
  color: "#C8A24A",
  fontSize: 9,
  letterSpacing: 2.5,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

const labelStyle = {
  color: "#8b8b8b",
  fontSize: 10,
  letterSpacing: 1.8,
  textTransform: "uppercase" as const,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#0f0f0f",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 12,
  padding: "15px 16px",
  color: "white",
  fontSize: 16,
  minHeight: 50,
  lineHeight: 1.6,
  outline: "none",
};

const secondaryButtonStyle = {
  border: "1px solid rgba(200,162,74,.25)",
  background: "transparent",
  borderRadius: 10,
  color: "#C8A24A",
  padding: "10px 14px",
  cursor: "pointer",
};

const successStyle = {
  padding: "15px 17px",
  borderRadius: 12,
  background: "rgba(200,162,74,.10)",
  border: "1px solid rgba(200,162,74,.30)",
  color: "#D9BD74",
  fontSize: 14,
  marginBottom: 24,
};

const errorStyle = {
  padding: "15px 17px",
  borderRadius: 12,
  background: "rgba(180,50,50,.10)",
  border: "1px solid rgba(220,80,80,.30)",
  color: "#e6aaaa",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 24,
};

const emptyStyle = {
  padding: "60px 30px",
  textAlign: "center" as const,
  color: "#888",
  background: "#151515",
  border: "1px solid rgba(255,255,255,.07)",
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
  fontFamily: "var(--font-title)",
  fontWeight: 400,
  fontSize: "clamp(2.4rem, 8vw, 3rem)",
  margin: "0 0 15px",
};