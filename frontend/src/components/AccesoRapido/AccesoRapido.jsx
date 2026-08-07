import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Map, 
  Settings, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  FileText, 
  HeartHandshake, 
  Car, 
  Star,
  Image as ImageIcon
} from 'lucide-react';

const AccesoRapido = () => {
  const categorias = [
    { key: 'equipo_de_proteccion', nombre: 'Equipo de Protección', icono: ShieldCheck },
    { key: 'elegir_moto', nombre: 'Elegir Moto', icono: Car },
    { key: 'conduccion', nombre: 'Conducción', icono: Map },
    { key: 'historia_de_las_marcas', nombre: 'Historia de las Marcas', icono: BookOpen },
    { key: 'mundo_biker', nombre: 'Mundo Biker', icono: Users },
    { key: 'tipos_de_motos', nombre: 'Tipos de Motos', icono: Car },
    { key: 'tecnologia', nombre: 'Tecnología', icono: Settings },
    { key: 'tips_para_viajero', nombre: 'Tips para Viajero', icono: AlertTriangle },
    { key: 'frases_de_motos', nombre: 'Frases de Motos', icono: FileText },
    { key: 'imagenes_de_motos', nombre: 'Imágenes de Motos', icono: HeartHandshake },
    { key: 'calendario_de_eventos', nombre: 'Calendario de eventos', icono: Star },
    { key: 'galeria', nombre: 'Galería', icono: ImageIcon },
    { key: 'nosotros', nombre: 'Nosotros', icono: Users }
  ];

  return (
    <section id="acceso-rapido" className="nr-glow-line" style={{ padding: '5rem 2rem', backgroundColor: 'var(--nr-fondo-principal)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
          textAlign: 'center',
          color: 'var(--nr-ambar-primario)'
        }}>
          Acceso Rápido
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {categorias.map((cat, idx) => {
            const IconComponent = cat.icono;
            return (
              <Link 
                to={`/categoria/${cat.key}`}
                key={idx}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div 
                  style={{
                    backgroundColor: 'var(--nr-fondo-secundario)',
                    padding: '2rem 1.5rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    border: '1px solid transparent',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'var(--nr-ambar-primario)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 165, 36, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    color: 'var(--nr-ambar-primario)', 
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={32} />
                  </div>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '0.75rem',
                    textTransform: 'none',
                    color: 'var(--nr-texto-principal)'
                  }}>
                    {cat.nombre}
                  </h3>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--nr-ambar-primario)',
                    fontWeight: '600'
                  }}>
                    Explorar contenido →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AccesoRapido;
