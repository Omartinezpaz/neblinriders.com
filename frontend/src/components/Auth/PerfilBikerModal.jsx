import { useState } from 'react';
import { X, ShieldAlert, Bike, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import './PerfilBikerModal.css';

/**
 * Modal para que el socio gestione su Ficha de Emergencia y Perfil Biker.
 * Utiliza el endpoint nativo PUT /api/users/me para actualizar los datos de forma segura.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {Object} props.user - Objeto del usuario actual (desde localStorage/estado).
 * @param {function} props.onSuccess - Callback opcional al guardar exitosamente.
 */
export default function PerfilBikerModal({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState(() => {
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('nr_user') : null;
    const currentUser = storedUserStr ? JSON.parse(storedUserStr) : user;
    return {
      apodo: currentUser?.apodo || '',
      modeloMoto: currentUser?.modeloMoto || '',
      placaMoto: currentUser?.placaMoto || '',
      direccion: currentUser?.direccion || '',
      tipoSangre: currentUser?.tipoSangre || '',
      alergias: currentUser?.alergias || '',
      contactoEmergenciaNombre: currentUser?.contactoEmergenciaNombre || '',
      contactoEmergenciaTelefono: currentUser?.contactoEmergenciaTelefono || '',
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  const handleCloseModal = () => {
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario actualizando el perfil del usuario.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const token = localStorage.getItem('nr_token');

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Error al actualizar la ficha de emergencia.');
      }

      const updatedUser = await response.json();
      
      // Actualizar localStorage con los nuevos datos del perfil
      const currentUser = JSON.parse(localStorage.getItem('nr_user') || '{}');
      const mergedUser = { ...currentUser, ...updatedUser, ...formData };
      localStorage.setItem('nr_user', JSON.stringify(mergedUser));

      setSuccessMsg('¡Ficha de emergencia guardada con éxito!');
      
      if (onSuccess) {
        onSuccess(mergedUser);
      }

      setTimeout(() => {
        handleCloseModal();
        window.location.reload();
      }, 1200);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="perfil-modal-overlay">
      <div className="perfil-modal-container nr-glow-line">
        
        {/* Header */}
        <div className="perfil-modal-header">
          <h2 className="perfil-modal-title">Mi Ficha de Emergencia / Perfil Biker</h2>
          <button 
            onClick={handleCloseModal} 
            className="perfil-modal-close-btn"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {error && (
            <div className="perfil-alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="perfil-alert-success">
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sección 1: Datos Biker & Moto */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <Bike size={20} /> Datos Biker y Vehículo
            </h3>
            <div className="perfil-grid">
              <div>
                <label className="perfil-label">Apodo / Alias Biker</label>
                <input
                  type="text"
                  name="apodo"
                  value={formData.apodo}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: El Rayo, Neblina_01"
                />
              </div>
              <div>
                <label className="perfil-label">Modelo de Moto</label>
                <input
                  type="text"
                  name="modeloMoto"
                  value={formData.modeloMoto}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: Kawasaki Ninja 650, Empire Bera"
                />
              </div>
              <div>
                <label className="perfil-label">Placa</label>
                <input
                  type="text"
                  name="placaMoto"
                  value={formData.placaMoto}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: AA123BC"
                />
              </div>
              <div className="perfil-field-full">
                <label className="perfil-label">Dirección de Referencia</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="perfil-textarea"
                  placeholder="Ciudad, zona o punto de referencia habitual"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Red de Emergencias */}
          <div className="perfil-section">
            <h3 className="perfil-section-title emergency">
              <ShieldAlert size={20} /> Red de Emergencias (Médico)
            </h3>
            <div className="perfil-grid">
              <div className="emergency-field">
                <label className="perfil-label">Tipo de Sangre</label>
                <input
                  type="text"
                  name="tipoSangre"
                  value={formData.tipoSangre}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: O+, A-, B+"
                />
              </div>
              <div className="emergency-field">
                <label className="perfil-label">Alergias / Condiciones Médicas</label>
                <input
                  type="text"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: Alergia a Penicilina, Asma"
                />
              </div>
              <div className="emergency-field">
                <label className="perfil-label">Nombre Contacto de Emergencia</label>
                <input
                  type="text"
                  name="contactoEmergenciaNombre"
                  value={formData.contactoEmergenciaNombre}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Nombre y relación (Ej: María - Esposa)"
                />
              </div>
              <div className="emergency-field">
                <label className="perfil-label">Teléfono Contacto de Emergencia</label>
                <input
                  type="tel"
                  name="contactoEmergenciaTelefono"
                  value={formData.contactoEmergenciaTelefono}
                  onChange={handleChange}
                  className="perfil-input"
                  placeholder="Ej: 0414-1234567"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="perfil-actions">
            <button
              type="button"
              onClick={handleCloseModal}
              className="perfil-cancel-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="perfil-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Guardando...
                </>
              ) : (
                'Guardar Ficha de Emergencia'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
