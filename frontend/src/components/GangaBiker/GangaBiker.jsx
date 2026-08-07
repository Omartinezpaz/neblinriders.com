import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { getGangas } from '../../services/api';
import NuevaGangaModal from './NuevaGangaModal';
import './GangaBiker.css';

const CATEGORIAS = [
  { key: 'todas', label: '🏷️ Todas' },
  { key: 'Moto', label: '🏍️ Motos' },
  { key: 'Casco', label: '🪖 Cascos' },
  { key: 'Indumentaria', label: '🧥 Indumentaria' },
  { key: 'Repuestos', label: '⚙️ Repuestos' },
  { key: 'Accesorios', label: '🎒 Accesorios' },
];

const STRAPI_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

function getAvatarUrl(autor) {
  if (!autor || !autor.avatar) return null;
  const url = autor.avatar.url || autor.avatar?.formats?.thumbnail?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function getInitial(autor) {
  if (!autor) return '?';
  const name = autor.apodo || autor.username || '';
  return name.charAt(0).toUpperCase() || '?';
}

function getFirstImageUrl(fotos) {
  if (!fotos || fotos.length === 0) return null;
  const foto = fotos[0];
  const url = foto.formats?.medium?.url || foto.formats?.small?.url || foto.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export default function GangaBiker({ user }) {
  const [gangas, setGangas] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });
  const [showNuevaGanga, setShowNuevaGanga] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [fetchedKey, setFetchedKey] = useState(null);

  const currentKey = `${categoriaActiva}:${page}`;
  const loading = fetchedKey !== currentKey;

  useEffect(() => {
    let ignore = false;
    const key = `${categoriaActiva}:${page}`;
    getGangas(categoriaActiva, page, 12).then(result => {
      if (!ignore) {
        setGangas(result.data || []);
        setPagination(result.meta?.pagination || { page: 1, pageCount: 1, total: 0 });
        setFetchedKey(key);
      }
    });
    return () => { ignore = true; };
  }, [categoriaActiva, page, refreshCounter]);

  const handleCategoriaChange = (cat) => {
    setCategoriaActiva(cat);
    setPage(1);
  };

  const handleGangaCreada = () => {
    setShowNuevaGanga(false);
    setCategoriaActiva('todas');
    setPage(1);
    setRefreshCounter(c => c + 1); // trigger re-fetch reliably
  };

  return (
    <section className="ganga-page nr-glow-line">
      <div className="ganga-header">
        <h1>🏷️ GangaBiker</h1>
        <p>Compra y venta de equipamiento entre miembros de la comunidad.</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--nr-texto-secundario)', marginTop: '0.5rem' }}>* Precios referenciales en USD</p>
      </div>

      <div className="ganga-controls">
        <div className="ganga-categorias">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.key}
              className={`ganga-cat-btn ${categoriaActiva === cat.key ? 'active' : ''}`}
              onClick={() => handleCategoriaChange(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {user && (
          <button className="ganga-nuevo-btn" onClick={() => setShowNuevaGanga(true)}>
            + Vender Artículo
          </button>
        )}
      </div>

      {loading ? (
        <div className="ganga-empty">
          <p>Cargando gangas...</p>
        </div>
      ) : gangas.length === 0 ? (
        <div className="ganga-empty">
          <div className="ganga-empty-icon">🏜️</div>
          <p>No hay artículos en venta en esta categoría.</p>
          {user ? (
            <p style={{ marginTop: '0.5rem' }}>¡Sé el primero en publicar algo!</p>
          ) : (
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Inicia sesión para publicar tu artículo.</p>
          )}
        </div>
      ) : (
        <div className="ganga-grid">
          {gangas.map((ganga) => {
            const vendedor = ganga.vendedor;
            const avatarUrl = getAvatarUrl(vendedor);
            const imgUrl = getFirstImageUrl(ganga.fotos);

            return (
              <div key={ganga.documentId || ganga.id} className="ganga-card">
                <div className={`ganga-card-img-container ${ganga.estado === 'Vendido' ? 'ganga-vendido' : ''}`}>
                  {imgUrl ? (
                    <img src={imgUrl} alt={ganga.titulo} className="ganga-card-img" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                      Sin Imagen
                    </div>
                  )}
                  <span className={`ganga-badge-estado ${ganga.estado === 'Vendido' ? 'badge-vendido' : ''}`}>{ganga.estado}</span>
                  <span className="ganga-badge-precio">${Number(ganga.precio).toLocaleString('en-US')}</span>
                </div>

                <div className="ganga-card-body">
                  <h3 className="ganga-card-title">{ganga.titulo}</h3>
                  <p className="ganga-card-desc">{ganga.descripcion}</p>
                  
                  <div className="ganga-card-footer">
                    <div className="ganga-vendedor">
                      <div className="ganga-vendedor-avatar">
                        {avatarUrl ? (
                          <img src={encodeURI(avatarUrl)} alt={vendedor?.apodo || vendedor?.username || ''} />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#fff' }}>{getInitial(vendedor)}</span>
                        )}
                      </div>
                      <span>@{vendedor?.apodo || vendedor?.username || 'anónimo'}</span>
                    </div>
                    <div className="ganga-ubicacion">
                      <MapPin size={12} /> {ganga.ubicacion}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination.pageCount > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button
            className="ganga-cat-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Anterior
          </button>
          <span style={{ color: 'var(--nr-texto-secundario)' }}>
            Página {pagination.page} de {pagination.pageCount}
          </span>
          <button
            className="ganga-cat-btn"
            disabled={page >= pagination.pageCount}
            onClick={() => setPage(p => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal Nueva Ganga */}
      {showNuevaGanga && (
        <NuevaGangaModal
          onClose={() => setShowNuevaGanga(false)}
          onCreated={handleGangaCreada}
        />
      )}
    </section>
  );
}
