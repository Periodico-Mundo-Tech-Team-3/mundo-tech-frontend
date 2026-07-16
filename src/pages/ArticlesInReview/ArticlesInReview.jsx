import { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getArticlesByStatus, publishArticle, rejectArticle, } from '../../services/articleService';
import { isManager, canPublish, canReject } from '../../utils/permissions';
import { formatDate } from '../../utils/formatDate';
import { API_URL } from '../../services/api';
import ArticleCard from '../../components/article/ArticleCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import placeholderArticle from '../../assets/placeholder-article.png';
import './ArticlesInReview.scss';

const ArticlesInReview = () => {
    const { currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const loadArticles = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const data = await getArticlesByStatus('IN_REVIEW', currentUser.id);
            setArticles(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los artículos.');
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    const handlePublish = async (article) => {
        try {
            await publishArticle(article.id, currentUser.id);
            setSelectedArticle(null);
            await loadArticles();
        } catch (err) {
            console.error(err);
            setError('No se pudo publicar el artículo.');
        }
    };

    const handleReject = async (article) => {
        try {
            await rejectArticle(article.id, currentUser.id);
            setSelectedArticle(null);
            await loadArticles();
        } catch (err) {
            console.error(err);
            setError('No se pudo rechazar el artículo.');
        }
    };

    const handleViewFull = (article) => setSelectedArticle(article);

    if (!isManager(currentUser)) {
        return (
            <div className="articles-in-review">
                <p className="articles-in-review__empty">
                    Esta sección está disponible solo para responsables editoriales.
                </p>
            </div>
        );
    }

    return (
        <div className="articles-in-review">
            <h1 className="articles-in-review__title">En revisión</h1>

            {loading ? (
                <p className="articles-in-review__empty">Cargando artículos…</p>
            ) : error ? (
                <p className="articles-in-review__empty" role="alert">{error}</p>
            ) : articles.length === 0 ? (
                <p className="articles-in-review__empty">
                    No hay artículos pendientes de revisión.
                </p>
            ) : (
                <div className="articles-in-review__list">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            currentUser={currentUser}
                            onPublish={handlePublish}
                            onReject={handleReject}
                            onViewFull={handleViewFull}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={Boolean(selectedArticle)}
                onClose={() => setSelectedArticle(null)}
                size="lg"
            >
                {selectedArticle && (
                    <div className="review-modal">
                        <div className="review-modal__meta">
                            <StatusBadge status={selectedArticle.status} />
                            <span className="review-modal__sender">
                                Enviado por {selectedArticle.author.name } ·{' '}
                                {formatDate(selectedArticle.publishDate)}
                            </span>
                        </div>

                        <h2 className="review-modal__title">{selectedArticle.title}</h2>

                        <img
                            className="review-modal__image"
                            src={
                                selectedArticle.image
                                    ? `${API_URL}/uploads/${selectedArticle.image}`
                                    : placeholderArticle
                            }
                            alt={selectedArticle.image ? `Portada de ${selectedArticle.title}` : ''}
                        />

                        <p className="review-modal__content">{selectedArticle.content}</p>

                        <div className="review-modal__actions">
                            {canPublish(currentUser, selectedArticle) && (
                                <Button
                                    variant="primary"
                                    icon={Check}
                                    onClick={() => handlePublish(selectedArticle)}
                                >
                                    Publicar artículo
                                </Button>
                            )}
                            {canReject(currentUser, selectedArticle) && (
                                <Button
                                    variant="danger-outline"
                                    icon={X}
                                    onClick={() => handleReject(selectedArticle)}
                                >
                                    Rechazar
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ArticlesInReview;