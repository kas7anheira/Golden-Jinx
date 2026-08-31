"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import PropertyGalleryManager from "@/components/admin/PropertyGalleryManager";

type Property = {
  id: number;
  created_at: string;
  slug: string;
  status: string;
  property_type: string;
  title: string;
  location: string;
  price: string;
  bedrooms: string | null;
  bathrooms: string | null;
  area: string | null;
  description: string | null;
  features: string[] | null;
  cover_image: string | null;
  published: boolean;
};


type PropertySettingField = {
  key: string;
  label: string;
  group: "buy" | "rent";
  type?: "text" | "textarea";
  rows?: number;
  defaultValue: string;
};

const propertySettingFields: PropertySettingField[] = [
  {
    key: "buy_eyebrow",
    label: "Comprar · linha superior",
    group: "buy",
    defaultValue: "Golden Jinx",
  },
  {
    key: "buy_title",
    label: "Comprar · título",
    group: "buy",
    defaultValue: "Comprar",
  },
  {
    key: "buy_intro",
    label: "Comprar · texto introdutório",
    group: "buy",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Descubra imóveis selecionados, transformados e desenvolvidos pela Golden Jinx.",
  },
  {
    key: "buy_location_placeholder",
    label: "Comprar · filtro localização",
    group: "buy",
    defaultValue: "Localização",
  },
  {
    key: "buy_type_all_label",
    label: "Comprar · filtro todos os tipos",
    group: "buy",
    defaultValue: "Todos os tipos",
  },
  {
    key: "buy_max_price_label",
    label: "Comprar · filtro preço máximo",
    group: "buy",
    defaultValue: "Preço máximo",
  },
  {
    key: "buy_clear_filters_label",
    label: "Comprar · limpar filtros",
    group: "buy",
    defaultValue: "Limpar filtros",
  },
  {
    key: "buy_loading_text",
    label: "Comprar · texto de carregamento",
    group: "buy",
    defaultValue: "A carregar imóveis...",
  },
  {
    key: "buy_empty_title",
    label: "Comprar · sem resultados · título",
    group: "buy",
    defaultValue: "Nenhum imóvel encontrado.",
  },
  {
    key: "buy_empty_text",
    label: "Comprar · sem resultados · texto",
    group: "buy",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Experimente alterar os filtros de pesquisa.",
  },

  {
    key: "rent_eyebrow",
    label: "Arrendar · linha superior",
    group: "rent",
    defaultValue: "Golden Jinx",
  },
  {
    key: "rent_title",
    label: "Arrendar · título",
    group: "rent",
    defaultValue: "Arrendar",
  },
  {
    key: "rent_intro",
    label: "Arrendar · texto introdutório",
    group: "rent",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Encontre imóveis Golden Jinx disponíveis para arrendamento.",
  },
  {
    key: "rent_location_placeholder",
    label: "Arrendar · filtro localização",
    group: "rent",
    defaultValue: "Localização",
  },
  {
    key: "rent_type_all_label",
    label: "Arrendar · filtro todos os tipos",
    group: "rent",
    defaultValue: "Todos os tipos",
  },
  {
    key: "rent_max_price_label",
    label: "Arrendar · filtro renda máxima",
    group: "rent",
    defaultValue: "Renda máxima",
  },
  {
    key: "rent_clear_filters_label",
    label: "Arrendar · limpar filtros",
    group: "rent",
    defaultValue: "Limpar filtros",
  },
  {
    key: "rent_loading_text",
    label: "Arrendar · texto de carregamento",
    group: "rent",
    defaultValue: "A carregar imóveis...",
  },
  {
    key: "rent_empty_title",
    label: "Arrendar · sem resultados · título",
    group: "rent",
    defaultValue: "Nenhum imóvel disponível.",
  },
  {
    key: "rent_empty_text",
    label: "Arrendar · sem resultados · texto",
    group: "rent",
    type: "textarea",
    rows: 2,
    defaultValue:
      "De momento não existem imóveis que correspondam à pesquisa.",
  },
];

