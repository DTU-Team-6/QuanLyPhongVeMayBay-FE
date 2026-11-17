import { apiClient, apiClientBlob } from '../../services/apiClient';

const RESOURCE = '/ve-may-bay';

export const TICKET_SEARCH_OPTIONS = [
  { value: 'MA_VE', label: 'Mã vé' },
  { value: 'MA_DAT_CHO', label: 'Mã đặt chỗ' },
  { value: 'TEN_NGUOI_DI', label: 'Tên người đi' },
  { value: 'MA_CHUYEN_BAY', label: 'Mã chuyến bay' },
];

export const TICKET_STATES = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'CHO_THANH_TOAN', label: 'Chờ thanh toán' },
  { value: 'DA_THANH_TOAN', label: 'Đã thanh toán' },
  { value: 'DA_HUY', label: 'Đã hủy' },
];

export function ticketQuery(filter = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== '' && value !== null && value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

export function validateTicketEdit({ hoTenNguoiDi, emailThanhToan }) {
  const errors = {};
  const name = hoTenNguoiDi.trim();
  const email = emailThanhToan.trim();
  if (name.length < 10 || name.length > 50) errors.hoTenNguoiDi = 'Họ tên phải có từ 10 đến 50 ký tự.';
  if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.emailThanhToan = 'Nhập email hợp lệ, tối đa 100 ký tự.';
  return errors;
}

export function pdfFilename(disposition, id) {
  const encoded = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
  const plain = disposition.match(/filename\s*=\s*"?([^";]+)"?/i)?.[1];
  let name = encoded || plain || `ve-${id}.pdf`;
  try { if (encoded) name = decodeURIComponent(encoded); } catch { name = `ve-${id}.pdf`; }
  name = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').trim();
  return name.toLowerCase().endsWith('.pdf') ? name : `ve-${id}.pdf`;
}

export const ticketService = {
  /** GET /api/v1/ve-may-bay: PageResponse<VeDanhSachResponse>. */
  async list(filter = {}) {
    const query = ticketQuery(filter);
    const response = await apiClient(`${RESOURCE}${query ? `?${query}` : ''}`);
    return response?.data;
  },
  /** PUT chỉ hỗ trợ sửa tên người đi và email thanh toán khi vé chờ thanh toán. */
  async update(id, payload) {
    const response = await apiClient(`${RESOURCE}/${encodeURIComponent(id)}`, {
      method: 'PUT', body: JSON.stringify(payload),
    });
    return response?.data;
  },
  /** GET PDF thật từ Backend; không dựng tệp vé ở trình duyệt. */
  async downloadPdf(id) {
    return apiClientBlob(`${RESOURCE}/${encodeURIComponent(id)}/pdf`);
  },
};
