# 🏍️ Neblina RIDERS — Release Notes v1.0.0-MVP

**Fecha de Release:** Agosto 2026  
**Estado:** MVP (Producto Mínimo Viable)  
**Entornos:** Producción (Render + Vercel + Cloudflare)  

---

## 🎯 Resumen del MVP

La versión 1.0.0 establece la plataforma fundacional de la comunidad **Neblina RIDERS**, diseñada específicamente para motorizados en los Altos Mirandinos y toda Venezuela. 

Esta versión se enfoca en tres pilares:
1. **Contenido:** Noticias, artículos y recursos útiles.
2. **Comunidad:** El "ForoBiker" y la vitrina de "Miembros Activos".
3. **Privacidad & Seguridad:** Adaptación a la legislación venezolana y protección de datos (Ficha de Emergencia).

---

## ✨ Nuevas Funcionalidades (Features)

### 1. ForoBiker (Red Social Interna)
- **Hilos de discusión:** Creación de temas con soporte de texto enriquecido.
- **Categorías especializadas:** Rutas y Rodadas, Mecánica, Equipamiento, General, Emergencias y Alertas.
- **Sistema de respuestas:** Interacción fluida entre miembros registrados.
- **Moderación básica:** Soporte para "Fijar" (Pin) y "Cerrar" temas.
- **Permisos:** Lectura pública para atraer tráfico (SEO), escritura restringida a usuarios verificados.

### 2. Perfiles y Fichas de Emergencia (Privacidad Primero)
- **Autenticación Segura:** JWT tokens con manejo local.
- **Ficha Médica Vital:** Tipo de sangre, alergias y contacto de emergencia almacenados de forma privada.
- **Datos de la Moto:** Marca, modelo, año y placa.
- **Privacidad "Regla 6":** Estricto aislamiento de PII (Personally Identifiable Information). La lista de "Miembros Activos" expone exclusivamente: `username`, `apodo` y `avatar`.

### 3. Noticias y Recursos
- **CMS Integrado:** Panel de administración robusto vía Strapi 5.
- **Rich Text:** Artículos formateados dinámicamente en el frontend.
- **Recursos Útiles VZLA:** Enlaces directos a entidades nacionales (INTT, SUDEASEG) y ordenanzas municipales.

### 4. Sistema de Monetización
- **Publicidad Dinámica:** Banners de patrocinantes que rotan automáticamente cada 30 segundos (`EspacioPublicitario`).

---

## 🛠️ Stack Tecnológico & Arquitectura

El proyecto adopta un enfoque **Lean (PaaS-First)** para maximizar la velocidad de iteración y minimizar costos iniciales de infraestructura:

- **Frontend:** React (Vite.js) + Vanilla CSS
- **Backend (Headless CMS):** Strapi 5 (Node.js)
- **Base de Datos:** PostgreSQL (Neon/Supabase)
- **Hosting:** 
  - Frontend → Vercel (Edge Network)
  - Backend → Render.com (Web Service)
- **Infraestructura de Borde (Edge):** Cloudflare (DNS, SSL Strict, DDoS Protection, Caché).

### Estética y UX/UI
- **Diseño "Dark Elite":** Paleta de colores HSL con fondo profundo (`#14161A`) y acento ámbar (`#F5A524`).
- **Microinteracciones:** Efectos hover, zoom in en avatares (1.28x), destellos dinámicos (Glow Lines).

---

## 🧪 Rendimiento y Pruebas de Estrés

Se ejecutaron pruebas de estrés locales para validar la resistencia del stack frente a picos de tráfico.

**Condiciones de la prueba:**
- 50 usuarios concurrentes
- 5 rondas consecutivas (250 requests por endpoint)
- Hardware: Localhost

**Resultados Destacados:**
- **Tasa de éxito:** 99.8% (solo 0.2% de error bajo carga sostenida).
- **Latencia:** Endpoints críticos de la comunidad (`/miembros/activos`) respondieron con una mediana (p50) de **~850ms**.
- **Optimización post-prueba:** Se optimizó el endpoint `/articulos` (población selectiva + paginación estricta) para reducir el p95 original.

---

## 🔒 Seguridad y Cumplimiento Normativo (Venezuela)

1. **Habeas Data (Art. 28 de la CRBV):** El usuario tiene acceso total y control para editar/eliminar sus datos a través de su Perfil Biker.
2. **Ley Especial contra Delitos Informáticos:** Implementación de HTTPS en tránsito, JWT para autorización, y HSTS (Strict-Transport-Security) en Vercel.
3. **Caché Cero para Datos Sensibles:** Reglas de Cloudflare configuradas explícitamente con `Bypass` para la API REST, garantizando que los datos privados nunca sean cacheados en servidores intermedios.

---

## 🚀 Próximos Pasos (Roadmap Post-MVP)
- Implementación de WebSockets para notificaciones en tiempo real en el Foro.
- Desarrollo del módulo "GangaBiker" (Compra/Venta).
- Galería multimedia colaborativa (Subida de videos/fotos de rodadas).
- Migración a VPS propio una vez el tráfico supere la capa gratuita del PaaS.
