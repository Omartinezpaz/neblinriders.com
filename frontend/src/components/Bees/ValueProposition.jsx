
import { Users, Ambulance, Gift } from 'lucide-react';

const ValueProposition = () => {
  const pilares = [
    {
      titulo: 'Red de Servicios BeeRider',
      icono: Users,
      descripcion: 'Encuentra productos y servicios para ti y tu moto cuando lo necesites en nuestro directorio de comercios aliados.',
      color: 'var(--nr-ambar-primario)'
    },
    {
      titulo: 'Red de Emergencias',
      icono: Ambulance,
      descripcion: 'Contarás con el apoyo de nuestra comunidad y aliados en caso de presentar una emergencia como hurto o accidente.',
      color: 'var(--nr-alerta)'
    },
    {
      titulo: 'Apoyo Comunitario',
      icono: Gift,
      descripcion: 'Impulsamos el crecimiento de las personas que participan, apoyan y creen en el Enjambre.',
      color: 'var(--nr-ambar-primario)'
    }
  ];

  return (
    <section className="nr-glow-line" style={{ padding: '5rem 2rem', backgroundColor: 'var(--nr-fondo-secundario)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '3rem',
          textAlign: 'center',
          color: 'var(--nr-texto-principal)'
        }}>
          NUESTROS PILARES (BEES)
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {pilares.map((pilar, idx) => {
            const Icon = pilar.icono;
            const isRed = pilar.titulo === 'Red de Emergencias';
            return (
              <div
                key={idx}
                className={`nr-glow-line ${isRed ? 'nr-glow-line--red' : ''}`}
                style={{
                  backgroundColor: 'var(--nr-fondo-principal)',
                  padding: '2.5rem 2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Icon size={48} color={pilar.color} style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: pilar.color }}>
                  {pilar.titulo}
                </h3>
                <p style={{ color: 'var(--nr-texto-secundario)', lineHeight: '1.6' }}>
                  {pilar.descripcion}
                </p>

                {/* ESPACIO RESERVADO PARA AVISO LEGAL RED DE EMERGENCIAS */}
                {pilar.titulo === 'Red de Emergencias' && (
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--nr-texto-secundario)',
                    fontStyle: 'italic',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    width: '100%',
                    textAlign: 'left'
                  }}>
                    * [ESPACIO RESERVADO PARA AVISO LEGAL DE RED DE EMERGENCIAS: Este servicio no reemplaza a las autoridades...]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
