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

type Project = {
  id: number;
  created_at: string;
  updated_at: string | null;
  slug: string;
  title: string;
  location: string | null;
  description: string | null;
  before_image: string | null;
  before_storage_path: string | null;
  after_image: string | null;
  after_storage_path: string | null;
  published: boolean;
};


type ProjectSettingField = {
  key: string;
  label: string;
  group: "home" | "page";
  type?: "text" | "textarea";
  rows?: number;
  defaultValue: string;
};

const projectSettingFields: ProjectSettingField[] = [
  {
    key: "projects_eyebrow",
    label: "Home · linha superior",
    group: "home",
    defaultValue: "Antes & Depois",
  },
  {
    key: "projects_title",
    label: "Home · título",
    group: "home",
    defaultValue: "Sparkling Projects",
  },
  {
    key: "projects_text",
    label: "Home · texto",
    group: "home",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Cada imóvel tem potencial.\nO nosso trabalho consiste em fazê-lo brilhar.",
  },

  {
    key: "projects_page_eyebrow",
    label: "Página · linha superior",
    group: "page",
    defaultValue: "Sparkling Projects",
  },
  {
    key: "projects_page_title",
    label: "Página · título principal",
    group: "page",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Transformamos\npotencial em valor.",
  },
  {
    key: "projects_page_intro",
    label: "Página · texto introdutório",
    group: "page",
    type: "textarea",
    rows: 4,
    defaultValue:
      "Cada projeto Golden Jinx nasce de uma oportunidade. Identificamos potencial, transformamos o espaço e criamos imóveis preparados para uma nova vida.",
  },
  {
    key: "projects_page_loading_text",
    label: "Página · texto de carregamento",
    group: "page",
    defaultValue: "A carregar projetos...",
  },
  {
    key: "projects_page_empty_title",
    label: "Página · sem projetos · título",
    group: "page",
    defaultValue: "Novos projetos em breve.",
  },
  {
    key: "projects_page_empty_text",
    label: "Página · sem projetos · texto",
    group: "page",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Estamos a preparar novas transformações Golden Jinx.",
  },
  {
    key: "projects_page_cta_eyebrow",
    label: "CTA · linha superior",
    group: "page",
    defaultValue: "Tem um imóvel com potencial?",
  },
  {
    key: "projects_page_cta_title",
    label: "CTA · título",
    group: "page",
    type: "textarea",
    rows: 2,
    defaultValue:
      "Talvez seja o nosso próximo projeto.",
  },
  {
    key: "projects_page_cta_text",
    label: "CTA · texto",
    group: "page",
    type: "textarea",
    rows: 3,
    defaultValue:
      "Procuramos imóveis, moradias, edifícios e oportunidades com potencial de transformação e valorização.",
  },
  {
    key: "projects_page_cta_button_label",
    label: "CTA · botão · texto",
    group: "page",
    defaultValue: "Falar com a Golden Jinx",
  },
  {
    key: "projects_page_cta_button_href",
    label: "CTA · botão · link",
    group: "page",
    defaultValue: "/contactos",
  },
];

