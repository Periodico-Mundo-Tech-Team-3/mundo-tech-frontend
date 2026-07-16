import { Check, X, Eye } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { canPublish, canReject } from '../../utils/permissions';
import { formatDate } from '../../utils/formatDate';
import { API_URL } from '../../services/api';
import placeholderArticle from '../../assets/placeholder-article.png';
import './ArticleCard.scss';

const EXCERPT_LENGTH = 180;

const getExcerpt = (text = '') =>
    text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;

const ArticleCard = ({ article, currentUser, onPublish, onReject, onViewFull }) => {
    const imageSrc = article.image
        ? `${API_URL}/uploads/${article.image}`
        : placeholderArticle;

    return (
        <Card as="article" className="article-card">
            <div className="article-card__header">
                <StatusBadge status={article.status} />
                <span className="article-card__meta">
          Enviado por {article.author.name} · {formatDate(article.publishDate)}
        </span>
            </div>

            <h3 className="article-card__title">{article.title}</h3>

            <div className="article-card__body">
                <img
                    className="article-card__image"
                    src={imageSrc}
                    alt={article.image ? `Portada de ${article.title}` : ''}
                />
                <p className="article-card__excerpt">{getExcerpt(article.content)}</p>
            </div>

            <div className="article-card__actions">
                {canPublish(currentUser, article) && (
                    <Button variant="primary" icon={Check} onClick={() => onPublish?.(article)}>
                        Publicar artículo
                    </Button>
                )}
                {canReject(currentUser, article) && (
                    <Button variant="danger-outline" icon={X} onClick={() => onReject?.(article)}>
                        Rechazar
                    </Button>
                )}
                <Button variant="secondary" icon={Eye} onClick={() => onViewFull?.(article)}>
                    Ver completo
                </Button>
            </div>
        </Card>
    );
};

export default ArticleCard;