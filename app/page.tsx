import Image from "next/image";
import Link from "next/link";
import MediaShowcase from "./components/media-showcase";

const workAreas = [
  {
    number: "01",
    label: "Investigar",
    title: "Literaturas orales y territorio",
    text: "Construimos y analizamos corpus de cuentos, coplas, décimas, mitos, leyendas y otras formas de literatura oral, con atención a sus lugares, versiones, mediaciones y condiciones de circulación.",
  },
  {
    number: "02",
    label: "Formar",
    title: "Aprender a escuchar y documentar",
    text: "Preparamos a nuevos investigadores mediante talleres de etnografía, laboratorios de escucha, trabajo colectivo, lectura crítica, entrevistas, diarios de campo y elaboración de metadatos.",
  },
  {
    number: "03",
    label: "Crear",
    title: "Transformar la investigación",
    text: "Exploramos el teatro de sombras, el pódcast, la composición musical, la escritura y las obras híbridas como formas de reinterpretar y compartir mitos y leyendas.",
  },
  {
    number: "04",
    label: "Circular",
    title: "Devolver y conversar públicamente",
    text: "Socializamos procesos y resultados mediante ponencias, artículos, exposiciones, muestras performativas, archivos sonoros y actividades culturales y comunitarias.",
  },
];

const route = [
  { n: "01", title: "Escuchar", text: "Reconocer voces, cuerpos, ritmos, silencios y situaciones." },
  { n: "02", title: "Documentar", text: "Registrar fuente, lugar, fecha, mediación, permisos y contexto." },
  { n: "03", title: "Interpretar", text: "Leer motivos, variaciones y relaciones culturales y territoriales." },
  { n: "04", title: "Crear y devolver", text: "Producir conocimiento y acordar cómo puede circular." },
];

const podcastEpisodes = [
  {
    number: "01",
    title: "Emisión I · Presentación",
    duration: "24:00",
    videoId: "eFNWbQaGozg",
    text: "Conoce el origen de Relato en Punto y la apuesta del semillero por investigar, analizar y compartir la riqueza de la literatura oral.",
  },
  {
    number: "02",
    title: "Emisión II · Tunja",
    duration: "18:32",
    videoId: "UsqSNkHy4KM",
    text: "Una emisión dedicada a las voces y relatos vinculados con Tunja, sus memorias y sus formas de circulación.",
  },
  {
    number: "03",
    title: "Emisión III · Tinjacá",
    duration: "08:46",
    videoId: "8H8WuysX8LI",
    text: "Un recorrido sonoro por las leyendas de Tinjacá y por las historias que conectan narración, lugar y memoria colectiva.",
  },
  {
    number: "04",
    title: "Emisión IV · Duitama",
    duration: "09:44",
    videoId: "soHfFq57KJM",
    text: "Duitama abre una nueva estación del recorrido: relatos locales, presencias fantásticas y preguntas que sobreviven en la tradición oral.",
  },
];

