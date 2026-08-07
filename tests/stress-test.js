/**
 * ============================================================
 * NEBLINA RIDERS — Pruebas de Estrés (Stress Test)
 * ============================================================
 * Script Node.js sin dependencias externas.
 * Lanza requests concurrentes contra los endpoints críticos
 * y mide latencia promedio, p95, p99 y tasa de errores.
 *
 * Uso: node tests/stress-test.js
 * 
 * Configuración por defecto:
 *   - 50 requests concurrentes × 5 rondas = 250 requests por endpoint
 *   - Endpoints públicos de lectura
 * ============================================================
 */

const BASE_URL = process.env.API_URL || 'http://localhost:1337/api';

const CONFIG = {
  concurrency: 50,       // Requests simultáneos por ronda
  rounds: 5,             // Número de rondas
  delayBetweenRounds: 500, // ms entre rondas
};

const ENDPOINTS = [
  { name: 'GET /articulos', method: 'GET', path: '/articulos?fields[0]=titulo&fields[1]=slug&fields[2]=resumen&fields[3]=categoria&fields[4]=publishedAt&populate[imagenDestacada][fields][0]=url&populate[imagenDestacada][fields][1]=formats&sort[0]=publishedAt:desc&pagination[pageSize]=10' },
  { name: 'GET /miembros/activos', method: 'GET', path: '/miembros/activos' },
  { name: 'GET /publicidads', method: 'GET', path: '/publicidads?populate=*' },
  { name: 'GET /recursos', method: 'GET', path: '/recursos?populate=*' },
  { name: 'GET /foro-temas', method: 'GET', path: '/foro-temas?populate[autor][fields][0]=username&populate[respuestas][count]=true&pagination[pageSize]=10' },
];

// ---- Utilidades ----

function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, idx)];
}

function formatMs(ms) {
  return ms.toFixed(1) + 'ms';
}

async function singleRequest(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  const start = performance.now();
  try {
    const res = await fetch(url, { method: endpoint.method });
    const elapsed = performance.now() - start;
    return { ok: res.ok, status: res.status, elapsed, error: null };
  } catch (err) {
    const elapsed = performance.now() - start;
    return { ok: false, status: 0, elapsed, error: err.message };
  }
}

async function runEndpointTest(endpoint) {
  const results = [];
  
  for (let round = 1; round <= CONFIG.rounds; round++) {
    const promises = Array.from({ length: CONFIG.concurrency }, () => singleRequest(endpoint));
    const roundResults = await Promise.all(promises);
    results.push(...roundResults);
    
    if (round < CONFIG.rounds) {
      await new Promise(r => setTimeout(r, CONFIG.delayBetweenRounds));
    }
  }

  // Calcular métricas
  const latencies = results.map(r => r.elapsed).sort((a, b) => a - b);
  const errors = results.filter(r => !r.ok);
  const totalRequests = results.length;
  const totalTime = latencies.reduce((sum, l) => sum + l, 0);

  return {
    endpoint: endpoint.name,
    totalRequests,
    successCount: totalRequests - errors.length,
    errorCount: errors.length,
    errorRate: ((errors.length / totalRequests) * 100).toFixed(1) + '%',
    avgLatency: formatMs(totalTime / totalRequests),
    minLatency: formatMs(latencies[0] || 0),
    maxLatency: formatMs(latencies[latencies.length - 1] || 0),
    p50: formatMs(percentile(latencies, 50)),
    p95: formatMs(percentile(latencies, 95)),
    p99: formatMs(percentile(latencies, 99)),
    reqPerSec: ((totalRequests / (totalTime / 1000))).toFixed(1),
    errors: errors.length > 0
      ? [...new Set(errors.map(e => e.error || `HTTP ${e.status}`))].slice(0, 3)
      : [],
  };
}

