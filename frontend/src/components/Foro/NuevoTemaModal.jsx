import { useState } from 'react';
import { crearForoTema } from '../../services/api';
import './ForoBiker.css';

const CATEGORIAS_FORM = [
  { key: 'general', label: '💬 General' },
  { key: 'rutas_rodadas', label: '🏍️ Rutas y Rodadas' },
  { key: 'mecanica', label: '🔧 Mecánica y Mantenimiento' },
  { key: 'equipamiento', label: '🛡️ Equipamiento' },
  { key: 'emergencias', label: '🆘 Emergencias y Alertas' },
];

export default function NuevoTemaModal({ onClose, onCreated }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim() || !contenido.trim()) {
      setError('El título y el contenido son obligatorios.');
      return;
    }

    const token = localStorage.getItem('nr_token');
    if (!token) {
      setError('Debes iniciar sesión para crear un tema.');
      return;
    }

    setLoading(true);
    try {
      await crearForoTema({ titulo: titulo.trim(), contenido: contenido.trim(), categoria }, token);
      onCreated();
    } catch (err) {
      setError(err.message || 'Error al crear el tema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="foro-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="foro-modal">
        <div className="foro-modal-header">
          <h2>Nuevo Tema</h2>
          <button className="foro-modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="foro-modal-body" onSubmit={handleSubmit}>
          <div className="foro-field">
            <label htmlFor="foro-cat">Categoría</label>
            <select
              id="foro-cat"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS_FORM.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="foro-field">
            <label htmlFor="foro-titulo">Título</label>
            <input
              id="foro-titulo"
              type="text"
              placeholder="¿De qué quieres hablar?"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="foro-field">
            <label htmlFor="foro-contenido">Contenido</label>
            <textarea
              id="foro-contenido"
              placeholder="Comparte tu experiencia, pregunta o idea con el Enjambre..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />
          </div>

          {error && <p className="foro-error">{error}</p>}

          <button type="submit" className="foro-submit-btn" disabled={loading}>
            {loading ? 'Publicando...' : '🐝 Publicar Tema'}
          </button>
        </form>
      </div>
    </div>
  );
}
