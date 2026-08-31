"use client";

import { useState } from "react";

type ProjectProps = {
  before: string;
  after: string;
  title: string;
  location: string;
  description: string;
};

export default function ProjectCard({
  before,
  after,
  title,
  location,
  description,
}: ProjectProps) {
  const [position, setPosition] = useState(50);

  return (
    <article
      className="golden-card golden-scale"
      style={{
        background: "#151515",
        borderRadius: 28,
        overflow: "hidden",
        border: "1px solid rgba(200,162,74,.18)",
        boxShadow: "0 25px 80px rgba(0,0,0,.35)",
      }}
    >
      {/* SLIDER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(360px, 50vw, 620px)",
          overflow: "hidden",
          userSelect: "none",
          background: "#111",
        }}
      >
        {/* DEPOIS */}
        <img
          src={after}
          alt="Depois da transformação"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* ANTES */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${position}%`,
            overflow: "hidden",
          }}
        >
          <img
            src={before}
            alt="Antes da transformação"
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* SOMBRA LATERAL */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${position}%`,
            width: 100,
            transform: "translateX(-50%)",
            background:
              "linear-gradient(90deg, transparent, rgba(0,0,0,.18), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* LINHA DOURADA */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${position}%`,
            width: 2,
            background: "#C8A24A",
            boxShadow: "0 0 18px rgba(200,162,74,.75)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* HANDLE */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "rgba(200,162,74,.96)",
            border: "2px solid rgba(255,255,255,.85)",
            boxShadow:
              "0 8px 30px rgba(0,0,0,.45), 0 0 25px rgba(200,162,74,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111",
            fontSize: 25,
            fontWeight: 500,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          ↔
        </div>

        {/* ETIQUETA ANTES */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            padding: "10px 17px",
            borderRadius: 999,
            background: "rgba(10,10,10,.62)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.15)",
            color: "#fff",
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            zIndex: 4,
          }}
        >
          Antes
        </div>

        {/* ETIQUETA DEPOIS */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            padding: "10px 17px",
            borderRadius: 999,
            background: "rgba(200,162,74,.92)",
            color: "#111",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            zIndex: 4,
          }}
        >
          Depois
        </div>

        {/* INSTRUÇÃO */}
        <div
          style={{
            position: "absolute",
            bottom: 25,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "9px 16px",
            borderRadius: 999,
            background: "rgba(10,10,10,.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "rgba(255,255,255,.85)",
            fontSize: 11,
            letterSpacing: 1.5,
            whiteSpace: "nowrap",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          Arraste para revelar a transformação
        </div>

        {/* CONTROLO INVISÍVEL */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) =>
            setPosition(Number(event.target.value))
          }
          aria-label="Comparar antes e depois"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "ew-resize",
            zIndex: 10,
            margin: 0,
          }}
        />
      </div>

      {/* INFORMAÇÃO */}
      <div
        style={{
          padding: "42px clamp(25px, 5vw, 55px) 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 28,
              height: 1,
              background: "#C8A24A",
            }}
          />

          <span
            style={{
              color: "#C8A24A",
              letterSpacing: 3,
              fontSize: 11,
              textTransform: "uppercase",
            }}
          >
            Sparkling Project
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: 10,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#C8A24A",
            fontSize: 14,
            letterSpacing: 1,
            marginBottom: 25,
          }}
        >
          {location}
        </p>

        <p
          style={{
            color: "#bdbdbd",
            lineHeight: 1.8,
            maxWidth: 850,
            fontSize: 16,
          }}
        >
          {description}
        </p>

        <button
          className="btn-primary"
          style={{
            marginTop: 32,
          }}
        >
          Ver Projeto
        </button>
      </div>
    </article>
  );
}