import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, FileText } from 'lucide-react';
import './CategoriaDetail.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

const CATEGORIA_NAMES = {
  equipo_de_proteccion: 'Equipo de Protección',
  elegir_moto: 'Elegir Moto',
  conduccion: 'Conducción',
  historia_de_las_marcas: 'Historia de las Marcas',
  mundo_biker: 'Mundo Biker',
  tipos_de_motos: 'Tipos de Motos',
  tecnologia: 'Tecnología',
  tips_para_viajero: 'Tips para Viajero',
  frases_de_motos: 'Frases de Motos',
  imagenes_de_motos: 'Imágenes de Motos',
  calendario_de_eventos: 'Calendario de Eventos',
  galeria: 'Galería',
  nosotros: 'Nosotros'
};

export default function CategoriaDetail() {
  const { categoryKey } = useParams();
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryTitle = CATEGORIA_NAMES[categoryKey] || categoryKey?.replace(/_/g, ' ');

  useEffect(() => {
    const fetchCategoryContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/articulos?filters[categoria][$eq]=${categoryKey}&populate=*`);
        const data = await res.json();
        
        if (data.data) {
          setArticulos(data.data);
        } else {
          setArticulos([]);
        }
      } catch (err) {
        console.error('Error al cargar contenido de la categoría:', err);
        setError('No se pudo cargar el contenido de esta categoría.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
    window.scrollTo(0, 0);
  }, [categoryKey]);

  const getImageUrl = (media) => {
    if (!media) return null;
    if (typeof media === 'string') {
      if (media.startsWith('http') || media.startsWith('/')) return media;
      return `/src/assets/${media}`;
    }
    const url = media.url || media.formats?.large?.url || media.formats?.medium?.url;
    if (!url) return null;
    if (url.startsWith('/')) {
      return `${API_URL}${url}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="categoria-loading">
        <Loader2 className="loading-icon animate-spin" size={48} color="var(--nr-ambar-primario)" />
        <p className="loading-text">Cargando publicaciones de {categoryTitle}...</p>
      </div>
    );
  }

  return (
    <div className="categoria-page nr-glow-line">
      <div className="categoria-container">
        <div className="categoria-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Volver al Inicio
          </Link>
          <h1 className="categoria-title">{categoryTitle}</h1>
          <p className="categoria-subtitle">
            Explora las publicaciones, imágenes y contenido sobre {categoryTitle}
          </p>
        </div>

        {error && (
          <div className="categoria-error">
            <AlertCircle size={40} color="var(--nr-alerta)" />
            <p>{error}</p>
          </div>
        )}

        {!error && articulos.length === 0 ? (
          <div className="categoria-empty">
            <ImageIcon size={64} color="var(--nr-ambar-primario)" />
            <h2>Aún no hay publicaciones en "{categoryTitle}"</h2>
            <p>
              Próximamente estaremos añadiendo fotos, videos y artículos en esta sección.
            </p>
            <Link to="/" className="btn-primary-home">
              Explorar otras secciones
            </Link>
          </div>
        ) : (
          <div className="categoria-grid">
            {articulos.map((art) => {
              const imgUrl = getImageUrl(art.imagenDestacada);
              return (
                <Link to={`/articulo/${art.slug}`} key={art.documentId || art.id} className="categoria-card">
                  <div className="card-media-wrapper">
                    {imgUrl ? (
                      <img src={imgUrl} alt={art.titulo} className="card-img" />
                    ) : (
                      <div className="card-media-placeholder">
                        <FileText size={48} color="var(--nr-ambar-primario)" />
                      </div>
                    )}
                    <span className="card-badge">{categoryTitle}</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{art.titulo}</h3>
                    {art.resumen && <p className="card-summary">{art.resumen}</p>}
                    <span className="card-read-more">Ver contenido →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
