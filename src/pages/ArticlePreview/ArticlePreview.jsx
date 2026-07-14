import { useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Send } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import { sendToReview } from '../../services/articleService';
import { API_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import placeholderArticle from '../../assets/placeholder-article.png';
import './ArticlePreview.scss';

const ArticlePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const article = location.state?.article;

  if (!article) {
    navigate('/my-articles', { replace: true });
    return null;
  }

  const handleEdit = () => {
    navigate('/new-article', { state: { article } });
  };

  const handleSendToReview = async () => {
    try {
      await sendToReview(article.id);
      navigate('/my-articles');
    } catch {
      // Error handling
    }
  };

  return (
    <div className="article-preview">
      <Card className="article-preview__card">
        <div className="article-preview__header">
          <StatusBadge status={article.status} />
          <span className="article-preview__saved-date">
            Guardado · {formatDate(article.createdAt || article.publishDate)}
          </span>
        </div>

        <hr className="article-preview__divider" />

        <h1 className="article-preview__title">{article.title}</h1>

        <img
          className="article-preview__image"
          src={article.image ? `${API_URL}/uploads/${article.image}` : placeholderArticle}
          alt={article.image ? `Portada de ${article.title}` : ''}
        />

        <div className="article-preview__content">{article.content}</div>

        <hr className="article-preview__divider" />

        <div className="article-preview__author-info">
          <span className="article-preview__author-label">
            Autor: <strong>{article.author?.name || '—'}</strong>
          </span>
          <span className="article-preview__separator">·</span>
          <span className="article-preview__date-label">
            Fecha de publicación:{' '}
            {article.publishDate
              ? formatDate(article.publishDate)
              : 'Sin programar'}
          </span>
        </div>

        <hr className="article-preview__divider" />

        <div className="article-preview__actions">
          <Button variant="secondary" icon={Pencil} onClick={handleEdit}>
            Editar
          </Button>
          {currentUser && (
            <Button
              variant="primary"
              icon={Send}
              onClick={handleSendToReview}
            >
              Enviar a revisión
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ArticlePreview;
