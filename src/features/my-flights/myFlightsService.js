import apiClient from '../../services/apiClient';
import { requireFlightLookup } from './lookupValidation';

export const myFlightsService = {
  async lookup(payload) {
    // Tra cứu công khai vẫn cần CSRF; token có thể được Backend xoay sau POST.
    await apiClient('/auth/csrf');
    const response = await apiClient('/chuyen-bay/cua-toi/tra-cuu', {
      method: 'POST', body: JSON.stringify({
        maDatCho: payload.maDatCho.trim().toUpperCase(),
        email: payload.email.trim(),
        soDienThoai: payload.soDienThoai.trim(),
      }),
    });
    return requireFlightLookup(response);
  },
};
