import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getArticlesByStatus } from '../../services/articleService';
import { isManager } from '../../utils/permissions';
import ArticleCard from '../../components/article/ArticleCard';
import './ArticlesPublished.scss';

const ArticlesPublished = () => {
    const { currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleViewFull = (article) => console.log('Ver completo', article.id);

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
        </div>
    );
};

export default ArticlesPublished;