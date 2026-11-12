import apiClient from './apiClient';

/**
 * Service quản lý các yêu cầu liên quan đến chuyến bay
 */
export const flightService = {
  /**
   * Lấy Top chuyến bay giá rẻ nhất cho Trang chủ
   * @param {number} [limit=10] - Số lượng chuyến bay tối đa (mặc định 10)
   * @returns {Promise<Array>} Danh sách TopCheapFlightResponse
   */
  async getTopCheapFlights(limit = 10) {
    const res = await apiClient(`/flights/top-cheap?limit=${encodeURIComponent(limit)}`);
    return res?.data || [];
  },

  /**
   * Tìm kiếm chuyến bay theo điều kiện
   */
  async searchFlights({ maDi, maDen, ngayDi, soNguoiLon = 1, soTreEm = 0, maHang }) {
    const params = new URLSearchParams({
      maDi,
      maDen,
      ngayDi,
      soNguoiLon: String(soNguoiLon),
      soTreEm: String(soTreEm),
    });
    if (maHang) {
      params.append('maHang', maHang);
    }
    const res = await apiClient(`/flights?${params.toString()}`);
    return res?.data || [];
  },

  /**
   * Xem chi tiết một chuyến bay theo ID
   */
  async getFlightDetail(id) {
    const res = await apiClient(`/flights/${id}`);
    return res?.data;
  },
};

export default flightService;