export default function AdminPropertiesPage() {
  const [loadingSession, setLoadingSession] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [properties, setProperties] = useState<
    Property[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [propertySettings, setPropertySettings] =
    useState<Record<string, string>>({});

  const [loadingPropertySettings, setLoadingPropertySettings] =
    useState(false);

  const [savingPropertySettings, setSavingPropertySettings] =
    useState(false);

  const [settingsSuccessMessage, setSettingsSuccessMessage] =
    useState("");

  const [settingsErrorMessage, setSettingsErrorMessage] =
    useState("");

  /*
   * NOVO IMÓVEL
   */

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  /*
   * EDIÇÃO
   */

  const [editingProperty, setEditingProperty] =
    useState<Property | null>(null);

  const [updating, setUpdating] =
    useState(false);

  const [editImageFile, setEditImageFile] =
    useState<File | null>(null);

  const [editImagePreview, setEditImagePreview] =
    useState("");

  /*
   * SLUG AUTOMÁTICO PARA NOVOS IMÓVEIS
   */

  const generatedSlug = useMemo(() => {
    return createSlug(
      `${title} ${location}`
    );
  }, [title, location]);

  /*
   * AUTENTICAÇÃO
   */

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      const loggedIn =
        Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await Promise.all([
          loadProperties(),
          loadPropertySettings(),
        ]);
      }
    }

    init();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setAuthenticated(
            Boolean(session)
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
   * PREVIEW DA IMAGEM DO NOVO IMÓVEL
   */

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl =
      URL.createObjectURL(imageFile);

    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(
        previewUrl
      );
    };
  }, [imageFile]);

  /*
   * PREVIEW DA NOVA IMAGEM NA EDIÇÃO
   */

  useEffect(() => {
    if (!editImageFile) {
      setEditImagePreview("");
      return;
    }

    const previewUrl =
      URL.createObjectURL(
        editImageFile
      );

    setEditImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(
        previewUrl
      );
    };
  }, [editImageFile]);

  /*
   * CARREGAR IMÓVEIS
   */

  async function loadProperties() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } =
      await supabase
        .from("properties")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Erro ao carregar imóveis:",
        error
      );

      setErrorMessage(
        "Não foi possível carregar os imóveis."
      );

      setLoading(false);
      return;
    }

    setProperties(
      (data || []) as Property[]
    );

    setLoading(false);
  }

  /*
   * UPLOAD DE FOTOGRAFIA
   */

  async function loadPropertySettings() {
    setLoadingPropertySettings(true);
    setSettingsErrorMessage("");

    const keys = propertySettingFields.map(
      (field) => field.key
    );

    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", keys);

    if (error) {
      console.error(
        "Erro ao carregar conteúdos de Imóveis:",
        error
      );

      setSettingsErrorMessage(
        `Não foi possível carregar os conteúdos: ${error.message}`
      );

      setLoadingPropertySettings(false);
      return;
    }

    const rows = data || [];
    const nextValues: Record<string, string> = {};

    propertySettingFields.forEach((field) => {
      const existing = rows.find(
        (item) => item.setting_key === field.key
      );

      nextValues[field.key] =
        existing?.setting_value ??
        field.defaultValue;
    });

    setPropertySettings(nextValues);
    setLoadingPropertySettings(false);
  }

  function updatePropertySetting(
    key: string,
    value: string
  ) {
    setPropertySettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function savePropertySettings() {
    setSavingPropertySettings(true);
    setSettingsSuccessMessage("");
    setSettingsErrorMessage("");

    const rows = propertySettingFields.map(
      (field) => ({
        setting_key: field.key,
        setting_value:
          propertySettings[field.key] ??
          field.defaultValue,
        setting_group:
          field.group === "buy"
            ? "comprar"
            : "arrendar",
        label: field.label,
        updated_at: new Date().toISOString(),
      })
    );

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, {
        onConflict: "setting_key",
      });

    if (error) {
      console.error(
        "Erro ao guardar conteúdos de Imóveis:",
        error
      );

      setSettingsErrorMessage(
        `Não foi possível guardar os conteúdos: ${error.message}`
      );

      setSavingPropertySettings(false);
      return;
    }

    setSettingsSuccessMessage(
      "Conteúdos de Comprar e Arrendar guardados com sucesso."
    );

    setSavingPropertySettings(false);
  }

  async function uploadCoverImage(
    file: File,
    slug: string
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const safeSlug =
      slug || "imovel";

    const fileName =
      `${safeSlug}-${Date.now()}.${extension}`;

    const filePath =
      `covers/${fileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from(
          "property-images"
        )
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",

            upsert: false,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from(
          "property-images"
        )
        .getPublicUrl(
          filePath
        );

    return data.publicUrl;
  }

  /*
   * CRIAR IMÓVEL
   */

  async function handleCreate(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);

    setErrorMessage("");
    setSuccessMessage("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const status =
      String(
        formData.get(
          "status"
        ) || ""
      ).trim();

    const propertyType =
      String(
        formData.get(
          "property_type"
        ) || ""
      ).trim();

    const price =
      String(
        formData.get(
          "price"
        ) || ""
      ).trim();

    const bedrooms =
      String(
        formData.get(
          "bedrooms"
        ) || ""
      ).trim();

    const bathrooms =
      String(
        formData.get(
          "bathrooms"
        ) || ""
      ).trim();

    const area =
      String(
        formData.get(
          "area"
        ) || ""
      ).trim();

    const description =
      String(
        formData.get(
          "description"
        ) || ""
      ).trim();

    const manualCoverImage =
      String(
        formData.get(
          "cover_image"
        ) || ""
      ).trim();

    const published =
      String(
        formData.get(
          "published"
        ) || ""
      ) === "true";

    const featuresRaw =
      String(
        formData.get(
          "features"
        ) || ""
      ).trim();

    const features =
      featuresRaw
        ? featuresRaw
            .split("\n")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        : [];

    const slug =
      generatedSlug;

    if (
      !title.trim() ||
      !location.trim() ||
      !slug ||
      !status ||
      !propertyType ||
      !price
    ) {
      setErrorMessage(
        "Preencha todos os campos obrigatórios antes de guardar."
      );

      setSaving(false);
      return;
    }

    let finalCoverImage:
      string | null =
      manualCoverImage ||
      null;

    try {
      if (imageFile) {
        finalCoverImage =
          await uploadCoverImage(
            imageFile,
            slug
          );
      }

      const { error } =
        await supabase
          .from(
            "properties"
          )
          .insert([
            {
              title:
                title.trim(),

              slug,

              status,

              property_type:
                propertyType,

              location:
                location.trim(),

              price,

              bedrooms:
                bedrooms ||
                null,

              bathrooms:
                bathrooms ||
                null,

              area:
                area ||
                null,

              description:
                description ||
                null,

              features,

              cover_image:
                finalCoverImage,

              published,
            },
          ]);

      if (error) {
        console.error(
          "Erro ao criar imóvel:",
          error
        );

        if (
          error.code ===
          "23505"
        ) {
          setErrorMessage(
            "Já existe um imóvel com este título e localização."
          );
        } else {
          setErrorMessage(
            `Não foi possível criar o imóvel: ${error.message}`
          );
        }

        setSaving(false);
        return;
      }

      form.reset();

      setTitle("");
      setLocation("");

      setImageFile(
        null
      );

      setImagePreview(
        ""
      );

      setSuccessMessage(
        "Imóvel criado com sucesso."
      );

      setShowForm(
        false
      );

      setSaving(false);

      await loadProperties();
    } catch (error) {
      console.error(
        "Erro no upload:",
        error
      );

      setErrorMessage(
        "Não foi possível carregar a fotografia. Verifique as permissões do Storage."
      );

      setSaving(false);
    }
  }

  /*
   * ABRIR EDIÇÃO
   */

  function startEditing(
    property: Property
  ) {
    setShowForm(false);

    setEditingProperty(
      property
    );

    setEditImageFile(
      null
    );

    setEditImagePreview(
      ""
    );

    setErrorMessage(
      ""
    );

    setSuccessMessage(
      ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * CANCELAR EDIÇÃO
   */

  function cancelEditing() {
    setEditingProperty(
      null
    );

    setEditImageFile(
      null
    );

    setEditImagePreview(
      ""
    );

    setErrorMessage(
      ""
    );
  }

  /*
   * GUARDAR ALTERAÇÕES
   */

  async function handleUpdate(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingProperty) {
      return;
    }

    setUpdating(true);

    setErrorMessage("");
    setSuccessMessage("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const editedTitle =
      String(
        formData.get(
          "edit_title"
        ) || ""
      ).trim();

    const editedLocation =
      String(
        formData.get(
          "edit_location"
        ) || ""
      ).trim();

    const editedStatus =
      String(
        formData.get(
          "edit_status"
        ) || ""
      ).trim();

    const editedPropertyType =
      String(
        formData.get(
          "edit_property_type"
        ) || ""
      ).trim();

    const editedPrice =
      String(
        formData.get(
          "edit_price"
        ) || ""
      ).trim();

    const editedBedrooms =
      String(
        formData.get(
          "edit_bedrooms"
        ) || ""
      ).trim();

    const editedBathrooms =
      String(
        formData.get(
          "edit_bathrooms"
        ) || ""
      ).trim();

    const editedArea =
      String(
        formData.get(
          "edit_area"
        ) || ""
      ).trim();

    const editedDescription =
      String(
        formData.get(
          "edit_description"
        ) || ""
      ).trim();

    const manualCoverImage =
      String(
        formData.get(
          "edit_cover_image"
        ) || ""
      ).trim();

    const published =
      String(
        formData.get(
          "edit_published"
        ) || ""
      ) === "true";

    const featuresRaw =
      String(
        formData.get(
          "edit_features"
        ) || ""
      ).trim();

    const features =
      featuresRaw
        ? featuresRaw
            .split("\n")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        : [];

    if (
      !editedTitle ||
      !editedLocation ||
      !editedStatus ||
      !editedPropertyType ||
      !editedPrice
    ) {
      setErrorMessage(
        "Preencha todos os campos obrigatórios."
      );

      setUpdating(false);
      return;
    }

    /*
     * Mantemos o slug atual.
     * Assim alterações no título/localização
     * não partem links já existentes.
     */

    let finalCoverImage =
      editingProperty.cover_image;

    try {
      if (editImageFile) {
        finalCoverImage =
          await uploadCoverImage(
            editImageFile,
            editingProperty.slug
          );
      } else if (
        manualCoverImage
      ) {
        finalCoverImage =
          manualCoverImage;
      }

      const { error } =
        await supabase
          .from(
            "properties"
          )
          .update({
            title:
              editedTitle,

            location:
              editedLocation,

            status:
              editedStatus,

            property_type:
              editedPropertyType,

            price:
              editedPrice,

            bedrooms:
              editedBedrooms ||
              null,

            bathrooms:
              editedBathrooms ||
              null,

            area:
              editedArea ||
              null,

            description:
              editedDescription ||
              null,

            features,

            cover_image:
              finalCoverImage ||
              null,

            published,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            editingProperty.id
          );

      if (error) {
        console.error(
          "Erro ao atualizar imóvel:",
          error
        );

        setErrorMessage(
          `Não foi possível guardar as alterações: ${error.message}`
        );

        setUpdating(false);
        return;
      }

      setSuccessMessage(
        "Alterações guardadas com sucesso."
      );

      setEditingProperty(
        null
      );

      setEditImageFile(
        null
      );

      setEditImagePreview(
        ""
      );

      setUpdating(false);

      await loadProperties();
    } catch (error) {
      console.error(
        "Erro ao substituir fotografia:",
        error
      );

      setErrorMessage(
        "Não foi possível carregar a nova fotografia."
      );

      setUpdating(false);
    }
  }

  /*
   * PUBLICAR / OCULTAR
   */

  async function togglePublished(
    property: Property
  ) {
    const newPublishedState =
      !property.published;

    const { error } =
      await supabase
        .from(
          "properties"
        )
        .update({
          published:
            newPublishedState,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          property.id
        );

    if (error) {
      console.error(
        "Erro ao alterar publicação:",
        error
      );

      alert(
        "Não foi possível alterar o estado do imóvel."
      );

      return;
    }

    setProperties(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            property.id
              ? {
                  ...item,
                  published:
                    newPublishedState,
                }
              : item
        )
    );
  }

  /*
   * LOADING
   */

  if (loadingSession) {
    return (
      <main
        style={
          centerPageStyle
        }
      >
        <div
          style={{
            color:
              "#C8A24A",
          }}
        >
          A carregar Golden
          Jinx...
        </div>
      </main>
    );
  }

  /*
   * SEM LOGIN
   */

  if (!authenticated) {
    return (
      <main
        style={
          centerPageStyle
        }
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            textAlign:
              "center",
          }}
        >
          <h1
            style={{
              fontFamily:
                "var(--font-title)",

              fontWeight: 400,

              fontSize:
                "3rem",
            }}
          >
            Área reservada
          </h1>

          <p
            style={{
              color: "#999",

              marginBottom:
                30,
            }}
          >
            Entre primeiro no
            back-office.
          </p>

          <Link
            href="/admin"
            className="btn-primary"
            style={{
              display:
                "inline-block",

              textDecoration:
                "none",
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
      title="Imóveis"
      subtitle="Apresentação e gestão de imóveis"
    >
      <section style={contentManagerStyle}>
        <div style={contentManagerHeaderStyle}>
          <div>
            <div style={eyebrowStyle}>
              Apresentação
            </div>

            <h2 style={contentManagerTitleStyle}>
              Comprar & Arrendar
            </h2>

            <p style={contentManagerTextStyle}>
              Controle aqui os textos e mensagens das páginas
              públicas de compra e arrendamento.
            </p>
          </div>

          <button
            type="button"
            onClick={savePropertySettings}
            disabled={
              savingPropertySettings ||
              loadingPropertySettings
            }
            className="btn-primary"
            style={{
              border: "none",
              cursor:
                savingPropertySettings ||
                loadingPropertySettings
                  ? "not-allowed"
                  : "pointer",
              opacity:
                savingPropertySettings ||
                loadingPropertySettings
                  ? 0.65
                  : 1,
            }}
          >
            {savingPropertySettings
              ? "A guardar..."
              : "Guardar apresentação"}
          </button>
        </div>

        {settingsSuccessMessage && (
          <div style={successStyle}>
            {settingsSuccessMessage}
          </div>
        )}

        {settingsErrorMessage && (
          <div style={errorStyle}>
            {settingsErrorMessage}
          </div>
        )}

        {loadingPropertySettings ? (
          <div style={emptyStyle}>
            A carregar conteúdos...
          </div>
        ) : (
          <div style={settingsColumnsStyle}>
            <PropertySettingsGroup
              title="Página Comprar"
              subtitle="Conteúdos e mensagens da página /comprar."
              fields={propertySettingFields.filter(
                (field) => field.group === "buy"
              )}
              values={propertySettings}
              onChange={updatePropertySetting}
            />

            <PropertySettingsGroup
              title="Página Arrendar"
              subtitle="Conteúdos e mensagens da página /arrendar."
              fields={propertySettingFields.filter(
                (field) => field.group === "rent"
              )}
              values={propertySettings}
              onChange={updatePropertySetting}
            />
          </div>
        )}
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 28,
        }}
      >
        <div>
          <div style={eyebrowStyle}>
            Gestão
          </div>

          <div
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(1.8rem, 6vw, 2.3rem)",
            }}
          >
            Imóveis
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setShowForm((value) => !value);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          className="btn-primary"
          style={{
            border: "none",
            cursor: "pointer",
          }}
        >
          {showForm ? "Fechar formulário" : "+ Novo imóvel"}
        </button>
      </div>

      {/* MENSAGENS */}

            {successMessage && (
              <div
                style={
                  successStyle
                }
              >
                {
                  successMessage
                }
              </div>
            )}

            {errorMessage && (
              <div
                style={
                  errorStyle
                }
              >
                {
                  errorMessage
                }
              </div>
            )}

            {/* FORMULÁRIO NOVO IMÓVEL */}

            {showForm && (
              <form
                onSubmit={
                  handleCreate
                }
                style={
                  formCardStyle
                }
              >
                <div>
                  <div
                    style={
                      eyebrowStyle
                    }
                  >
                    Golden Jinx
                  </div>

                  <h2
                    style={
                      formTitleStyle
                    }
                  >
                    Novo imóvel
                  </h2>
                </div>

                <input
                  name="title"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Título do imóvel *"
                  required
                  style={
                    inputStyle
                  }
                />

                <input
                  name="location"
                  value={
                    location
                  }
                  onChange={(
                    event
                  ) =>
                    setLocation(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Localização *"
                  required
                  style={
                    inputStyle
                  }
                />

                <div
                  style={
                    slugBoxStyle
                  }
                >
                  <div
                    style={
                      labelStyle
                    }
                  >
                    Endereço
                    automático
                  </div>

                  <div
                    style={{
                      color:
                        generatedSlug
                          ? "#C8A24A"
                          : "#666",

                      fontSize:
                        13,

                      wordBreak:
                        "break-all",
                    }}
                  >
                    {generatedSlug
                      ? `/imoveis/${generatedSlug}`
                      : "O endereço será criado automaticamente."}
                  </div>
                </div>

                <div
                  style={
                    twoColumnStyle
                  }
                >
                  <select
                    name="status"
                    defaultValue=""
                    required
                    style={
                      inputStyle
                    }
                  >
                    <option
                      value=""
                      disabled
                    >
                      Estado
                      comercial *
                    </option>

                    <option value="Venda">
                      Venda
                    </option>

                    <option value="Arrendamento">
                      Arrendamento
                    </option>
                  </select>

                  <select
                    name="property_type"
                    defaultValue=""
                    required
                    style={
                      inputStyle
                    }
                  >
                    <option
                      value=""
                      disabled
                    >
                      Tipo de
                      imóvel *
                    </option>

                    <option value="Moradia">
                      Moradia
                    </option>

                    <option value="Apartamento">
                      Apartamento
                    </option>

                    <option value="Terreno">
                      Terreno
                    </option>

                    <option value="Prédio">
                      Prédio
                    </option>

                    <option value="Outro">
                      Outro
                    </option>
                  </select>
                </div>

                <input
                  name="price"
                  placeholder="Preço *  Ex.: 595 000 €"
                  required
                  style={
                    inputStyle
                  }
                />

                <div
                  style={
                    threeColumnStyle
                  }
                >
                  <input
                    name="bedrooms"
                    placeholder="Quartos"
                    style={
                      inputStyle
                    }
                  />

                  <input
                    name="bathrooms"
                    placeholder="Casas de banho"
                    style={
                      inputStyle
                    }
                  />

                  <input
                    name="area"
                    placeholder="Área  Ex.: 240 m²"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <ImageUpload
                  title="Fotografia principal"
                  preview={
                    imagePreview
                  }
                  onFileChange={
                    setImageFile
                  }
                />

                <input
                  name="cover_image"
                  placeholder="Ou cole aqui uma URL de imagem"
                  style={
                    inputStyle
                  }
                />

                <textarea
                  name="description"
                  rows={6}
                  placeholder="Descrição do imóvel"
                  style={{
                    ...inputStyle,
                    resize:
                      "vertical",
                  }}
                />

                <textarea
                  name="features"
                  rows={7}
                  placeholder={
                    "Características, uma por linha\nPiscina\nGaragem\nJardim\nAr condicionado"
                  }
                  style={{
                    ...inputStyle,
                    resize:
                      "vertical",
                  }}
                />

                <select
                  name="published"
                  defaultValue="false"
                  style={
                    inputStyle
                  }
                >
                  <option value="false">
                    Guardar como
                    oculto
                  </option>

                  <option value="true">
                    Publicar
                    imediatamente
                  </option>
                </select>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="btn-primary"
                  style={{
                    border:
                      "none",

                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",

                    justifySelf:
                      "start",

                    opacity:
                      saving
                        ? 0.65
                        : 1,
                  }}
                >
                  {saving
                    ? "A guardar..."
                    : "Guardar imóvel"}
                </button>
              </form>
            )}

            {/* FORMULÁRIO EDITAR */}

            {editingProperty && (
              <form
                key={
                  editingProperty.id
                }
                onSubmit={
                  handleUpdate
                }
                style={
                  formCardStyle
                }
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    gap:
                      20,

                    alignItems:
                      "flex-start",

                    flexWrap:
                      "wrap",
                  }}
                >
                  <div>
                    <div
                      style={
                        eyebrowStyle
                      }
                    >
                      Editar imóvel
                    </div>

                    <h2
                      style={
                        formTitleStyle
                      }
                    >
                      {
                        editingProperty.title
                      }
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      cancelEditing
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancelar
                  </button>
                </div>

                <div
                  style={
                    slugBoxStyle
                  }
                >
                  <div
                    style={
                      labelStyle
                    }
                  >
                    Endereço atual
                  </div>

                  <div
                    style={{
                      color:
                        "#C8A24A",

                      fontSize:
                        13,

                      wordBreak:
                        "break-all",
                    }}
                  >
                    /imoveis/
                    {
                      editingProperty.slug
                    }
                  </div>

                  <div
                    style={{
                      color:
                        "#666",

                      fontSize:
                        11,

                      marginTop:
                        8,
                    }}
                  >
                    O endereço não é
                    alterado quando
                    editar o título ou
                    localização.
                  </div>
                </div>

                <input
                  name="edit_title"
                  defaultValue={
                    editingProperty.title
                  }
                  placeholder="Título do imóvel *"
                  required
                  style={
                    inputStyle
                  }
                />

                <input
                  name="edit_location"
                  defaultValue={
                    editingProperty.location
                  }
                  placeholder="Localização *"
                  required
                  style={
                    inputStyle
                  }
                />

                <div
                  style={
                    twoColumnStyle
                  }
                >
                  <select
                    name="edit_status"
                    defaultValue={
                      editingProperty.status
                    }
                    required
                    style={
                      inputStyle
                    }
                  >
                    <option value="Venda">
                      Venda
                    </option>

                    <option value="Arrendamento">
                      Arrendamento
                    </option>
                  </select>

                  <select
                    name="edit_property_type"
                    defaultValue={
                      editingProperty.property_type
                    }
                    required
                    style={
                      inputStyle
                    }
                  >
                    <option value="Moradia">
                      Moradia
                    </option>

                    <option value="Apartamento">
                      Apartamento
                    </option>

                    <option value="Terreno">
                      Terreno
                    </option>

                    <option value="Prédio">
                      Prédio
                    </option>

                    <option value="Outro">
                      Outro
                    </option>
                  </select>
                </div>

                <input
                  name="edit_price"
                  defaultValue={
                    editingProperty.price
                  }
                  placeholder="Preço *"
                  required
                  style={
                    inputStyle
                  }
                />

                <div
                  style={
                    threeColumnStyle
                  }
                >
                  <input
                    name="edit_bedrooms"
                    defaultValue={
                      editingProperty.bedrooms ||
                      ""
                    }
                    placeholder="Quartos"
                    style={
                      inputStyle
                    }
                  />

                  <input
                    name="edit_bathrooms"
                    defaultValue={
                      editingProperty.bathrooms ||
                      ""
                    }
                    placeholder="Casas de banho"
                    style={
                      inputStyle
                    }
                  />

                  <input
                    name="edit_area"
                    defaultValue={
                      editingProperty.area ||
                      ""
                    }
                    placeholder="Área"
                    style={
                      inputStyle
                    }
                  />
                </div>

                {/* FOTO ATUAL */}

                <div>
                  <div
                    style={
                      labelStyle
                    }
                  >
                    Fotografia atual
                  </div>

                  {editingProperty.cover_image ? (
                    <div
                      style={
                        previewBoxStyle
                      }
                    >
                      <img
                        src={
                          editingProperty.cover_image
                        }
                        alt={
                          editingProperty.title
                        }
                        style={
                          previewImageStyle
                        }
                      />
                    </div>
                  ) : (
                    <div
                      style={
                        noImageStyle
                      }
                    >
                      Este imóvel ainda
                      não tem fotografia.
                    </div>
                  )}
                </div>

                {/* NOVA FOTO */}

                <ImageUpload
                  title="Substituir fotografia"
                  preview={
                    editImagePreview
                  }
                  onFileChange={
                    setEditImageFile
                  }
                />

                <div
                  style={{
                    color:
                      "#777",

                    fontSize:
                      12,

                    lineHeight:
                      1.6,
                  }}
                >
                  Se não escolher uma
                  fotografia nova, a
                  fotografia atual será
                  mantida.
                </div>

                <input
                  name="edit_cover_image"
                  placeholder="Ou introduza uma nova URL de imagem"
                  style={
                    inputStyle
                  }
                />

                <textarea
                  name="edit_description"
                  defaultValue={
                    editingProperty.description ||
                    ""
                  }
                  rows={6}
                  placeholder="Descrição do imóvel"
                  style={{
                    ...inputStyle,
                    resize:
                      "vertical",
                  }}
                />

                <textarea
                  name="edit_features"
                  defaultValue={
                    editingProperty.features?.join(
                      "\n"
                    ) || ""
                  }
                  rows={7}
                  placeholder="Características, uma por linha"
                  style={{
                    ...inputStyle,
                    resize:
                      "vertical",
                  }}
                />

                <select
                  name="edit_published"
                  defaultValue={
                    editingProperty.published
                      ? "true"
                      : "false"
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="false">
                    Oculto
                  </option>

                  <option value="true">
                    Publicado
                  </option>
                </select>

                {/* GALERIA DO IMÓVEL */}

                <PropertyGalleryManager
                  propertyId={editingProperty.id}
                  propertySlug={editingProperty.slug}
                />

                <button
                  type="submit"
                  disabled={
                    updating
                  }
                  className="btn-primary"
                  style={{
                    border:
                      "none",

                    cursor:
                      updating
                        ? "not-allowed"
                        : "pointer",

                    justifySelf:
                      "start",

                    opacity:
                      updating
                        ? 0.65
                        : 1,
                  }}
                >
                  {updating
                    ? "A guardar alterações..."
                    : "Guardar alterações"}
                </button>
              </form>
            )}

            {/* LISTA */}

            <div
              style={{
                background:
                  "#151515",

                border:
                  "1px solid rgba(200,162,74,.16)",

                borderRadius:
                  24,

                overflow:
                  "hidden",
              }}
            >
              <div
                style={{
                  padding:
                    "24px 28px",

                  borderBottom:
                    "1px solid rgba(255,255,255,.08)",

                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  gap:
                    20,

                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-title)",

                      fontSize:
                        "1.8rem",
                    }}
                  >
                    Imóveis
                    registados
                  </div>

                  <div
                    style={{
                      color:
                        "#777",

                      fontSize:
                        12,

                      marginTop:
                        5,
                    }}
                  >
                    {
                      properties.length
                    }{" "}
                    {properties.length ===
                    1
                      ? "imóvel"
                      : "imóveis"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    loadProperties
                  }
                  style={
                    goldOutlineButtonStyle
                  }
                >
                  Atualizar
                </button>
              </div>

              {loading ? (
                <div
                  style={
                    emptyStyle
                  }
                >
                  A carregar
                  imóveis...
                </div>
              ) : properties.length ===
                0 ? (
                <div
                  style={
                    emptyStyle
                  }
                >
                  Ainda não existem
                  imóveis no
                  Supabase.
                </div>
              ) : (
                <div>
                  {properties.map(
                    (property) => (
                      <div
                        key={
                          property.id
                        }
                        style={
                          propertyRowStyle
                        }
                      >
                        {/* FOTO */}

                        <div
                          style={
                            thumbnailStyle
                          }
                        >
                          {property.cover_image ? (
                            <img
                              src={
                                property.cover_image
                              }
                              alt={
                                property.title
                              }
                              style={{
                                width:
                                  "100%",

                                height:
                                  "100%",

                                objectFit:
                                  "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={
                                noThumbnailStyle
                              }
                            >
                              ⌂
                            </div>
                          )}
                        </div>

                        {/* INFO */}

                        <div>
                          <div
                            style={{
                              fontSize:
                                16,

                              marginBottom:
                                6,
                            }}
                          >
                            {
                              property.title
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#888",

                              fontSize:
                                12,
                            }}
                          >
                            {
                              property.property_type
                            }{" "}
                            ·{" "}
                            {
                              property.location
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#666",

                              fontSize:
                                11,

                              marginTop:
                                6,
                            }}
                          >
                            /imoveis/
                            {
                              property.slug
                            }
                          </div>
                        </div>

                        {/* PREÇO */}

                        <div>
                          <div
                            style={{
                              color:
                                "#C8A24A",

                              fontSize:
                                15,
                            }}
                          >
                            {
                              property.price
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#777",

                              fontSize:
                                11,

                              marginTop:
                                4,
                            }}
                          >
                            {
                              property.status
                            }
                          </div>
                        </div>

                        {/* AÇÕES */}

                        <div
                          style={{
                            display:
                              "flex",

                            gap:
                              10,

                            flexWrap:
                              "wrap",

                            justifyContent:
                              "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                property
                              )
                            }
                            style={
                              editButtonStyle
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePublished(
                                property
                              )
                            }
                            style={{
                              border:
                                "1px solid rgba(200,162,74,.25)",

                              background:
                                property.published
                                  ? "rgba(200,162,74,.12)"
                                  : "transparent",

                              color:
                                property.published
                                  ? "#C8A24A"
                                  : "#999",

                              borderRadius:
                                10,

                              padding:
                                "10px 13px",

                              cursor:
                                "pointer",
                            }}
                          >
                            {property.published
                              ? "Publicado"
                              : "Oculto"}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
    </AdminLayout>
  );
}

/*
 * COMPONENTE PARA ESCOLHER FOTO
 */

function PropertySettingsGroup({
  title,
  subtitle,
  fields,
  values,
  onChange,
}: {
  title: string;
  subtitle: string;
  fields: PropertySettingField[];
  values: Record<string, string>;
  onChange: (
    key: string,
    value: string
  ) => void;
}) {
  return (
    <div style={settingsGroupStyle}>
      <div>
        <h3 style={settingsGroupTitleStyle}>
          {title}
        </h3>

        <p style={settingsGroupTextStyle}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {fields.map((field) => (
          <label
            key={field.key}
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
                rows={field.rows || 3}
                value={
                  values[field.key] ??
                  field.defaultValue
                }
                onChange={(event) =>
                  onChange(
                    field.key,
                    event.target.value
                  )
                }
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 100,
                }}
              />
            ) : (
              <input
                type="text"
                value={
                  values[field.key] ??
                  field.defaultValue
                }
                onChange={(event) =>
                  onChange(
                    field.key,
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function ImageUpload({
  title,
  preview,
  onFileChange,
}: {
  title: string;
  preview: string;
  onFileChange: (
    file: File | null
  ) => void;
}) {
  return (
    <div
      style={{
        display:
          "grid",

        gap:
          12,
      }}
    >
      <div
        style={
          labelStyle
        }
      >
        {title}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(
          event
        ) => {
          const file =
            event.target
              .files?.[0] ||
            null;

          onFileChange(
            file
          );
        }}
        style={{
          color:
            "#bbb",
        }}
      />

      {preview && (
        <div
          style={
            previewBoxStyle
          }
        >
          <img
            src={
              preview
            }
            alt="Pré-visualização"
            style={
              previewImageStyle
            }
          />
        </div>
      )}
    </div>
  );
}

/*
 * SLUG
 */

function createSlug(
  value: string
) {
  return value
    .toLowerCase()
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /ç/g,
      "c"
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

/*
 * ESTILOS
 */

const contentManagerStyle = {
  background: "#151515",
  border: "1px solid rgba(200,162,74,.18)",
  borderRadius: 24,
  padding: "clamp(22px, 5vw, 38px)",
  marginBottom: 40,
};

const contentManagerHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  flexWrap: "wrap" as const,
  marginBottom: 28,
};

const contentManagerTitleStyle = {
  fontFamily: "var(--font-title)",
  fontSize: "clamp(2rem, 7vw, 2.6rem)",
  fontWeight: 400,
  margin: "0 0 10px",
};

const contentManagerTextStyle = {
  color: "#888",
  lineHeight: 1.7,
  margin: 0,
  maxWidth: 650,
};

const settingsColumnsStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 390px), 1fr))",
  gap: 24,
};

const settingsGroupStyle = {
  background: "#101010",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 18,
  padding: "clamp(18px, 4vw, 26px)",
  display: "grid",
  gap: 22,
};

const settingsGroupTitleStyle = {
  fontFamily: "var(--font-title)",
  fontSize: "1.6rem",
  fontWeight: 400,
  margin: "0 0 6px",
};

const settingsGroupTextStyle = {
  color: "#777",
  fontSize: 13,
  lineHeight: 1.6,
  margin: 0,
};

const inputStyle = {
  width:
    "100%",

  boxSizing:
    "border-box" as const,

  background:
    "#0f0f0f",

  border:
    "1px solid rgba(255,255,255,.12)",

  borderRadius:
    12,

  padding:
    "15px 17px",

  color:
    "white",

  fontSize:
    14,

  outline:
    "none",
};

const twoColumnStyle = {
  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",

  gap:
    15,
};

const threeColumnStyle = {
  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",

  gap:
    15,
};

const eyebrowStyle = {
  color:
    "#C8A24A",

  fontSize:
    11,

  letterSpacing:
    3,

  textTransform:
    "uppercase" as const,

  marginBottom:
    15,
};

const formCardStyle = {
  background:
    "#151515",

  border:
    "1px solid rgba(200,162,74,.18)",

  borderRadius:
    24,

  padding:
    "clamp(25px, 5vw, 45px)",

  display:
    "grid",

  gap:
    18,

  marginBottom:
    40,
};

const formTitleStyle = {
  fontFamily:
    "var(--font-title)",

  fontSize:
    "2.3rem",

  fontWeight:
    400,

  margin:
    0,
};

const slugBoxStyle = {
  background:
    "#101010",

  border:
    "1px solid rgba(200,162,74,.18)",

  borderRadius:
    12,

  padding:
    "14px 17px",
};

const labelStyle = {
  color:
    "#C8A24A",

  fontSize:
    10,

  letterSpacing:
    2,

  textTransform:
    "uppercase" as const,

  marginBottom:
    7,
};

const previewBoxStyle = {
  width:
    "100%",

  maxWidth:
    520,

  height:
    300,

  borderRadius:
    16,

  overflow:
    "hidden",

  border:
    "1px solid rgba(200,162,74,.20)",

  background:
    "#0d0d0d",
};

const previewImageStyle = {
  width:
    "100%",

  height:
    "100%",

  objectFit:
    "cover" as const,
};

const noImageStyle = {
  width:
    "100%",

  maxWidth:
    520,

  padding:
    "30px",

  boxSizing:
    "border-box" as const,

  borderRadius:
    16,

  border:
    "1px dashed rgba(200,162,74,.25)",

  color:
    "#777",

  textAlign:
    "center" as const,
};

const secondaryButtonStyle = {
  textDecoration:
    "none",

  border:
    "1px solid rgba(255,255,255,.15)",

  background:
    "transparent",

  borderRadius:
    10,

  color:
    "#bbb",

  padding:
    "11px 17px",

  cursor:
    "pointer",
};

const goldOutlineButtonStyle = {
  background:
    "transparent",

  border:
    "1px solid rgba(200,162,74,.30)",

  borderRadius:
    10,

  color:
    "#C8A24A",

  padding:
    "10px 16px",

  cursor:
    "pointer",
};

const editButtonStyle = {
  background:
    "transparent",

  border:
    "1px solid rgba(255,255,255,.16)",

  color:
    "#ddd",

  borderRadius:
    10,

  padding:
    "10px 15px",

  cursor:
    "pointer",
};

const successStyle = {
  padding:
    "15px 17px",

  borderRadius:
    12,

  background:
    "rgba(200,162,74,.10)",

  border:
    "1px solid rgba(200,162,74,.30)",

  color:
    "#D9BD74",

  fontSize:
    14,

  marginBottom:
    25,
};

const errorStyle = {
  padding:
    "15px 17px",

  borderRadius:
    12,

  background:
    "rgba(180,50,50,.10)",

  border:
    "1px solid rgba(220,80,80,.30)",

  color:
    "#e6aaaa",

  fontSize:
    14,

  marginBottom:
    25,
};

const emptyStyle = {
  padding:
    "60px 30px",

  textAlign:
    "center" as const,

  color:
    "#888",
};

const centerPageStyle = {
  minHeight:
    "100vh",

  background:
    "#0d0d0d",

  color:
    "white",

  display:
    "flex",

  alignItems:
    "center",

  justifyContent:
    "center",

  padding:
    30,
};

const propertyRowStyle = {
  display:
    "grid",

  gridTemplateColumns:
    "90px minmax(200px, 1fr) minmax(140px, .6fr) minmax(190px, auto)",

  gap:
    20,

  alignItems:
    "center",

  padding:
    "20px 28px",

  borderBottom:
    "1px solid rgba(255,255,255,.06)",
};

const thumbnailStyle = {
  width:
    90,

  height:
    70,

  borderRadius:
    10,

  overflow:
    "hidden",

  background:
    "#0d0d0d",
};

const noThumbnailStyle = {
  width:
    "100%",

  height:
    "100%",

  display:
    "flex",

  alignItems:
    "center",

  justifyContent:
    "center",

  color:
    "#555",

  fontSize:
    20,
};