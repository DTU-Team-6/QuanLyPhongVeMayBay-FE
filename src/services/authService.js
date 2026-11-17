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
    const res = await apiClient('/auth/me');
    return res?.data;
  },

  /** Lấy cookie CSRF trước thao tác thay đổi dữ liệu, kể cả đăng nhập. */
  async ensureCsrf() {
    await apiClient('/auth/csrf');
  },

  /** Đăng nhập bằng cookie HttpOnly do Backend cấp. */
  async login(email, password) {
    await this.ensureCsrf();
    const res = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res?.data;
  },

  /**
   * Đăng xuất phiên hiện tại
   */
  async logout() {
    await this.ensureCsrf();
    await apiClient('/auth/logout', { method: 'POST' });
  },
};

export default authService;
