import apiClient from './apiClient';

/**
 * Service quản lý xác thực và phiên đăng nhập của người dùng
 */
export const authService = {
  /**
   * Lấy thông tin người dùng hiện tại từ cookie HttpOnly
   * BE trả về id, hoTen, email, vaiTro (ADMIN, NHAN_VIEN, KHACH_HANG)
   */
  async getCurrentUser() {
    try {
      const res = await apiClient('/auth/me');
      return res?.data;
    } catch {
      return null;
    }
  },

  /**
   * Đăng xuất phiên hiện tại
   */
  async logout() {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Lỗi khi gọi logout:', e);
    }
  },

  /**
   * Làm mới access token
   */
  async refreshToken() {
    try {
      const res = await apiClient('/auth/refresh', { method: 'POST' });
      return res?.data;
    } catch {
      return null;
    }
  },
};

export default authService;
