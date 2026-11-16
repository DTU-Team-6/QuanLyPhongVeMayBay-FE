import { destinationQuery } from '../utils/destinationHelpers.js';

/** Client được truyền vào để kiểm tra chính xác thứ tự CSRF/POST và hợp đồng phân trang. */
export function createDestinationApi(client) {
  return {
    async list(filters, options = {}) {
      const response = await client(`/destinations?${destinationQuery(filters)}`, options);
      const data = response?.data;
      if (!data || !Array.isArray(data.content) || !Number.isInteger(data.pageNumber) || !Number.isInteger(data.totalPages) || !Number.isFinite(data.totalElements)) {
        throw new Error('Dữ liệu danh sách điểm đến không hợp lệ. Vui lòng thử lại.');
      }
      return data;
    },
    async airports(options = {}) {
      const response = await client('/destinations/airports', options);
      if (!Array.isArray(response?.data)) throw new Error('Dữ liệu sân bay không hợp lệ. Vui lòng thử lại.');
      return response.data;
    },
    async create(payload, options = {}) {
      // Lấy cookie trước POST, hoạt động độc lập với nhánh tích hợp đăng nhập.
      await client('/auth/csrf', options);
      const response = await client('/destinations', {
        ...options,
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response?.data?.id) throw new Error('Chưa nhận được xác nhận lưu. Hãy kiểm tra danh sách trước khi thử lại.');
      return response.data;
    },
  };
}
