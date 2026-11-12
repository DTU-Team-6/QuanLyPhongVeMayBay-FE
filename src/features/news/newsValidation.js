import { NEWS_CATEGORIES } from './newsTypes.js';

const ALLOWED_CATEGORY_VALUES = new Set(NEWS_CATEGORIES.map((item) => item.value));
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_TITLE_LENGTH = 255;
export const MAX_IMAGE_URL_LENGTH = 255;

/**
 * Kiểm tra tệp ảnh được chọn từ máy người dùng (JPG/PNG, tối đa 5 MB).
 * Trả về chuỗi lỗi hoặc null nếu hợp lệ.
 */
export function validateNewsImageFile(file) {
  if (!file) return null;
  const lowerName = (file.name || '').toLowerCase();
  const hasValidExtension =
    lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png');

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type) && !hasValidExtension) {
    return 'Chỉ hỗ trợ ảnh định dạng JPG hoặc PNG.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Dung lượng ảnh không được vượt quá 5 MB.';
  }
  return null;
}

/**
 * Chuẩn hóa tên tệp ảnh local thành đường dẫn hợp lệ giới hạn 255 ký tự để lưu DB.
 */
export function buildLocalNewsImagePath(fileName) {
  const safeName = String(fileName || 'news-cover.jpg')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-');
  const fullPath = `/assets/news/${safeName}`;
  return fullPath.length <= MAX_IMAGE_URL_LENGTH
    ? fullPath
    : fullPath.slice(0, MAX_IMAGE_URL_LENGTH);
}

/**
 * Kiểm tra dữ liệu biểu mẫu Thêm / Sửa tin tức.
 */
export function validateNewsForm(values) {
  const errors = {};
  const tieuDe = String(values?.tieuDe || '').trim();
  const moTaNgan = String(values?.moTaNgan || '').trim();
  const noiDung = String(values?.noiDung || '').trim();
  const loaiTin = String(values?.loaiTin || '').trim();
  const anhDaiDien = String(values?.anhDaiDien || '').trim();

  if (!tieuDe) {
    errors.tieuDe = 'Vui lòng nhập tiêu đề tin tức.';
  } else if (tieuDe.length > MAX_TITLE_LENGTH) {
    errors.tieuDe = `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự.`;
  }

  if (!moTaNgan) {
    errors.moTaNgan = 'Vui lòng nhập mô tả ngắn.';
  }

  if (!noiDung) {
    errors.noiDung = 'Vui lòng nhập nội dung bài viết.';
  }

  if (!loaiTin || !ALLOWED_CATEGORY_VALUES.has(loaiTin)) {
    errors.loaiTin = 'Vui lòng chọn chuyên mục phù hợp.';
  }

  if (!anhDaiDien) {
    errors.anhDaiDien = 'Vui lòng chọn ảnh đại diện hoặc nhập đường dẫn ảnh.';
  } else if (anhDaiDien.length > MAX_IMAGE_URL_LENGTH) {
    errors.anhDaiDien = `Đường dẫn ảnh không được vượt quá ${MAX_IMAGE_URL_LENGTH} ký tự.`;
  }

  return errors;
}

/**
 * Chuyển đổi dữ liệu form thành payload gửi API Backend (POST / PUT /api/v1/tin-tuc).
 */
export function buildNewsPayload(values, mode = 'create', userId = null) {
  const category = NEWS_CATEGORIES.find((item) => item.value === values.loaiTin);
  const payload = {
    tieuDe: String(values.tieuDe || '').trim(),
    moTaNgan: String(values.moTaNgan || '').trim(),
    noiDung: String(values.noiDung || '').trim(),
    anhDaiDien: String(values.anhDaiDien || '').trim(),
    loaiTin: values.loaiTin,
    chuyenMuc: category ? category.label : undefined,
    trangThai: values.trangThai || 'HIEN_THI',
  };

  if (mode === 'create' && userId != null) {
    payload.nguoiDungId = userId;
  }

  return payload;
}

/**
 * Ánh xạ mảng details lỗi RFC 9457 của Backend vào từng trường form.
 */
export function mapNewsApiFieldErrors(error) {
  const fieldErrors = {};
  if (!Array.isArray(error?.details)) return fieldErrors;
  for (const item of error.details) {
    if (item?.field && item?.message && !fieldErrors[item.field]) {
      fieldErrors[item.field] = item.message;
    }
  }
  return fieldErrors;
}
