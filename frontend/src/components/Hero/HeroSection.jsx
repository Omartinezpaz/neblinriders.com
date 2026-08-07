

const HeroSection = ({ onRegisterClick, user }) => {
  return (
    <section 
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
        // Placeholder for baner-4.jpg using a gradient
        background: 'linear-gradient(to bottom, var(--nr-fondo-secundario), var(--nr-fondo-principal))',
        overflow: 'hidden'
      }}
    >
      {/* Overlay oscuro para legibilidad (regla de diseño) */}
      <div 
        className="overlay-oscuro" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      ></div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Neblina RIDERS
        </h1>
        <p style={{ 
          color: 'var(--nr-texto-principal)', 
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
          marginBottom: '2.5rem',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          opacity: 0.9
        }}>
          Donde la carretera se encuentra con la libertad.
        </p>
        
        {user ? (
          <div style={{
            backgroundColor: 'var(--nr-fondo-secundario)',
            padding: '1rem 2rem',
            borderRadius: '4px',
            border: '1px solid var(--nr-ambar-primario)',
            display: 'inline-block'
          }}>
            <p style={{ fontFamily: 'var(--nr-font-titulos)', fontSize: '1.2rem', margin: 0, color: 'var(--nr-ambar-primario)' }}>
              ¡Bienvenido, {user.nombre || user.username}!
            </p>
          </div>
        ) : (
          <button style={{ 
            backgroundColor: 'var(--nr-ambar-primario)', 
            color: 'var(--nr-fondo-principal)',
            border: 'none',
            padding: '1.2rem 2.5rem',
            borderRadius: '4px',
            fontFamily: 'var(--nr-font-titulos)',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
          onClick={onRegisterClick}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--nr-ambar-secundario)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--nr-ambar-primario)';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            REGISTRARME GRATIS
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
