# Cloudflare — Guía de Configuración (Plug & Play)

Guía paso a paso para activar Cloudflare como proxy DNS gratuito para Neblina RIDERS.

> **Prerequisito:** Necesitas un dominio propio registrado (ej. `neblinariders.com`).  
> Costo del dominio: ~$10-15 USD/año. Cloudflare es **gratis** (plan Free).

---

## Paso 1: Crear Cuenta en Cloudflare

1. Ve a [cloudflare.com](https://dash.cloudflare.com/sign-up)
2. Regístrate con tu correo
3. Plan: selecciona **Free** (0 USD/mes)

---

## Paso 2: Agregar tu Dominio

1. En el dashboard, clic en **"Add a Site"**
2. Escribe tu dominio: `neblinariders.com`
3. Selecciona el plan **Free**
4. Cloudflare escaneará tus registros DNS existentes

---

## Paso 3: Cambiar Nameservers

Cloudflare te dará 2 nameservers (ej. `aria.ns.cloudflare.com` y `ben.ns.cloudflare.com`).

1. Ve al panel de tu registrador de dominio (ej. Namecheap, Google Domains, GoDaddy)
2. Busca la sección **"Nameservers"** o **"DNS"**
3. Cambia los nameservers por los que te dio Cloudflare
4. Guarda y espera propagación (5-30 minutos, máximo 24h)

---

## Paso 4: Configurar Registros DNS

Una vez el dominio esté activo en Cloudflare, configura estos registros:

### Frontend (Vercel)
| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| CNAME | `@` (root) | `cname.vercel-dns.com` | ☁️ ON (naranja) |
| CNAME | `www` | `cname.vercel-dns.com` | ☁️ ON (naranja) |

### Backend (Render)
| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| CNAME | `api` | `[tu-app].onrender.com` | ☁️ ON (naranja) |

> **Importante:** El icono de nube naranja (Proxy ON) significa que Cloudflare intercepta el tráfico y aplica protección DDoS, caché y SSL. Déjalo activado.

---

## Paso 5: Configurar SSL

1. Ve a **SSL/TLS → Overview**
2. Selecciona modo: **Full (Strict)**
   - Esto encripta tanto Cloudflare↔Visitante como Cloudflare↔Render/Vercel
   - Tanto Render como Vercel generan certificados SSL automáticamente
3. En **Edge Certificates**, verifica que "Always Use HTTPS" esté **ON**
4. Activa **Automatic HTTPS Rewrites**

---

## Paso 6: Configurar Caché

1. Ve a **Caching → Configuration**
2. **Caching Level:** Standard
3. **Browser Cache TTL:** 4 hours (para assets estáticos)

### Page Rules (2 reglas en plan Free)

**Regla 1: No cachear la API**
- URL: `api.neblinariders.com/*`
- Setting: **Cache Level → Bypass**

**Regla 2: Cachear uploads/media**
- URL: `api.neblinariders.com/uploads/*`
- Setting: **Cache Level → Standard**, **Edge Cache TTL → 1 month**

---

## Paso 7: Seguridad

### DDoS Protection
- Activada **por defecto** en plan Free. No necesitas hacer nada.

### Bot Management
1. Ve a **Security → Bots**
2. Activa **Bot Fight Mode** → ON

### WAF (Firewall)
- Las reglas administradas de Cloudflare se aplican automáticamente en el plan Free.

### Security Level
1. Ve a **Security → Settings**
2. **Security Level:** Medium

---

## Paso 8: Configurar Dominio en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings → Domains**
3. Agrega: `neblinariders.com` y `www.neblinariders.com`
4. Vercel te pedirá verificar el DNS — ya está hecho en el Paso 4

---

## Paso 9: Configurar Dominio en Render

1. Ve a tu servicio en [render.com](https://render.com)
2. **Settings → Custom Domains**
3. Agrega: `api.neblinariders.com`
4. Render verificará el CNAME — ya está hecho en el Paso 4

---

## Paso 10: Actualizar Variables de Entorno

### Frontend (.env.production)
```
VITE_API_URL=https://api.neblinariders.com/api
```

### Backend (.env)
```
# Agregar para confiar en los headers de Cloudflare
CLOUDFLARE_PROXY=true
```

---

## Verificación Final

Después de la propagación DNS:

1. Abre `https://neblinariders.com` — debe cargar el frontend
2. Abre `https://api.neblinariders.com/api/articulos` — debe retornar JSON
3. Verifica el candado HTTPS en ambas URLs
4. En Cloudflare → **Analytics**, confirma que el tráfico pasa por el proxy

---

## Métricas del Plan Free de Cloudflare

| Feature | Incluido |
|---------|----------|
| DDoS Protection (L3/L4/L7) | ✅ Ilimitado |
| SSL/TLS | ✅ Universal |
| CDN Global (310+ PoPs) | ✅ |
| Page Rules | 3 reglas |
| Firewall Rules | 5 reglas |
| Bot Fight Mode | ✅ |
| Analytics | ✅ (últimas 24h) |
| Bandwidth | ✅ Ilimitado |
| Costo | **$0 USD/mes** |
