import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getArticlesByStatus } from '../../services/articleService';
import { isManager } from '../../utils/permissions';
import { formatDate } from '../../utils/formatDate';
import { API_URL } from '../../services/api';
import ArticleCard from '../../components/article/ArticleCard';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import placeholderArticle from '../../assets/placeholder-article.png';
import './ArticlesPublished.scss';

const ArticlesPublished = () => {
    const { currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const loadArticles = async () => {
            setLoading(true);
            try {
                const data = await getArticlesByStatus('PUBLISHED', currentUser.id);
                setArticles(data);
                setError('');
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los artículos.');
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, [currentUser]);

    const handleViewFull = (article) => setSelectedArticle(article);

    if (!isManager(currentUser)) {
        return (
            <div className="articles-published">
                <p className="articles-published__empty">
                    Esta sección está disponible solo para responsables editoriales.
                </p>
            </div>
        );
    }

    return (
        <div className="articles-published">
            <h1 className="articles-published__title">Publicados</h1>

            {loading ? (
                <p className="articles-published__empty">Cargando artículos…</p>
            ) : error ? (
                <p className="articles-published__empty" role="alert">{error}</p>
            ) : articles.length === 0 ? (
                <p className="articles-published__empty">
                    Todavía no hay artículos publicados.
                </p>
            ) : (
                <div className="articles-published__list">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            currentUser={currentUser}
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
                Enviado por {selectedArticle.author.name} ·{' '}
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
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ArticlesPublished;