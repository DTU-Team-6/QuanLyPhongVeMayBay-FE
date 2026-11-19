import flightService from '../../../services/flightService';
import apiClient from '../../../services/apiClient';
import { buildMinPriceDateRange } from '../utils/flightDateHelpers.js';

export { buildMinPriceDateRange } from '../utils/flightDateHelpers.js';

/**
 * Service tìm kiếm chuyến bay cho màn hình danh sách chuyến bay (6.4.6)
 * Bao gồm: tìm kiếm theo điều kiện, lấy giá thấp nhất theo ngày nếu BE hỗ trợ
 */
export const flightSearchService = {
  /**
   * Tìm kiếm danh sách chuyến bay theo các bộ lọc
   * Wrapper trực tiếp từ flightService.searchFlights
   * @param {Object} params - Điều kiện tìm kiếm
   * @param {string} params.maDi - Mã sân bay đi
   * @param {string} params.maDen - Mã sân bay đến
   * @param {string} params.ngayDi - Ngày đi (YYYY-MM-DD)
   * @param {number} params.soNguoiLon - Số người lớn
   * @param {number} params.soTreEm - Số trẻ em
   * @param {string} [params.maHang] - Mã hãng hàng không để lọc (tùy chọn)
   */
  async searchFlights({ maDi, maDen, ngayDi, soNguoiLon = 1, soTreEm = 0, maHang }) {
    return flightService.searchFlights({ maDi, maDen, ngayDi, soNguoiLon, soTreEm, maHang });
  },

  /**
   * Lấy giá thấp nhất theo từng ngày trong dải ngày
   * Gọi BE qua endpoint /flights/min-price-by-date.
   * @param {string} maDi - Mã sân bay đi
   * @param {string} maDen - Mã sân bay đến
   * @param {string} ngayBatDau - Ngày bắt đầu dải (YYYY-MM-DD)
   * @param {string} ngayKetThuc - Ngày kết thúc dải (YYYY-MM-DD)
   * @param {number} soNguoiLon - Số người lớn
   * @param {number} soTreEm - Số trẻ em
   * @returns {Promise<Object|null>} Map { 'YYYY-MM-DD': giaThapNhat } hoặc null khi request lỗi
   */
  async getMinPriceByDateRange({ maDi, maDen, ngayBatDau, ngayKetThuc, soNguoiLon = 1, soTreEm = 0 }) {
    try {
      const params = new URLSearchParams({
        maDi,
        maDen,
        ngayBatDau,
        ngayKetThuc,
        soNguoiLon: String(soNguoiLon),
        soTreEm: String(soTreEm),
      });
      const res = await apiClient(`/flights/min-price-by-date?${params.toString()}`);
      // BE trả về dạng { data: { '2026-11-12': 500000, '2026-11-13': 450000, ... } }
      return res?.data || null;
    } catch {
      // Khi request lỗi, UI vẫn hiển thị kết quả tìm chuyến và để giá gợi ý là "--"
      return null;
    }
  },
};

export default flightSearchService;
