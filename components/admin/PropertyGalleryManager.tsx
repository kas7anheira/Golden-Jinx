"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryImage = {
  id: number;
  created_at: string;
  property_id: number;
  image_url: string;
  storage_path: string | null;
  position: number;
};

type PropertyGalleryManagerProps = {
  propertyId: number;
  propertySlug: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function PropertyGalleryManager({
  propertyId,
  propertySlug,
}: PropertyGalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadImages();
  }, [propertyId]);

  async function loadImages() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao carregar galeria:", error);
      setErrorMessage(
        `Não foi possível carregar a galeria: ${error.message}`
      );
      setLoading(false);
      return;
    }

    setImages((data || []) as GalleryImage[]);
    setLoading(false);
  }

  function handleFileSelection(files: File[]) {
    setErrorMessage("");
    setSuccessMessage("");

    const invalidType = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidType) {
      setSelectedFiles([]);
      setErrorMessage(
        "Utilize apenas fotografias JPG, PNG ou WEBP."
      );
      return;
    }

    const tooLarge = files.find((file) => file.size > MAX_FILE_SIZE);

    if (tooLarge) {
      setSelectedFiles([]);
      setErrorMessage(
        `A fotografia "${tooLarge.name}" ultrapassa 10 MB.`
      );
      return;
    }

    setSelectedFiles(files);
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      setErrorMessage("Escolha pelo menos uma fotografia.");
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    let uploadedCount = 0;

    try {
      let nextPosition =
        images.length > 0
          ? Math.max(...images.map((image) => image.position)) + 1
          : 0;

      for (const file of selectedFiles) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const safeSlug = propertySlug || `imovel-${propertyId}`;

        const uniquePart =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

        const storagePath =
          `galleries/${propertyId}/${safeSlug}-${uniquePart}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(storagePath);

        const { error: databaseError } = await supabase
          .from("property_images")
          .insert({
            property_id: propertyId,
            image_url: publicUrlData.publicUrl,
            storage_path: storagePath,
            position: nextPosition,
          });

        if (databaseError) {
          await supabase.storage
            .from("property-images")
            .remove([storagePath]);

          throw databaseError;
        }

        nextPosition += 1;
        uploadedCount += 1;
      }

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMessage(
        uploadedCount === 1
          ? "Fotografia adicionada à galeria."
          : `${uploadedCount} fotografias adicionadas à galeria.`
      );

      await loadImages();
    } catch (error) {
      console.error("Erro no upload da galeria:", error);

      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";

      setErrorMessage(
        uploadedCount > 0
          ? `${uploadedCount} fotografia(s) foram carregadas, mas ocorreu um erro a seguir: ${message}`
          : `Não foi possível carregar as fotografias: ${message}`
      );

      await loadImages();
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(image: GalleryImage) {
    const confirmed = window.confirm(
      "Tem a certeza de que pretende apagar esta fotografia?"
    );

    if (!confirmed) return;

    setWorkingId(image.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error: databaseError } = await supabase
        .from("property_images")
        .delete()
        .eq("id", image.id);

      if (databaseError) {
        throw databaseError;
      }

      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("property-images")
          .remove([image.storage_path]);

        if (storageError) {
          console.error(
            "O registo foi apagado, mas o ficheiro não foi removido do Storage:",
            storageError
          );

          setSuccessMessage(
            "Fotografia removida da galeria. O ficheiro poderá necessitar de limpeza no Storage."
          );

          await loadImages();
          return;
        }
      }

      setSuccessMessage("Fotografia apagada.");
      await loadImages();
    } catch (error) {
      console.error("Erro ao apagar fotografia:", error);

      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";

      setErrorMessage(
        `Não foi possível apagar a fotografia: ${message}`
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function moveImage(
    image: GalleryImage,
    direction: "left" | "right"
  ) {
    const currentIndex = images.findIndex(
      (item) => item.id === image.id
    );

    if (currentIndex === -1) return;

    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const targetImage = images[targetIndex];

    setWorkingId(image.id);
    setErrorMessage("");
    setSuccessMessage("");

    /*
     * Usamos posições temporárias negativas para evitar colisões
     * caso no futuro seja criada uma restrição UNIQUE por posição.
     */
    const temporaryPosition = -1000000 - image.id;

    const { error: temporaryError } = await supabase
      .from("property_images")
      .update({ position: temporaryPosition })
      .eq("id", image.id);

    if (temporaryError) {
      console.error(temporaryError);
      setErrorMessage(
        "Não foi possível alterar a ordem das fotografias."
      );
      setWorkingId(null);
      return;
    }

    const { error: targetError } = await supabase
      .from("property_images")
      .update({ position: image.position })
      .eq("id", targetImage.id);

    if (targetError) {
      console.error(targetError);

      await supabase
        .from("property_images")
        .update({ position: image.position })
        .eq("id", image.id);

      setErrorMessage(
        "Não foi possível alterar a ordem das fotografias."
      );
      setWorkingId(null);
      return;
    }

    const { error: finalError } = await supabase
      .from("property_images")
      .update({ position: targetImage.position })
      .eq("id", image.id);

    if (finalError) {
      console.error(finalError);
      setErrorMessage(
        "A ordem ficou parcialmente alterada. Clique em Atualizar e tente novamente."
      );
      setWorkingId(null);
      await loadImages();
      return;
    }

    await loadImages();
    setWorkingId(null);
  }

  return (
    <section
      style={{
        marginTop: 10,
        padding: "28px",
        background: "#101010",
        border: "1px solid rgba(200,162,74,.16)",
        borderRadius: 18,
      }}
    >
      <div style={{ marginBottom: 25 }}>
        <div
          style={{
            color: "#C8A24A",
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Galeria do imóvel
        </div>

        <h3
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "1.8rem",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Fotografias
        </h3>

        <p
          style={{
            color: "#777",
            fontSize: 12,
            lineHeight: 1.6,
            margin: "8px 0 0",
          }}
        >
          A fotografia principal continua a ser gerida acima. Aqui pode
          adicionar as restantes fotografias que aparecerão na página
          individual do imóvel.
        </p>
      </div>

      {loading ? (
        <div style={emptyStyle}>A carregar fotografias...</div>
      ) : images.length === 0 ? (
        <div style={emptyStyle}>
          Este imóvel ainda não tem fotografias na galeria.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 30,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              style={{
                background: "#151515",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 150,
                  background: "#0d0d0d",
                }}
              >
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={`Fotografia ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
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
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    Imagem indisponível
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    minWidth: 25,
                    height: 25,
                    padding: "0 5px",
                    borderRadius: 999,
                    background: "rgba(0,0,0,.72)",
                    color: "#C8A24A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                  }}
                >
                  {index + 1}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 7,
                  padding: 10,
                }}
              >
                <button
                  type="button"
                  disabled={index === 0 || workingId === image.id}
                  onClick={() => moveImage(image, "left")}
                  style={{
                    ...smallButtonStyle,
                    opacity:
                      index === 0 || workingId === image.id ? 0.4 : 1,
                  }}
                >
                  ←
                </button>

                <button
                  type="button"
                  disabled={
                    index === images.length - 1 ||
                    workingId === image.id
                  }
                  onClick={() => moveImage(image, "right")}
                  style={{
                    ...smallButtonStyle,
                    opacity:
                      index === images.length - 1 ||
                      workingId === image.id
                        ? 0.4
                        : 1,
                  }}
                >
                  →
                </button>

                <button
                  type="button"
                  disabled={workingId === image.id}
                  onClick={() => deleteImage(image)}
                  style={{
                    ...deleteButtonStyle,
                    gridColumn: "1 / -1",
                    opacity: workingId === image.id ? 0.5 : 1,
                  }}
                >
                  {workingId === image.id ? "A processar..." : "Apagar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          paddingTop: 25,
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            color: "#ddd",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          Adicionar fotografias
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            handleFileSelection(files);
          }}
          style={{
            color: "#bbb",
            marginBottom: 15,
            maxWidth: "100%",
          }}
        />

        {selectedFiles.length > 0 && (
          <div
            style={{
              color: "#888",
              fontSize: 12,
              marginBottom: 15,
            }}
          >
            {selectedFiles.length}{" "}
            {selectedFiles.length === 1
              ? "fotografia selecionada"
              : "fotografias selecionadas"}
          </div>
        )}

        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

        {successMessage && (
          <div style={successStyle}>{successMessage}</div>
        )}

        <button
          type="button"
          disabled={uploading || selectedFiles.length === 0}
          onClick={handleUpload}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "13px 22px",
            background: "#C8A24A",
            color: "#111",
            fontWeight: 600,
            cursor:
              uploading || selectedFiles.length === 0
                ? "not-allowed"
                : "pointer",
            opacity:
              uploading || selectedFiles.length === 0 ? 0.55 : 1,
          }}
        >
          {uploading
            ? "A carregar fotografias..."
            : "Carregar fotografias"}
        </button>
      </div>
    </section>
  );
}

const emptyStyle = {
  padding: "35px 20px",
  borderRadius: 12,
  background: "#151515",
  border: "1px dashed rgba(255,255,255,.10)",
  color: "#777",
  textAlign: "center" as const,
  fontSize: 13,
  marginBottom: 25,
};

const smallButtonStyle = {
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 8,
  padding: "8px",
  background: "transparent",
  color: "#ddd",
  cursor: "pointer",
};

const deleteButtonStyle = {
  border: "1px solid rgba(220,80,80,.25)",
  borderRadius: 8,
  padding: "8px",
  background: "rgba(180,50,50,.08)",
  color: "#d99",
  cursor: "pointer",
};

const errorStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  background: "rgba(180,50,50,.10)",
  border: "1px solid rgba(220,80,80,.30)",
  color: "#e6aaaa",
  fontSize: 12,
  marginBottom: 15,
};

const successStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  background: "rgba(200,162,74,.10)",
  border: "1px solid rgba(200,162,74,.30)",
  color: "#D9BD74",
  fontSize: 12,
  marginBottom: 15,
};