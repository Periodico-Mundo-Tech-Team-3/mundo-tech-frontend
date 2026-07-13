import { useId } from 'react';
import './Input.scss';

const Input = ({
    label,
    id,
    type = 'text',
    error,
    required = false,
    ...rest
}) => {
    const generateId = useId();
    const inputId = id || generateId;
    const errorId = `${inputId}-error`;

    return (
        <div className="input">
            {label && (
                <label className="input__label" htmlFor={inputId}>
                    {label}
                    {required && <span className="input__required" aria-hidden="true"> *</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={`input__field${error ? ' input__field--error' : ''}`}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errorId : undefined}
                required={required}
                {...rest}
            />
            {error && (
                <span className="input__error" id={errorId} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;