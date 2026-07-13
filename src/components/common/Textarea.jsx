import { useId } from "react";
import 'Textarea.scss';

const Textarea = ({
    label,
    id,
    error,
    required = false,
    rows = 6,
    ...rest
}) => {
    const generateId = useId();
    const textareaId = id || generateId;
    const errorId = `${textareaId}-error`;

    return (
        <div className="textarea">
            {label && (
                <label className="textarea__label" htmlFor={textareaId}>
                    {label}
                    {required && <span className="textarea__required" aria-hidden="true"> *</span>}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`textarea__field${error ? ' textarea__field--error' : ''}`}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errorId : undefined}
                required={required}
                rows={rows}
                {...rest}
            />
            {error && (
                <span className="textarea__error" id={errorId} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Textarea;