import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import ImageUploader from '../../components/article/ImageUploader';
import Card from '../../components/common/Card';
import './NewArticleForm.scss';

const MAX_TITLE = 100;
const MAX_CONTENT = 10000;

const NewArticleForm = ({ initialValues, onSubmit, onCancel }) => {
    const { currentUser } = useAuth();
    const isEditing = Boolean(initialValues);

    const [title, setTitle] = useState(initialValues?.title || '');
    const [content, setContent] = useState(initialValues?.content || '');
    const [image, setImage] = useState(initialValues?.image || null);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;

        onSubmit?.({
            title: title.trim(),
            content: content.trim(),
            image,
        });
    };

    return (
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

                    {/* Fecha y autor: solo lectura. El backend fija la fecha; el autor es el usuario logueado. */}
                    <div className="new-article-form__meta">
                        <div className="new-article-form__meta-item">
                            <span className="new-article-form__meta-label">Fecha de publicación</span>
                            <span className="new-article-form__meta-value">Se define al publicar</span>
                        </div>
                        <div className="new-article-form__meta-item">
                            <span className="new-article-form__meta-label">Autor</span>
                            <span className="new-article-form__meta-value">{currentUser?.name || '—'}</span>
                        </div>
                    </div>
                </div>

                <div className="new-article-form__actions">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar cambios' : 'Guardar borrador'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default NewArticleForm;