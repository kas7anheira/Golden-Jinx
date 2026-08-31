"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import { supabase } from "@/lib/supabase";

export default function ContactosPage() {
  const [contactContent, setContactContent] = useState({
    companyName: "Golden Jinx",
    slogan: "Sparkling Solutions",
    email: "info@goldenjinx.pt",
    phone: "+351 XXX XXX XXX",
    location: "Portugal",
  });

  useEffect(() => {
    loadContactContent();
  }, []);

  async function loadContactContent() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "company_name",
        "company_slogan",
        "contact_email",
        "contact_phone",
        "contact_location",
      ]);

    if (error) {
      console.error(
        "Erro ao carregar dados de contacto:",
        error
      );

      return;
    }

    const settings = data || [];

    function getValue(
      key: string,
      fallback: string
    ) {
      const setting = settings.find(
        (item) => item.setting_key === key
      );

      return (
        setting?.setting_value?.trim() ||
        fallback
      );
    }

    setContactContent({
      companyName: getValue(
        "company_name",
        "Golden Jinx"
      ),

      slogan: getValue(
        "company_slogan",
        "Sparkling Solutions"
      ),

      email: getValue(
        "contact_email",
        "info@goldenjinx.pt"
      ),

      phone: getValue(
        "contact_phone",
        "+351 XXX XXX XXX"
      ),

      location: getValue(
        "contact_location",
        "Portugal"
      ),
    });
  }
  const searchParams = useSearchParams();
  const propertyName = String(searchParams.get("imovel") || "").trim();

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const finalSubject = propertyName
      ? `Interesse no imóvel: ${propertyName}`
      : subject;

    const finalMessage = propertyName
      ? `Imóvel: ${propertyName}\n\n${message}`
      : message;

    if (!name || !email || !subject || !message) {
      setErrorMessage(
        "Por favor, preencha todos os campos obrigatórios."
      );
      setSending(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            source: "contactos",
            name,
            email,
            phone: phone || null,
            subject: finalSubject,
            message: finalMessage,
          },
        ]);

      if (error) {
        console.error("ERRO SUPABASE DETALHADO:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        setErrorMessage(
          `Não foi possível enviar a mensagem: ${error.message}`
        );

        setSending(false);
        return;
      }

      form.reset();
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
            padding: "clamp(60px, 11vw, 110px) clamp(18px, 4vw, 40px) clamp(48px, 8vw, 80px)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "auto",
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
              Contactos
            </div>

            <h1
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "clamp(2.65rem, 11vw, 6rem)",
                fontWeight: 400,
                lineHeight: 0.98,
                margin: "0 0 30px",
              }}
            >
              Vamos falar
              <br />
              sobre oportunidades.
            </h1>

            <p
              style={{
                color: "#b8b8b8",
                maxWidth: 720,
                lineHeight: 1.9,
                fontSize: "clamp(14px, 3.4vw, 16px)",
                margin: 0,
              }}
            >
              Quer comprar, arrendar, apresentar um imóvel ou conhecer
              melhor um projeto? Fale connosco.
            </p>
          </div>
        </section>

        {/* CONTACTO + FORMULÁRIO */}

        <section
          style={{
            padding: "clamp(18px, 5vw, 30px) clamp(18px, 4vw, 40px) clamp(80px, 11vw, 120px)",
          }}
        >
          <div
            style={{
              maxWidth: 1250,
              margin: "auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "clamp(22px, 5vw, 35px)",
            }}
          >
            {/* DADOS */}

            <div
              style={{
                background: "#151515",
                borderRadius: "clamp(18px, 4vw, 24px)",
                padding: "clamp(24px, 6vw, 45px)",
                minWidth: 0,
                border: "1px solid rgba(200,162,74,.16)",
              }}
            >
              <div
                style={{
                  color: "#C8A24A",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 25,
                }}
              >
                {contactContent.companyName}
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(2rem, 8vw, 2.5rem)",
                  fontWeight: 400,
                  margin: "0 0 35px",
                }}
              >
                {contactContent.slogan}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  color: "#c7c7c7",
                }}
              >
                <div>
                  <div style={labelStyle}>Email</div>

                  <a
                    href={`mailto:${contactContent.email}`}
                    style={{
                      color: "#c7c7c7",
                      textDecoration: "none",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {contactContent.email}
                  </a>
                </div>

                <div>
                  <div style={labelStyle}>Telefone</div>

                  <a
                    href={`tel:${contactContent.phone.replace(
                      /[^+\d]/g,
                      ""
                    )}`}
                    style={{
                      color: "#c7c7c7",
                      textDecoration: "none",
                    }}
                  >
                    {contactContent.phone}
                  </a>
                </div>

                <div>
                  <div style={labelStyle}>Localização</div>
                  <div>{contactContent.location}</div>
                </div>
              </div>
            </div>

            {/* FORMULÁRIO */}

            <div
              style={{
                background: "#151515",
                borderRadius: "clamp(18px, 4vw, 24px)",
                padding: "clamp(24px, 6vw, 45px)",
                minWidth: 0,
                border: "1px solid rgba(200,162,74,.16)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(2rem, 8vw, 2.4rem)",
                  fontWeight: 400,
                  margin: "0 0 30px",
                }}
              >
                Envie-nos uma mensagem
              </h2>

              {propertyName && (
                <div
                  style={{
                    margin: "-8px 0 26px",
                    padding: "clamp(15px, 4vw, 18px) clamp(16px, 4vw, 20px)",
                    borderRadius: 14,
                    background: "rgba(200,162,74,.08)",
                    border: "1px solid rgba(200,162,74,.28)",
                  }}
                >
                  <div
                    style={{
                      color: "#C8A24A",
                      fontSize: 9,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Imóvel em consulta
                  </div>

                  <div
                    style={{
                      color: "#f1f1f1",
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                      lineHeight: 1.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {propertyName}
                  </div>

                  <div
                    style={{
                      color: "#888",
                      fontSize: 12,
                      lineHeight: 1.6,
                      marginTop: 7,
                    }}
                  >
                    A sua mensagem ficará automaticamente associada a este imóvel.
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
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
                  name="subject"
                  defaultValue={propertyName ? "Comprar imóvel" : ""}
                  required
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Motivo do contacto *
                  </option>

                  <option value="Comprar imóvel">
                    Comprar imóvel
                  </option>

                  <option value="Arrendar imóvel">
                    Arrendar imóvel
                  </option>

                  <option value="Apresentar oportunidade">
                    Apresentar oportunidade
                  </option>

                  <option value="Outro">
                    Outro
                  </option>
                </select>

                <textarea
                  name="message"
                  placeholder={propertyName ? "Escreva a sua mensagem sobre este imóvel *" : "Mensagem *"}
                  required
                  rows={6}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />

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
                    Mensagem enviada com sucesso. Entraremos em contacto
                    consigo assim que possível.
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
                    cursor: sending ? "not-allowed" : "pointer",
                    alignSelf: "stretch",
                    width: "100%",
                    minHeight: 50,
                    opacity: sending ? 0.65 : 1,
                  }}
                >
                  {sending ? "A enviar..." : "Enviar mensagem"}
                </button>
              </form>
            </div>
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

const labelStyle = {
  color: "#777",
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  marginBottom: 6,
};