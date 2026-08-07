import { useState, useEffect } from 'react';
import './Hero.css';
import Button from './Button';

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2070&auto=format&fit=crop',
];

export default function Hero({ user, onRegisterClick }) {
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  // Cargar imágenes del Hero desde Strapi (ubicación: hero_slider)
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const hoy = new Date().toISOString().split('T')[0];
        const url = `${API_URL}/api/publicidads?filters[ubicacion][$eq]=hero_slider&filters[fechaInicio][$lte]=${hoy}&filters[fechaFin][$gte]=${hoy}&populate=*`;
        
        const response = await fetch(url);
        if (response.ok) {
          const { data } = await response.json();
          if (data && data.length > 0) {
            const strapiImages = data
              .map(item => {
                const media = item.imagen || item.attributes?.imagen;
                const rawUrl = media?.url || media?.[0]?.url || media?.data?.attributes?.url;
                if (!rawUrl) return null;
                return rawUrl.startsWith('http') ? rawUrl : `${API_URL}${rawUrl}`;
              })
              .filter(Boolean);

            if (strapiImages.length > 0) {
              setHeroImages(strapiImages);
            }
          }
        }
      } catch (err) {
        console.error('Error cargando imágenes de Hero desde Strapi:', err);
      }
    };

    fetchHeroImages();
  }, [API_URL]);

  // Rotación del Slider cada 5 segundos
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section id="hero" className="hero-section">
      {/* Slider Backgrounds */}
      {heroImages.map((img, index) => (
        <div
          key={`${img}-${index}`}
          className={`hero-bg-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>NEBLINA RIDERS</h1>
        <span className="subtitle-small" style={{ color: 'var(--nr-ambar-primario)', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '16px' }}>
          Comunidad Motera en Venezuela, Altos Mirandinos
        </span>
        <p>Donde la carretera se encuentra con la libertad.</p>
        <div className="hero-actions">
          {user ? (
            <div className="user-greeting">
              ¡Bienvenido, {user.apodo || user.nombre || user.username}!
            </div>
          ) : (
            <Button onClick={onRegisterClick} variant="primary">Registrarme Gratis</Button>
          )}
        </div>
      </div>
    </section>
  );
}
