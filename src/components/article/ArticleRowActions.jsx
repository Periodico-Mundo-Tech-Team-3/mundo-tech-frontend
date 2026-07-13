import { Pencil, Send, Eye, Trash2 } from "lucide-react";
import {canDelete, canEdit, canSendToReview} from "../../utils/permissions.js";
import IconButton from "../common/IconButton.jsx";
import './ArticleRowActions.scss';

const ArticleRowActions = ({
    article,
    currentUser,
    onEdit,
    onSendToReview,
    onView,
    onDelete,
}) => {
    return (
        <div className="article-row-actions">
            {canEdit(currentUser, article) && (
                <IconButton
                    icon={Pencil}
                    label={`Editar ${article.title}`}
                    variant="neutral"
                    onClick={() => onEdit?.(article)}
                />
            )}

            {canSendToReview(currentUser, article) && (
                <IconButton
                    icon={Send}
                    label={`Enviar a revisión ${article.title}`}
                    variant="primary"
                    onClick={() => onSendToReview?.(article)}
                />
            )}

            <IconButton
                icon={Eye}
                label={`Ver ${article.title}`}
                variant="neutral"
                onClick={() => onView?.(article)}
            />

            {canDelete(currentUser, article) && (
                <IconButton
                    icon={Trash2}
                    label={`Eliminar ${article.title}`}
                    variant="danger"
                    onClick={() => onDelete?.(article)}
                />
            )}
        </div>
    );
};

export default ArticleRowActions;