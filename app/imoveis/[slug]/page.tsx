"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/footer/Footer";
import { useSiteSettings } from "@/components/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";

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

type GalleryImage = {
  id: number;
  property_id: number;
  image_url: string;
  position: number;
};


const propertyPageDefaults = {
  property_detail_back_label: "Voltar aos imóveis",
  property_detail_bedrooms_label: "Quartos",
  property_detail_bathrooms_label: "Casas de banho",
  property_detail_area_label: "Área",
  property_detail_on_request_label: "Sob consulta",
  property_detail_about_label: "Sobre o imóvel",
  property_detail_features_label: "Características",
  property_detail_price_label: "Preço",
  property_detail_rent_label: "Renda",
  property_detail_cta_title: "Interessado neste imóvel?",
  property_detail_cta_text:
    "Entre em contacto connosco para obter mais informações ou marcar uma visita.",
  property_detail_info_button: "Pedir informações",
  property_detail_contact_button: "Contactar Golden Jinx",
  property_detail_unavailable_title: "Imóvel não disponível",
  property_detail_view_properties_button: "Ver imóveis",
  property_detail_loading_label: "A carregar imóvel...",
  property_detail_photos_soon_label: "Fotografias em breve",
};

export default function PropertyPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { settings } = useSiteSettings(propertyPageDefaults);

  const [property, setProperty] = useState<Property | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    loadProperty();
  }, [slug]);

  async function loadProperty() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      console.error("Erro ao carregar imóvel:", error);
      setErrorMessage("Este imóvel não está disponível.");
      setLoading(false);
      return;
    }

    const currentProperty = data as Property;
    setProperty(currentProperty);

    const { data: galleryData, error: galleryError } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", currentProperty.id)
      .order("position", { ascending: true });

    if (galleryError) {
      console.error("Erro ao carregar galeria:", galleryError);
    }

    const propertyGallery = (galleryData || []) as GalleryImage[];
    setGallery(propertyGallery);

    if (currentProperty.cover_image) {
      setSelectedImage(currentProperty.cover_image);
    } else if (propertyGallery.length > 0) {
      setSelectedImage(propertyGallery[0].image_url);
    } else {
      setSelectedImage(null);
    }

    setLoading(false);
  }

  const allImages = useMemo(() => {
    const images: string[] = [];

    if (property?.cover_image?.trim()) {
      images.push(property.cover_image.trim());
    }

    gallery.forEach((item) => {
      const url = item.image_url?.trim();
      if (url && !images.includes(url)) images.push(url);
    });

    return images;
  }, [property, gallery]);

  const selectedIndex = selectedImage
    ? allImages.findIndex((image) => image === selectedImage)
    : -1;

  function selectImageByIndex(index: number) {
    if (!allImages.length) return;
    const normalized = (index + allImages.length) % allImages.length;
    setSelectedImage(allImages[normalized]);
  }

  function showPreviousImage() {
    if (allImages.length <= 1) return;
    selectImageByIndex((selectedIndex >= 0 ? selectedIndex : 0) - 1);
  }

  function showNextImage() {
    if (allImages.length <= 1) return;
    selectImageByIndex((selectedIndex >= 0 ? selectedIndex : 0) + 1);
  }

  function handleTouchStart(event: TouchEvent) {
    setTouchStartX(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX === null) return;

    const difference = touchStartX - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 45) {
      difference > 0 ? showNextImage() : showPreviousImage();
    }

    setTouchStartX(null);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!fullscreen) return;

      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen, selectedImage, allImages]);

  useEffect(() => {
    if (!fullscreen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [fullscreen]);

  if (loading) {
    return (
      <>
        <Header />
        <main style={centerPageStyle}>
          <div style={{ color: "#C8A24A" }}>{settings.property_detail_loading_label}</div>
        </main>
      </>
    );
  }

  if (errorMessage || !property) {
    return (
      <>
        <Header />
        <main style={centerPageStyle}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#C8A24A", fontSize: "clamp(24px, 7vw, 30px)", marginBottom: 20 }}>
              ✦
            </div>

            <h1
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "2.8rem",
                fontWeight: 400,
                marginBottom: 15,
              }}
            >
              {settings.property_detail_unavailable_title}
            </h1>

            <p style={{ color: "#999", marginBottom: 30 }}>{errorMessage}</p>

            <Link
              href="/comprar"
              className="btn-primary"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              {settings.property_detail_view_properties_button}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
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
        <section style={{ padding: "clamp(24px, 5vw, 40px) clamp(16px, 4vw, 40px) 14px" }}>
          <div style={{ maxWidth: 1350, margin: "auto" }}>
            <Link
              href={property.status === "Arrendamento" ? "/arrendar" : "/comprar"}
              style={{ color: "#999", textDecoration: "none", fontSize: 13 }}
            >
              ← {settings.property_detail_back_label}
            </Link>
          </div>
        </section>

        <section style={{ padding: "14px clamp(16px, 4vw, 40px) clamp(38px, 7vw, 60px)" }}>
          <div style={{ maxWidth: 1350, margin: "auto" }}>
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(290px, 68vw, 760px)",
                borderRadius: "clamp(18px, 4vw, 28px)",
                overflow: "hidden",
                background: "#151515",
                border: "1px solid rgba(200,162,74,.15)",
              }}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt={property.title}
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
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,.10), transparent 52%, rgba(0,0,0,.38))",
                    }}
                  />
                </>
              ) : (
                <EmptyImage label={settings.property_detail_photos_soon_label} />
              )}

              <div
                style={{
                  position: "absolute",
                  top: "clamp(14px, 3vw, 24px)",
                  left: "clamp(14px, 3vw, 24px)",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: "rgba(200,162,74,.94)",
                    color: "#111",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {property.status}
                </div>

                {allImages.length > 0 && (
                  <div
                    style={{
                      padding: "9px 13px",
                      borderRadius: 999,
                      background: "rgba(10,10,10,.64)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,.16)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      fontSize: 11,
                      letterSpacing: 1.5,
                    }}
                  >
                    {Math.max(selectedIndex + 1, 1)} / {allImages.length}
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <>
                  <GalleryArrow direction="left" onClick={showPreviousImage} />
                  <GalleryArrow direction="right" onClick={showNextImage} />
                </>
              )}

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  aria-label="Abrir fotografia em ecrã inteiro"
                  style={{
                    position: "absolute",
                    right: "clamp(14px, 3vw, 24px)",
                    bottom: "clamp(14px, 3vw, 24px)",
                    border: "1px solid rgba(255,255,255,.18)",
                    background: "rgba(10,10,10,.62)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "10px clamp(12px, 3vw, 16px)",
                    cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    fontSize: "clamp(10px, 2.5vw, 12px)",
                    letterSpacing: 0.6,
                  }}
                >
                  ⛶ Ver em ecrã inteiro
                </button>
              )}
            </div>

            {allImages.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "clamp(8px, 2vw, 12px)",
                  overflowX: "auto",
                  paddingTop: 15,
                  paddingBottom: 5,
                  scrollSnapType: "x mandatory",
                }}
              >
                {allImages.map((imageUrl, index) => {
                  const active = selectedImage === imageUrl;

                  return (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(imageUrl)}
                      aria-label={`Ver fotografia ${index + 1}`}
                      style={{
                        flex: "0 0 auto",
                        width: "clamp(92px, 25vw, 125px)",
                        height: "clamp(68px, 18vw, 90px)",
                        padding: 0,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: active
                          ? "2px solid #C8A24A"
                          : "1px solid rgba(255,255,255,.12)",
                        background: "#151515",
                        cursor: "pointer",
                        opacity: active ? 1 : 0.72,
                        scrollSnapAlign: "start",
                        boxShadow: active
                          ? "0 0 20px rgba(200,162,74,.18)"
                          : "none",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`${property.title} ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "clamp(20px, 5vw, 30px) clamp(16px, 4vw, 40px) clamp(70px, 10vw, 100px)" }}>
          <div
            style={{
              maxWidth: 1350,
              margin: "auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "clamp(32px, 6vw, 50px)",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  color: "#C8A24A",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {property.property_type}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "clamp(2.35rem, 9vw, 5rem)",
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: "0 0 16px",
                }}
              >
                {property.title}
              </h1>

              <div style={{ color: "#aaa", fontSize: "clamp(14px, 3vw, 16px)", marginBottom: "clamp(28px, 6vw, 40px)" }}>
                {property.location}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 110px), 1fr))",
                  borderTop: "1px solid rgba(255,255,255,.08)",
                  borderBottom: "1px solid rgba(255,255,255,.08)",
                  marginBottom: "clamp(36px, 7vw, 50px)",
                }}
              >
                <FeatureStat
                  label={settings.property_detail_bedrooms_label}
                  value={property.bedrooms || settings.property_detail_on_request_label}
                />
                <FeatureStat
                  label={settings.property_detail_bathrooms_label}
                  value={property.bathrooms || settings.property_detail_on_request_label}
                />
                <FeatureStat
                  label={settings.property_detail_area_label}
                  value={property.area || settings.property_detail_on_request_label}
                />
              </div>

              {property.description && (
                <div style={{ marginBottom: "clamp(36px, 7vw, 50px)" }}>
                  <SectionLabel>{settings.property_detail_about_label}</SectionLabel>

                  <p
                    style={{
                      color: "#b7b7b7",
                      fontSize: "clamp(14px, 3.4vw, 16px)",
                      lineHeight: 1.85,
                      maxWidth: 850,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {property.description}
                  </p>
                </div>
              )}

              {property.features && property.features.length > 0 && (
                <div>
                  <SectionLabel>{settings.property_detail_features_label}</SectionLabel>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
                      gap: 12,
                    }}
                  >
                    {property.features.map((feature, index) => (
                      <div
                        key={`${feature}-${index}`}
                        style={{
                          padding: "16px 18px",
                          borderRadius: 12,
                          background: "#151515",
                          border: "1px solid rgba(255,255,255,.07)",
                          color: "#c8c8c8",
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: "#C8A24A", marginRight: 10 }}>
                          ✦
                        </span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside
              style={{
                background: "#151515",
                border: "1px solid rgba(200,162,74,.18)",
                borderRadius: "clamp(18px, 4vw, 24px)",
                padding: "clamp(22px, 5vw, 35px)",
                minWidth: 0,
                boxShadow: "0 25px 70px rgba(0,0,0,.25)",
              }}
            >
              <div
                style={{
                  color: "#888",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {property.status === "Arrendamento"
                  ? settings.property_detail_rent_label
                  : settings.property_detail_price_label}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-title)",
                  color: "#C8A24A",
                  fontSize: "clamp(2rem, 8vw, 3.3rem)",
                  marginBottom: 30,
                }}
              >
                {property.price}
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,.08)",
                  marginBottom: 30,
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  margin: "0 0 12px",
                }}
              >
                {settings.property_detail_cta_title}
              </h3>

              <p
                style={{
                  color: "#999",
                  fontSize: 13,
                  lineHeight: 1.7,
                  margin: "0 0 25px",
                }}
              >
                {settings.property_detail_cta_text}
              </p>

              <Link
                href={`/contactos?imovel=${encodeURIComponent(property.title)}`}
                className="btn-primary"
                style={{
                  display: "block",
                  textDecoration: "none",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {settings.property_detail_info_button}
              </Link>

              <Link
                href="/contactos"
                style={{
                  display: "block",
                  textDecoration: "none",
                  textAlign: "center",
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 10,
                  padding: "13px 15px",
                  fontSize: 13,
                }}
              >
                {settings.property_detail_contact_button}
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Footer />

      {fullscreen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotografias"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "max(12px, env(safe-area-inset-top)) clamp(10px, 3vw, 35px) max(12px, env(safe-area-inset-bottom))",
          }}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Fechar galeria"
            style={{
              position: "absolute",
              top: "max(14px, env(safe-area-inset-top))",
              right: "clamp(14px, 3vw, 22px)",
              width: "clamp(42px, 11vw, 46px)",
              height: "clamp(42px, 11vw, 46px)",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.18)",
              background: "rgba(20,20,20,.7)",
              color: "#fff",
              fontSize: 28,
              lineHeight: 1,
              cursor: "pointer",
              zIndex: 3,
            }}
          >
            ×
          </button>

          <div
            style={{
              position: "absolute",
              top: "max(20px, calc(env(safe-area-inset-top) + 6px))",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#ddd",
              fontSize: 12,
              letterSpacing: 2,
              zIndex: 3,
            }}
          >
            {Math.max(selectedIndex + 1, 1)} / {allImages.length}
          </div>

          {allImages.length > 1 && (
            <>
              <GalleryArrow
                direction="left"
                onClick={showPreviousImage}
                fullscreen
              />
              <GalleryArrow
                direction="right"
                onClick={showNextImage}
                fullscreen
              />
            </>
          )}

          <img
            src={selectedImage}
            alt={property.title}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 1600,
              maxHeight: "88vh",
              objectFit: "contain",
              display: "block",
              userSelect: "none",
            }}
          />
        </div>
      )}
    </>
  );
}

function GalleryArrow({
  direction,
  onClick,
  fullscreen = false,
}: {
  direction: "left" | "right";
  onClick: () => void;
  fullscreen?: boolean;
}) {
  const left = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? "Fotografia anterior" : "Fotografia seguinte"}
      style={{
        position: "absolute",
        top: "50%",
        left: left ? (fullscreen ? "clamp(10px, 3vw, 22px)" : "clamp(10px, 3vw, 20px)") : undefined,
        right: !left ? (fullscreen ? "clamp(10px, 3vw, 22px)" : "clamp(10px, 3vw, 20px)") : undefined,
        transform: "translateY(-50%)",
        width: fullscreen ? "clamp(44px, 11vw, 54px)" : "clamp(40px, 10vw, 48px)",
        height: fullscreen ? "clamp(44px, 11vw, 54px)" : "clamp(40px, 10vw, 48px)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,.18)",
        background: "rgba(10,10,10,.58)",
        color: "#fff",
        fontSize: 30,
        lineHeight: 1,
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 3,
      }}
    >
      {left ? "‹" : "›"}
    </button>
  );
}

function EmptyImage({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        color: "#777",
      }}
    >
      <div style={{ color: "#C8A24A", fontSize: 42 }}>⌂</div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FeatureStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={{ padding: "clamp(18px, 4vw, 25px) clamp(10px, 3vw, 20px) clamp(18px, 4vw, 25px) 0" }}>
      <div
        style={{
          color: "#777",
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 7,
        }}
      >
        {label}
      </div>

      <div style={{ color: "#ddd", fontSize: 16 }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: "#C8A24A",
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

const centerPageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(110px, 18vw, 140px) clamp(18px, 5vw, 30px) 80px",
};