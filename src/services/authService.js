import apiClient from './apiClient';
import { getCookie } from '../utils/csrf';

async function ensureCsrfToken() {
  if (getCookie('XSRF-TOKEN')) return;

  await apiClient('/auth/csrf');
  if (!getCookie('XSRF-TOKEN')) {
    throw new Error('Không nhận được mã CSRF từ Backend. Vui lòng thử lại.');
  }
}

/**
 * Service quản lý xác thực và phiên đăng nhập của người dùng
 */
export const authService = {
  /**
   * Đăng nhập bằng email và mật khẩu; phiên được Backend đặt trong cookie HttpOnly.
   * @param {{email: string, password: string}} credentials
   */
  async login(credentials) {
    await ensureCsrfToken();
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response?.data) {
      throw new Error('Backend trả về dữ liệu đăng nhập không hợp lệ.');
    }

    return response.data;
  },

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
