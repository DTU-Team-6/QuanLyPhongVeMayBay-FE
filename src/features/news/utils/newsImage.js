import fallbackNewsBanner from '../../../assets/hanoi-promo.png';

/**
 * Trả về đường dẫn hiển thị ảnh đại diện tin tức.
 * Nếu chuỗi trống hoặc ảnh từ BE không tải được, dùng ảnh dự phòng của hệ thống.
 */
export function resolveNewsImageSrc(url, previewUrl = '') {
  if (previewUrl) return previewUrl;
  if (!url) return fallbackNewsBanner;
  return url;
}

export function handleNewsImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = fallbackNewsBanner;
}

export { fallbackNewsBanner };
