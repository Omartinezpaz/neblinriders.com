# 🏍️ Neblina RIDERS — Reporte de Pruebas de Estrés

**Fecha:** martes, 4 de agosto de 2026, 09:51 p. m.
**Servidor:** http://localhost:1337/api
**Concurrencia:** 50 requests simultáneos × 5 rondas = 250 requests/endpoint

---

## Resultados por Endpoint

| Endpoint | Requests | Avg | p50 | p95 | p99 | Errores | req/s |
|----------|----------|-----|-----|-----|-----|---------|-------|
| GET /articulos | 250 | 5600.2ms | 5409.1ms | 9229.4ms | 9713.4ms | 2.0% | 0.2 |
| GET /miembros/activos | 250 | 1043.4ms | 1023.7ms | 1562.6ms | 1690.0ms | 0.0% | 1.0 |
| GET /publicidads | 250 | 4045.9ms | 4022.3ms | 5413.4ms | 5727.4ms | 1.6% | 0.2 |
| GET /recursos | 250 | 3151.9ms | 3092.0ms | 4437.1ms | 4940.9ms | 1.6% | 0.3 |
| GET /foro-temas | 250 | 2888.0ms | 2875.4ms | 3989.0ms | 4211.3ms | 0.0% | 0.3 |

---

## Resumen

- **Total de Requests:** 1250
- **Total de Errores:** 13 (1.0%)
- **Umbral de Alerta:** >5% de errores

> [!NOTE]
> ⚠️ **PASS con observaciones** — Tasa de errores del 1.0%. Aceptable para MVP pero monitorear en producción.

## Errores Detectados

- **GET /articulos:** HTTP 500
- **GET /publicidads:** HTTP 500
- **GET /recursos:** HTTP 500

---

## Interpretación

| Métrica | Significado |
|---------|-------------|
| **Avg** | Tiempo de respuesta promedio |
| **p50** | Mediana — 50% de requests fueron más rápidos |
| **p95** | 95% de requests terminaron antes de este tiempo |
| **p99** | 99% de requests — detecta outliers extremos |
| **req/s** | Requests por segundo sostenidos |
