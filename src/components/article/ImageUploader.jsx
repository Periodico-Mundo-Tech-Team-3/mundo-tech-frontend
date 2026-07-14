import { useState, useRef } from 'react';
import { ImageUp, X, Loader2 } from 'lucide-react';
import { API_URL } from '../../services/api';
import './ImageUploader.scss';

const ImageUploader = ({ value, onChange, label = 'Imagen de portada' }) => {
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('El archivo debe ser una imagen.');
            return;
        }

        setError('');

        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file); // la clave DEBE ser "file" (así lo espera Spring)

            const response = await fetch(`${API_URL}/api/files/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('La subida falló');

            const data = await response.json();
            onChange?.(data.fileName);
        } catch (err) {
            setError('No se pudo subir la imagen. Inténtalo de nuevo.');
            setPreview(null);
            onChange?.(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        handleFile(event.dataTransfer.files?.[0]);
    };

    const handleRemove = () => {
        setPreview(null);
        setError('');
        onChange?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const shownImage = preview || (value ? `${API_URL}/uploads/${value}` : null);

    return (
        <div className="image-uploader">
            <span className="image-uploader__label">{label}</span>

            {shownImage ? (
                <div className="image-uploader__preview">
                    <img src={shownImage} alt="Vista previa de la portada" />
                    {isUploading && (
                        <div className="image-uploader__status">
                            <Loader2 className="image-uploader__spinner" size={20} aria-hidden="true" />
                            <span>Subiendo…</span>
                        </div>
                    )}
                    <button
                        type="button"
                        className="image-uploader__remove"
                        onClick={handleRemove}
                        aria-label="Quitar imagen"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="image-uploader__dropzone"
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <ImageUp size={28} aria-hidden="true" />
                    <span>Arrastra una imagen o haz clic para subirla</span>
                </button>
            )}

            {error && <span className="image-uploader__error" role="alert">{error}</span>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="image-uploader__input"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
        </div>
    );
};

export default ImageUploader;