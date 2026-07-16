import { api } from './api';

export const deleteAccount = (userId) => {
  return api.delete(`/api/v1/users/${userId}`);
};