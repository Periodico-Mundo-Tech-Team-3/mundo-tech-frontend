import { Check, X, Eye } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { canPublish, canReject } from '../../utils/permissions';
import { formatDate } from '../../utils/formatDate';
import { API_URL } from '../../services/api';
import placeholderArticle from '../../assets/placeholder-article.png';
import './ReviewArticleCard.scss';

const EXCERPT_LENGTH = 180;

const getExcerpt = (text = '') =>
    text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;

const ReviewArticleCard = ({ article, currentUser, onPublish, onReject, onViewFull }) => {
    const imageSrc = article.image
        ? `${API_URL}/uploads/${article.image}`
        : placeholderArticle;

    return (
        <Card as="article" className="review-card">
            <div className="review-card__header">
                <StatusBadge status={article.status} />
                <span className="review-card__meta">
          Enviado por {article.author.name} · {formatDate(article.publishDate)}
        </span>
            </div>

            <h3 className="review-card__title">{article.title}</h3>

            <div className="review-card__body">
                <img
                    className="review-card__image"
                    src={imageSrc}
                    alt={article.image ? `Portada de ${article.title}` : ''}
                />
                <p className="review-card__excerpt">{getExcerpt(article.content)}</p>
            </div>

            <div className="review-card__actions">
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

export default ReviewArticleCard;