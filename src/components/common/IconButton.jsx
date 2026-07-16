import './IconButton.scss';

const IconButton = ({
    icon: Icon,
    label,
    variant = 'neutral',
    type = 'button',
    disabled = false,
    onClick,
    ...rest
}) => {
    return (
        <button
            type={type}
            className={`icon-button icon-button--${variant}`}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            {...rest}
            >
            <Icon className="icon-button__icon" size={18} aria-hidden="true" />
        </button>
    );
}

export default IconButton;