import apiClient from '../../services/apiClient';

const RESOURCE = '/nhan-vien';

export const employeeService = {
  /**
   * GET đã có hợp đồng trên nhánh Backend feature/danh-sach-nhan-vien,
   * nhưng chưa được merge vào develop. Giữ nguyên bảo vệ ADMIN của Backend.
   * @param {{tieuChi?: string, tuKhoa?: string, trang?: number, kichThuoc?: number}} filter
   * @returns {Promise<import('./employeeTypes').DanhSachNhanVien>}
   */
  async list(filter = {}) {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    const query = params.toString();
    const response = await apiClient(`${RESOURCE}${query ? `?${query}` : ''}`);
    return response?.data;
  },

  /** @param {import('./employeeTypes').ThemNhanVienRequest} payload */
  async create(payload) {
    const response = await apiClient(RESOURCE, { method: 'POST', body: JSON.stringify(payload) });
    return response?.data;
  },

  /** @param {number} id @param {import('./employeeTypes').SuaNhanVienRequest} payload */
  async update(id, payload) {
    const response = await apiClient(`${RESOURCE}/${encodeURIComponent(id)}`, {
      method: 'PUT', body: JSON.stringify(payload),
    });
    return response?.data;
  },

  /** @param {number} id */
  async remove(id) {
    const response = await apiClient(`${RESOURCE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return response?.data;
  },
};

export default employeeService;
