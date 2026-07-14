import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ARTICLES } from '../../mocks/articles';
import { isManager } from '../../utils/permissions';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import './ArticlesPublished.scss';

const ArticlesPublished = () => {
    const { currentUser } = useAuth();

    const publishedArticles = useMemo(
        () => MOCK_ARTICLES.filter((article) => article.status === 'PUBLISHED'),
        []
    );

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

            {publishedArticles.length === 0 ? (
                <p className="articles-published__empty">
                    Todavía no hay artículos publicados.
                </p>
            ) : (
                <div className="articles-published__list">
                    {publishedArticles.map((article) => (
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