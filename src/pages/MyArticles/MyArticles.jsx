import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllArticles } from '../../services/articleService';
import { canSeeInMyArticles, isAuthor } from '../../utils/permissions';
import { formatDate } from '../../utils/formatDate';
import Tabs from '../../components/common/Tabs';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import ArticleRowActions from '../../components/article/ArticleRowActions';
import './MyArticles.scss';

const TABS = [
    { id: 'all', label: 'Todos' },
    { id: 'PUBLISHED', label: 'Publicados' },
    { id: 'IN_REVIEW', label: 'En revisión' },
    { id: 'DRAFT', label: 'Borradores' },
];

const MyArticles = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadArticles = async () => {
            setLoading(true);
            try {
                const data = await getAllArticles();
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
    }, []);

    const visibleArticles = useMemo(() => {
        const canSee = articles.filter((article) =>
            canSeeInMyArticles(currentUser, article)
        );

        if (activeTab === 'all') {
            return canSee;
        }

        return canSee.filter(
            (article) =>
                article.status === activeTab &&
                article.author.id === currentUser?.id
        );
    }, [articles, currentUser, activeTab]);

    const handleEdit = (article) => console.log('Editar', article.id);
    const handleSendToReview = (article) => console.log('Enviar a revisión', article.id);
    const handleView = (article) => console.log('Ver', article.id);
    const handleDelete = (article) => console.log('Eliminar', article.id);

    if (!isAuthor(currentUser)) {
        return (
            <div className="my-articles">
                <p className="my-articles__empty">
                    Esta sección está disponible solo para autores.
                </p>
            </div>
        );
    }

    return (
        <div className="my-articles">
            <h1 className="my-articles__title">Mis artículos</h1>

            <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

            <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                className="my-articles__panel"
            >
                {loading ? (
                    <p className="my-articles__empty">Cargando artículos…</p>
                ) : error ? (
                    <p className="my-articles__empty" role="alert">{error}</p>
                ) : visibleArticles.length === 0 ? (
                    <p className="my-articles__empty">
                        No hay artículos en esta categoría.
                    </p>
                ) : (
                    <Table headers={['Artículo', 'Autor', 'Fecha', 'Acciones']}>
                        {visibleArticles.map((article) => (
                            <tr key={article.id}>
                                <td>
                                    <div className="article-cell">
                                        <span className="article-cell__title">{article.title}</span>
                                        <StatusBadge status={article.status} />
                                    </div>
                                </td>
                                <td className="article-cell__author">{article.author.name}</td>
                                <td className="article-cell__date">{formatDate(article.publishDate)}</td>
                                <td>
                                    <ArticleRowActions
                                        article={article}
                                        currentUser={currentUser}
                                        onEdit={handleEdit}
                                        onSendToReview={handleSendToReview}
                                        onView={handleView}
                                        onDelete={handleDelete}
                                    />
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </div>
        </div>
    );
};

export default MyArticles;