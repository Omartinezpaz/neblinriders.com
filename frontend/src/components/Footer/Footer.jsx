

import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="nr-glow-line" style={{ 
      backgroundColor: '#1A1C21', // Ligeramente más oscuro que el fondo secundario
      padding: '4rem 2rem 2rem 2rem',
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h3 style={{ 
            fontFamily: 'var(--nr-font-titulos)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: 'var(--nr-texto-principal)'
          }}>
            NEBLINA RIDERS
          </h3>
          <p style={{ color: 'var(--nr-texto-secundario)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Uniendo motociclistas bajo un mismo código de hermandad y respeto por la carretera.<br/><br/>
            📍 Altos Mirandinos, Venezuela
          </p>
        </div>

        <div>
          <h4 style={{ 
            color: 'var(--nr-texto-principal)',
            marginBottom: '1.2rem',
            fontSize: '1.1rem'
          }}>
            Enlaces Rápidos
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--nr-texto-secundario)', fontSize: '0.9rem', lineHeight: '2' }}>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--nr-ambar-primario)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Inicio</Link></li>
            <li><Link to="/nosotros" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--nr-ambar-primario)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>El Enjambre (Nosotros)</Link></li>
            <li><Link to="/#noticias" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--nr-ambar-primario)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Últimas Noticias</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ 
            color: 'var(--nr-texto-principal)',
            marginBottom: '1.2rem',
            fontSize: '1.1rem'
          }}>
            Legal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--nr-texto-secundario)', fontSize: '0.9rem', lineHeight: '2' }}>
            <li style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>Aviso legal — próximamente</li>
            <li><Link to="/politica-privacidad" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--nr-ambar-primario)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Política de Privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '2rem',
        color: 'var(--nr-texto-secundario)',
        fontSize: '0.8rem'
      }}>
        <p>&copy; {currentYear} Neblina RIDERS. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
