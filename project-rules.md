# PROJECT RULES — Neblina RIDERS (Stack: React + Strapi)

*Reemplaza la versión anterior basada en WordPress. Documento vivo — cualquier cambio de alcance, diseño o arquitectura debe reflejarse aquí antes de implementarse.*

---

## 1. Objetivo y alcance

**Objetivo:** Landing page comunitaria para el club Neblina RIDERS — con panel de administración propio, registro/login de socios, presupuesto $0, primera maqueta funcional en 1 semana.

**Dentro de alcance — Fase 1 (Maqueta):**
- Frontend React con las 8 secciones definidas en el wireframe
- Backend Strapi con CRUD de artículos y usuarios/socios vía panel admin
- Registro y login de socios (autenticación provista por Strapi)
- Espacio publicitario reservado visualmente (sin lógica de anuncios activa aún)

**Contexto corregido:** el club opera en Altos Mirandinos, estado Miranda, Venezuela — no en Colombia. Esto afecta directamente la sección "Recursos Útiles" y cualquier referencia legal (ver checklist pre-desarrollo, sección de tema legal, pendiente de corrección).

**Decisión de diseño (actualizada):** se autoriza replicar la **estructura y patrones de layout** de SBikers.com — header con topbar de contacto, grid de "features" con íconos, divisor tipo "wave" (curva SVG), estilo de botones con hover — siempre que se re-skinee completamente con la paleta y tipografía del brief (`--nr-*`, ámbar/oscuro), y que el copy/navegación siga el contenido ya definido en `wireframe.mermaid` y `copy-secciones.md` (no los ítems de nav de SBikers como "Vídeos/Eventos/ForoRider/CholloRider", salvo que se apruebe explícitamente agregar esas secciones al wireframe).

**Fuera de alcance — Fase 1:**
- Pasarela de pagos / cobros de membresía
- Geolocalización en tiempo real para la Red de Emergencias
- Marketplace transaccional completo de comercios aliados (solo directorio estático)
- App móvil nativa

---

## 2. Arquitectura y stack autorizado

| Capa | Herramienta | Notas |
|---|---|---|
| Frontend | React (Vite, no Create React App — más rápido y liviano) | — |
| Estilos | CSS con variables (paleta del brief) o Tailwind CSS | Preferir Tailwind si el equipo se siente cómodo — acelera el desarrollo en 1 semana |
| Backend / CMS | Strapi (self-hosted, open source, gratuito) | Da admin panel + CRUD + autenticación sin construirlos a mano |
| Base de datos | SQLite en desarrollo local → **Postgres gratuito** (Supabase o Neon) en producción | SQLite no persiste bien en hosting gratuito de backend (ver sección hosting) |
| Hosting frontend | Vercel o Netlify (capa gratuita) | Ideal para React estático/SSR ligero |
| Hosting backend | Render.com (Web Service free tier) | Ver advertencia de "cold starts" abajo |
| Autenticación | Provista por Strapi (Users & Permissions plugin, incluido gratis) | No reconstruir auth desde cero |

Cualquier librería, servicio o plugin no listado aquí requiere aprobación antes de agregarse (control de presupuesto $0). Esto incluye Tailwind CSS: si se decide usarlo, debe aplicarse de forma consistente en **todos** los componentes, no mezclado con estilos inline en unos sí y otros no.

### ⚠️ Advertencia de hosting backend gratuito
Los planes gratuitos de backend (Render, Fly.io, etc.) suelen "dormir" el servidor tras inactividad, causando que la primera carga tras un tiempo sin uso tarde 30-60 segundos. Es aceptable para una maqueta/demo, pero debe comunicarse como limitación conocida — no es un bug.

---

## 3. Convenciones de nomenclatura

- **Componentes React:** PascalCase, un componente por archivo. Ej: `HeroSection.jsx`, `BeeCard.jsx`
- **Carpetas de componentes:** organizadas por sección del wireframe, no por tipo genérico. Ej: `components/Hero/`, `components/Enjambre/`, no `components/buttons/`, `components/cards/` sueltos sin contexto
- **Content-types en Strapi:** singular, minúscula. Ej: `articulo`, `socio`, `recurso`
- **Variables CSS de la paleta:** prefijo `--nr-` (Neblina Riders). Ej: `--nr-ambar-primario: #F5A524;`
- **Rutas de la API (Strapi REST):** las genera Strapi automáticamente a partir del content-type — no renombrar manualmente salvo necesidad justificada

---

## 4. Reglas de diseño

*(Referencia completa: `brief-diseno.md`)*

- Paleta fija: fondo oscuro (`#14161A`/`#1F2229`), ámbar primario (`#F5A524`) solo para CTAs y elementos "Bee", rojo (`#E5484D`) solo para Red de Emergencias.
- Tipografía: Oswald/Bebas Neue (títulos), Inter (cuerpo) — cargarlas vía Google Fonts o autohospedadas si se prioriza performance.
- Definir la paleta como **variables CSS globales** (o config de Tailwind) desde el primer commit, no como valores hardcodeados por componente — así un cambio de color no implica editar 20 archivos.
- Todo fondo con imagen lleva overlay oscuro 40-60%.

---

## 5. Reglas de contenido

- Tono: cercano y comunitario, sin jerga motociclística excesiva.
- Artículos: mínimo 300 palabras, imagen destacada obligatoria, gestionados desde el panel admin de Strapi (no hardcodeados en el frontend).
- Publicidad/patrocinios: marcada visualmente como "espacio publicitario", separada del contenido editorial.
- Ningún texto placeholder (`[PENDIENTE]` en `copy-secciones.md`) se sube a producción sin reemplazo — el frontend debe poder mostrar "Contenido próximamente" en vez de romperse si un campo viene vacío desde Strapi.

---

## 6. Datos de usuarios y privacidad

- Datos mínimos de registro: nombre, apellido, correo, contraseña — gestión de hash delegada a Strapi (Users & Permissions), **no implementar hashing manual**.
- No exponer el listado completo de socios ni sus correos vía API pública — restringir permisos en Strapi (rol `Authenticated` vs `Public`) desde el día 1.
- Checkbox de aceptación de política de datos obligatorio en el formulario de registro del frontend.

---

## 7. Flujo de trabajo

- Roles mínimos: 1 responsable de frontend, 1 responsable de backend/Strapi (puede ser la misma persona), 1 responsable de contenido.
- Cambios de estructura (nueva sección) se reflejan primero en el wireframe antes de crear componentes nuevos.
- Variables de entorno (URLs de API, claves) **nunca se suben al repositorio** — usar `.env` + `.gitignore` desde el primer commit.
- **Checklist antes de publicar cualquier cambio:**
  - [ ] Revisado en mobile y desktop
  - [ ] Formulario de registro probado end-to-end contra el backend real (no mock)
  - [ ] Enlaces de "Recursos Útiles" verificados
  - [ ] Permisos de API revisados (nadie puede editar contenido sin login de admin)

---

## 8. Roadmap post-maqueta

- Migrar backend a un plan de hosting pago si el "cold start" gratuito afecta la experiencia de socios reales.
- Comprar dominio propio para frontend y backend.
- Activar lógica real de anuncios en el espacio ya reservado.
- Evaluar CDN de imágenes (ej. Cloudinary free tier) si el volumen de fotos de socios crece.