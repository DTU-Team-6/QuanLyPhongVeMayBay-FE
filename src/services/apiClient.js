import { getCookie } from '../utils/csrf';

/**
 * Địa chỉ gốc backend đọc từ biến môi trường VITE_API_BASE_URL,
 * không viết cứng trong code. Tiền tố /api/v1 đặt tại đây.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const API_PREFIX = '/api/v1';

/**
 * Lớp lỗi chuẩn hóa từ phản hồi RFC 9457 của backend
 */
export class ApiError extends Error {
  constructor({ message, status, code, details = [], raw }) {
    super(message || 'Đã có lỗi xảy ra từ máy chủ');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = Array.isArray(details) ? details : [];
    this.raw = raw;
  }
}

/**
 * Hàm gọi API dùng chung bằng fetch, hỗ trợ HttpOnly cookie và CSRF
 * @param {string} endpoint - Đường dẫn sau /api/v1 (ví dụ: '/flights/top-cheap')
 * @param {RequestInit} [options] - Cấu hình fetch
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${API_PREFIX}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  // Tự động thêm Content-Type JSON nếu có body và chưa cấu hình
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Tự động gắn header X-XSRF-TOKEN cho các request thay đổi dữ liệu
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      headers.set('X-XSRF-TOKEN', xsrfToken);
    }
  }

  const fetchOptions = {
    ...options,
    method,
    headers,
    // Bắt buộc gửi cookie HttpOnly để xác thực phiên
    credentials: 'include',
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Xử lý phản hồi 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Đọc body dạng JSON nếu có
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      // Phản hồi lỗi chuẩn RFC 9457 kèm mã nghiệp vụ code và mảng details
      const errorCode = data?.code || `HTTP_${response.status}`;
      const errorMessage = data?.detail || data?.message || data?.title || `Yêu cầu thất bại với mã ${response.status}`;
      const errorDetails = data?.details || [];

      throw new ApiError({
        message: errorMessage,
        status: response.status,
        code: errorCode,
        details: errorDetails,
        raw: data,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Lỗi mạng hoặc lỗi kết nối (Failed to fetch, CORS...)
    throw new ApiError({
      message: error.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại.',
      status: 0,
      code: 'NETWORK_ERROR',
      details: [],
      raw: error,
    });
  }
}

export default apiClient;