export default function AdminProjectsPage() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [editBeforeFile, setEditBeforeFile] =
    useState<File | null>(null);

  const [editAfterFile, setEditAfterFile] =
    useState<File | null>(null);

  const [editBeforePreview, setEditBeforePreview] =
    useState("");

  const [editAfterPreview, setEditAfterPreview] =
    useState("");

  const [updating, setUpdating] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [projectSettings, setProjectSettings] =
    useState<Record<string, string>>({});

  const [loadingProjectSettings, setLoadingProjectSettings] =
    useState(false);

  const [savingProjectSettings, setSavingProjectSettings] =
    useState(false);

  const [settingsSuccessMessage, setSettingsSuccessMessage] =
    useState("");

  const [settingsErrorMessage, setSettingsErrorMessage] =
    useState("");

  const generatedSlug = useMemo(() => {
    return createSlug(`${title} ${location}`);
  }, [title, location]);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const loggedIn = Boolean(session);

      setAuthenticated(loggedIn);
      setLoadingSession(false);

      if (loggedIn) {
        await Promise.all([
          loadProjects(),
          loadProjectSettings(),
        ]);
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

  useEffect(() => {
    if (!beforeFile) {
      setBeforePreview("");
      return;
    }

    const url = URL.createObjectURL(beforeFile);
    setBeforePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [beforeFile]);

  useEffect(() => {
    if (!afterFile) {
      setAfterPreview("");
      return;
    }

    const url = URL.createObjectURL(afterFile);
    setAfterPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [afterFile]);

  useEffect(() => {
    if (!editBeforeFile) {
      setEditBeforePreview("");
      return;
    }

    const url = URL.createObjectURL(editBeforeFile);
    setEditBeforePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [editBeforeFile]);

  useEffect(() => {
    if (!editAfterFile) {
      setEditAfterPreview("");
      return;
    }

    const url = URL.createObjectURL(editAfterFile);
    setEditAfterPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [editAfterFile]);

  async function loadProjects() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Erro ao carregar projetos:", error);

      setErrorMessage(
        `Não foi possível carregar os projetos: ${error.message}`
      );

      setLoading(false);
      return;
    }

    setProjects((data || []) as Project[]);
    setLoading(false);
  }

  async function loadProjectSettings() {
    setLoadingProjectSettings(true);
    setSettingsErrorMessage("");

    const keys = projectSettingFields.map(
      (field) => field.key
    );

    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", keys);

    if (error) {
      console.error(
        "Erro ao carregar conteúdos de Projetos:",
        error
      );

      setSettingsErrorMessage(
        `Não foi possível carregar os conteúdos: ${error.message}`
      );

      setLoadingProjectSettings(false);
      return;
    }

    const rows = data || [];
    const nextValues: Record<string, string> = {};

    projectSettingFields.forEach((field) => {
      const existing = rows.find(
        (item) => item.setting_key === field.key
      );

      nextValues[field.key] =
        existing?.setting_value ??
        field.defaultValue;
    });

    setProjectSettings(nextValues);
    setLoadingProjectSettings(false);
  }

  function updateProjectSetting(
    key: string,
    value: string
  ) {
    setProjectSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveProjectSettings() {
    setSavingProjectSettings(true);
    setSettingsSuccessMessage("");
    setSettingsErrorMessage("");

    const rows = projectSettingFields.map(
      (field) => ({
        setting_key: field.key,
        setting_value:
          projectSettings[field.key] ??
          field.defaultValue,
        setting_group:
          field.group === "home"
            ? "projetos"
            : "pagina_projetos",
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
        "Erro ao guardar conteúdos de Projetos:",
        error
      );

      setSettingsErrorMessage(
        `Não foi possível guardar os conteúdos: ${error.message}`
      );

      setSavingProjectSettings(false);
      return;
    }

    setSettingsSuccessMessage(
      "Conteúdos de Projetos guardados com sucesso."
    );

    setSavingProjectSettings(false);
  }

  async function uploadProjectImage(
    file: File,
    slug: string,
    kind: "before" | "after"
  ) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeSlug = slug || "projeto";

    const path =
      `projects/${safeSlug}/${kind}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);

    return {
      publicUrl: data.publicUrl,
      storagePath: path,
    };
  }

  async function removeStorageFile(path: string | null) {
    if (!path) return;

    const { error } = await supabase.storage
      .from("property-images")
      .remove([path]);

    if (error) {
      console.error("Erro ao apagar ficheiro do Storage:", error);
    }
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const description = String(
      formData.get("description") || ""
    ).trim();

    const published =
      String(formData.get("published") || "") === "true";

    const slug = generatedSlug;

    if (!title.trim() || !location.trim() || !slug) {
      setErrorMessage(
        "Preencha o título e a localização antes de guardar."
      );

      setSaving(false);
      return;
    }

    if (!beforeFile || !afterFile) {
      setErrorMessage(
        "Escolha uma fotografia Antes e uma fotografia Depois."
      );

      setSaving(false);
      return;
    }

    let uploadedBeforePath: string | null = null;
    let uploadedAfterPath: string | null = null;

    try {
      const beforeUpload = await uploadProjectImage(
        beforeFile,
        slug,
        "before"
      );

      uploadedBeforePath = beforeUpload.storagePath;

      const afterUpload = await uploadProjectImage(
        afterFile,
        slug,
        "after"
      );

      uploadedAfterPath = afterUpload.storagePath;

      const { error } = await supabase
        .from("projects")
        .insert([
          {
            slug,
            title: title.trim(),
            location: location.trim(),
            description: description || null,

            before_image: beforeUpload.publicUrl,
            before_storage_path: beforeUpload.storagePath,

            after_image: afterUpload.publicUrl,
            after_storage_path: afterUpload.storagePath,

            published,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        await removeStorageFile(uploadedBeforePath);
        await removeStorageFile(uploadedAfterPath);

        if (error.code === "23505") {
          setErrorMessage(
            "Já existe um projeto com este título e localização."
          );
        } else {
          setErrorMessage(
            `Não foi possível criar o projeto: ${error.message}`
          );
        }

        setSaving(false);
        return;
      }

      form.reset();

      setTitle("");
      setLocation("");
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview("");
      setAfterPreview("");

      setShowForm(false);

      setSuccessMessage(
        "Sparkling Project criado com sucesso."
      );

      setSaving(false);

      await loadProjects();
    } catch (error) {
      console.error("Erro no upload do projeto:", error);

      if (uploadedBeforePath) {
        await removeStorageFile(uploadedBeforePath);
      }

      if (uploadedAfterPath) {
        await removeStorageFile(uploadedAfterPath);
      }

      setErrorMessage(
        "Não foi possível carregar as fotografias. Confirme as permissões do Storage."
      );

      setSaving(false);
    }
  }

  function startEditing(project: Project) {
    setShowForm(false);
    setEditingProject(project);

    setEditBeforeFile(null);
    setEditAfterFile(null);

    setEditBeforePreview("");
    setEditAfterPreview("");

    setSuccessMessage("");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingProject(null);

    setEditBeforeFile(null);
    setEditAfterFile(null);

    setEditBeforePreview("");
    setEditAfterPreview("");

    setErrorMessage("");
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingProject) return;

    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const editedTitle = String(
      formData.get("edit_title") || ""
    ).trim();

    const editedLocation = String(
      formData.get("edit_location") || ""
    ).trim();

    const editedDescription = String(
      formData.get("edit_description") || ""
    ).trim();

    const published =
      String(formData.get("edit_published") || "") === "true";

    if (!editedTitle || !editedLocation) {
      setErrorMessage(
        "Preencha o título e a localização."
      );

      setUpdating(false);
      return;
    }

    let finalBeforeImage = editingProject.before_image;
    let finalBeforeStoragePath =
      editingProject.before_storage_path;

    let finalAfterImage = editingProject.after_image;
    let finalAfterStoragePath =
      editingProject.after_storage_path;

    let newlyUploadedBeforePath: string | null = null;
    let newlyUploadedAfterPath: string | null = null;

    try {
      if (editBeforeFile) {
        const upload = await uploadProjectImage(
          editBeforeFile,
          editingProject.slug,
          "before"
        );

        newlyUploadedBeforePath = upload.storagePath;

        finalBeforeImage = upload.publicUrl;
        finalBeforeStoragePath = upload.storagePath;
      }

      if (editAfterFile) {
        const upload = await uploadProjectImage(
          editAfterFile,
          editingProject.slug,
          "after"
        );

        newlyUploadedAfterPath = upload.storagePath;

        finalAfterImage = upload.publicUrl;
        finalAfterStoragePath = upload.storagePath;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: editedTitle,
          location: editedLocation,
          description: editedDescription || null,

          before_image: finalBeforeImage,
          before_storage_path: finalBeforeStoragePath,

          after_image: finalAfterImage,
          after_storage_path: finalAfterStoragePath,

          published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProject.id);

      if (error) {
        if (newlyUploadedBeforePath) {
          await removeStorageFile(newlyUploadedBeforePath);
        }

        if (newlyUploadedAfterPath) {
          await removeStorageFile(newlyUploadedAfterPath);
        }

        setErrorMessage(
          `Não foi possível guardar o projeto: ${error.message}`
        );

        setUpdating(false);
        return;
      }

      if (
        editBeforeFile &&
        editingProject.before_storage_path &&
        editingProject.before_storage_path !== finalBeforeStoragePath
      ) {
        await removeStorageFile(
          editingProject.before_storage_path
        );
      }

      if (
        editAfterFile &&
        editingProject.after_storage_path &&
        editingProject.after_storage_path !== finalAfterStoragePath
      ) {
        await removeStorageFile(
          editingProject.after_storage_path
        );
      }

      setEditingProject(null);

      setEditBeforeFile(null);
      setEditAfterFile(null);

      setEditBeforePreview("");
      setEditAfterPreview("");

      setSuccessMessage(
        "Sparkling Project atualizado com sucesso."
      );

      setUpdating(false);

      await loadProjects();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);

      if (newlyUploadedBeforePath) {
        await removeStorageFile(newlyUploadedBeforePath);
      }

      if (newlyUploadedAfterPath) {
        await removeStorageFile(newlyUploadedAfterPath);
      }

      setErrorMessage(
        "Não foi possível atualizar as fotografias do projeto."
      );

      setUpdating(false);
    }
  }

  async function togglePublished(project: Project) {
    const newState = !project.published;

    const { error } = await supabase
      .from("projects")
      .update({
        published: newState,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (error) {
      console.error("Erro ao alterar publicação:", error);

      alert(
        "Não foi possível alterar o estado de publicação do projeto."
      );

      return;
    }

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              published: newState,
            }
          : item
      )
    );
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Apagar definitivamente o projeto "${project.title}"?\n\nEsta ação também tentará apagar as fotografias Antes e Depois do Storage.`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      console.error("Erro ao apagar projeto:", error);

      setErrorMessage(
        `Não foi possível apagar o projeto: ${error.message}`
      );

      return;
    }

    await Promise.all([
      removeStorageFile(project.before_storage_path),
      removeStorageFile(project.after_storage_path),
    ]);

    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    );

    if (editingProject?.id === project.id) {
      setEditingProject(null);
    }

    setSuccessMessage(
      "Sparkling Project apagado com sucesso."
    );
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
      title="Projetos"
      subtitle="Conteúdos, apresentação e portefólio Antes & Depois"
    >
      <section style={contentManagerStyle}>
        <div style={contentManagerHeaderStyle}>
          <div>
            <div style={eyebrowStyle}>
              Conteúdo do site
            </div>

            <h2 style={contentManagerTitleStyle}>
              Apresentação dos Projetos
            </h2>

            <p style={contentManagerTextStyle}>
              Controle aqui os textos da secção Sparkling Projects
              na Home e da página /projetos.
            </p>
          </div>

          <button
            type="button"
            onClick={saveProjectSettings}
            disabled={
              savingProjectSettings ||
              loadingProjectSettings
            }
            className="btn-primary"
            style={{
              border: "none",
              cursor:
                savingProjectSettings ||
                loadingProjectSettings
                  ? "not-allowed"
                  : "pointer",
              opacity:
                savingProjectSettings ||
                loadingProjectSettings
                  ? 0.65
                  : 1,
            }}
          >
            {savingProjectSettings
              ? "A guardar..."
              : "Guardar conteúdos"}
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

        {loadingProjectSettings ? (
          <div style={emptyStyle}>
            A carregar conteúdos...
          </div>
        ) : (
          <div style={settingsColumnsStyle}>
            <ProjectSettingsGroup
              title="Na Home"
              subtitle="Secção Sparkling Projects da página inicial."
              fields={projectSettingFields.filter(
                (field) => field.group === "home"
              )}
              values={projectSettings}
              onChange={updateProjectSetting}
            />

            <ProjectSettingsGroup
              title="Página Projetos"
              subtitle="Hero, mensagens e CTA da página /projetos."
              fields={projectSettingFields.filter(
                (field) => field.group === "page"
              )}
              values={projectSettings}
              onChange={updateProjectSetting}
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
            Portefólio
          </div>

          <div
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(1.8rem, 6vw, 2.3rem)",
            }}
          >
            Projetos individuais
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
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
          {showForm
            ? "Fechar formulário"
            : "+ Novo projeto"}
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

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={formCardStyle}
        >
          <div>
            <div style={eyebrowStyle}>
              Sparkling Projects
            </div>

            <h2 style={formTitleStyle}>
              Novo projeto
            </h2>
          </div>

          <input
            name="title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Título do projeto *"
            required
            style={inputStyle}
          />

          <input
            name="location"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Localização *"
            required
            style={inputStyle}
          />

          <div style={slugBoxStyle}>
            <div style={labelStyle}>
              Endereço automático
            </div>

            <div
              style={{
                color: generatedSlug
                  ? "#C8A24A"
                  : "#666",
                fontSize: 13,
                wordBreak: "break-all",
              }}
            >
              {generatedSlug
                ? `/projetos/${generatedSlug}`
                : "O endereço será criado automaticamente."}
            </div>
          </div>

          <textarea
            name="description"
            rows={6}
            placeholder="Descrição do projeto"
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <div style={imageGridStyle}>
            <ProjectImageUpload
              title="Fotografia Antes *"
              preview={beforePreview}
              onFileChange={setBeforeFile}
            />

            <ProjectImageUpload
              title="Fotografia Depois *"
              preview={afterPreview}
              onFileChange={setAfterFile}
            />
          </div>

          <select
            name="published"
            defaultValue="false"
            style={inputStyle}
          >
            <option value="false">
              Guardar como oculto
            </option>

            <option value="true">
              Publicar imediatamente
            </option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{
              border: "none",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              justifySelf: "start",
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving
              ? "A guardar..."
              : "Guardar projeto"}
          </button>
        </form>
      )}

      {editingProject && (
        <form
          key={editingProject.id}
          onSubmit={handleUpdate}
          style={formCardStyle}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={eyebrowStyle}>
                Editar projeto
              </div>

              <h2 style={formTitleStyle}>
                {editingProject.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={cancelEditing}
              style={secondaryButtonStyle}
            >
              Cancelar
            </button>
          </div>

          <div style={slugBoxStyle}>
            <div style={labelStyle}>
              Endereço atual
            </div>

            <div
              style={{
                color: "#C8A24A",
                fontSize: 13,
                wordBreak: "break-all",
              }}
            >
              /projetos/{editingProject.slug}
            </div>

            <div
              style={{
                color: "#666",
                fontSize: 11,
                marginTop: 8,
              }}
            >
              O endereço mantém-se mesmo que altere o título ou a localização.
            </div>
          </div>

          <input
            name="edit_title"
            defaultValue={editingProject.title}
            placeholder="Título do projeto *"
            required
            style={inputStyle}
          />

          <input
            name="edit_location"
            defaultValue={
              editingProject.location || ""
            }
            placeholder="Localização *"
            required
            style={inputStyle}
          />

          <textarea
            name="edit_description"
            defaultValue={
              editingProject.description || ""
            }
            rows={6}
            placeholder="Descrição do projeto"
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <div style={imageGridStyle}>
            <CurrentProjectImage
              title="Antes atual"
              image={editingProject.before_image}
              alt={`${editingProject.title} antes`}
            />

            <CurrentProjectImage
              title="Depois atual"
              image={editingProject.after_image}
              alt={`${editingProject.title} depois`}
            />
          </div>

          <div style={imageGridStyle}>
            <ProjectImageUpload
              title="Substituir fotografia Antes"
              preview={editBeforePreview}
              onFileChange={setEditBeforeFile}
            />

            <ProjectImageUpload
              title="Substituir fotografia Depois"
              preview={editAfterPreview}
              onFileChange={setEditAfterFile}
            />
          </div>

          <div
            style={{
              color: "#777",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            Se não escolher novas fotografias, as atuais serão mantidas.
          </div>

          <select
            name="edit_published"
            defaultValue={
              editingProject.published
                ? "true"
                : "false"
            }
            style={inputStyle}
          >
            <option value="false">
              Oculto
            </option>

            <option value="true">
              Publicado
            </option>
          </select>

          <button
            type="submit"
            disabled={updating}
            className="btn-primary"
            style={{
              border: "none",
              cursor: updating
                ? "not-allowed"
                : "pointer",
              justifySelf: "start",
              opacity: updating ? 0.65 : 1,
            }}
          >
            {updating
              ? "A guardar alterações..."
              : "Guardar alterações"}
          </button>
        </form>
      )}

      <section
        style={{
          background: "#151515",
          border: "1px solid rgba(200,162,74,.16)",
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px clamp(18px, 4vw, 28px)",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
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
              Projetos registados
            </div>

            <div
              style={{
                color: "#777",
                fontSize: 12,
                marginTop: 5,
              }}
            >
              {projects.length}{" "}
              {projects.length === 1
                ? "projeto"
                : "projetos"}
            </div>
          </div>

          <button
            type="button"
            onClick={loadProjects}
            style={goldOutlineButtonStyle}
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div style={emptyStyle}>
            A carregar projetos...
          </div>
        ) : projects.length === 0 ? (
          <div style={emptyStyle}>
            Ainda não existem Sparkling Projects.
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <div
                key={project.id}
                style={projectRowStyle}
              >
                <div style={pairPreviewStyle}>
                  <ProjectThumb
                    label="Antes"
                    image={project.before_image}
                    alt={`${project.title} antes`}
                  />

                  <ProjectThumb
                    label="Depois"
                    image={project.after_image}
                    alt={`${project.title} depois`}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      marginBottom: 6,
                    }}
                  >
                    {project.title}
                  </div>

                  <div
                    style={{
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    {project.location || "Localização não indicada"}
                  </div>

                  <div
                    style={{
                      color: "#666",
                      fontSize: 11,
                      marginTop: 6,
                      overflowWrap: "anywhere",
                    }}
                  >
                    /projetos/{project.slug}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: project.published
                        ? "#C8A24A"
                        : "#777",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    {project.published
                      ? "Publicado"
                      : "Oculto"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      startEditing(project)
                    }
                    style={editButtonStyle}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      togglePublished(project)
                    }
                    style={{
                      border:
                        "1px solid rgba(200,162,74,.25)",
                      background: project.published
                        ? "rgba(200,162,74,.12)"
                        : "transparent",
                      color: project.published
                        ? "#C8A24A"
                        : "#999",
                      borderRadius: 10,
                      padding: "10px 13px",
                      cursor: "pointer",
                    }}
                  >
                    {project.published
                      ? "Publicado"
                      : "Oculto"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteProject(project)
                    }
                    style={deleteButtonStyle}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

function ProjectSettingsGroup({
  title,
  subtitle,
  fields,
  values,
  onChange,
}: {
  title: string;
  subtitle: string;
  fields: ProjectSettingField[];
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

function ProjectImageUpload({
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
        display: "grid",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={labelStyle}>
        {title}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file =
            event.target.files?.[0] ||
            null;

          onFileChange(file);
        }}
        style={{
          color: "#bbb",
          maxWidth: "100%",
        }}
      />

      {preview && (
        <div style={previewBoxStyle}>
          <img
            src={preview}
            alt="Pré-visualização"
            style={previewImageStyle}
          />
        </div>
      )}
    </div>
  );
}

function CurrentProjectImage({
  title,
  image,
  alt,
}: {
  title: string;
  image: string | null;
  alt: string;
}) {
  return (
    <div>
      <div style={labelStyle}>
        {title}
      </div>

      {image ? (
        <div style={previewBoxStyle}>
          <img
            src={image}
            alt={alt}
            style={previewImageStyle}
          />
        </div>
      ) : (
        <div style={noImageStyle}>
          Sem fotografia.
        </div>
      )}
    </div>
  );
}

function ProjectThumb({
  label,
  image,
  alt,
}: {
  label: string;
  image: string | null;
  alt: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: 82,
        height: 64,
        borderRadius: 10,
        overflow: "hidden",
        background: "#0d0d0d",
        flexShrink: 0,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
          }}
        >
          ⌂
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 5,
          bottom: 5,
          padding: "4px 6px",
          borderRadius: 999,
          background: "rgba(0,0,0,.72)",
          color: "#ddd",
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#0f0f0f",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 12,
  padding: "15px 17px",
  color: "white",
  fontSize: 16,
  minHeight: 50,
  outline: "none",
};

const eyebrowStyle = {
  color: "#C8A24A",
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase" as const,
  marginBottom: 15,
};

const formCardStyle = {
  background: "#151515",
  border: "1px solid rgba(200,162,74,.18)",
  borderRadius: 24,
  padding: "clamp(22px, 5vw, 45px)",
  display: "grid",
  gap: 18,
  marginBottom: 40,
};

const formTitleStyle = {
  fontFamily: "var(--font-title)",
  fontSize: "clamp(2rem, 7vw, 2.3rem)",
  fontWeight: 400,
  margin: 0,
};

const slugBoxStyle = {
  background: "#101010",
  border: "1px solid rgba(200,162,74,.18)",
  borderRadius: 12,
  padding: "14px 17px",
};

const labelStyle = {
  color: "#C8A24A",
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  marginBottom: 7,
};

const imageGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 20,
};

const previewBoxStyle = {
  width: "100%",
  height: "clamp(220px, 38vw, 330px)",
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid rgba(200,162,74,.20)",
  background: "#0d0d0d",
};

const previewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const noImageStyle = {
  width: "100%",
  minHeight: 150,
  padding: 30,
  boxSizing: "border-box" as const,
  borderRadius: 16,
  border: "1px dashed rgba(200,162,74,.25)",
  color: "#777",
  textAlign: "center" as const,
};

const secondaryButtonStyle = {
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,.15)",
  background: "transparent",
  borderRadius: 10,
  color: "#bbb",
  padding: "11px 17px",
  cursor: "pointer",
};

const goldOutlineButtonStyle = {
  background: "transparent",
  border: "1px solid rgba(200,162,74,.30)",
  borderRadius: 10,
  color: "#C8A24A",
  padding: "10px 16px",
  cursor: "pointer",
};

const editButtonStyle = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.16)",
  color: "#ddd",
  borderRadius: 10,
  padding: "10px 15px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  background: "transparent",
  border: "1px solid rgba(220,80,80,.26)",
  color: "#d98f8f",
  borderRadius: 10,
  padding: "10px 13px",
  cursor: "pointer",
};

const successStyle = {
  padding: "15px 17px",
  borderRadius: 12,
  background: "rgba(200,162,74,.10)",
  border: "1px solid rgba(200,162,74,.30)",
  color: "#D9BD74",
  fontSize: 14,
  marginBottom: 25,
};

const errorStyle = {
  padding: "15px 17px",
  borderRadius: 12,
  background: "rgba(180,50,50,.10)",
  border: "1px solid rgba(220,80,80,.30)",
  color: "#e6aaaa",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 25,
};

const emptyStyle = {
  padding: "60px 30px",
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

const pairPreviewStyle = {
  display: "flex",
  gap: 8,
};

const projectRowStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(175px, auto) minmax(220px, 1fr) minmax(90px, .35fr) minmax(250px, auto)",
  gap: 20,
  alignItems: "center",
  padding: "20px clamp(18px, 4vw, 28px)",
  borderBottom: "1px solid rgba(255,255,255,.06)",
};