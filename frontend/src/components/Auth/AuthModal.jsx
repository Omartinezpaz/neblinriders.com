import { useState } from 'react';
import { X } from 'lucide-react';
import RegistroForm from './RegistroForm';
import LoginForm from './LoginForm';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'login'

  if (!isOpen) return null;

  const handleSuccess = (user) => {
    console.log("Autenticación exitosa:", user);
    onClose();
    window.location.reload();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container nr-glow-line">
        
        {/* Header del Modal */}
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {activeTab === 'register' ? 'Únete al Enjambre' : 'Iniciar Sesión'}
          </h2>
          <button 
            onClick={onClose}
            className="auth-modal-close-btn"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formularios */}
        {activeTab === 'register' ? (
          <RegistroForm 
            onLoginClick={() => setActiveTab('login')} 
            onSuccess={handleSuccess} 
          />
        ) : (
          <LoginForm 
            onRegisterClick={() => setActiveTab('register')} 
            onSuccess={handleSuccess} 
          />
        )}
      </div>
    </div>
  );
}
