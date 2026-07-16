import { api } from './api';

const BASE = '/api/v1/articles';

export const getAllArticles = async () => {
  const { data } = await api.get(BASE);
  return data;
};

export const getArticleById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

// GET /articles/status?status=X&userId=Y
export const getArticlesByStatus = async (status, userId) => {
  const { data } = await api.get(`${BASE}/status`, { params: { status, userId } });
  return data;
};

export const getArticlesByAuthor = async (authorId) => {
  const { data } = await api.get(`${BASE}/author`, { params: { authorId } });
  return data;
};

// POST /articles/{userId} — multipart
export const createArticle = async (userId, article, file) => {
  const formData = new FormData();
  formData.append(
      'article',
      new Blob([JSON.stringify(article)], { type: 'application/json' })
  );
  if (file) formData.append('file', file);

  const { data } = await api.post(`${BASE}/${userId}`, formData);
  return data;
};

// PUT /articles/{id}/{userLoginId}
export const updateArticle = async (id, userLoginId, article, file) => {
  const formData = new FormData();
  formData.append(
      'article',
      new Blob([JSON.stringify(article)], { type: 'application/json' })
  );
  if (file) formData.append('file', file);

  const { data } = await api.put(`${BASE}/${id}/${userLoginId}`, formData);
  return data;
};

// DELETE /articles/{id}/{userLoginId}
export const deleteArticle = async (id, userLoginId) => {
  await api.delete(`${BASE}/${id}/${userLoginId}`);
};

// ARTICLE STATUS (GET con ?userId=) ──
export const submitArticle = async (id, userId) => {
  const { data } = await api.get(`${BASE}/${id}/submit`, { params: { userId } });
  return data;
};

export const publishArticle = async (id, userId) => {
  const { data } = await api.get(`${BASE}/${id}/publish`, { params: { userId } });
  return data;
};

export const rejectArticle = async (id, userId) => {
  const { data } = await api.get(`${BASE}/${id}/reject`, { params: { userId } });
  return data;
};