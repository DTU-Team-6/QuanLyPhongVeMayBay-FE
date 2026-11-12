import apiClient from '../../../services/apiClient';

/**
 * Service kết nối API CRUD Tin tức (/api/v1/tin-tuc) của Backend.
 */
const newsService = {
  /**
   * 99.4.1 Lấy danh sách tin tức có tìm kiếm, lọc chuyên mục, trạng thái và phân trang
   * @param {Object} params
   * @returns {Promise<{content: Array, pageNumber: number, pageSize: number, totalElements: number, totalPages: number, isFirst: boolean, isLast: boolean}>}
   */
  async getNewsList({ keyword, loaiTin, chuyenMuc, trangThai, page = 0, size = 6 } = {}) {
    const query = new URLSearchParams();
    if (keyword && keyword.trim()) query.set('keyword', keyword.trim());
    if (loaiTin) query.set('loaiTin', loaiTin);
    if (chuyenMuc) query.set('chuyenMuc', chuyenMuc);
    if (trangThai) query.set('trangThai', trangThai);
    query.set('page', String(page));
    query.set('size', String(size));

    const res = await apiClient(`/tin-tuc?${query.toString()}`, { method: 'GET' });
    return res?.data;
  },

  /**
   * Xem chi tiết một bài viết tin tức theo ID
   * @param {number|string} id
   */
  async getNewsDetail(id) {
    const res = await apiClient(`/tin-tuc/${id}`, { method: 'GET' });
    return res?.data;
  },

  /**
   * 99.4.3 Thêm tin tức mới
   * @param {Object} payload
   */
  async createNews(payload) {
    const res = await apiClient('/tin-tuc', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.data;
  },

  /**
   * 99.4.4 Cập nhật bài viết tin tức
   * @param {number|string} id
   * @param {Object} payload
   */
  async updateNews(id, payload) {
    const res = await apiClient(`/tin-tuc/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data;
  },

  /**
   * 99.4.2 Xóa bài viết tin tức
   * @param {number|string} id
   */
  async deleteNews(id) {
    const res = await apiClient(`/tin-tuc/${id}`, { method: 'DELETE' });
    return res?.data;
  },
};

export default newsService;
