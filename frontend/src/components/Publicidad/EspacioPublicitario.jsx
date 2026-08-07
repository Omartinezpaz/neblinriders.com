import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Muestra banners publicitarios rotativos gestionados en Strapi.
 * Soporta múltiples anuncios activos por ubicación/categoría que rotan cada N segundos.
 * Compatible con Strapi 5 (respuesta aplanada) y Strapi 4.
 * 
 * @param {Object} props
 * @param {string} props.categoria - 'home_principal' | 'home_secundaria' | 'sidebar' | 'footer'
 * @param {number} props.duracionSegundos - Tiempo de visualización de cada anuncio (por defecto 30 seg)
 */
const EspacioPublicitario = ({ categoria = 'home_principal', duracionSegundos = 30 }) => {
  const [anuncios, setAnuncios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  useEffect(() => {
    const fetchPublicidad = async () => {
      try {
        const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        // Strapi 5 / 4 REST API request
        const url = `${API_URL}/api/publicidads?filters[ubicacion][$eq]=${categoria}&filters[fechaInicio][$lte]=${hoy}&filters[fechaFin][$gte]=${hoy}&populate=*`;
        
        const response = await fetch(url);
        if (response.ok) {
          const { data } = await response.json();
          setAnuncios(data || []);
        }
      } catch (error) {
        console.error("Error cargando publicidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicidad();
  }, [API_URL, categoria]);

  // Rotación automática cada N segundos si hay más de 1 anuncio
  useEffect(() => {
    if (anuncios.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % anuncios.length);
    }, duracionSegundos * 1000);

    return () => clearInterval(interval);
  }, [anuncios.length, duracionSegundos]);

  // Helper para resolver campos soportando Strapi 5 (aplanado) y Strapi 4 (attributes)
  const getField = (item, fieldName) => {
    if (!item) return null;
    return item[fieldName] !== undefined ? item[fieldName] : item.attributes?.[fieldName];
  };

  // Helper para extraer la URL de la imagen en Strapi 5 y 4
  const getImageUrl = (media) => {
    if (!media) return null;
    
    // Strapi 5 directo o array
    const rawUrl = media.url || 
                   (Array.isArray(media) && media[0]?.url) || 
                   media.data?.attributes?.url || 
                   (Array.isArray(media.data) && media.data[0]?.attributes?.url);

    if (!rawUrl) return null;
    if (rawUrl.startsWith('http')) return rawUrl;
    return `${API_URL}${rawUrl}`;
  };

  // Si no hay anuncios activos para esta ubicación y fecha, no se muestra nada
  if (loading || anuncios.length === 0) {
    return null;
  }

  const anuncioActual = anuncios[currentIndex];
  const nombreEmpresa = getField(anuncioActual, 'nombreEmpresa') || 'Publicidad';
  const urlEnlace = getField(anuncioActual, 'urlEnlace');
  const mediaObj = getField(anuncioActual, 'imagen');
  const imageUrl = getImageUrl(mediaObj);

  if (!imageUrl) return null;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % anuncios.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + anuncios.length) % anuncios.length);
  };

  const bannerContent = (
    <div style={{
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      border: '1px solid rgba(245, 165, 36, 0.3)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.01)';
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 165, 36, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    }}>
      <img 
        src={imageUrl} 
        alt={nombreEmpresa} 
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: '280px',
          objectFit: 'cover'
        }}
      />
    </div>
  );

  return (
    <section className="nr-glow-line" style={{ 
      padding: '2rem 1rem', 
      backgroundColor: 'var(--nr-fondo-principal)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative'
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        {urlEnlace ? (
          <a 
            href={urlEnlace} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            {bannerContent}
          </a>
        ) : (
          bannerContent
        )}

        {/* Flechas de navegación manual si hay más de 1 anuncio */}
        {anuncios.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              title="Anuncio anterior"
              style={{
                position: 'absolute',
                top: '50%',
                left: '-20px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(20, 22, 26, 0.85)',
                border: '1px solid rgba(245, 165, 36, 0.5)',
                color: 'var(--nr-ambar-primario)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              title="Siguiente anuncio"
              style={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(20, 22, 26, 0.85)',
                border: '1px solid rgba(245, 165, 36, 0.5)',
                color: 'var(--nr-ambar-primario)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Puntos (Dots) indicadores si hay múltiples anuncios */}
        {anuncios.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '1rem'
          }}>
            {anuncios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                title={`Ver anuncio ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: idx === currentIndex ? 'var(--nr-ambar-primario)' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <p style={{
        textAlign: 'center',
        marginTop: '1rem',
        color: 'var(--nr-texto-secundario)',
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: 0.6
      }}>
        Patrocinadores Oficiales {anuncios.length > 1 && `• Anuncio ${currentIndex + 1} de ${anuncios.length} (Rota cada ${duracionSegundos}s)`}
      </p>
    </section>
  );
};

export default EspacioPublicitario;
