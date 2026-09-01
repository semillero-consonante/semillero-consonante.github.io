# Semillero Consonante

Sitio público y portal privado del Semillero Consonante, perteneciente al Grupo de Investigación Litoral. El proyecto separa la información pública de los materiales de trabajo reservados para integrantes.

## Estructura

- `/`: presentación pública, líneas de trabajo y actividades.
- `/portal`: ingreso con Google y espacio privado.
- Firebase Authentication: identifica a cada integrante con su propia cuenta de Google.
- Cloud Firestore: guarda programación, lecturas, tareas, anuncios y roles.
- GitHub: conserva el código y permite la edición colaborativa de la estructura y el diseño.

Los materiales privados no deben guardarse dentro del repositorio. El portal consulta esos datos después de verificar el acceso en Firebase.

## Roles

- `integrante`: consulta los contenidos privados.
- `editor`: consulta y publica desde el panel editorial.
- `coordinacion`: administra accesos, contenidos y estructura.

## Configuración inicial

1. Crear una organización de GitHub para el semillero y añadir como propietarios únicamente a las personas responsables.
2. Crear un repositorio llamado `<organizacion>.github.io` para que el sitio se publique desde la raíz y no interfiera con otros proyectos.
3. Crear un proyecto en Firebase, registrar una aplicación web y activar Google como proveedor en Authentication.
4. Crear una base de Cloud Firestore y publicar las reglas contenidas en `firestore.rules`.
5. En Firestore, crear la colección `integrantes`. El identificador de cada documento debe ser el correo de Google en minúsculas. El primer documento debe corresponder a la coordinación y contener:

```json
{
  "nombre": "Nombre de la persona",
  "role": "coordinacion"
}
```

6. Copiar los valores de Firebase indicados en `.env.example` a los secretos del repositorio de GitHub con los mismos nombres.
7. En GitHub, abrir **Settings → Pages** y seleccionar **GitHub Actions** como fuente de publicación.
8. Añadir `https://<organizacion>.github.io` a los dominios autorizados de Firebase Authentication.

## Trabajo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Para comprobar la versión destinada a GitHub Pages:

```bash
npm run build:pages
```

## Actualización de contenidos

Las fechas, lecturas, tareas y anuncios se actualizan desde **Portal → Gestión**. Los cambios de textos públicos, estructura, diseño o funciones se realizan mediante GitHub. De esta manera, el trabajo cotidiano no requiere editar código, pero el proyecto conserva control y trazabilidad técnica.

## Privacidad

- No incluir entrevistas, transcripciones, audios, videos ni enlaces privados en el código fuente.
- Publicar materiales de campo solo con consentimiento y condiciones de circulación confirmadas.
- Completar lugar, fecha, fuente, mediación, responsable y nivel de privacidad antes de enlazar un registro.
- Retirar inmediatamente el acceso a quienes dejen de pertenecer al semillero.
