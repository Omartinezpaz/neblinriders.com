import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticulos } from '../../services/api';

const NoticiasList = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      const data = await getArticulos();
      setArticulos(data);
      setLoading(false);
    };
    fetchNoticias();
  }, []);

  return (
    <section id="noticias" className="nr-glow-line" style={{ padding: '5rem 2rem', backgroundColor: 'var(--nr-fondo-principal)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
          textAlign: 'center',
          color: 'var(--nr-texto-principal)'
        }}>
          ÚLTIMAS NOTICIAS
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--nr-texto-secundario)' }}>Cargando noticias...</p>
        ) : articulos.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--nr-texto-secundario)', fontStyle: 'italic' }}>
            No hay artículos publicados aún.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {articulos.map((art) => (
              <Link 
                to={`/articulo/${art.slug}`} 
                key={art.documentId || art.id}
                style={{ textDecoration: 'none' }}
              >
                <article 
                  style={{
                    backgroundColor: 'var(--nr-fondo-secundario)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '200px', backgroundColor: 'var(--nr-fondo-principal)', position: 'relative', overflow: 'hidden' }}>
                    {art.imagenDestacada ? (
                      <img 
                        src={
                          typeof art.imagenDestacada === 'string'
                            ? (art.imagenDestacada.startsWith('http') || art.imagenDestacada.startsWith('/')
                                ? art.imagenDestacada
                                : `/src/assets/${art.imagenDestacada}`)
                            : (art.imagenDestacada.url?.startsWith('/') 
                                ? `http://localhost:1337${art.imagenDestacada.url}` 
                                : art.imagenDestacada.url)
                        } 
                        alt={art.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="overlay-oscuro" style={{ width: '100%', height: '100%' }}></div>
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: 'var(--nr-ambar-primario)',
                      color: 'var(--nr-fondo-principal)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--nr-font-titulos)',
                      textTransform: 'uppercase'
                    }}>
                      {art.categoria || 'General'}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--nr-texto-principal)' }}>
                      {art.titulo}
                    </h3>
                    <p style={{ color: 'var(--nr-texto-secundario)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {art.resumen}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticiasList;
