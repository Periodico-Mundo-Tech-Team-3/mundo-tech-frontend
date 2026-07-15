import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ARTICLES } from '../../mocks/articles';
import { isManager } from '../../utils/permissions';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import './ArticlesInReview.scss';

const ArticlesInReview = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const articlesInReview = useMemo(
        () => MOCK_ARTICLES.filter((article) => article.status === 'IN_REVIEW'),
        []
    );

    const handlePublish = (article) => console.log('Publicar', article.id);
    const handleReject = (article) => console.log('Rechazar', article.id);
    const handleViewFull = (article) => navigate('/review', { state: { article } });

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