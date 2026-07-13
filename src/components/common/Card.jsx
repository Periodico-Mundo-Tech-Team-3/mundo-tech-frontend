import './Card.scss';

const Card = ({ children, as: Tag = 'div', className = '', ...rest }) => {
    return (
        <Tag className={`card${className ? ` ${className}` : ''}`} {...rest}>
            {children}
        </Tag>
    );
};

export default Card;