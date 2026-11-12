import apiClient from './apiClient';

/**
 * Service lấy cấu hình và thông tin công khai dùng chung cho Header, Footer, Banner
 */
export const publicService = {
  /**
   * Lấy thông tin chung (hotline, email, brand, policyLinks, banners...)
   */
  async getCommonInfo() {
    try {
      const res = await apiClient('/public/common-info');
      return res?.data;
    } catch {
      // Khi BE chưa sẵn sàng, trả về null để FE dùng dữ liệu mặc định theo Figma
      return null;
    }
  },
};

export default publicService;
