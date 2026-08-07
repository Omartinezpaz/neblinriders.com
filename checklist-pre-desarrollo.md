# Checklist Pre-Desarrollo — Neblina RIDERS (React + Strapi 5)

**Última actualización:** 2026-08-04  
**Estado General:** MVP Fase 1 — ForoBiker implementado, Cloudflare preparado, Stress Tests listos  
**Stack:** React (Vite) + Vanilla CSS (Dark Elite) + Strapi 5 (PostgreSQL)  

---

## 1. Accesos y Cuentas 🔴
- [x] **Node.js y npm** (Node 22 LTS instalado y verificado)
- [x] **Backend (Render.com)**: Archivo `backend/render.yaml` generado con CLOUDFLARE_PROXY
- [x] **Frontend (Vercel)**: Archivo `frontend/vercel.json` con SPA routing, HSTS y security headers
- [x] **Base de Datos**: PostgreSQL (Supabase/Neon) configurado en `backend/.env.example`
- [x] **Repositorio Git**: `.gitignore` actualizado y archivos `.env.example` creados
- [x] **InfinityFree (WordPress)**: Descartado (migrado a React + Strapi 5)

---

## 2. Assets Reales 🔴
- [x] **Logo de Neblina RIDERS**: Integrado en Header con tipografía oficial
- [x] **Hero Slider Dinámico**: `Hero.jsx` cargando fotos desde Strapi (`hero_slider`) con fallback HD
- [x] **Avatares de Miembros Activos**: `MiembrosActivos.jsx` con `encodeURI`, iniciales dinámicas y hover zoom 1.28x
- [x] **Publicidad Dinámica**: Banners rotando cada 30s en `EspacioPublicitario.jsx`
- [x] **Set de Íconos**: Lucide React integrado en todo el portal

---

## 3. Contenido y Copy Real 🟡
- [x] **Copy Secciones**: `copy-secciones.md` y `ValueProposition.jsx` actualizados
- [x] **Recursos Útiles de Venezuela**: Links oficiales (INTT, SUDEASEG, Alcaldías)
- [x] **Seeding Automático**: `backend/src/index.ts` auto-siembra Recursos, Noticias y permisos

---

## 4. Tema Legal y Privacidad (Venezuela) 🔴
- [x] **Marco Legal Venezolano**: Habeas Data Art. 28, Ley Especial Delitos Informáticos
- [x] **Checkbox de Política de Privacidad**: Obligatorio en `RegistroForm.jsx`
- [x] **Aviso Legal Red de Emergencias**: En `ValueProposition.jsx` y `Footer.jsx`
- [x] **Regla 6 de Privacidad**: Endpoint `/api/miembros/activos` sanitizado (solo username, apodo, avatar)
- [x] **Ficha de Emergencia**: `PerfilBikerModal.jsx` con datos médicos y de moto

---

## 5. Configuración Técnica Adicional 🟡
- [x] **Permisos de Roles en Strapi**: Auto-permisos públicos para Publicidad, ForoTema, ForoRespuesta
- [x] **Estética Dark Elite**: Paleta HSL, destello estrella, `.nr-glow-line`
- [x] **Cero Advertencias React**: Lazy State Initialization
- [x] **Rutas por Categoría**: `/categoria/:categoryKey` y `/articulo/:slug`

---

## 6. ForoBiker / Red Social 🟢 (NUEVO)
- [x] **Backend Content-Types**: `foro-tema` (5 categorías, fijado/cerrado, autor, respuestas) y `foro-respuesta` (contenido, autor, tema)
- [x] **Permisos**: Lectura pública, escritura solo autenticados
- [x] **Frontend Página Principal**: `ForoBiker.jsx` — filtro por categorías, paginación, tarjetas con avatares
- [x] **Frontend Detalle de Tema**: `ForoTemaDetalle.jsx` — post original, hilo de respuestas, formulario para responder
- [x] **Modal Nuevo Tema**: `NuevoTemaModal.jsx` — selección de categoría, título, contenido
- [x] **Navegación**: Link "Foro" en Header (ámbar), tarjeta clickeable en Features
- [x] **Rutas**: `/foro` y `/foro/:temaId` en `App.jsx`

---

## 7. Cloudflare (Preparado — Plug & Play) ⏳
- [x] **Guía de Configuración**: `docs/cloudflare-setup.md` (10 pasos detallados)
- [x] **Headers de Seguridad**: HSTS (1 año + preload), Referrer-Policy, Permissions-Policy en `vercel.json`
- [x] **Variable Backend**: `CLOUDFLARE_PROXY=true` en `render.yaml`
- [ ] **Activación**: Pendiente de compra de dominio propio

---

## 8. Pruebas de Estrés 🧪
- [x] **Script de Carga**: `tests/stress-test.js` — 50 requests concurrentes × 5 rondas por endpoint
- [x] **Endpoints Cubiertos**: articulos, miembros/activos, publicidads, recursos, foro-temas
- [x] **Métricas**: avg, p50, p95, p99, errores, req/s
- [x] **Reportes**: Genera `stress-results.md` y `stress-results.json`
- [x] **Ejecución**: Completada con éxito (0.2% de errores, 1250 requests)

---

## 9. Antes del Despliegue Público 🟡
- [x] **Pruebas E2E en Local**: Registro, Login, Logout, Ficha de Emergencia, Carrusel, Hero, Miembros, Foro
- [x] **Compatibilidad Strapi 5**: Respuestas aplanadas soportadas en todos los componentes
- [ ] **Despliegue a Producción**: Push a GitHub → Render.com (Backend) + Vercel (Frontend)
