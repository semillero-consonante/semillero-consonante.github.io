"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const categories = ["Todas", "Talleres", "Creación", "Ponencias", "Recorridos"] as const;
type Category = typeof categories[number];
const moments: { id: number; category: Category; title: string; alt: string }[] = [
  { id: 1, category: "Talleres", title: "Aprender en círculo", alt: "Participantes reunidos en círculo en un auditorio durante un taller" },
  { id: 2, category: "Creación", title: "Historias entre luces y sombras", alt: "Siluetas de dos personajes proyectadas en una pantalla de teatro de sombras" },
  { id: 3, category: "Recorridos", title: "Un equipo, muchas voces", alt: "Integrantes del semillero reunidos en un espacio universitario" },
  { id: 4, category: "Recorridos", title: "Conversar con las imágenes", alt: "Grupo de visitantes frente a una exposición de fotografías y obras" },
  { id: 5, category: "Ponencias", title: "Compartir la investigación", alt: "Ponente en un atril de la UPTC junto a una proyección" },
  { id: 6, category: "Ponencias", title: "Saberes que circulan", alt: "Presentación académica proyectada en un auditorio de la UPTC" },
  { id: 7, category: "Talleres", title: "El auditorio como laboratorio", alt: "Participantes de un taller distribuidos en grupos dentro de un auditorio" },
  { id: 8, category: "Talleres", title: "Poner el cuerpo en el aprendizaje", alt: "Participantes conversando y trabajando de pie durante un taller" },
  { id: 9, category: "Talleres", title: "Crear en colectivo", alt: "Grupo reunido alrededor de materiales de trabajo en una actividad colectiva" },
  { id: 10, category: "Talleres", title: "Escuchar y tomar la palabra", alt: "Conversación grupal con micrófonos y una proyección de fondo" },
  { id: 11, category: "Creación", title: "Ensayar otras formas de narrar", alt: "Participantes preparando una escena con luces y sombras en una sala" },
  { id: 12, category: "Creación", title: "Dar forma a una sombra", alt: "Participante manipulando una figura que proyecta su sombra sobre la pared" },
];

export default function MediaShowcase() {
  const [category, setCategory] = useState<Category>("Todas");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = moments.filter(m => category === "Todas" || m.category === category);
  const moment = selected === null ? null : moments.find(m => m.id === selected);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, [isOpen]);
  function move(direction: number) {
    const index = visible.findIndex(m => m.id === selected);
    setSelected(visible[(index + direction + visible.length) % visible.length].id);
  }
  return <div className="c-media-interactive">
    <div className="c-media-filters" role="group" aria-label="Filtrar memoria visual">
      {categories.map(item => <button key={item} type="button" aria-pressed={category === item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <p className="c-gallery-count" aria-live="polite">{visible.length} fotografías · Selecciona una imagen para explorar</p>
    <div className="c-gallery-grid">
      {visible.map(m => <button className="c-gallery-card" type="button" key={m.id} onClick={() => setSelected(m.id)} aria-label={`Ampliar: ${m.title}`}>
        <Image src={`/media/semillero/momento-${m.id}.jpg`} alt={m.alt} width={800} height={600} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
        <span className="c-gallery-caption"><small>{m.category}</small><strong>{m.title}</strong><span aria-hidden="true">Ampliar ↗</span></span>
      </button>)}
    </div>
    <dialog ref={dialog} className="c-gallery-dialog" aria-labelledby="gallery-title" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} onKeyDown={e => { if (e.key === "ArrowLeft") move(-1); if (e.key === "ArrowRight") move(1); }}>
      {moment && <div className="c-gallery-viewer">
        <button className="c-viewer-close" type="button" onClick={() => setSelected(null)} autoFocus aria-label="Cerrar visor">Cerrar ✕</button>
        <Image src={`/media/semillero/momento-${moment.id}.jpg`} alt={moment.alt} width={1600} height={1200} />
        <div className="c-viewer-footer"><button type="button" onClick={() => move(-1)} aria-label="Fotografía anterior">← Anterior</button><div><small>{moment.category} · {visible.findIndex(m => m.id === selected) + 1} / {visible.length}</small><h3 id="gallery-title">{moment.title}</h3></div><button type="button" onClick={() => move(1)} aria-label="Fotografía siguiente">Siguiente →</button></div>
      </div>}
    </dialog>
  </div>;
}

export function ProcessVideos() {
  return <div className="c-process-videos">{[13, 14].map((id, i) => <article key={id}>
    <video controls playsInline preload="none" poster={`/media/semillero/video-${i + 1}.jpg`} aria-label={`Registro audiovisual del proceso creativo ${i + 1}`}>
      <source src={`/media/semillero/momento-${id}.mp4`} type="video/mp4" />Tu navegador no permite reproducir este video.
    </video>
    <div><small>Registro {i + 1} · {i === 0 ? "00:58" : "01:28"}</small><h3>{i === 0 ? "La carranga se vive en el territorio" : "Carranga y literatura oral"}</h3><p>Un fragmento del trabajo del semillero. Activa la reproducción para ver y escuchar el registro.</p></div>
  </article>)}</div>;
}
