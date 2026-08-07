import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { getForoTema, crearForoRespuesta } from '../../services/api';
import './ForoTemaDetalle.css';

const STRAPI_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

function getAvatarUrl(autor) {
  if (!autor) return null;
  const avatar = autor.avatar;
  if (!avatar) return null;
  const url = avatar.url || avatar?.formats?.thumbnail?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function getInitial(autor) {
  if (!autor) return '?';
  const name = autor.apodo || autor.username || '';
  return name.charAt(0).toUpperCase() || '?';
}

function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ForoTemaDetalle({ user }) {
  const { temaId } = useParams();
  const [tema, setTema] = useState(null);
  const [fetchedId, setFetchedId] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Derived loading: true when we haven't fetched for this temaId yet
  const loading = fetchedId !== temaId;

  useEffect(() => {
    let ignore = false;
    getForoTema(temaId).then(data => {
      if (!ignore) {
        setTema(data);
        setFetchedId(temaId);
      }
    });
    return () => { ignore = true; };
  }, [temaId]);

  const handleResponder = async (e) => {
    e.preventDefault();
    setError('');

    if (!respuestaTexto.trim()) {
      setError('Escribe algo para responder.');
      return;
    }

    const token = localStorage.getItem('nr_token');
    if (!token) {
      setError('Debes iniciar sesión para responder.');
      return;
    }

    setEnviando(true);
    try {
      await crearForoRespuesta(
        { contenido: respuestaTexto.trim(), temaDocumentId: tema.documentId || tema.id },
        token
      );
      setRespuestaTexto('');
      // Refresh tema data after posting
      const refreshed = await getForoTema(temaId);
      setTema(refreshed);
    } catch (err) {
      setError(err.message || 'Error al enviar la respuesta.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="foro-detalle">
        <p style={{ color: 'var(--nr-texto-secundario)', textAlign: 'center', padding: '4rem 0' }}>
          Cargando tema...
        </p>
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="foro-detalle">
        <Link to="/foro" className="foro-back-link">
          <ArrowLeft size={16} /> Volver al foro
        </Link>
        <p style={{ color: 'var(--nr-texto-secundario)', textAlign: 'center', padding: '4rem 0' }}>
          Tema no encontrado.
        </p>
      </div>
    );
  }

  const autor = tema.autor;
  const avatarUrl = getAvatarUrl(autor);
  const respuestas = tema.respuestas || [];

  return (
    <div className="foro-detalle">
      <div className="foro-breadcrumb">
        <Link to="/foro" className="foro-breadcrumb-link">
          <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Foro
        </Link>
        <span className="foro-breadcrumb-separator">/</span>
        <span className="foro-breadcrumb-current">{tema.categoria?.replace('_', ' ')}</span>
      </div>

      {/* Post Original */}
      <div className="foro-post-original">
        <div className="foro-post-header">
          <div className="foro-post-avatar">
            {avatarUrl ? (
              <img src={encodeURI(avatarUrl)} alt={autor?.apodo || autor?.username || ''} />
            ) : (
              <span className="initial">{getInitial(autor)}</span>
            )}
          </div>
          <div className="foro-post-author-info">
            <div className="foro-post-author-name">
              @{autor?.apodo || autor?.username || 'anónimo'}
              {(autor?.role?.name === 'Moderator' || autor?.role?.name === 'Admin') && <span className="mod-badge" style={{ marginLeft: '8px' }}>Mod</span>}
            </div>
            <div className="foro-post-date">{formatDateLong(tema.createdAt)}</div>
          </div>
        </div>

        <div className="foro-post-badges">
          {tema.cerrado && (
            <span className="foro-badge-cerrado">
              <Lock size={11} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
              Cerrado
            </span>
          )}
        </div>

        <h1>{tema.titulo}</h1>
        <div className="foro-post-content">{tema.contenido}</div>
      </div>

      {/* Respuestas */}
      <h3 className="foro-respuestas-header">
        💬 {respuestas.length} {respuestas.length === 1 ? 'Respuesta' : 'Respuestas'}
      </h3>

      {respuestas.length > 0 ? (
        <div className="foro-respuestas-list">
          {respuestas.map((resp, idx) => {
            const respAutor = resp.autor;
            const respAvatarUrl = getAvatarUrl(respAutor);
            return (
              <div key={resp.documentId || resp.id || idx} className="foro-respuesta-card">
                <div className="foro-respuesta-avatar">
                  {respAvatarUrl ? (
                    <img src={encodeURI(respAvatarUrl)} alt={respAutor?.apodo || respAutor?.username || ''} />
                  ) : (
                    <span className="initial">{getInitial(respAutor)}</span>
                  )}
                </div>
                <div className="foro-respuesta-body">
                  <div className="foro-respuesta-meta">
                    <span className="author">
                      @{respAutor?.apodo || respAutor?.username || 'anónimo'}
                      {(respAutor?.role?.name === 'Moderator' || respAutor?.role?.name === 'Admin') && <span className="mod-badge" style={{ marginLeft: '6px' }}>Mod</span>}
                    </span>
                    <span className="date">{formatDateLong(resp.createdAt)}</span>
                  </div>
                  <div className="foro-respuesta-text">{resp.contenido}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: 'var(--nr-texto-secundario)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          Aún no hay respuestas. ¡Sé el primero!
        </p>
      )}

      {/* Formulario de respuesta o prompt de login */}
      {tema.cerrado ? (
        <div className="foro-login-prompt">
          <Lock size={20} style={{ marginBottom: '0.5rem' }} />
          <p>Este tema está cerrado. No se aceptan nuevas respuestas.</p>
        </div>
      ) : user ? (
        <form className="foro-reply-form" onSubmit={handleResponder}>
          <h3>Responder a este tema</h3>
          <textarea
            placeholder="Escribe tu respuesta..."
            value={respuestaTexto}
            onChange={(e) => setRespuestaTexto(e.target.value)}
          />
          {error && <p className="foro-error" style={{ marginBottom: '0.75rem' }}>{error}</p>}
          <button type="submit" className="foro-submit-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : '💬 Responder'}
          </button>
        </form>
      ) : (
        <div className="foro-login-prompt">
          <p>
            <strong>Inicia sesión</strong> para responder a este tema.
          </p>
        </div>
      )}
    </div>
  );
}
