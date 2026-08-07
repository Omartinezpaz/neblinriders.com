import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Pin } from 'lucide-react';
import { getForoTemas, getForoStats } from '../../services/api';
import NuevoTemaModal from './NuevoTemaModal';
import './ForoBiker.css';

const CATEGORIAS = [
  { key: 'todas', label: '🔥 Todas', emoji: '🔥' },
  { key: 'Las Motos y la Mecánica', label: '🔧 Las Motos y la Mecánica', emoji: '🔧' },
  { key: 'Rutas, Eventos y Quedadas', label: '🏍️ Rutas, Eventos y Quedadas', emoji: '🏍️' },
  { key: 'Taller, Equipo y Consejos', label: '🛡️ Taller, Equipo y Consejos', emoji: '🛡️' },
  { key: 'La Vida Biker', label: '💬 La Vida Biker', emoji: '💬' },
  { key: 'Nuevos Miembros', label: '👋 Nuevos Miembros', emoji: '👋' },
];

const STRAPI_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

function getAvatarUrl(autor) {
  if (!autor) return null;
  const avatar = autor.avatar;
  if (!avatar) return null;
  const url = avatar.url || avatar?.formats?.thumbnail?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function getInitial(autor) {
  if (!autor) return '?';
  const name = autor.apodo || autor.username || '';
  return name.charAt(0).toUpperCase() || '?';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `Hace ${diffD}d`;
  return d.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ForoBiker() {
  const [temas, setTemas] = useState([]);
  const [stats, setStats] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });
  const [showNuevoTema, setShowNuevoTema] = useState(false);
  const [fetchedKey, setFetchedKey] = useState(null);

  useEffect(() => {
    getForoStats().then(setStats);
  }, []);

  // Derived loading: true when current filters don't match last fetched filters
  const currentKey = `${categoriaActiva}:${page}`;
  const loading = fetchedKey !== currentKey;

  useEffect(() => {
    let ignore = false;
    const key = `${categoriaActiva}:${page}`;
    getForoTemas(categoriaActiva, page, 10).then(result => {
      if (!ignore) {
        setTemas(result.data || []);
        setPagination(result.meta?.pagination || { page: 1, pageCount: 1, total: 0 });
        setFetchedKey(key);
      }
    });
    return () => { ignore = true; };
  }, [categoriaActiva, page]);

  const handleCategoriaChange = (cat) => {
    setCategoriaActiva(cat);
    setPage(1);
  };

  const handleTemaCreado = () => {
    setShowNuevoTema(false);
    setCategoriaActiva('todas');
    setPage(1);
    // Force re-fetch by invalidating the fetched key
    setFetchedKey(null);
  };

  return (
    <section className="foro-page">
      <div className="foro-header">
        <h1>🐝 ForoBiker</h1>
        <p>Comparte experiencias, dudas y opiniones. Debates reales de riders.</p>
      </div>

      <div className="foro-controls">
        <div className="foro-categorias">
          {CATEGORIAS.map((cat) => {
            const count = stats[cat.key];
            return (
              <button
                key={cat.key}
                className={`foro-cat-btn ${categoriaActiva === cat.key ? 'active' : ''}`}
                onClick={() => handleCategoriaChange(cat.key)}
              >
                {cat.label} {count !== undefined && <span className="cat-count">· {count} temas</span>}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="foro-empty">
          <p>Cargando temas del foro...</p>
        </div>
      ) : temas.length === 0 ? (
        <div className="foro-empty">
          <div className="foro-empty-icon">💬</div>
          <p>No hay temas disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="foro-temas-list">
          {temas.map((tema) => {
            const autor = tema.autor;
            const avatarUrl = getAvatarUrl(autor);
            const respuestasCount = tema.respuestas?.count ?? tema.respuestas?.length ?? 0;

            return (
              <Link
                to={`/foro/${tema.documentId || tema.id}`}
                key={tema.documentId || tema.id}
                className={`foro-tema-card ${tema.fijado ? 'fijado' : ''}`}
              >
                <div className="foro-tema-avatar">
                  {avatarUrl ? (
                    <img src={encodeURI(avatarUrl)} alt={autor?.apodo || autor?.username || ''} />
                  ) : (
                    <span className="initial">{getInitial(autor)}</span>
                  )}
                </div>

                <div className="foro-tema-body">
                  <div className="foro-tema-titulo">
                    {tema.fijado && <Pin size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle', color: 'var(--nr-ambar-primario)' }} />}
                    {tema.titulo}
                  </div>
                  <div className="foro-tema-meta">
                    <span className={`foro-tema-cat-badge cat-todas`}>
                      {CATEGORIAS.find(c => c.key === tema.categoria)?.emoji || '💬'} {tema.categoria?.replace('_', ' ')}
                    </span>
                    <span className="autor-info">
                      @{autor?.apodo || autor?.username || 'anónimo'}
                      {(autor?.role?.name === 'Moderator' || autor?.role?.name === 'Admin') && <span className="mod-badge">Mod</span>}
                    </span>
                    <span className="actividad-info">Última act. {formatDate(tema.updatedAt || tema.createdAt)}</span>
                  </div>
                </div>

                <div className="foro-tema-stats">
                  <span className="count">{respuestasCount}</span>
                  <span className="label">
                    <MessageSquare size={12} /> resp.
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination.pageCount > 1 && (
        <div className="foro-pagination">
          <button
            className="foro-page-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Anterior
          </button>
          <span className="foro-page-info">
            Página {pagination.page} de {pagination.pageCount}
          </span>
          <button
            className="foro-page-btn"
            disabled={page >= pagination.pageCount}
            onClick={() => setPage(p => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal Nuevo Tema */}
      {showNuevoTema && (
        <NuevoTemaModal
          onClose={() => setShowNuevoTema(false)}
          onCreated={handleTemaCreado}
        />
      )}
    </section>
  );
}
