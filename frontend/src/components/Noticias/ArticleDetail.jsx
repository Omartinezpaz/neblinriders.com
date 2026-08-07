import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import './ArticleDetail.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1337';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/api/articulos?filters[slug][$eq]=${slug}&populate=*`);
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          setArticle(data.data[0]);
        } else {
          setError('Artículo no encontrado');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0); // Scroll to top when loading a new article
  }, [slug]);

  if (loading) {
    return (
      <div className="article-loading">
        <Loader2 className="loading-icon animate-spin" size={48} color="var(--nr-ambar-primario)" />
        <p className="loading-text">Cargando artículo...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-error">
        <AlertCircle size={48} color="#E5484D" />
        <h2 className="error-title">{error}</h2>
        <Link to="/" className="back-link-center">
          <ArrowLeft size={20} /> Volver al inicio
        </Link>
      </div>
    );
  }

  const getImageUrl = (media) => {
    if (!media) return null;
    if (typeof media === 'string') {
      if (media.startsWith('http') || media.startsWith('/')) return media;
      return `/src/assets/${media}`;
    }
    const url = media.url || media.formats?.large?.url || media.formats?.medium?.url;
    if (!url) return null;
    if (url.startsWith('/')) {
      return `${API_URL}${url}`;
    }
    return url;
  };

  const imageUrl = getImageUrl(article.imagenDestacada);

  const renderBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    
    return blocks.map((block, index) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index}>
            {block.children?.map((child, i) => {
              let text = child.text;
              if (child.bold) text = <strong key={i}>{text}</strong>;
              if (child.italic) text = <em key={i}>{text}</em>;
              if (child.underline) text = <u key={i}>{text}</u>;
              if (child.code) text = <code key={i}>{text}</code>;
              return <span key={i}>{text}</span>;
            })}
          </p>
        );
      }
      if (block.type === 'heading') {
        const Tag = `h${block.level}`;
        return (
          <Tag key={index}>
            {block.children?.map(c => c.text).join('')}
          </Tag>
        );
      }
      if (block.type === 'list') {
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={index}>
            {block.children?.map((li, i) => (
              <li key={i}>
                {li.children?.map(c => c.text).join('')}
              </li>
            ))}
          </ListTag>
        );
      }
      if (block.type === 'quote') {
        return (
          <blockquote key={index} className="article-quote">
            {block.children?.map(c => c.text).join('')}
          </blockquote>
        );
      }
      return null;
    });
  };

  return (
    <div className="article-detail-page">
      <div className="article-nav">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>
      </div>

      <article className="article-content">
        <header className="article-header">
          {article.categoria && (
            <span className="article-category">
              {article.categoria}
            </span>
          )}
          <h1 className="article-title">
            {article.titulo}
          </h1>
          <p className="article-summary">
            {article.resumen}
          </p>
        </header>

        {imageUrl && (
          <figure className="article-figure">
            <img 
              src={imageUrl} 
              alt={article.titulo} 
              className="article-image"
            />
          </figure>
        )}

        <div className="article-body">
          {article.contenido ? renderBlocks(article.contenido) : (
             <p style={{fontStyle: 'italic', color: 'var(--nr-texto-secundario)'}}>Contenido en preparación...</p>
          )}
        </div>
      </article>
    </div>
  );
}
