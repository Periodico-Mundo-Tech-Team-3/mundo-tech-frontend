import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getArticlesByStatus, publishArticle, rejectArticle, } from '../../services/articleService';
import { isManager } from '../../utils/permissions';
import ArticleCard from '../../components/article/ArticleCard';
import './ArticlesInReview.scss';

const ArticlesInReview = () => {
    const { currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            await loadArticles();
        } catch (err) {
            console.error(err);
            setError('No se pudo publicar el artículo.');
        }
    };

    const handleReject = async (article) => {
        try {
            await rejectArticle(article.id, currentUser.id);
            await loadArticles();
        } catch (err) {
            console.error(err);
            setError('No se pudo rechazar el artículo.');
        }
    };

    const handleViewFull = (article) => console.log('Ver completo', article.id);

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
        </div>
    );
};

export default ArticlesInReview;