"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, firebaseReady } from "../../lib/firebase";

type Role = "coordinacion" | "editor" | "integrante";
type Section = "inicio" | "programacion" | "lecturas" | "tareas" | "archivo" | "gestion";
type ContentType = "programacion" | "lecturas" | "tareas" | "anuncios";

type Profile = {
  name: string;
  email: string;
  role: Role;
};

type ContentItem = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  meta?: string;
  url?: string;
  status?: string;
};

type ContentState = Record<ContentType, ContentItem[]>;

const emptyContent: ContentState = {
  programacion: [],
  lecturas: [],
  tareas: [],
  anuncios: [],
};

const demoContent: ContentState = {
  programacion: [
    {
      id: "demo-session",
      title: "Laboratorio de escucha: cuerpo, ritmo y performance",
      description: "Análisis colectivo de un acontecimiento oral atendiendo a lo verbal, corporal, musical y situacional.",
      date: "Fecha por programar",
      meta: "Sesión presencial · 90 minutos",
      status: "Próxima sesión",
    },
    {
      id: "demo-field",
      title: "Preparación del trabajo de campo",
      description: "Preguntas, consentimiento, registro y construcción de metadatos.",
      date: "Fecha por programar",
      meta: "Taller colectivo",
      status: "En preparación",
    },
  ],
  lecturas: [
    {
      id: "demo-reading-1",
      title: "Lectura principal de la próxima sesión",
      description: "La coordinación añadirá aquí la referencia bibliográfica y el enlace autorizado.",
      meta: "Lectura obligatoria",
      status: "Pendiente",
    },
    {
      id: "demo-reading-2",
      title: "Material complementario",
      description: "Espacio para un audio, video, capítulo o artículo de apoyo.",
      meta: "Recurso complementario",
      status: "Opcional",
    },
  ],
  tareas: [
    {
      id: "demo-task",
      title: "Ejercicio individual de escucha",
      description: "Registrar observaciones sobre voz, gesto, ritmo, espacio y relación con la audiencia.",
      date: "Sin fecha asignada",
      meta: "Entrega individual",
      status: "Por iniciar",
    },
  ],
  anuncios: [
    {
      id: "demo-announcement",
      title: "Bienvenida al portal",
      description: "Este espacio reunirá las indicaciones y materiales de trabajo del semillero.",
      date: "Hoy",
    },
    {
      id: "demo-privacy",
      title: "Cuidado de los materiales",
      description: "Los registros de campo solo se compartirán cuando sus permisos y condiciones de circulación estén confirmados.",
      date: "Importante",
    },
  ],
};

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "inicio", label: "Inicio", icon: "I" },
  { id: "programacion", label: "Programación", icon: "P" },
  { id: "lecturas", label: "Lecturas", icon: "L" },
  { id: "tareas", label: "Tareas", icon: "T" },
  { id: "archivo", label: "Archivo", icon: "A" },
];

const sectionLabels: Record<Section, { title: string; subtitle: string }> = {
  inicio: { title: "Hola, Consonante.", subtitle: "Aquí está lo esencial para continuar el trabajo colectivo." },
  programacion: { title: "Programación", subtitle: "Sesiones, talleres, encuentros y fechas del semillero." },
  lecturas: { title: "Lecturas", subtitle: "Bibliografía y recursos organizados para cada sesión." },
  tareas: { title: "Tareas", subtitle: "Indicaciones, productos esperados y fechas de entrega." },
  archivo: { title: "Archivo de trabajo", subtitle: "Documentos compartidos y materiales con acceso autorizado." },
  gestion: { title: "Gestión de contenidos", subtitle: "Actualiza el portal cotidiano sin modificar su diseño." },
};

function hasEditorialRole(role: Role) {
  return role === "coordinacion" || role === "editor";
}

