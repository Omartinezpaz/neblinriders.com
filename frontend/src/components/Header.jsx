import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useHeaderHeight } from '../hooks/useHeaderHeight';
import './Header.css';

export default function Header({ user, onLoginClick, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useHeaderHeight();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={headerRef} className={`neblina-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-topbar">
        <div className="topbar-content">
          <span>+58 412 000 0000 | contacto@neblinariders.com</span>
          <div className="topbar-socials">
            <a href="#">IG</a>
            <a href="#">FB</a>
            <a href="#">YT</a>
          </div>
        </div>
      </div>
      <nav className="header-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="/"><span className="logo-accent">N</span>eblina<span className="logo-accent">R</span>iders</a>
          </div>
          <ul className="nav-links">
            <li><a href="/#hero">Inicio</a></li>
            <li><Link to="/nosotros">El Enjambre</Link></li>
            <li><a href="/#noticias">Noticias</a></li>
            <li><Link to="/foro" style={{ color: 'var(--nr-ambar-primario)', fontWeight: '600' }}>Foro</Link></li>
            <li><Link to="/gangas" style={{ color: 'var(--nr-ambar-primario)', fontWeight: '600' }}>Gangas</Link></li>
            <li><Link to="/videos" style={{ color: 'var(--nr-ambar-primario)', fontWeight: '600' }}>Videos</Link></li>
            <li><a href="/#recursos">Recursos</a></li>
            <li><a href="/#nosotros">Nosotros</a></li>
          </ul>
          <div className="nav-actions">
            <button className="icon-btn">🔍</button>
            <button className="icon-btn">🔔</button>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="profile-btn" style={{ cursor: 'default' }}>
                  <div className="profile-circle" style={{ 
                    backgroundColor: 'var(--nr-ambar-primario)', 
                    color: '#14161A', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem' 
                  }}>
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{user.nombre || user.username}</span>
                </div>
                <button 
                  onClick={onLogout}
                  title="Cerrar sesión"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--nr-texto-secundario)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--nr-alerta)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--nr-texto-secundario)'}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="profile-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div className="profile-circle"></div>
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
