import apiClient from '../../../services/apiClient';

/**
 * Service xử lý Thanh toán (6.4.3) và Lịch sử giao dịch (6.4.4)
 * Khớp hợp đồng API của ThanhToanController (/api/v1/thanh-toan)
 */
export const paymentService = {
  /**
   * Lấy lịch sử giao dịch có lọc ngày, trạng thái và phân trang
   * @param {Object} params
   * @param {string} [params.tuNgay] - YYYY-MM-DD
   * @param {string} [params.denNgay] - YYYY-MM-DD
   * @param {string} [params.trangThai] - 'CHO_THANH_TOAN' | 'DA_THANH_TOAN' | 'DA_HUY' | ''
   * @param {number} [params.page=0]
   * @param {number} [params.size=6]
   * @returns {Promise<Object>} PageResponse<TransactionHistoryDto>
   */
  async getTransactionHistory({ tuNgay, denNgay, trangThai, page = 0, size = 6 } = {}) {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (tuNgay) query.set('tuNgay', tuNgay);
    if (denNgay) query.set('denNgay', denNgay);
    if (trangThai) query.set('trangThai', trangThai);

    const res = await apiClient(`/thanh-toan/lich-su?${query.toString()}`);
    return res?.data || {
      content: [],
      pageNumber: 0,
      pageSize: size,
      totalElements: 0,
      totalPages: 0,
      isFirst: true,
      isLast: true,
    };
  },

  /**
   * Lấy danh sách các đơn đặt chỗ đang chờ thanh toán từ BE
   */
  async getPendingBookings({ page = 0, size = 50 } = {}) {
    return this.getTransactionHistory({
      trangThai: 'CHO_THANH_TOAN',
      page,
      size,
    });
  },

  /**
   * Khởi tạo URL thanh toán VNPay hoặc PayPal theo hợp đồng CreatePaymentUrlRequest
   * @param {Object} payload
   * @param {number} payload.datChoId
   * @param {'VNPAY'|'PAYPAL'} payload.phuongThuc
   * @param {string} [payload.bankCode]
   * @param {string} [payload.returnUrl]
   * @returns {Promise<Object>} PaymentUrlResponse { paymentUrl, maGiaoDich, datChoId, maDatCho, soTienVnd, soTienUsd, phuongThuc }
   */
  async createPaymentUrl({ datChoId, phuongThuc, bankCode = null, returnUrl }) {
    const res = await apiClient('/thanh-toan/tao-url', {
      method: 'POST',
      body: JSON.stringify({
        datChoId,
        phuongThuc,
        bankCode,
        returnUrl,
      }),
    });
    return res?.data;
  },

  /**
   * Gửi tham số callback từ VNPay lên BE để xác thực chữ ký HMAC-SHA512 và ghi nhận kết quả
   * @param {string} queryString - Chuỗi query params trả về từ VNPay
   * @returns {Promise<Object>} PaymentCallbackResponse
   */
  async verifyVnPayCallback(queryString) {
    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const res = await apiClient(`/thanh-toan/vnpay/callback?${cleanQuery}`);
    return res?.data;
  },

  /**
   * Yêu cầu BE xác nhận và capture đơn PayPal (BE tự verify với PayPal API)
   * @param {string} orderId
   * @returns {Promise<Object>} PaymentCallbackResponse
   */
  async capturePayPalOrder(orderId) {
    const res = await apiClient(`/thanh-toan/paypal/capture?orderId=${encodeURIComponent(orderId)}`, {
      method: 'POST',
    });
    return res?.data;
  },

  /**
   * Hủy đơn đặt chỗ chờ thanh toán (gọi endpoint BE nếu đã triển khai)
   * @param {number} datChoId
   */
  async cancelBooking(datChoId) {
    const res = await apiClient(`/dat-cho/${datChoId}/huy`, {
      method: 'POST',
    });
    return res?.data;
  },
};

export default paymentService;
