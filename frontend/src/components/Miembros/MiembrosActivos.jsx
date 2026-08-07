import { useState, useEffect, useMemo } from 'react';
import './MiembrosActivos.css';

// Variación de tonos ámbar/oscuro para avatares sin foto cargada
const AVATAR_STYLES = [
  'radial-gradient(circle at 30% 30%, #FFC65C, var(--nr-ambar-primario))',
  'radial-gradient(circle at 30% 30%, var(--nr-ambar-primario), var(--nr-ambar-secundario))',
  'radial-gradient(circle at 30% 30%, #3A3E48, var(--nr-fondo-secundario))',
];

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : 'U';
}

function getAvatarStyle(index) {
  return AVATAR_STYLES[index % AVATAR_STYLES.length];
}

const MiembroCard = ({ miembro, index, apiUrl }) => {
  const displayName = miembro.apodo || miembro.username;
  
  // Extraer URL de la imagen en Strapi 5 y 4
  const rawAvatarUrl = miembro.avatar?.url || 
                       miembro.avatar?.[0]?.url || 
                       miembro.avatar?.data?.attributes?.url ||
                       miembro.avatar?.data?.[0]?.attributes?.url;

  // Codificar espacios y caracteres especiales de la URL de la imagen
  const avatarUrl = rawAvatarUrl 
    ? (rawAvatarUrl.startsWith('http') ? encodeURI(rawAvatarUrl) : `${apiUrl}${encodeURI(rawAvatarUrl)}`)
    : null;

  return (
    <div className="miembro-card" style={{ animationDelay: `${(index % 6) * 0.08}s` }}>
      <div
        className="miembro-avatar"
        style={{ 
          background: avatarUrl ? 'var(--nr-fondo-secundario)' : getAvatarStyle(index),
          border: avatarUrl ? '2px solid var(--nr-ambar-primario)' : undefined,
          overflow: 'hidden'
        }}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '50%' 
            }} 
          />
        ) : (
          getInitial(displayName)
        )}
        {index % 3 === 0 && <span className="miembro-online-dot" />}
      </div>
      <div className="miembro-info">
        <span className="miembro-username">@{displayName}</span>
      </div>
    </div>
  );
};

const MiembrosActivos = () => {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  useEffect(() => {
    const fetchMiembros = async () => {
      try {
        const response = await fetch(`${API_URL}/api/miembros/activos`);
        if (response.ok) {
          const data = await response.json();
          setMiembros(data || []);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMiembros();
  }, [API_URL]);

  const miembrosLoop = useMemo(() => {
    if (miembros.length === 0) return [];
    if (miembros.length < 10) return [...miembros, ...miembros, ...miembros];
    return [...miembros, ...miembros];
  }, [miembros]);

  if (loading || miembros.length === 0) return null;

  return (
    <section className="miembros-section nr-glow-line">
      <div className="miembros-container">
        <h2 className="miembros-title">MIEMBROS ACTIVOS</h2>
        <p className="miembros-contador">
          <span className="miembros-contador-dot" />
          {miembros.length} miembros del Enjambre
        </p>

        <div className="miembros-marquee-viewport">
          <div className="miembros-marquee-track">
            {miembrosLoop.map((miembro, i) => (
              <MiembroCard 
                key={`${miembro.id}-${i}`} 
                miembro={miembro} 
                index={i} 
                apiUrl={API_URL}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiembrosActivos;
