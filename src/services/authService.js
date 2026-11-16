import apiClient from './apiClient';

export const authService = {
  async getCurrentUser() {
    try {
      const res = await apiClient('/auth/me');
      return res?.data ?? null;
    } catch (error) {
      if (error.status === 401) return null;
      throw error;
    }
  },
  async login(credentials) {
    const res = await apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    return res.data;
  },
  async logout() {
    await apiClient('/auth/logout', { method: 'POST' });
  },
};
export default authService;
