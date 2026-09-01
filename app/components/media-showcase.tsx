"use client";

import { useMemo, useState } from "react";

type Category = "Todas" | "Campo" | "Talleres" | "Creación" | "Circulación";

const categories: Category[] = ["Todas", "Campo", "Talleres", "Creación", "Circulación"];

const moments = [
  {
    id: "campo-boyaca",
    category: "Campo" as Category,
    title: "Trabajo de campo en Boyacá",
    text: "Salidas, encuentros, lugares y situaciones de escucha documentados por el semillero.",
    code: "CAMPO / 01",
  },
  {
    id: "taller-etnografia",
    category: "Talleres" as Category,
    title: "Preparación etnográfica",
    text: "Sesiones sobre observación, entrevista, registro, consentimiento y construcción de metadatos.",
    code: "TALLER / 02",
  },
  {
    id: "archivo-escucha",
    category: "Talleres" as Category,
    title: "Archivo y escucha colectiva",
    text: "Análisis de voces, gestos, ritmos, silencios, espacios y relaciones con la audiencia.",
    code: "ESCUCHA / 03",
  },
  {
    id: "creacion",
    category: "Creación" as Category,
    title: "Teatro, pódcast y música",
    text: "Procesos de investigación-creación alrededor del mito, la leyenda y sus transformaciones.",
    code: "CREACIÓN / 04",
  },
  {
    id: "coloquio",
    category: "Circulación" as Category,
    title: "Ponencias y encuentros",
    text: "Socialización de resultados en espacios académicos, culturales y comunitarios.",
    code: "CIRCULA / 05",
  },
];

export default function MediaShowcase() {
  const [category, setCategory] = useState<Category>("Todas");
  const [selected, setSelected] = useState(moments[0]);
  const visible = useMemo(
    () => category === "Todas" ? moments : moments.filter((moment) => moment.category === category),
    [category],
  );

  return (
    <div className="c-media-interactive">
      <div className="c-media-filters" aria-label="Filtrar memoria visual">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "is-active" : ""}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="c-media-grid">
        {visible.map((moment, index) => (
          <button
            type="button"
            className={`c-media-slot c-media-slot-${(index % 3) + 1} ${selected.id === moment.id ? "is-selected" : ""}`}
            key={moment.id}
            onClick={() => setSelected(moment)}
            aria-label={`Explorar ${moment.title}`}
          >
            <span className="c-slot-code">{moment.code}</span>
            <span className="c-slot-art" aria-hidden="true"><i /><i /><i /></span>
            <span className="c-slot-title">{moment.title}</span>
            <span className="c-slot-state">Fotografías por incorporar</span>
          </button>
        ))}
      </div>

      <div className="c-media-detail" aria-live="polite">
        <span>{selected.category}</span>
        <h3>{selected.title}</h3>
        <p>{selected.text}</p>
        <small>Este espacio está listo para recibir fotografías auténticas con sus créditos, fechas, lugares y permisos de publicación.</small>
      </div>
    </div>
  );
}
