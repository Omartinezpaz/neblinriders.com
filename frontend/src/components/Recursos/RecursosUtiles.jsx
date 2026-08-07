import { useEffect, useState } from 'react';
import { getRecursos } from '../../services/api';
import { ExternalLink } from 'lucide-react';

const RecursosUtiles = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecursos = async () => {
      const data = await getRecursos();
      setRecursos(data);
      setLoading(false);
    };
    fetchRecursos();
  }, []);

  return (
    <section id="recursos" className="nr-glow-line" style={{ padding: '4rem 2rem', backgroundColor: 'var(--nr-fondo-secundario)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'var(--nr-texto-principal)'
        }}>
          RECURSOS ÚTILES
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--nr-texto-secundario)' }}>Cargando recursos...</p>
        ) : recursos.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--nr-texto-secundario)', fontStyle: 'italic' }}>
            No hay recursos disponibles aún.
          </p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {recursos.map((rec) => (
              <a 
                key={rec.id}
                href={rec.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--nr-fondo-principal)',
                  padding: '1.5rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--nr-texto-principal)',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = 'var(--nr-ambar-primario)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>{rec.nombre}</span>
                </div>
                <ExternalLink size={20} color="var(--nr-texto-secundario)" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecursosUtiles;