function normalizeItem(id: string, value: Record<string, unknown>): ContentItem {
  return {
    id,
    title: String(value.title ?? value.titulo ?? "Sin título"),
    description: String(value.description ?? value.descripcion ?? ""),
    date: String(value.date ?? value.fecha ?? ""),
    meta: String(value.meta ?? value.tipo ?? ""),
    url: String(value.url ?? value.enlace ?? ""),
    status: String(value.status ?? value.estado ?? ""),
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function PortalClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseReady);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);
  const [active, setActive] = useState<Section>("inicio");
  const [content, setContent] = useState<ContentState>(emptyContent);

  useEffect(() => {
    const firebaseAuth = auth;
    const firestore = db;
    if (!firebaseReady || !firebaseAuth || !firestore) return;
    return onAuthStateChanged(firebaseAuth, async (user) => {
      setLoading(true);
      setError("");
      if (!user?.email) {
        setFirebaseUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const email = user.email.toLowerCase();
        const membership = await getDoc(doc(firestore, "integrantes", email));
        if (!membership.exists()) {
          await signOut(firebaseAuth);
          setError("Tu cuenta de Google todavía no figura en la lista de integrantes. Solicita acceso a la coordinación del semillero.");
          return;
        }

        const member = membership.data();
        setFirebaseUser(user);
        setProfile({
          name: String(member.nombre ?? user.displayName ?? email.split("@")[0]),
          email,
          role: (member.role as Role) ?? "integrante",
        });
        await loadContent();
      } catch {
        setError("No fue posible verificar el acceso. Revisa la configuración del portal e inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  async function loadContent() {
    const firestore = db;
    if (!firestore) return;
    const names: ContentType[] = ["programacion", "lecturas", "tareas", "anuncios"];
    const snapshots = await Promise.all(names.map((name) => getDocs(collection(firestore, name))));
    const next = { ...emptyContent };
    names.forEach((name, index) => {
      next[name] = snapshots[index].docs.map((entry) => normalizeItem(entry.id, entry.data()));
    });
    setContent(next);
  }

  async function handleGoogleLogin() {
    if (!firebaseReady || !auth) {
      setError("La conexión con Google se activará al asociar el proyecto de Firebase del semillero.");
      return;
    }
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (loginError) {
      const code = typeof loginError === "object" && loginError && "code" in loginError ? String(loginError.code) : "";
      if (code !== "auth/popup-closed-by-user") setError("No fue posible iniciar sesión con Google. Inténtalo nuevamente.");
    }
  }

  async function handleSignout() {
    if (demo) {
      setDemo(false);
      setProfile(null);
      setActive("inicio");
      return;
    }
    if (auth) await signOut(auth);
  }

  function openDemo() {
    setDemo(true);
    setContent(demoContent);
    setProfile({ name: "Coordinación Consonante", email: "vista de diseño", role: "coordinacion" });
  }

  if (loading) {
    return (
      <main className="portal-shell login-panel">
        <div className="login-card"><p className="section-index">Portal privado</p><h2>Verificando acceso…</h2></div>
      </main>
    );
  }

  if (!profile) {
    return <LoginView error={error} onLogin={handleGoogleLogin} onDemo={openDemo} />;
  }

  const editor = hasEditorialRole(profile.role);
  const visibleNav = editor ? [...navItems, { id: "gestion" as Section, label: "Gestión", icon: "G" }] : navItems;

  return (
    <main className="portal-shell dashboard">
      <aside className="portal-sidebar">
        <Link className="brand" href="/" aria-label="Volver al sitio público">
          <span className="brand-mark">C</span>
          <span className="brand-text"><strong>Semillero</strong><span>Consonante</span></span>
        </Link>
        <nav className="portal-nav" aria-label="Secciones del portal">
          {visibleNav.map((item) => (
            <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="user-row">
            <span className="user-avatar">{initials(profile.name)}</span>
            <div className="user-meta"><strong>{profile.name}</strong><span>{profile.email}</span></div>
          </div>
          <button className="signout" onClick={handleSignout}>Cerrar sesión</button>
        </div>
      </aside>

      <section className="portal-main">
        <div className="portal-topbar">
          <div><p>Semillero Consonante</p><strong>Espacio de integrantes</strong></div>
          <span className={`status-pill ${demo ? "demo-pill" : ""}`}>{demo ? "Vista de diseño" : profile.role}</span>
        </div>
        <div className="portal-heading">
          <div><h1>{sectionLabels[active].title}</h1><p>{sectionLabels[active].subtitle}</p></div>
        </div>
        <div className="section-content">
          {active === "inicio" && <HomePanel content={content} onNavigate={setActive} />}
          {active === "programacion" && <ContentPanel type="programacion" items={content.programacion} />}
          {active === "lecturas" && <ContentPanel type="lecturas" items={content.lecturas} />}
          {active === "tareas" && <ContentPanel type="tareas" items={content.tareas} />}
          {active === "archivo" && <ArchivePanel />}
          {active === "gestion" && editor && (
            <EditorPanel demo={demo} onSaved={loadContent} currentUser={firebaseUser} />
          )}
        </div>
      </section>
    </main>
  );
}

function LoginView({ error, onLogin, onDemo }: { error: string; onLogin: () => void; onDemo: () => void }) {
  return (
    <main className="portal-shell login-shell">
      <section className="login-art">
        <Link className="brand" href="/">
          <span className="brand-mark">C</span>
          <span className="brand-text"><strong>Semillero</strong><span>Consonante</span></span>
        </Link>
        <div className="login-art-copy">
          <p className="eyebrow">Espacio de integrantes</p>
          <h1>La escucha<br />continúa <em>aquí.</em></h1>
          <p>Programación, lecturas, tareas y materiales para sostener el trabajo colectivo.</p>
        </div>
        <Link className="back-home" href="/">← Volver al sitio público</Link>
        <div className="login-rings" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <p className="section-index">Acceso privado</p>
          <h2>Bienvenida,<br />bienvenido.</h2>
          <p>Ingresa con la cuenta de Google que fue autorizada por la coordinación del semillero.</p>
          <button className="google-button" onClick={onLogin}><span className="google-g">G</span>Continuar con Google</button>
          {error && <p className="login-error" role="alert">{error}</p>}
          <div className="login-note"><span>◌</span><p>El acceso no depende de una contraseña compartida. Cada integrante utiliza su propia cuenta y los materiales permanecen sujetos a permisos.</p></div>
          {!firebaseReady && <button className="demo-button" onClick={onDemo}>Ver la maqueta del portal</button>}
        </div>
      </section>
    </main>
  );
}

function HomePanel({ content, onNavigate }: { content: ContentState; onNavigate: (section: Section) => void }) {
  const next = content.programacion[0];
  return (
    <div className="dashboard-grid">
      {next ? (
        <article className="next-session">
          <span className="session-date">{next.status || "Próxima sesión"} · {next.date}</span>
          <h2>{next.title}</h2>
          <p>{next.description}</p>
          <div className="session-meta"><span>{next.meta || "Detalles por confirmar"}</span></div>
        </article>
      ) : <div className="empty-state">Todavía no hay una próxima sesión publicada.</div>}
      <article className="portal-card">
        <div className="portal-card-header"><h2>Anuncios</h2><span>{content.anuncios.length}</span></div>
        <div className="announcements">
          {content.anuncios.length ? content.anuncios.slice(0, 3).map((item) => (
            <div className="announcement" key={item.id}><span>{item.date}</span><h3>{item.title}</h3><p>{item.description}</p></div>
          )) : <p className="empty-state">No hay anuncios nuevos.</p>}
        </div>
      </article>
      <div className="two-columns">
        <article className="portal-card">
          <div className="portal-card-header"><h2>Lecturas recientes</h2><button className="content-link" onClick={() => onNavigate("lecturas")}>Ver todas</button></div>
          <MiniList items={content.lecturas.slice(0, 3)} fallback="No hay lecturas publicadas." />
        </article>
        <article className="portal-card">
          <div className="portal-card-header"><h2>Tareas pendientes</h2><button className="content-link" onClick={() => onNavigate("tareas")}>Ver todas</button></div>
          <MiniList items={content.tareas.slice(0, 3)} fallback="No hay tareas pendientes." />
        </article>
      </div>
    </div>
  );
}

function MiniList({ items, fallback }: { items: ContentItem[]; fallback: string }) {
  if (!items.length) return <div className="empty-state">{fallback}</div>;
  return (
    <div className="item-list">
      {items.map((item) => (
        <div className="resource-row" key={item.id}>
          <span className="resource-icon">↗</span>
          <div><h3>{item.title}</h3><p>{item.meta || item.date}</p></div>
          {item.url ? <a href={item.url} target="_blank" rel="noreferrer">Abrir</a> : <span />}
        </div>
      ))}
    </div>
  );
}

function ContentPanel({ type, items }: { type: Exclude<ContentType, "anuncios">; items: ContentItem[] }) {
  const labels = {
    programacion: { empty: "Todavía no hay sesiones publicadas.", action: "Detalles", defaultMeta: "Sesión" },
    lecturas: { empty: "Todavía no hay lecturas publicadas.", action: "Abrir", defaultMeta: "Lectura" },
    tareas: { empty: "Todavía no hay tareas publicadas.", action: "Ver tarea", defaultMeta: "Pendiente" },
  }[type];

  if (!items.length) return <div className="empty-state">{labels.empty}</div>;
  return (
    <div className="content-table">
      {items.map((item) => (
        <article className="content-row" key={item.id}>
          <div className="content-date">{item.date || "Sin fecha"}</div>
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
          <span className="content-chip">{item.status || item.meta || labels.defaultMeta}</span>
          {item.url ? <a className="content-link" href={item.url} target="_blank" rel="noreferrer">{labels.action} ↗</a> : <span className="content-link">{labels.action}</span>}
        </article>
      ))}
    </div>
  );
}

function ArchivePanel() {
  return (
    <div className="editor-grid">
      <article className="portal-card">
        <div className="portal-card-header"><h2>Materiales compartidos</h2><span>Acceso restringido</span></div>
        <div className="empty-state">El archivo se conectará a la carpeta institucional definida por la coordinación. Aquí no se mostrarán materiales de campo sin permisos confirmados.</div>
      </article>
      <article className="portal-card">
        <div className="portal-card-header"><h2>Criterios de cuidado</h2><span>Antes de publicar</span></div>
        <div className="guide-steps">
          <div className="guide-step"><h3>Confirmar el consentimiento</h3><p>Verifica el alcance acordado para conservación, consulta y circulación.</p></div>
          <div className="guide-step"><h3>Completar los metadatos</h3><p>Registra lugar, fecha, participantes, mediación, fuente y responsable.</p></div>
          <div className="guide-step"><h3>Definir la privacidad</h3><p>Clasifica el material como público, interno o restringido antes de enlazarlo.</p></div>
        </div>
      </article>
    </div>
  );
}

function EditorPanel({ demo, onSaved, currentUser }: { demo: boolean; onSaved: () => Promise<void>; currentUser: User | null }) {
  const [type, setType] = useState<ContentType>("programacion");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const canSave = useMemo(() => !demo && Boolean(db && currentUser), [demo, currentUser]);

    async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const firestore = db;

    if (!firestore || !canSave) return;

    const form = new FormData(formElement);

    setSaving(true);
    setMessage("");

    try {
      await addDoc(collection(firestore, type), {
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        date: String(form.get("date") ?? ""),
        meta: String(form.get("meta") ?? ""),
        url: String(form.get("url") ?? ""),
        status: String(form.get("status") ?? ""),
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email ?? "",
      });
    } catch {
      setMessage(
        "No fue posible guardar el contenido. Verifica tu conexión e inténtalo nuevamente.",
      );
      setSaving(false);
      return;
    }

    try {
      formElement.reset();
      await onSaved();
      setMessage("Contenido publicado correctamente.");
    } catch {
      setMessage(
        "El contenido se publicó, pero la lista no se actualizó. Recarga la página para verlo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor-grid">
      <article className="portal-card">
        <div className="portal-card-header"><h2>Publicar contenido</h2><span>Panel editorial</span></div>
        <form className="editor-form" onSubmit={save}>
          <label>Sección<select value={type} onChange={(e) => setType(e.target.value as ContentType)}><option value="programacion">Programación</option><option value="lecturas">Lecturas</option><option value="tareas">Tareas</option><option value="anuncios">Anuncios</option></select></label>
          <label>Título<input name="title" required placeholder="Título breve y preciso" /></label>
          <label>Descripción<textarea name="description" placeholder="Indicaciones o contexto" /></label>
          <label>Fecha o rótulo<input name="date" placeholder="Ej.: 18 de septiembre · 2:00 p. m." /></label>
          <label>Tipo o modalidad<input name="meta" placeholder="Ej.: Lectura obligatoria" /></label>
          <label>Estado<input name="status" placeholder="Ej.: Pendiente" /></label>
          <label>Enlace<input name="url" type="url" placeholder="https://…" /></label>
          <button className="editor-submit" disabled={!canSave || saving}>{saving ? "Publicando…" : demo ? "Disponible al conectar Firebase" : "Publicar en el portal"}</button>
          {message && <p className="login-error" role="status">{message}</p>}
        </form>
      </article>
      <article className="portal-card">
        <div className="portal-card-header"><h2>Dos formas de editar</h2><span>Flujo recomendado</span></div>
        <div className="guide-steps">
          <div className="guide-step"><h3>Panel para el trabajo cotidiano</h3><p>Coordinación y editores publican fechas, tareas, lecturas y anuncios sin tocar el código.</p></div>
          <div className="guide-step"><h3>GitHub para la estructura</h3><p>Los colaboradores autorizados modifican el diseño, las páginas públicas y las funciones del sitio.</p></div>
          <div className="guide-step"><h3>Roles separados</h3><p>Integrantes consultan; editores actualizan contenidos; coordinación administra accesos y estructura.</p></div>
          <div className="guide-step"><h3>Privacidad desde el origen</h3><p>Los enlaces privados y registros de campo no se incluyen en el repositorio público.</p></div>
        </div>
      </article>
    </div>
  );
}
