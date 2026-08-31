"use client";

import { FormEvent, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/components/hooks/useSiteSettings";

const defaults = {
  valuation_eyebrow: "Avaliar Imóvel",
  valuation_title:
    "O seu imóvel pode ter\nmais potencial do que imagina.",
  valuation_intro:
    "Apresente-nos o seu imóvel ou terreno. Analisamos a localização, características e potencial para perceber se poderá enquadrar-se numa oportunidade Golden Jinx.",

  valuation_step_1_title: "Envie os dados",
  valuation_step_1_text:
    "Indique-nos as principais características do imóvel.",

  valuation_step_2_title: "Analisamos",
  valuation_step_2_text:
    "Avaliamos localização, características e potencial.",

  valuation_step_3_title: "Entramos em contacto",
  valuation_step_3_text:
    "Se existir enquadramento, falamos consigo sobre os próximos passos.",

  valuation_form_eyebrow: "Apresente o seu imóvel",
  valuation_form_title: "Conte-nos o essencial.",

  valuation_success_text:
    "Imóvel enviado com sucesso. Vamos analisar a informação e entraremos em contacto consigo.",

  valuation_submit_label:
    "Enviar imóvel para análise",

  valuation_sending_label:
    "A enviar...",
};

export default function AvaliarImovelPage() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { settings } =
    useSiteSettings(defaults);

  const [photoFiles, setPhotoFiles] =
    useState<File[]>([]);

  const photoPreviews = useMemo(
    () =>
      photoFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [photoFiles]
  );

  function clearPhotoPreviews() {
    photoPreviews.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });
  }

  function handlePhotoSelection(
    files: FileList | null
  ) {
    if (!files) return;

    const selected = Array.from(files);

    if (selected.length > 8) {
      setErrorMessage(
        "Pode enviar no máximo 8 fotografias."
      );
      return;
    }

    const invalidType = selected.find(
      (file) =>
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type)
    );

    if (invalidType) {
      setErrorMessage(
        "As fotografias devem estar em formato JPG, PNG ou WEBP."
      );
      return;
    }

    const tooLarge = selected.find(
      (file) =>
        file.size >
        8 * 1024 * 1024
    );

    if (tooLarge) {
      setErrorMessage(
        "Cada fotografia pode ter no máximo 8 MB."
      );
      return;
    }

    clearPhotoPreviews();
    setPhotoFiles(selected);
    setErrorMessage("");
  }

  function removePhoto(index: number) {
    clearPhotoPreviews();

    setPhotoFiles((current) =>
      current.filter(
        (_file, fileIndex) =>
          fileIndex !== index
      )
    );
  }

  function safeFileName(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function uploadLeadPhotos(
    leadId: number
  ) {
    if (photoFiles.length === 0) {
      return;
    }

    const uploadedPaths: string[] = [];

    try {
      const rows = [];

      for (
        let index = 0;
        index < photoFiles.length;
        index += 1
      ) {
        const file = photoFiles[index];

        const fileName =
          safeFileName(file.name) ||
          `fotografia-${index + 1}.jpg`;

        const storagePath =
          `${leadId}/${Date.now()}-${index}-${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("lead-images")
            .upload(
              storagePath,
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

        uploadedPaths.push(
          storagePath
        );

        const { data } =
          supabase.storage
            .from("lead-images")
            .getPublicUrl(
              storagePath
            );

        rows.push({
          lead_id: leadId,
          image_url:
            data.publicUrl,
          storage_path:
            storagePath,
        });
      }

      const { error: imageRowsError } =
        await supabase
          .from("lead_images")
          .insert(rows);

      if (imageRowsError) {
        throw imageRowsError;
      }
    } catch (error) {
      console.error(
        "Erro ao carregar fotografias:",
        error
      );

      if (
        uploadedPaths.length >
        0
      ) {
        await supabase.storage
          .from("lead-images")
          .remove(
            uploadedPaths
          );
      }

      throw error;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    setSuccess(false);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    const propertyType = String(
      formData.get("property_type") || ""
    ).trim();

    const propertyLocation = String(
      formData.get("property_location") || ""
    ).trim();

    const propertyArea = String(
      formData.get("property_area") || ""
    ).trim();

    const propertyCondition = String(
      formData.get("property_condition") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (
      !name ||
      !email ||
      !propertyType ||
      !propertyLocation ||
      !propertyCondition
    ) {
      setErrorMessage(
        "Por favor, preencha todos os campos obrigatórios."
      );

      setSending(false);
      return;
    }

    try {
      const {
        data: createdLead,
        error,
      } = await supabase
        .from("leads")
        .insert([
          {
            source: "avaliacao",
            name,
            email,
            phone: phone || null,
            subject: "Avaliação de imóvel",
            message: message || null,
            property_type: propertyType,
            property_location: propertyLocation,
            property_area: propertyArea || null,
            property_condition: propertyCondition,
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("ERRO SUPABASE DETALHADO:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        setErrorMessage(
          `Não foi possível enviar o imóvel: ${error.message}`
        );

        setSending(false);
        return;
      }

      if (!createdLead?.id) {
        setErrorMessage(
          "O imóvel foi recebido, mas não foi possível associar as fotografias."
        );

        setSending(false);
        return;
      }

      if (photoFiles.length > 0) {
        try {
          await uploadLeadPhotos(
            createdLead.id
          );
        } catch {
          setErrorMessage(
            "Os dados do imóvel foram enviados, mas ocorreu um problema ao carregar as fotografias. Pode contactar-nos para as enviar em separado."
          );

          setSending(false);
          return;
        }
      }

      form.reset();

      clearPhotoPreviews();
      setPhotoFiles([]);

      setSuccess(true);
      setSending(false);
    } catch (error) {
      console.error("ERRO INESPERADO:", error);

      setErrorMessage(
        "Ocorreu um erro inesperado. Tente novamente."
      );

      setSending(false);
    }
  }

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "white",
          paddingTop: "clamp(78px, 10vw, 90px)",
        }}
      >
        {/* HERO */}

        <section
          style={{
            padding: "clamp(60px, 11vw, 110px) clamp(18px, 4vw, 40px) clamp(45px, 8vw, 70px)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#C8A24A",
                fontSize: 11,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {settings.valuation_eyebrow}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "clamp(2.55rem, 10.5vw, 5.8rem)",
                fontWeight: 400,
                lineHeight: 0.98,
                margin: "0 0 30px",
                whiteSpace: "pre-line",
              }}
            >
              {settings.valuation_title}
            </h1>

            <p
              style={{
                color: "#b8b8b8",
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.9,
                fontSize: "clamp(14px, 3.4vw, 16px)",
                whiteSpace: "pre-line",
              }}
            >
              {settings.valuation_intro}
            </p>
          </div>
        </section>

        {/* PASSOS */}

        <section
          style={{
            padding: "clamp(18px, 5vw, 30px) clamp(18px, 4vw, 40px) clamp(55px, 9vw, 80px)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "clamp(14px, 4vw, 20px)",
            }}
          >
            {[
              [
                "01",
                settings.valuation_step_1_title,
                settings.valuation_step_1_text,
              ],
              [
                "02",
                settings.valuation_step_2_title,
                settings.valuation_step_2_text,
              ],
              [
                "03",
                settings.valuation_step_3_title,
                settings.valuation_step_3_text,
              ],
            ].map(([number, title, text]) => (
              <div
                key={number}
                style={{
                  background: "#151515",
                  border: "1px solid rgba(200,162,74,.16)",
                  borderRadius: "clamp(16px, 4vw, 20px)",
                  padding: "clamp(22px, 5vw, 30px)",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: "#C8A24A",
                    fontSize: 11,
                    letterSpacing: 2,
                    marginBottom: 22,
                  }}
                >
                  {number}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-title)",
                    fontSize: "1.7rem",
                    fontWeight: 400,
                    margin: "0 0 12px",
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    color: "#999",
                    fontSize: 14,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULÁRIO */}

        <section
          style={{
            padding: "clamp(10px, 4vw, 20px) clamp(18px, 4vw, 40px) clamp(80px, 11vw, 120px)",
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: "auto",
              background: "#151515",
              border: "1px solid rgba(200,162,74,.18)",
              borderRadius: "clamp(18px, 5vw, 28px)",
              padding: "clamp(24px, 6vw, 60px)",
              minWidth: 0,
            }}
          >
            <div
              style={{
                marginBottom: "clamp(28px, 6vw, 40px)",
              }}
            >
              <div
                style={{
                  color: "#C8A24A",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 15,
                }}
              >
                {settings.valuation_form_eyebrow}
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(2rem, 8vw, 3.5rem)",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {settings.valuation_form_title}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "clamp(14px, 4vw, 20px)",
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Nome *"
                required
                style={inputStyle}
              />

              <input
                name="email"
                type="email"
                placeholder="Email *"
                required
                style={inputStyle}
              />

              <input
                name="phone"
                type="tel"
                placeholder="Telefone"
                style={inputStyle}
              />

              <select
                name="property_type"
                defaultValue=""
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Tipo de imóvel *
                </option>

                <option value="Moradia">Moradia</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Prédio">Prédio</option>
                <option value="Terreno">Terreno</option>
                <option value="Imóvel para reabilitar">
                  Imóvel para reabilitar
                </option>
                <option value="Outro">Outro</option>
              </select>

              <input
                name="property_location"
                type="text"
                placeholder="Localização do imóvel *"
                required
                style={inputStyle}
              />

              <input
                name="property_area"
                type="text"
                placeholder="Área aproximada"
                style={inputStyle}
              />

              <select
                name="property_condition"
                defaultValue=""
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Situação atual *
                </option>

                <option value="Habitável">
                  Habitável
                </option>

                <option value="Necessita remodelação">
                  Necessita remodelação
                </option>

                <option value="Para reabilitação total">
                  Para reabilitação total
                </option>

                <option value="Em construção">
                  Em construção
                </option>

                <option value="Terreno">
                  Terreno
                </option>
              </select>

              <textarea
                name="message"
                placeholder="Conte-nos um pouco mais sobre o imóvel..."
                rows={6}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />

              <div
                style={{
                  padding:
                    "clamp(18px, 4vw, 22px)",
                  border:
                    "1px dashed rgba(200,162,74,.35)",
                  borderRadius: 14,
                  background:
                    "rgba(200,162,74,.035)",
                }}
              >
                <div
                  style={{
                    color: "#C8A24A",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform:
                      "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Fotografias do imóvel
                </div>

                <div
                  style={{
                    color: "#999",
                    fontSize: 13,
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Pode enviar até 8 fotografias em JPG, PNG ou WEBP.
                  Cada ficheiro pode ter no máximo 8 MB.
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) =>
                    handlePhotoSelection(
                      event.target.files
                    )
                  }
                  style={{
                    color: "#bbb",
                    width: "100%",
                  }}
                />

                {photoPreviews.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                      gap: 12,
                      marginTop: 18,
                    }}
                  >
                    {photoPreviews.map(
                      (item, index) => (
                        <div
                          key={`${item.file.name}-${index}`}
                          style={{
                            position:
                              "relative",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              height: 130,
                              borderRadius:
                                12,
                              overflow:
                                "hidden",
                              background:
                                "#0d0d0d",
                              border:
                                "1px solid rgba(255,255,255,.08)",
                            }}
                          >
                            <img
                              src={item.url}
                              alt={`Fotografia ${index + 1}`}
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                              }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removePhoto(
                                index
                              )
                            }
                            style={{
                              width:
                                "100%",
                              marginTop: 7,
                              border:
                                "1px solid rgba(255,255,255,.12)",
                              background:
                                "transparent",
                              color:
                                "#aaa",
                              borderRadius:
                                8,
                              padding:
                                "7px 9px",
                              cursor:
                                "pointer",
                              fontSize:
                                11,
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {success && (
                <div
                  style={{
                    padding: "15px 17px",
                    borderRadius: 12,
                    background: "rgba(200,162,74,.10)",
                    border:
                      "1px solid rgba(200,162,74,.30)",
                    color: "#D9BD74",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {settings.valuation_success_text}
                </div>
              )}

              {errorMessage && (
                <div
                  style={{
                    padding: "15px 17px",
                    borderRadius: 12,
                    background: "rgba(180,50,50,.10)",
                    border:
                      "1px solid rgba(220,80,80,.30)",
                    color: "#e6aaaa",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-primary"
                style={{
                  border: "none",
                  cursor: sending
                    ? "not-allowed"
                    : "pointer",
                  justifySelf: "stretch",
                  width: "100%",
                  minHeight: 50,
                  marginTop: 10,
                  opacity: sending ? 0.65 : 1,
                }}
              >
                {sending
                  ? settings.valuation_sending_label
                  : settings.valuation_submit_label}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

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
  outline: "none",
};