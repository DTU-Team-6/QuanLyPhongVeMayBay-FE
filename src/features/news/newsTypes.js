/**
 * Định nghĩa enum chuyên mục, trạng thái và các hàm định dạng tin tức
 * khớp với LoaiTinTuc & TrangThaiTinTuc của Backend.
 */
export const NEWS_CATEGORIES = [
  { value: 'KHUYEN_MAI', label: 'Khuyến mãi' },
  { value: 'THONG_BAO', label: 'Thông tin chuyến bay' },
  { value: 'QUY_DINH_HANH_LY', label: 'Kinh nghiệm bay' },
  { value: 'GIOI_THIEU', label: 'Điểm đến' },
];

export const NEWS_STATUSES = [
  { value: 'HIEN_THI', label: 'Hiển thị' },
  { value: 'AN', label: 'Ẩn bài viết' },
];

export function getNewsCategoryLabel(loaiTin, chuyenMuc) {
  if (chuyenMuc) return chuyenMuc;
  const matched = NEWS_CATEGORIES.find((item) => item.value === loaiTin);
  return matched ? matched.label : 'Tin tức';
}

export function formatNewsCode(id, maTin) {
  if (maTin) return maTin;
  if (id == null) return 'TT---';
  return `TT${String(id).padStart(3, '0')}`;
}

export function formatNewsDate(ngayDang, thoiGianTao) {
  if (ngayDang) return ngayDang;
  if (!thoiGianTao) return '—';
  const parsed = new Date(thoiGianTao);
  if (Number.isNaN(parsed.getTime())) return String(thoiGianTao);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

export function estimateReadingMinutes(content) {
  const words = String(content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}
