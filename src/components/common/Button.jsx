import './Button.scss';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    icon: Icon,
    disabled = false,
    onClick,
    ...rest
}) => {
    return (
        <button
            type={type}
            className={`button button--${variant}`}
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