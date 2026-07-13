import './StatusBadge.scss';

const STATUS_CONFIG = {
    DRAFT: { label: 'Borrador', modifier: 'draft' },
    IN_REVIEW: { label: 'En revisión', modifier: 'review' },
    PUBLISHED: { label: 'Publicado', modifier: 'published' },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status];

    if (!config) return null;

    return (
        <span className={`status-badge status-badge--${config.modifier}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;