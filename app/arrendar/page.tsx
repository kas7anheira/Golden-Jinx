"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/components/hooks/useSiteSettings";

type Property = {
  id: number;
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

const defaults = {
  rent_eyebrow: "Golden Jinx",
  rent_title: "Arrendar",
  rent_intro:
    "Encontre imóveis Golden Jinx disponíveis para arrendamento.",

  rent_location_placeholder: "Localização",
  rent_type_all_label: "Todos os tipos",
  rent_max_price_label: "Renda máxima",
  rent_clear_filters_label: "Limpar filtros",

  rent_loading_text: "A carregar imóveis...",
  rent_empty_title: "Nenhum imóvel disponível.",
  rent_empty_text:
    "De momento não existem imóveis que correspondam à pesquisa.",
};

export default function ArrendarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { settings } =
    useSiteSettings(defaults);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .eq("status", "Arrendamento")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Erro ao carregar imóveis:", error);

      setErrorMessage(
        "Não foi possível carregar os imóveis para arrendamento."
      );

      setLoading(false);
      return;
    }

    setProperties((data || []) as Property[]);
    setLoading(false);
  }

  const filteredProperties = useMemo(() => {
    return properties
      .filter((property) => {
        if (!location) return true;

        return property.location
          .toLowerCase()
          .includes(location.toLowerCase());
      })
      .filter((property) => {
        if (!type) return true;

        return property.property_type === type;
      })
      .filter((property) => {
        if (!maxPrice) return true;

        const numericPrice = Number(
          property.price.replace(/[^\d]/g, "")
        );

        return numericPrice <= Number(maxPrice);
      });
  }, [properties, location, type, maxPrice]);

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "100vh",
          background: "#111111",
          color: "white",
          paddingTop: "clamp(105px, 12vw, 130px)",
        }}
      >
        <section
          style={{
            padding: "clamp(42px, 7vw, 70px) clamp(18px, 4vw, 40px) clamp(80px, 10vw, 120px)",
          }}
        >
          <div
            style={{
              maxWidth: 1350,
              margin: "auto",
            }}
          >
            {/* INTRO */}

            <div
              style={{
                maxWidth: 750,
                marginBottom: "clamp(35px, 6vw, 55px)",
              }}
            >
              <div
                style={{
                  color: "#C8A24A",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {settings.rent_eyebrow}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: "0 0 25px",
                }}
              >
                {settings.rent_title}
              </h1>

              <p
                style={{
                  color: "#bdbdbd",
                  lineHeight: 1.8,
                  fontSize: 16,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {settings.rent_intro}
              </p>
            </div>

            {/* FILTROS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                gap: 15,
                padding: "clamp(14px, 3vw, 22px)",
                marginBottom: "clamp(35px, 6vw, 50px)",
                borderRadius: 20,
                background: "#171717",
                border: "1px solid rgba(200,162,74,.16)",
              }}
            >
              <input
                type="text"
                placeholder={settings.rent_location_placeholder}
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                style={filterStyle}
              />

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                style={filterStyle}
              >
                <option value="">{settings.rent_type_all_label}</option>
                <option value="Moradia">Moradia</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Prédio">Prédio</option>
                <option value="Outro">Outro</option>
              </select>

              <select
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
                style={filterStyle}
              >
                <option value="">{settings.rent_max_price_label}</option>
                <option value="750">750 €/mês</option>
                <option value="1000">1 000 €/mês</option>
                <option value="1250">1 250 €/mês</option>
                <option value="1500">1 500 €/mês</option>
                <option value="2000">2 000 €/mês</option>
                <option value="3000">3 000 €/mês</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setLocation("");
                  setType("");
                  setMaxPrice("");
                }}
                style={{
                  border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: 12,
                  background: "transparent",
                  color: "#ccc",
                  cursor: "pointer",
                  padding: "14px 18px",
                  width: "100%",
                  minHeight: 50,
                  fontSize: 14,
                }}
              >
                {settings.rent_clear_filters_label}
              </button>
            </div>

            {/* RESULTADOS */}

            {loading && (
              <div style={messageStyle}>
                {settings.rent_loading_text}
              </div>
            )}

            {errorMessage && (
              <div style={errorStyle}>
                {errorMessage}
              </div>
            )}

            {!loading && !errorMessage && (
              <>
                <div
                  style={{
                    marginBottom: 25,
                    color: "#888",
                    fontSize: 13,
                  }}
                >
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1
                    ? "imóvel encontrado"
                    : "imóveis encontrados"}
                </div>

                {filteredProperties.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                      gap: "clamp(20px, 4vw, 30px)",
                    }}
                  >
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        image={property.cover_image}
                        status={
                          property.status as
                            | "Venda"
                            | "Arrendamento"
                        }
                        type={property.property_type}
                        title={property.title}
                        location={property.location}
                        price={property.price}
                        area={
                          property.area ||
                          "Área sob consulta"
                        }
                        bedrooms={
                          property.bedrooms ||
                          "Tipologia sob consulta"
                        }
                        slug={property.slug}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={messageStyle}>
                    <h2
                      style={{
                        fontFamily: "var(--font-title)",
                        fontWeight: 400,
                        fontSize: "2rem",
                        margin: "0 0 10px",
                      }}
                    >
                      {settings.rent_empty_title}
                    </h2>

                    <p
                      style={{
                        color: "#999",
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {settings.rent_empty_text}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const filterStyle = {
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

const messageStyle = {
  padding: "clamp(42px, 8vw, 70px) clamp(18px, 5vw, 30px)",
  textAlign: "center" as const,
  borderRadius: 20,
  background: "#151515",
  border: "1px solid rgba(255,255,255,.08)",
  color: "#999",
};

const errorStyle = {
  ...messageStyle,
  color: "#e6aaaa",
  border: "1px solid rgba(220,80,80,.30)",
};