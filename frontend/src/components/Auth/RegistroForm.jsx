import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function RegistroForm({ onLoginClick, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseName = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const generatedUsername = `${baseName}_${uniqueSuffix}`;

      const registerResponse = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: generatedUsername,
          email: formData.email,
          password: formData.password,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error?.message || 'Error en el registro. Verifica los datos.');
      }

      // Strapi 5 usa documentId para content-types, pero users-permissions sigue requiriendo el ID numérico clásico
      const userId = registerData.user.id;
      const updateResponse = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registerData.jwt}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Tu cuenta fue creada, pero hubo un problema de red al guardar tu nombre. Por favor, Inicia Sesión para continuar y actualiza tu perfil más tarde.');
      }

      localStorage.setItem('nr_token', registerData.jwt);
      localStorage.setItem('nr_user', JSON.stringify({
        ...registerData.user,
        nombre: formData.nombre,
        apellido: formData.apellido,
      }));

      if (onSuccess) {
        onSuccess({
          ...registerData.user,
          nombre: formData.nombre,
          apellido: formData.apellido,
        });
      } else {
        window.location.reload(); 
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-form-row">
        <div className="auth-form-group half-width">
          <label className="auth-form-label">Nombre</label>
          <input 
            type="text" 
            name="nombre"
            required 
            value={formData.nombre}
            onChange={handleChange}
            className="auth-form-input" 
            placeholder="Tu nombre" 
          />
        </div>
        <div className="auth-form-group half-width">
          <label className="auth-form-label">Apellido</label>
          <input 
            type="text" 
            name="apellido"
            required 
            value={formData.apellido}
            onChange={handleChange}
            className="auth-form-input" 
            placeholder="Tu apellido" 
          />
        </div>
      </div>
      
      <div className="auth-form-group">
        <label className="auth-form-label">Correo Electrónico</label>
        <input 
          type="email" 
          name="email"
          required 
          value={formData.email}
          onChange={handleChange}
          className="auth-form-input" 
          placeholder="tucorreo@ejemplo.com" 
        />
      </div>

      <div className="auth-form-group">
        <label className="auth-form-label">Contraseña</label>
        <input 
          type="password" 
          name="password"
          required 
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          className="auth-form-input" 
          placeholder="Mínimo 6 caracteres" 
        />
      </div>

      <div className="auth-form-checkbox-container">
        <input 
          type="checkbox" 
          name="acceptedTerms"
          id="terms"
          required
          checked={formData.acceptedTerms}
          onChange={handleChange}
          className="auth-form-checkbox"
        />
        <label htmlFor="terms" className="auth-form-checkbox-label">
          Acepto la <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad y Tratamiento de Datos</a> de Neblina RIDERS.
        </label>
      </div>

      {error && (
        <div className="auth-form-error">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading || !formData.acceptedTerms}
        className="auth-form-submit-btn"
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : 'Registrarme ahora'}
      </button>

      <p className="auth-form-footer-text">
        ¿Ya eres miembro del Enjambre?{' '}
        <button type="button" onClick={onLoginClick} className="auth-form-switch-btn">
          Inicia Sesión
        </button>
      </p>
    </form>
  );
}
