import { useState, useEffect } from 'react';
import { getVideos } from '../../services/api';
import './VideosBiker.css';

const CATEGORIAS = [
  'todas', 
  'Review', 
  'Aventura', 
  'Circuito',
  'Equipamiento',
  'Taller',
  'Rutas',
  'Off-Road',
  'Técnica',
  'Comparativas',
  'Eventos',
  'MUSICA'
];

export default function VideosBiker() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });

  useEffect(() => {
    let ignore = false;

    getVideos(categoriaActiva, page, 12).then((res) => {
      if (!ignore) {
        setVideos(res.data);
        setPagination(res.meta.pagination);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (!ignore) setLoading(false);
    });

    return () => { ignore = true; };
  }, [categoriaActiva, page]);

  const handleCategoriaChange = (cat) => {
    setLoading(true);
    setCategoriaActiva(cat);
    setPage(1);
  };

  // Extraer ID de YouTube para thumbnail e iframe (soporta youtube.com/watch?v=, youtu.be/, youtube.com/embed/)
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="videos-page nr-glow-line">
      <div className="videos-header">
        <h1>🎥 Videos Biker</h1>
        <p>Reviews, rutas de aventura y track days de la comunidad Neblina Riders.</p>
      </div>

      <div className="videos-controls">
        <div className="videos-categorias">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
              onClick={() => handleCategoriaChange(cat)}
            >
              {cat === 'todas' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="foro-loading">Cargando videos...</div>
      ) : videos.length === 0 ? (
        <div className="foro-empty">No hay videos en esta categoría aún.</div>
      ) : (
        <div className="videos-grid">
          {videos.map((vid) => {
            const videoId = getYouTubeId(vid.youtube_url);
            if (!videoId) return null; // Ignorar si el admin puso una url mala
            
            return (
              <div key={vid.id} className="video-card">
                <div className="video-player">
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title={vid.titulo} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-info">
                  <span className="video-badge">{vid.categoria}</span>
                  <h3>{vid.titulo}</h3>
                  {vid.descripcion && <p>{vid.descripcion}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination.pageCount > 1 && (
        <div className="foro-pagination">
          <button 
            disabled={page === 1} 
            onClick={() => {
              setLoading(true);
              setPage(p => Math.max(1, p - 1));
            }}
          >
            Anterior
          </button>
          <span>Página {page} de {pagination.pageCount}</span>
          <button 
            disabled={page === pagination.pageCount} 
            onClick={() => {
              setLoading(true);
              setPage(p => Math.min(pagination.pageCount, p + 1));
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
