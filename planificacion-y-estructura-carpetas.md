# Estructura de Carpetas y Planificación — Neblina RIDERS (React + Strapi)

## 1. Estructura de carpetas del proyecto (monorepo)

Con React + Strapi tienes dos aplicaciones separadas (frontend y backend). Lo más simple de mantener para un equipo pequeño es un **monorepo**: un solo repositorio con ambas carpetas, en vez de dos repos separados que hay que sincronizar.

```
neblina-riders/
│
├── docs/
│   ├── brief-diseno.md
│   ├── wireframe.mermaid
│   ├── project-rules.md
│   └── planificacion.md             # este documento
│
├── frontend/                        # React (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero/
│   │   │   ├── AccesoRapido/
│   │   │   ├── Enjambre/
│   │   │   ├── Bees/
│   │   │   ├── Noticias/
│   │   │   ├── Recursos/
│   │   │   ├── EspacioPublicitario/
│   │   │   └── Footer/
│   │   ├── pages/                   # Home, Registro, Login, Perfil, Nosotros
│   │   ├── styles/
│   │   │   └── variables.css        # paleta y tipografía del brief como variables CSS
│   │   ├── services/
│   │   │   └── api.js               # llamadas a la API de Strapi
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── assets/                  # logo, favicon, imágenes estáticas del sitio
│   ├── .env                         # URL del backend (no se sube al repo)
│   └── package.json
│
├── backend/                         # Strapi
│   ├── src/
│   │   └── api/
│   │       ├── articulo/            # content-type: Noticias y Artículos
│   │       ├── socio/               # extiende el modelo de usuario si hace falta
│   │       └── recurso/             # content-type: Recursos Útiles
│   ├── config/
│   ├── .env                         # credenciales de base de datos (no se sube al repo)
│   └── package.json
│
├── content/
│   └── copy-secciones.md            # textos reales — se cargan manualmente en Strapi, no en el código
│
├── .gitignore                       # incluye .env, node_modules de ambas apps
└── README.md                        # cómo levantar frontend y backend en local
```

**Por qué esta estructura:**
- Separar `frontend/` y `backend/` como carpetas independientes (cada una con su propio `package.json`) permite desplegarlas por separado (Vercel para frontend, Render para backend) sin que se pisen configuraciones.
- `styles/variables.css` centraliza la paleta del brief en un solo lugar — evita que el ámbar o el oscuro queden hardcodeados en 15 componentes distintos.
- `content/copy-secciones.md` sigue siendo la referencia de texto, pero el contenido real vive en Strapi (base de datos), no en archivos del frontend.

---

## 2. Planificación — Sprint de 1 semana (React + Strapi)

Con este stack, el sprint cambia respecto a la versión de WordPress: hay más piezas técnicas que montar antes de poder maquetar visualmente. Ajusto el plan para reflejarlo con honestidad — es más apretado que con WordPress.

| Día | Foco | Entregable del día |
|---|---|---|
| **Día 1** | Setup backend | Strapi instalado localmente, content-types creados (`articulo`, `recurso`), base de datos configurada, admin panel accesible |
| **Día 2** | Setup frontend + sistema de diseño | Proyecto React (Vite) creado, `variables.css` con la paleta/tipografía del brief, conectado al backend local |
| **Día 3** | Maquetación bloques 1-4 | Hero, Acceso Rápido, "El Enjambre", "Bees" construidos como componentes React (con datos reales o placeholder) |
| **Día 4** | Maquetación bloques 5-8 | Noticias (consumiendo la API de Strapi), Recursos, Espacio Publicitario, Footer |
| **Día 5** | Registro y login de socios | Formulario de registro/login conectado a la autenticación de Strapi, perfil básico accesible tras login |
| **Día 6** | Despliegue | Backend desplegado en Render, frontend desplegado en Vercel/Netlify, apuntando el frontend a la URL real del backend |
| **Día 7** | QA y presentación | Checklist del `project-rules.md` revisado, pruebas en mobile/desktop, demo lista para presentar |

### Riesgos principales de este plan (a diferencia del plan con WordPress)

1. **Día 1 y 2 son más técnicos** que instalar WordPress — si quien lo hace no tiene experiencia previa con Node.js/React, es fácil que tomen más de un día cada uno. Si esto pasa, el primer recorte razonable es el Día 6 (despliegue): puedes presentar la demo corriendo en local (`localhost`) en vez de desplegada, y desplegar después de la presentación.
2. **El "cold start" del backend gratuito** (mencionado en `project-rules.md`) puede hacer que la demo en vivo tarde unos segundos en la primera carga — vale la pena "despertar" el backend un par de minutos antes de presentar.
3. **Compará esto contra el plan de WordPress:** si el Día 1 se atrasa mucho, es una señal legítima de que, para el plazo de una semana específicamente, WordPress seguía siendo la opción más rápida — no hay nada de malo en reconsiderarlo a mitad de camino si el tiempo aprieta.
