const articlesStore = [];

export const saveDraft = (articleData) => {
  const now = new Date().toISOString();

  if (articleData.id) {
    const existing = articlesStore.find((a) => a.id === articleData.id);
    if (existing) {
      Object.assign(existing, {
        title: articleData.title,
        content: articleData.content,
        image: articleData.image || null,
        createdAt: now,
      });
      return Promise.resolve({ ...existing });
    }
  }

  const newArticle = {
    id: Date.now(),
    title: articleData.title,
    content: articleData.content,
    image: articleData.image || null,
    status: 'DRAFT',
    createdAt: now,
    publishDate: null,
    author: articleData.author,
  };
  articlesStore.push(newArticle);
  return Promise.resolve({ ...newArticle });
};

export const sendToReview = (articleId) => {
  const article = articlesStore.find((a) => a.id === articleId);
  if (!article) {
    return Promise.reject(new Error('Artículo no encontrado'));
  }
  article.status = 'IN_REVIEW';
  return Promise.resolve({ ...article });
};

export const publishArticle = (articleId) => {
  const article = articlesStore.find((a) => a.id === articleId);
  if (!article){
    return Promise.reject(new Error('Artículo no encontrado'));
  }
    
  article.status = 'PUBLISHED';
  return Promise.resolve({ ...article });
};

export const rejectArticle = (articleId) => {
  const article = articlesStore.find((a) => a.id === articleId);
  if (!article){
  return Promise.reject(new Error('Artículo no encontrado'));
     }
  article.status = 'DRAFT';
  return Promise.resolve({ ...article });
};