// ---- Main ----

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🏍️  NEBLINA RIDERS — Pruebas de Estrés');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Base URL:     ${BASE_URL}`);
  console.log(`  Concurrencia: ${CONFIG.concurrency} requests simultáneos`);
  console.log(`  Rondas:       ${CONFIG.rounds}`);
  console.log(`  Total:        ${CONFIG.concurrency * CONFIG.rounds} requests por endpoint`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // Verificar que el servidor está corriendo
  try {
    const healthCheck = await fetch(`${BASE_URL}/articulos?pagination[pageSize]=1`);
    if (!healthCheck.ok) throw new Error(`HTTP ${healthCheck.status}`);
    console.log('✅ Servidor respondiendo. Iniciando pruebas...\n');
  } catch (err) {
    console.error(`❌ No se puede conectar a ${BASE_URL}`);
    console.error(`   Error: ${err.message}`);
    console.error('   Asegúrate de que Strapi esté corriendo: cd backend && npm run dev');
    process.exit(1);
  }

  const allResults = [];

  for (const endpoint of ENDPOINTS) {
    process.stdout.write(`  🔄 Probando ${endpoint.name}...`);
    const result = await runEndpointTest(endpoint);
    allResults.push(result);
    console.log(` ✅ (avg: ${result.avgLatency}, p95: ${result.p95}, errores: ${result.errorRate})`);
  }

  // Mostrar resultados
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  📊 RESULTADOS');
  console.log('═══════════════════════════════════════════════════════');

  // Tabla ASCII
  const header = '| Endpoint                  | Requests | Avg     | p50     | p95     | p99     | Errores | req/s  |';
  const sep =    '|---------------------------|----------|---------|---------|---------|---------|---------|--------|';
  console.log(header);
  console.log(sep);

  for (const r of allResults) {
    const name = r.endpoint.padEnd(25);
    const reqs = String(r.totalRequests).padStart(8);
    const avg = r.avgLatency.padStart(7);
    const p50 = r.p50.padStart(7);
    const p95 = r.p95.padStart(7);
    const p99 = r.p99.padStart(7);
    const errs = r.errorRate.padStart(7);
    const rps = r.reqPerSec.padStart(6);
    console.log(`| ${name} | ${reqs} | ${avg} | ${p50} | ${p95} | ${p99} | ${errs} | ${rps} |`);
  }
  console.log(sep);

  // Resumen
  const totalReqs = allResults.reduce((s, r) => s + r.totalRequests, 0);
  const totalErrors = allResults.reduce((s, r) => s + r.errorCount, 0);
  console.log(`\n  Total: ${totalReqs} requests, ${totalErrors} errores (${((totalErrors/totalReqs)*100).toFixed(1)}%)`);

  // Generar archivo de resultados
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const mdContent = generateMarkdownReport(allResults, timestamp);
  
  const fs = await import('fs');
  const path = await import('path');
  
  const resultsDir = path.join(process.cwd(), 'tests');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const resultsPath = path.join(resultsDir, 'stress-results.md');
  fs.writeFileSync(resultsPath, mdContent, 'utf-8');
  console.log(`\n  📄 Reporte guardado en: ${resultsPath}`);

  const jsonPath = path.join(resultsDir, 'stress-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ timestamp, config: CONFIG, results: allResults }, null, 2), 'utf-8');
  console.log(`  📄 Datos crudos en:     ${jsonPath}`);

  console.log('\n═══════════════════════════════════════════════════════\n');

  // Exit code: 1 si hay más de 5% de errores
  const globalErrorRate = (totalErrors / totalReqs) * 100;
  if (globalErrorRate > 5) {
    console.error('⚠️  Tasa de errores superior al 5%. Revisar estabilidad del servidor.');
    process.exit(1);
  }
}

function generateMarkdownReport(results, timestamp) {
  const lines = [
    '# 🏍️ Neblina RIDERS — Reporte de Pruebas de Estrés',
    '',
    `**Fecha:** ${new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    `**Servidor:** ${BASE_URL}`,
    `**Concurrencia:** ${CONFIG.concurrency} requests simultáneos × ${CONFIG.rounds} rondas = ${CONFIG.concurrency * CONFIG.rounds} requests/endpoint`,
    '',
    '---',
    '',
    '## Resultados por Endpoint',
    '',
    '| Endpoint | Requests | Avg | p50 | p95 | p99 | Errores | req/s |',
    '|----------|----------|-----|-----|-----|-----|---------|-------|',
  ];

  for (const r of results) {
    lines.push(`| ${r.endpoint} | ${r.totalRequests} | ${r.avgLatency} | ${r.p50} | ${r.p95} | ${r.p99} | ${r.errorRate} | ${r.reqPerSec} |`);
  }

  const totalReqs = results.reduce((s, r) => s + r.totalRequests, 0);
  const totalErrors = results.reduce((s, r) => s + r.errorCount, 0);

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Resumen');
  lines.push('');
  lines.push(`- **Total de Requests:** ${totalReqs}`);
  lines.push(`- **Total de Errores:** ${totalErrors} (${((totalErrors/totalReqs)*100).toFixed(1)}%)`);
  lines.push(`- **Umbral de Alerta:** >5% de errores`);
  lines.push('');

  // Veredicto
  const globalErrorRate = (totalErrors / totalReqs) * 100;
  if (globalErrorRate === 0) {
    lines.push('> [!TIP]');
    lines.push('> ✅ **PASS** — Todos los endpoints respondieron exitosamente bajo carga concurrente. El sistema es estable para el volumen de tráfico esperado en MVP.');
  } else if (globalErrorRate <= 5) {
    lines.push('> [!NOTE]');
    lines.push(`> ⚠️ **PASS con observaciones** — Tasa de errores del ${globalErrorRate.toFixed(1)}%. Aceptable para MVP pero monitorear en producción.`);
  } else {
    lines.push('> [!WARNING]');
    lines.push(`> ❌ **FAIL** — Tasa de errores del ${globalErrorRate.toFixed(1)}% supera el umbral del 5%. Investigar cuellos de botella antes de desplegar.`);
  }

  // Errores encontrados
  const allErrors = results.filter(r => r.errors.length > 0);
  if (allErrors.length > 0) {
    lines.push('');
    lines.push('## Errores Detectados');
    lines.push('');
    for (const r of allErrors) {
      lines.push(`- **${r.endpoint}:** ${r.errors.join(', ')}`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Interpretación');
  lines.push('');
  lines.push('| Métrica | Significado |');
  lines.push('|---------|-------------|');
  lines.push('| **Avg** | Tiempo de respuesta promedio |');
  lines.push('| **p50** | Mediana — 50% de requests fueron más rápidos |');
  lines.push('| **p95** | 95% de requests terminaron antes de este tiempo |');
  lines.push('| **p99** | 99% de requests — detecta outliers extremos |');
  lines.push('| **req/s** | Requests por segundo sostenidos |');
  lines.push('');

  return lines.join('\n');
}

main().catch(err => {
  console.error('Error fatal en stress test:', err);
  process.exit(1);
});
