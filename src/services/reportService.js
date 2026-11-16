import apiClient from './apiClient';

/**
 * Service gọi API Báo cáo & Thống kê từ Backend Spring Boot
 * Endpoint: /reports và /statistics
 */
export const reportService = {
  /**
   * Tạo báo cáo chi tiết qua POST /api/v1/reports
   * @param {Object} filter - ReportFilterRequest
   * @returns {Promise<Object>} ReportResponse
   */
  async createReport(filter, options = {}) {
    const res = await apiClient('/reports', {
      ...options,
      method: 'POST',
      body: JSON.stringify(filter),
    });
    return res?.data;
  },

  /**
   * Tạo báo cáo chi tiết qua GET /api/v1/reports/generate
   * @param {Object} filter - query parameters
   * @returns {Promise<Object>} ReportResponse
   */
  async generateReport(filter, options = {}) {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/reports/generate?${queryString}` : '/reports/generate';
    const res = await apiClient(endpoint, options);
    return res?.data;
  },

  /**
   * Lấy số liệu thống kê tổng hợp qua GET /api/v1/statistics
   * @param {Object} filter - StatisticsFilterRequest
   * @returns {Promise<Object>} StatisticsResponse
   */
  async getStatistics(filter = {}, options = {}) {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/statistics?${queryString}` : '/statistics';
    const res = await apiClient(endpoint, options);
    return res?.data;
  },
};

export default reportService;
