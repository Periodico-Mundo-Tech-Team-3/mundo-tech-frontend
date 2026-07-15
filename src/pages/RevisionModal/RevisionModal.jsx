import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import { publishArticle, rejectArticle } from '../../services/articleService';
import { canPublish, canReject } from '../../utils/permissions';
import { API_URL } from '../../services/api';
import placeholderArticle from '../../assets/placeholder-article.png';
import './RevisionModal.scss';

const RevisionModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const article = location.state?.article;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') navigate('/in-review');
    },
    [navigate]
  );

  useEffect(() => {
    if (!article) {
      navigate('/in-review', { replace: true });
      return;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [article, navigate, handleKeyDown]);

  if (!article) return null;

  const handleClose = () => navigate('/in-review');

  const handlePublish = async () => {
    try {
      await publishArticle(article.id);
      navigate('/in-review');
    } catch {
      // Error handling
    }
  };

  const handleReject = async () => {
    try {
      await rejectArticle(article.id);
      navigate('/in-review');
    } catch {
      // Error handling
    }
  };

  const imageSrc = article.image
    ? `${API_URL}/uploads/${article.image}`
    : placeholderArticle;

  return (
    <div className="revision-modal-overlay" onClick={handleClose}>
      <div
        className="revision-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Revisar artículo: ${article.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="revision-modal__header">
          <div className="revision-modal__metadata">
            <StatusBadge status={article.status} />
            <span className="revision-modal__meta">
              Enviado por {article.author.name} · {formatDate(article.publishDate)}
            </span>
          </div>
          <button
            className="revision-modal__close"
            onClick={handleClose}
            aria-label="Cerrar"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <h1 className="revision-modal__title">{article.title}</h1>

        <img
          className="revision-modal__image"
          src={imageSrc}
          alt={article.image ? `Portada de ${article.title}` : ''}
        />

        <div className="revision-modal__content">{article.content}</div>

        <div className="revision-modal__footer">
          {canPublish(currentUser, article) && (
            <Button variant="primary" icon={Check} onClick={handlePublish}>
              Publicar artículo
            </Button>
          )}
          {canReject(currentUser, article) && (
            <Button variant="danger-outline" icon={X} onClick={handleReject}>
              Rechazar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;
