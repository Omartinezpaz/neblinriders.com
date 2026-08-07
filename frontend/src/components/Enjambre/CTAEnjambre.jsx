export default function CTAEnjambre({ user, onOpenAuthModal, onOpenPerfilModal }) {
  return (
    <section id="enjambre" className="nr-glow-line" style={{ 
      backgroundColor: 'var(--nr-ambar-primario)',
      padding: '4rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Patrón de fondo opcional tipo rayas/enjambre */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.05,
        backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 10px, transparent 10px, transparent 20px)',
        zIndex: 1
      }}></div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: 'var(--nr-fondo-principal)',
          marginBottom: '1rem'
        }}>
          EL ENJAMBRE
        </h2>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--nr-fondo-secundario)',
          marginBottom: '2rem',
          fontWeight: '500'
        }}>
          {user 
            ? `¡Bienvenido al Enjambre, ${user.apodo || user.nombre || user.username}! Mantén tu Ficha de Emergencia y datos Biker al día para tu protección en cada rodada.`
            : 'Planes y Rodadas ¿Quieres conocer lugares y personas increíbles? ¡Únete al Enjambre!'
          }
        </p>

        {user ? (
          <button 
            onClick={onOpenPerfilModal}
            style={{ 
              backgroundColor: 'var(--nr-fondo-principal)', 
              color: 'var(--nr-ambar-primario)',
              border: '2px solid var(--nr-fondo-principal)',
              padding: '1rem 2rem',
              borderRadius: '6px',
              fontFamily: 'var(--nr-font-titulos)',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--nr-fondo-secundario)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--nr-fondo-principal)';
              e.currentTarget.style.color = 'var(--nr-ambar-primario)';
            }}
          >
            📋 Mi Ficha de Emergencia / Perfil Biker
          </button>
        ) : (
          <button 
            onClick={onOpenAuthModal}
            style={{ 
              backgroundColor: 'var(--nr-fondo-principal)', 
              color: 'var(--nr-texto-principal)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '4px',
              fontFamily: 'var(--nr-font-titulos)',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--nr-fondo-secundario)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--nr-fondo-principal)';
            }}
          >
            Únete al Enjambre
          </button>
        )}
      </div>
    </section>
  );
}
