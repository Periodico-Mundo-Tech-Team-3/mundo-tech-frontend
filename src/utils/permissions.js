const hasRole = (user, role) =>
    Boolean(user?.roles?.some((r) => r.name === role));

export const isAuthor = (user) =>
    hasRole(user, 'author');
export const isManager = (user) =>
    hasRole(user, 'manager');

export const canAccessRedaction = (user) =>
    isAuthor(user);
export const canAccessEditorial = (user) =>
    isManager(user);

const isOwner = (user, article) =>
    user?.id === article?.author?.id;

export const canEdit = (user, article) =>
    isOwner(user, article);
export const canDelete = (user, article) =>
    isOwner(user, article);
export const canSendToReview = (user, article) =>
    isOwner(user, article) && article?.status === 'DRAFT';
export const canPublish = (user, article) =>
    isManager(user) && article?.status === 'IN_REVIEW';
export const canReject = (user, article) =>
    isManager(user) && article?.status === 'IN_REVIEW';
export const canSeeInMyArticles = (user, article) =>
    article?.status === 'PUBLISHED' || isOwner(user, article);