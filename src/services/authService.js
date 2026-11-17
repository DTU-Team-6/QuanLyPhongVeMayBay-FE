import apiClient, { refreshSession } from './apiClient';
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
  getOAuthUrl(provider) {
    if (!['google', 'facebook'].includes(provider)) {
      throw new Error('Nhà cung cấp đăng nhập không hợp lệ.');
    }
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
    if (!baseUrl) {
      throw new Error('Chưa cấu hình VITE_API_BASE_URL. Hãy tạo file .env theo .env.example.');
    }
    return `${baseUrl}/oauth2/authorization/${provider}`;
  },

  async register(registration) {
    await ensureCsrfToken();
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registration),
    });

    if (!response?.data) {
      throw new Error('Backend trả về dữ liệu đăng ký không hợp lệ.');
    }

    return response.data;
  },

  /**
   * Đăng nhập bằng email và mật khẩu; phiên được Backend đặt trong cookie HttpOnly.
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
    } catch (error) {
      if (error?.status === 401) return null;
      throw error;
    }
  },

  /**
   * Đăng xuất phiên hiện tại
   */
  async logout() {
    await ensureCsrfToken();
    await apiClient('/auth/logout', { method: 'POST' });
  },

  /**
   * Làm mới access token
   */
  async refreshToken() {
    await refreshSession();
  },
};

export default authService;
