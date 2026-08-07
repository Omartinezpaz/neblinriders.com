# Neblina RIDERS — Landing Page
## Brief de Diseño + Recomendación Técnica

*Documento de apoyo para maqueta — Plazo de presentación: 02/08/2026*

---

## 1. Brief de Diseño

### Concepto visual
El nombre "Neblina" (niebla) y la identidad "Enjambre/Bees" ya dan dos pistas visuales fuertes que conviene fusionar en vez de tratar como elementos separados:

- **Neblina** → atmósfera oscura, difusa, de carretera al amanecer/anochecer. Fotografía con contraluces, faros encendidos, siluetas.
- **Enjambre / Bees** → patrón de rayas ámbar-negro, sensación de comunidad/movimiento colectivo, calidez dentro de un entorno oscuro.

La combinación da un estilo **"moto club nocturno con acento de miel"**: fondo oscuro y sobrio (niebla/asfalto) roto por un color cálido de alta energía (panal/ámbar) que marca CTAs y elementos clave. Esto evita el cliché genérico de "rojo velocidad" y conecta directamente con el naming ya existente (BeeRider, Enjambre, Bees).

### Paleta de colores

| Uso | Color | Hex aprox. | Justificación |
|---|---|---|---|
| Fondo principal | Gris asfalto muy oscuro | `#14161A` | Base "niebla nocturna", reduce fatiga visual, resalta fotos |
| Fondo secundario | Gris carbón | `#1F2229` | Para tarjetas/bloques sobre el fondo principal |
| Acento primario (CTA) | Ámbar miel | `#F5A524` | Botones, links activos, íconos "Bee" — alto contraste sobre oscuro |
| Acento secundario | Ámbar oscuro / bronce | `#C97A1C` | Hover states, bordes, detalles secundarios |
| Texto principal | Blanco hueso | `#F2F0EA` | Legibilidad sobre fondo oscuro |
| Texto secundario | Gris niebla | `#9AA0A8` | Subtítulos, metadatos, texto de apoyo |
| Alerta/Emergencia | Rojo señal | `#E5484D` | Reservado solo para "Red de Emergencias", uso puntual |

**Nota:** paleta oscura reduce además el costo de producción de imágenes: fotos de motos con poca luz/contraluz disimulan mejor diferencias de calidad entre fotos de socios y stock gratuito, algo relevante dado el presupuesto $0.

### Tipografía

- **Titulares (H1/H2):** una fuente sans-serif condensada e industrial — ej. *Oswald*, *Bebas Neue* o *Rajdhani* (todas gratuitas en Google Fonts). Transmite velocidad/carácter sin costo de licencia.
- **Cuerpo de texto:** una sans-serif neutra y muy legible — ej. *Inter* o *Work Sans* (Google Fonts, gratuitas, buen soporte en WordPress/Elementor).
- **Evitar:** fuentes decorativas tipo "biker gótico" en bloques largos de texto; reservarlas, si acaso, solo para el logo/wordmark.

### Estilo visual general
- Fotografía con overlay oscuro (40-60% negro) para garantizar legibilidad del texto — ya contemplado en el Hero.
- Iconografía lineal simple (outline), color ámbar sobre fondo oscuro, para la sección "Bees" y "Recursos".
- Bordes redondeados suaves (8-12px) en tarjetas, evitando el estilo "brutalista" que puede sentirse frío para una comunidad.
- Micro-detalle de marca: un patrón sutil tipo panal (hexágonos) como textura de fondo en secciones de transición (ej. detrás de "El Enjambre"), sin saturar.

---

## 2. Wireframe / Mapa del sitio

Ver diagrama adjunto (`neblina-riders-wireframe.mermaid`) para la versión visual en bloques.

Versión jerárquica con prioridad visual (1 = máxima prioridad/tamaño, 3 = mínima):

