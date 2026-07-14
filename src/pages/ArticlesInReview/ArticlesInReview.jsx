import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ARTICLES } from '../../mocks/articles';
import { isManager } from '../../utils/permissions';
import ReviewArticleCard from '../../components/article/ArticleReviewCard.jsx';
import './ArticlesInReview.scss';

const ArticlesInReview = () => {
    const { currentUser } = useAuth();

    const articlesInReview = useMemo(
        () => MOCK_ARTICLES.filter((article) => article.status === 'IN_REVIEW'),
        []
    );

    const handlePublish = (article) => console.log('Publicar', article.id);
    const handleReject = (article) => console.log('Rechazar', article.id);
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

            {articlesInReview.length === 0 ? (
                <p className="articles-in-review__empty">
                    No hay artículos pendientes de revisión.
                </p>
            ) : (
                <div className="articles-in-review__list">
                    {articlesInReview.map((article) => (
                        <ReviewArticleCard
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