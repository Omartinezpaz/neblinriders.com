import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function LoginForm({ onRegisterClick, onSuccess }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Credenciales incorrectas');
      }

      localStorage.setItem('nr_token', data.jwt);
      localStorage.setItem('nr_user', JSON.stringify(data.user));
      
      onSuccess(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-form-group">
        <label className="auth-form-label">Correo Electrónico o Usuario</label>
        <input 
          type="text" 
          name="identifier"
          required 
          value={formData.identifier}
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
          value={formData.password}
          onChange={handleChange}
          className="auth-form-input" 
          placeholder="Tu contraseña" 
        />
      </div>

      {error && (
        <div className="auth-form-error">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="auth-form-submit-btn"
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : 'Entrar al Enjambre'}
      </button>

      <p className="auth-form-footer-text">
        ¿Aún no tienes cuenta?{' '}
        <button type="button" onClick={onRegisterClick} className="auth-form-switch-btn">
          Únete ahora
        </button>
      </p>
    </form>
  );
}