```
Landing Page — Neblina RIDERS
│
├── 1. HERO [Prioridad 1 — full viewport height]
│   ├── Logo Neblina RIDERS
│   ├── Eslogan ("Donde la carretera se encuentra con la libertad")
│   ├── CTA primario: "Registrarme Gratis" (botón ámbar, máximo contraste)
│   └── Fondo: baner-4.jpg + overlay oscuro
│
├── 2. NAVEGACIÓN / ACCESO RÁPIDO [Prioridad 2 — grid de 11 ítems]
│   └── Grid de tarjetas pequeñas (íconos + texto corto):
│       Equipo de Protección · Elegir Moto · Conducción · Historia de Marcas ·
│       Mundo Biker · Tipos de Motos · Tecnología · Tips de Viajero ·
│       Frases de Motos · Galería · Nosotros
│
├── 3. "EL ENJAMBRE" — CTA [Prioridad 1 — banner ancho, alto contraste]
│   └── Texto + botón "Únete al Enjambre" (fondo con patrón panal)
│
├── 4. VALOR DIFERENCIAL / "BEES" [Prioridad 2 — 3 columnas iguales]
│   ├── Red de Servicios BeeRider
│   ├── Red de Emergencias (acento rojo puntual)
│   └── Apoyo Comunitario
│
├── 5. NOTICIAS Y ARTÍCULOS [Prioridad 2 — carrusel/grid 3 tarjetas]
│   └── Placeholders: "Diseño sin título (7)" y "(8)"
│
├── 6. RECURSOS ÚTILES [Prioridad 3 — lista de 4 enlaces con íconos]
│   └── Pago de impuestos · SOAT · Comparendos · Código de Tránsito
│
├── 7. ESPACIO PUBLICITARIO [Prioridad 3 — banner discreto]
│   └── Reservado para comercios aliados (inactivo en fase de lanzamiento)
│
└── 8. FOOTER [Prioridad 3 — franja fija inferior]
    ├── Contacto
    ├── Redes sociales
    └── Enlace "Nosotros"
```

---

## 3. Recomendación técnica

### Restricciones que definen la elección
- Presupuesto: **$0**
- Plazo: **1 semana** para tener una maqueta presentable
- Equipo: **sin desarrolladores permanentes** → la solución debe ser mantenible por alguien no técnico
- Necesidad futura: **espacio publicitario** para autofinanciarse
- Funcionalidad: **CRUD de artículos + CRUD/registro de usuarios con perfil**

### Recomendación: WordPress + Elementor (gratuitos) + hosting gratuito de lanzamiento

**Por qué WordPress (y no Laravel u otro framework a medida):**

| Requisito | WordPress | Desarrollo a medida (Laravel, etc.) |
|---|---|---|
| CRUD de artículos | Nativo (Entradas) — cero desarrollo | Hay que construirlo desde cero |
| CRUD de usuarios/socios | Nativo + plugin gratuito (ej. *Ultimate Member* o *Profile Builder*) para registro público y perfiles | Hay que construirlo desde cero |
| Tiempo de implementación | Días | Semanas (incompatible con el plazo de 1 semana) |
| Costo | $0 (tema + plugins gratuitos) | $0 en software, pero alto costo en horas de desarrollo |
| Mantenimiento sin equipo técnico | Panel visual, apto para no-programadores | Requiere conocimientos de código para cualquier cambio |
| Espacio publicitario futuro | Plugins gratuitos de gestión de anuncios (ej. *Advanced Ads*, o simplemente widgets + Google AdSense cuando esté listo) | Hay que programarlo |

Con el plazo de una semana, un desarrollo a medida no es viable salvo que ya exista una plantilla/base de código reutilizable. WordPress permite tener una maqueta funcional (no solo visual) en ese tiempo.

**Pila sugerida (costo $0):**
- **CMS:** WordPress (self-hosted)
- **Constructor visual:** Elementor (versión gratuita cubre el 90% de lo necesario aquí; el 10% restante —como el grid de accesos rápidos o el patrón panal— se puede lograr con CSS personalizado, sin costo)
- **Tema base:** un tema gratuito ligero y compatible con Elementor (ej. *Astra* o *Hello Elementor*), sobre el cual se aplica la paleta oscura/ámbar definida arriba
- **Registro y perfiles de socios:** plugin gratuito *Ultimate Member* (formularios de registro personalizables, perfiles, y control de contenido exclusivo para usuarios logueados)
- **Hosting de lanzamiento (gratis):** proveedores como *InfinityFree* o el trial gratuito de *Hostinger* permiten instalar WordPress sin costo para la fase de maqueta/demo. **Importante:** este tipo de hosting gratuito tiene limitaciones (rendimiento, dominio con subdominio del proveedor, publicidad del proveedor en algunos casos) — es válido para la maqueta de la próxima semana, pero **no se recomienda para el lanzamiento real al público**; ahí conviene evaluar un hosting pagado de bajo costo (~$3-5 USD/mes) una vez el club tenga los primeros ingresos por el espacio publicitario ya reservado en el diseño.
- **Dominio:** si no hay presupuesto aún, usar subdominio gratuito para la maqueta; priorizar la compra de un dominio propio (~$10-15 USD/año) en cuanto haya ingresos, ya que da mucha más credibilidad frente a un club que busca captar socios.

### Riesgo a comunicar
Con $0 y una semana, la maqueta será sólida en estructura y contenido, pero el hosting gratuito puede ser lento o tener cortes — vale la pena aclarar esto de entrada a quien reciba la presentación, y presentarlo explícitamente como "versión demo, no infraestructura final".