const socialNetworks = [
  {
    code: "IG",
    name: "Instagram",
    handle: "@semillero.consonante",
    href: "https://www.instagram.com/semillero.consonante/",
  },
  {
    code: "FB",
    name: "Facebook",
    handle: "Semillero Consonante",
    href: "https://www.facebook.com/semillero.consonante/",
  },
  {
    code: "TT",
    name: "TikTok",
    handle: "@semillero.consonante",
    href: "https://www.tiktok.com/@semillero.consonante",
  },
  {
    code: "YT",
    name: "YouTube",
    handle: "@SemilleroConsonante",
    href: "https://www.youtube.com/@SemilleroConsonante",
  },
  {
    code: "SP",
    name: "Spotify",
    handle: "Relato en Punto",
    href: "https://open.spotify.com/show/6bLNlEtrplQ8FBqC8rXs2W",
  },
  {
    code: "SC",
    name: "SoundCloud",
    handle: "Semillero Consonante",
    href: "https://soundcloud.com/semillero-consonante",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`c-brand ${footer ? "c-brand-footer" : ""}`}>
      <span className="c-brand-crop" aria-hidden="true">
        <Image src="/consonante-logo.png" alt="" width={798} height={795} priority={!footer} />
      </span>
      <span className="c-brand-words">
        <strong>Semillero Consonante</strong>
        <span>Investigación de la literatura oral</span>
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="consonante-site">
      <header className="c-header">
        <a href="#inicio" aria-label="Semillero Consonante, inicio"><Brand /></a>
        <nav className="c-nav" aria-label="Navegación principal">
          <a href="#semillero">El semillero</a>
          <a href="#trabajo">Qué hacemos</a>
          <a href="#memoria">Memoria visual</a>
          <a href="#audiovisual">Audiovisual</a>
          <a href="#podcast">Pódcast</a>
          <a href="#redes">Redes</a>
        </nav>
        <Link className="c-portal-link" href="/portal">Portal privado <Arrow /></Link>
      </header>

      <section className="c-hero" id="inicio">
        <div className="c-hero-copy">
          <p className="c-kicker">Grupo de Investigación Litoral · UPTC</p>
          <h1>Voces que cuentan.<br /><span>Territorios</span> que responden.</h1>
          <p className="c-hero-lead">
            Investigamos la literatura oral como memoria viva, práctica cultural
            y forma de crear conocimiento con los territorios.
          </p>
          <div className="c-actions">
            <a className="c-button c-button-solid" href="#semillero">Conocer el semillero <Arrow /></a>
            <a className="c-button c-button-line" href="#memoria">Explorar la memoria visual</a>
          </div>
        </div>

        <div className="c-logo-stage">
          <span className="c-stage-label">Literatura oral / escucha / creación</span>
          <div className="c-logo-card">
            <Image
              src="/consonante-logo.png"
              alt="Logo del Semillero Consonante: Investigación de la literatura oral"
              width={798}
              height={795}
              priority
            />
          </div>
          <span className="c-stage-note">La gran C reúne voz, onda, espiral, trazo y mirada.</span>
        </div>

        <div className="c-ticker" aria-label="Temas del semillero">
          <span>Mito</span><i>✦</i><span>Leyenda</span><i>✦</i><span>Memoria</span><i>✦</i><span>Territorio</span><i>✦</i><span>Investigación-creación</span>
        </div>
      </section>

      <section className="c-about c-shell" id="semillero">
        <div className="c-section-intro">
          <p className="c-kicker">01 / El semillero</p>
          <h2>Formamos investigadores para escuchar lo que una comunidad cuenta sobre sí misma.</h2>
        </div>
        <div className="c-about-grid">
          <div className="c-about-main">
            <p className="c-drop">
              Consonante pertenece a la línea <strong>Literaturas orales, memoria y patrimonio cultural</strong> del Grupo de Investigación Litoral y se articula con la Licenciatura en Literatura de la UPTC.
            </p>
            <p>
              El semillero forma nuevos investigadores interesados en valorar, estudiar,
              visibilizar y resignificar expresiones literarias tradicionales y orales.
              Cada semestre desarrolla un proceso colectivo alrededor de un problema
              amplio: delimita un corpus, prepara el trabajo de campo, analiza los
              materiales y construye productos para su divulgación.
            </p>
            <p>
              Nos interesan los relatos en su complejidad: no solo aquello que dicen,
              sino quién los cuenta, dónde circulan, cómo intervienen la voz y el cuerpo,
              qué memorias sostienen y qué transformaciones experimentan en los medios
              digitales y en la vida contemporánea.
            </p>
          </div>
          <aside className="c-focus-card">
            <span>Foco colectivo · 2026</span>
            <h3>Mito, leyenda, territorio y transformaciones contemporáneas en Boyacá</h3>
            <p>Una pregunta común articula el análisis cultural y territorial con los diálogos y tensiones entre tradición, ciencia, medios digitales y experiencias contemporáneas.</p>
            <div className="c-focus-stats">
              <div><strong>5</strong><small>ponencias colectivas</small></div>
              <div><strong>XIII</strong><small>Coloquio Internacional en Lenguaje y Cultura</small></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="c-work" id="trabajo">
        <div className="c-shell">
          <div className="c-section-intro c-section-intro-light">
            <p className="c-kicker">02 / Qué hacemos</p>
            <h2>La investigación ocurre entre el archivo, el encuentro y la creación.</h2>
            <p>Abre cada línea para conocer cómo se articula el trabajo del semillero.</p>
          </div>
          <div className="c-accordion">
            {workAreas.map((area, index) => (
              <details key={area.number} open={index === 0}>
                <summary>
                  <span className="c-acc-number">{area.number}</span>
                  <span className="c-acc-label">{area.label}</span>
                  <strong>{area.title}</strong>
                  <span className="c-acc-plus" aria-hidden="true">+</span>
                </summary>
                <p>{area.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="c-route c-shell">
        <div className="c-section-intro">
          <p className="c-kicker">03 / Nuestra ruta</p>
          <h2>Una metodología para cuidar la palabra y su contexto.</h2>
        </div>
        <div className="c-route-grid">
          {route.map((step) => (
            <article key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="c-care-note">
          <strong>Principio de cuidado</strong>
          <p>Entrevistas, transcripciones, diarios, fotografías, audios y videos solo se publican cuando sus metadatos, derechos, consentimiento y nivel de privacidad han sido verificados.</p>
        </div>
      </section>

      <section className="c-media" id="memoria">
        <div className="c-shell">
          <div className="c-section-intro c-section-intro-split">
            <div><p className="c-kicker">04 / Memoria visual</p><h2>El trabajo también se recuerda en imágenes.</h2></div>
            <p className="c-section-side">Filtra y selecciona los momentos. La estructura queda preparada para incorporar fotografías reales del semillero con sus datos y permisos; no utilizamos imágenes genéricas para simular el trabajo de campo.</p>
          </div>
          <MediaShowcase />
        </div>
      </section>

      <section className="c-video c-shell" id="audiovisual">
        <div className="c-section-intro c-section-intro-split">
          <div><p className="c-kicker">05 / Ver y escuchar</p><h2>Laboratorios, pódcast y obras en proceso.</h2></div>
          <p className="c-section-side">Una videoteca para reunir materiales de análisis y documentar los productos audiovisuales del semillero.</p>
        </div>
        <div className="c-video-grid">
          <article className="c-video-feature">
            <div className="c-video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/LMmdDmiJY0g"
                title="Material de análisis para el Laboratorio Escuchar tres veces"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="c-video-copy">
              <span>Material de análisis</span>
              <h3>Laboratorio «Escuchar tres veces»</h3>
              <p>Una batalla de freestyle permite observar cómo una expresión oral integra palabra, cuerpo, ritmo, música, espacio, audiencia y performance.</p>
              <a href="https://www.youtube.com/watch?v=LMmdDmiJY0g" target="_blank" rel="noreferrer">Ver en YouTube <Arrow /></a>
            </div>
          </article>
          <div className="c-video-upcoming">
            <article>
              <span>En desarrollo</span><h3>Teatro de sombras</h3><p>Registro del proceso creativo alrededor del mito y la leyenda.</p><i>01</i>
            </article>
            <article>
              <span>Ya disponible</span><h3>Relato en Punto</h3><p>Cinco emisiones para escuchar la literatura oral desde Boyacá.</p><i>02</i>
            </article>
            <article>
              <span>Archivo futuro</span><h3>Composiciones musicales</h3><p>Piezas que exploran motivos, atmósferas y transformaciones de los relatos.</p><i>03</i>
            </article>
          </div>
        </div>
      </section>

      <section className="c-podcast" id="podcast">
        <div className="c-shell">
          <div className="c-section-intro c-section-intro-split c-section-intro-light">
            <div>
              <p className="c-kicker">06 / Pódcast del semillero</p>
              <h2>Relato en Punto: la literatura oral también se escucha.</h2>
            </div>
            <p className="c-section-side">
              Un programa del Semillero Consonante para difundir y analizar relatos,
              voces y memorias de los territorios. Escucha las emisiones aquí o
              continúa en tu plataforma preferida.
            </p>
          </div>

          <div className="c-podcast-feature">
            <div className="c-podcast-identity">
              <span className="c-podcast-label">Pódcast oficial · Semillero Consonante</span>
              <h3>Relato<br />en Punto</h3>
              <p>
                Cinco estaciones para acercarse a la literatura oral: una presentación
                del proyecto y recorridos por Tunja, Tinjacá, Duitama y Ráquira.
              </p>
              <div className="c-waveform" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
              <div className="c-podcast-platforms">
                <a
                  className="c-button c-button-podcast"
                  href="https://www.youtube.com/@SemilleroConsonante"
                  target="_blank"
                  rel="noreferrer"
                >
                  Canal en YouTube <Arrow />
                </a>
                <a
                  className="c-button c-button-podcast-line"
                  href="https://open.spotify.com/show/6bLNlEtrplQ8FBqC8rXs2W"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir en Spotify <Arrow />
                </a>
                <a
                  className="c-button c-button-podcast-line"
                  href="https://soundcloud.com/semillero-consonante"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir SoundCloud <Arrow />
                </a>
              </div>
            </div>

            <div className="c-spotify-card">
              <div className="c-player-heading">
                <span>Escuchar en Spotify</span>
                <small>El reproductor se actualiza con las nuevas emisiones.</small>
              </div>
              <iframe
                src="https://open.spotify.com/embed/show/6bLNlEtrplQ8FBqC8rXs2W?utm_source=generator&theme=0"
                title="Relato en Punto en Spotify"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>

          <div className="c-episodes-heading">
            <h3>Videopódcast publicados</h3>
            <span>4 emisiones en YouTube · 5 en audio</span>
          </div>
          <div className="c-episodes-grid">
            {podcastEpisodes.map((episode) => (
              <article className="c-episode-card" key={episode.videoId}>
                <div className="c-episode-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${episode.videoId}`}
                    title={`Relato en Punto, ${episode.title}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="c-episode-copy">
                  <div className="c-episode-meta">
                    <span>Emisión {episode.number}</span>
                    <span>{episode.duration}</span>
                  </div>
                  <h3>{episode.title}</h3>
                  <p>{episode.text}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${episode.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver en YouTube <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="c-social" id="redes">
        <div className="c-shell">
          <div className="c-section-intro c-section-intro-split">
            <div>
              <p className="c-kicker">07 / Comunidad en red</p>
              <h2>Sigue las voces y los procesos de Consonante.</h2>
            </div>
            <p className="c-section-side">
              Encuentra las actividades, registros, videopódcast y emisiones del
              semillero en sus canales digitales.
            </p>
          </div>
          <div className="c-social-grid">
            {socialNetworks.map((network, index) => (
              <a
                className="c-social-link"
                href={network.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visitar ${network.name} del Semillero Consonante`}
                key={network.name}
              >
                <span className="c-social-code">{network.code}</span>
                <span className="c-social-copy">
                  <small>{String(index + 1).padStart(2, "0")} / Canal</small>
                  <strong>{network.name}</strong>
                  <span>{network.handle}</span>
                </span>
                <span className="c-social-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="c-publication">
        <div className="c-shell c-publication-grid">
          <div>
            <p className="c-kicker">08 / Investigar para compartir</p>
            <h2>Cinco ponencias. Una pregunta común. Múltiples voces.</h2>
          </div>
          <div>
            <p>En 2026, los equipos preparan cinco ponencias colectivas para el XIII Coloquio Internacional en Lenguaje y Cultura. El ejercicio articula corpus localizables en Boyacá, discusión conceptual, análisis y conversación pública.</p>
            <ul>
              <li>Motivos, modelización y cultura</li>
              <li>Leyenda, proximidad y territorio</li>
              <li>Mito, leyenda y ciencia</li>
              <li>Transformaciones y circulación digital</li>
              <li>Diálogo colectivo y síntesis crítica</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="c-member-cta">
        <div className="c-shell c-member-grid">
          <div>
            <p className="c-kicker">Espacio de integrantes</p>
            <h2>La programación y los materiales, siempre a la mano.</h2>
          </div>
          <div>
            <p>Consulta lecturas, tareas, anuncios, próximos encuentros y documentos de trabajo en el portal privado.</p>
            <Link className="c-button c-button-sand" href="/portal">Ingresar con Google <Arrow /></Link>
          </div>
        </div>
      </section>

      <footer className="c-footer">
        <Brand footer />
        <p>Grupo de Investigación Litoral · Licenciatura en Literatura · UPTC</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </main>
  );
}
