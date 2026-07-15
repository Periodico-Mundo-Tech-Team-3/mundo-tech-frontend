import { useState, useRef, useEffect } from 'react';
import { ImageUp, X } from 'lucide-react';
import { API_URL } from '../../services/api';
import './ImageUploader.scss';

const ImageUploader = ({ value, onChange, label = 'Imagen de portada' }) => {
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('El archivo debe ser una imagen.');
            return;
        }

        setError('');
        setPreview(URL.createObjectURL(file));
        onChange?.(file); // devolvemos el File, no un nombre
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

    const shownImage =
        preview || (typeof value === 'string' && value ? `${API_URL}/uploads/${value}` : null);

    return (
        <div className="image-uploader">
            <span className="image-uploader__label">{label}</span>

            {shownImage ? (
                <div className="image-uploader__preview">
                    <img src={shownImage} alt="Vista previa de la portada" />
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