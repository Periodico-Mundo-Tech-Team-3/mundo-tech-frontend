import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import ImageUploader from '../../components/article/ImageUploader';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { createArticle, updateArticle } from '../../services/articleService';
import { formatDate } from '../../utils/formatDate';
import './NewArticleForm.scss';

const MAX_TITLE = 100;
const MAX_CONTENT = 10000;

const NewArticleForm = ({ initialValues, onSubmit, onCancel }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const article = initialValues ?? location.state?.article;
    const isEditing = Boolean(article);

    const [title, setTitle] = useState(initialValues?.title || '');
    const [content, setContent] = useState(initialValues?.content || '');
    const [image, setImage] = useState(initialValues?.image || null);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [savedArticle, setSavedArticle] = useState(null);
    const [saving, setSaving] = useState(false);

    const validate = () => {
        const nextErrors = {};

        if (!title.trim()) {
            nextErrors.title = 'El título es obligatorio.';
        } else if (title.length > MAX_TITLE) {
            nextErrors.title = `El título no puede superar los ${MAX_TITLE} caracteres.`;
        }

        if (!content.trim()) {
            nextErrors.content = 'El contenido es obligatorio.';
        } else if (content.length > MAX_CONTENT) {
            nextErrors.content = `El contenido no puede superar los ${MAX_CONTENT} caracteres.`;
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const articleData = {
                title: title.trim(),
                content: content.trim(),
                publishDate: new Date().toISOString(),
            };

            const file = image instanceof File ? image : null;

            const article = isEditing
                ? await updateArticle(initialValues.id, currentUser.id, articleData, file)
                : await createArticle(currentUser.id, articleData, file);

            setSavedArticle(article);
            setShowSuccessModal(true);
        } catch (error) {
            setErrors({ submit: 'Error al guardar el artículo. Inténtalo de nuevo.' });
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Card className="new-article-form">
                <h2 className="new-article-form__heading">
                    {isEditing ? 'Editar artículo' : 'Redactar artículo'}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="new-article-form__fields">
                        <Input
                            label="Título"
                            placeholder="Escribe el titular del artículo…"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={errors.title}
                            required
                            maxLength={MAX_TITLE}
                        />

                        <ImageUploader value={image} onChange={setImage} />

                        <Textarea
                            label="Contenido"
                            placeholder="Escribe el cuerpo del artículo…"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            error={errors.content}
                            required
                        />

                        <div className="new-article-form__meta">
                            <div className="new-article-form__meta-item">
                                <span className="new-article-form__meta-label">Fecha de publicación</span>
                                <span className="new-article-form__meta-value">
                                {initialValues?.publishDate
                                    ? formatDate(initialValues.publishDate)
                                    : formatDate(new Date().toISOString())}
                            </span>
                            </div>
                            <div className="new-article-form__meta-item">
                                <span className="new-article-form__meta-label">Autor</span>
                                <span className="new-article-form__meta-value">{currentUser?.name || '—'}</span>
                            </div>
                        </div>
                    </div>

                    {errors.submit && (
                        <p className="new-article-form__submit-error" role="alert">
                            {errors.submit}
                        </p>
                    )}

                    <div className="new-article-form__actions">
                        <Button
                            variant="secondary"
                            onClick={onCancel ?? (() => navigate('/my-articles'))}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Guardar borrador'}
                        </Button>
                    </div>
                </form>
            </Card>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="¡Artículo guardado!"
            >
                <p className="success-dialog__message">
                    Tu borrador se ha guardado correctamente.
                </p>
                <div className="success-dialog__actions">
                    <Button
                        variant="primary"
                        onClick={() =>
                            navigate('/preview', { state: { article: savedArticle } })
                        }
                    >
                        Ver vista previa
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        Cerrar
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default NewArticleForm;