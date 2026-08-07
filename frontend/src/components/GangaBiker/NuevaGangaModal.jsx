import { useState } from 'react';
import { crearGanga, uploadMedia } from '../../services/api';
import '../Foro/ForoBiker.css'; // Reutilizamos estilos del modal del foro

export default function NuevaGangaModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    estado: 'Nuevo',
    categoria: 'Accesorios',
    ubicacion: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('nr_token');
    if (!token) {
      setError('Debes iniciar sesión para publicar.');
      return;
    }

    if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.ubicacion) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }

    setEnviando(true);
    try {
      let uploadedFileId = null;

      // Subir imagen si existe
      if (file) {
        console.log("🔑 Token encontrado:", token ? "SÍ (longitud: " + token.length + ")" : "NO");
        console.log("📤 Intentando subir imagen...");
        const uploadResult = await uploadMedia(file, token);
        if (uploadResult && uploadResult.length > 0) {
          uploadedFileId = uploadResult[0].id;
        }
      }

      // Crear Ganga
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio),
        fotos: uploadedFileId ? [uploadedFileId] : []
      };

      await crearGanga(payload, token);
      onCreated();
    } catch (err) {
      setError(err.message || 'Error al publicar el artículo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="foro-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="foro-modal">
        <div className="foro-modal-header">
          <h2>🏷️ Vender Artículo</h2>
          <button className="foro-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="foro-modal-body">
          <div className="foro-field">
            <label>Título del artículo *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Casco HJC RPHA 11 Pro"
              required
              maxLength={100}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="foro-field">
              <label>Precio (USD) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Ej: 150"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="foro-field">
              <label>Estado *</label>
              <select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="Nuevo">Nuevo</option>
                <option value="Usado - Excelente">Usado - Excelente</option>
                <option value="Usado - Bueno">Usado - Bueno</option>
                <option value="Repuestos">Para Repuestos</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="foro-field">
              <label>Categoría *</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="Moto">Moto</option>
                <option value="Casco">Casco</option>
                <option value="Indumentaria">Indumentaria</option>
                <option value="Repuestos">Repuestos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div className="foro-field">
              <label>Ubicación *</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ej: San Antonio"
                required
              />
            </div>
          </div>

          <div className="foro-field">
            <label>Foto Principal (Opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ color: 'var(--nr-texto-principal)', padding: '0.6rem 1rem' }}
            />
          </div>

          <div className="foro-field">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles del artículo, talla, detalles de uso..."
              required
            ></textarea>
          </div>

          {error && <p className="foro-error">{error}</p>}

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--nr-texto-secundario)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            padding: '0.65rem 0.9rem',
            lineHeight: '1.5',
            marginBottom: '0.25rem',
          }}>
            ⚠️ <strong style={{ color: 'var(--nr-texto-principal)' }}>Aviso:</strong> NeblinaRiders actúa como tablón de anuncios entre socios.
            El sitio <strong>no gestiona pagos, envíos ni garantías</strong>. Toda transacción es un acuerdo directo entre vendedor y comprador. Publica solo artículos que realmente tengas disponibles.
          </p>

          <button type="submit" className="foro-submit-btn" disabled={enviando}>
            {enviando ? 'Publicando...' : '🏷️ Publicar Artículo'}
          </button>
        </form>
      </div>
    </div>
  );
}
