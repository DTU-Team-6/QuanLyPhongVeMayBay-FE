import fallbackNewsBanner from '../../../assets/hanoi-promo.png';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Trả về đường dẫn hiển thị ảnh đại diện tin tức.
 * Nếu chuỗi trống hoặc ảnh từ BE không tải được, dùng ảnh dự phòng của hệ thống.
 */
export function resolveNewsImageSrc(url, previewUrl = '') {
  if (previewUrl) return previewUrl;
  if (!url) return fallbackNewsBanner;
  if (url.startsWith('/api/')) return `${API_BASE_URL}${url}`;
  return url;
}

export function handleNewsImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = fallbackNewsBanner;
}

export { fallbackNewsBanner };
