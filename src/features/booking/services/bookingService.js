import apiClient from '../../../services/apiClient';

/**
 * Service đặt chỗ và thông tin hành khách (6.4.8)
 * Khớp DatChoController: POST /api/v1/dat-cho
 */
export const bookingService = {
  /**
   * Tạo đơn đặt chỗ và lưu thông tin hành khách
   * @param {Object} bookingData - Payload khớp BookingRequest của BE:
   * {
   *   hangVeId: number,
   *   emailNguoiDat: string,
   *   soDienThoaiNguoiDat: string,
   *   hoTenNguoiDat: string,
   *   soNguoiLon: number,
   *   soTreEm: number,
   *   soEmBe: number,
   *   hanhKhach: Array<{
   *     hoTen: string,
   *     ngaySinh: string (YYYY-MM-DD),
   *     gioiTinh: 'Nam' | 'Nu' | 'Khac',
   *     email: string,
   *     soDienThoai: string,
   *     cmndPassport?: string,
   *     loaiHanhKhach: 'NGUOI_LON' | 'TRE_EM' | 'EM_BE'
   *   }>
   * }
   * @returns {Promise<Object>} BookingResponse { id, maDatCho, tongGiaBan, trangThai, soHanhKhach }
   */
  async createBooking(bookingData) {
    const res = await apiClient('/dat-cho', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return res?.data;
  },

  /**
   * Lấy danh sách gói hành lý bổ sung (nếu BE hỗ trợ endpoint này)
   * @returns {Promise<Array>} Danh sách BaggageOption hoặc [] nếu chưa có
   */
  async getBaggageOptions() {
    try {
      const res = await apiClient('/baggage-options');
      return res?.data || [];
    } catch {
      return [];
    }
  },
};

export default bookingService;
