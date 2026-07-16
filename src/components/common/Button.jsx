import './Button.scss';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    icon: Icon,
    disabled = false,
    onClick,
    className = '',
    ...rest
}) => {
    return (
        <button
            type={type}
            className={`button button--${variant}${className ? ` ${className}` : ''}`}
            disabled={disabled}
            onClick={onClick}
            {...rest}
            >
            {Icon && <Icon className="button__icon" size={18} aria-hidden="true" />}
            {children}
        </button>
    );
};

export default Button;