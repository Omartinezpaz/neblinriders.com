
import { Link } from 'react-router-dom';
import './Features.css';

export default function Features() {
  return (
    <section className="features-section">
      <div className="features-title">
        <h2>¿Qué es Neblina Riders?</h2>
      </div>
      <div className="features-grid">

        <Link to="/videos" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">🎥</div>
          <h3 style={{ color: 'var(--nr-ambar-primario)' }}>Videos de Bikers</h3>
          <p>Contenido de reviews, aventuras y circuitos.</p>
        </Link>
        <Link to="/foro" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">👥</div>
          <h3 style={{ color: 'var(--nr-ambar-primario)' }}>ForoBiker / Red social</h3>
          <p>Comparte experiencias, dudas y opiniones. Debates reales de riders.</p>
        </Link>
        <Link to="/gangas" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-icon">⚙️</div>
          <h3 style={{ color: 'var(--nr-ambar-primario)' }}>GangaBiker</h3>
          <p>Ofertas en equipación, accesorios y más.</p>
        </Link>
      </div>
      <div className="features-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C320,150 420,-50 1440,50 L1440,100 L0,100 Z" fill="var(--nr-ambar-primario)"></path>
        </svg>
      </div>
    </section>
  );
}
