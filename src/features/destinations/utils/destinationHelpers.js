export const DESTINATION_LIMITS = { tenDiemDen: 100, maSanBay: 10, moTa: 5000, hinhAnh: 255 };

export function destinationPayload(values) {
  return {
    tenDiemDen: (values.tenDiemDen || '').trim().replace(/\s+/g, ' '),
    maSanBay: (values.maSanBay || '').trim().toUpperCase(),
    moTa: values.moTa?.trim() || null,
    hinhAnh: values.hinhAnh?.trim() || null,
  };
}

/** Ảnh dùng đường dẫn website hoặc URL http(s); không nhận URL thực thi hay đường dẫn lùi thư mục. */
export function validDestinationImage(value) {
  if (!value) return true;
  if (/[\s\\\u0000-\u001f\u007f-\u009f]/.test(value) || value.startsWith('//')) return false;
  try {
    const absolute = /^https?:\/\//i.test(value);
    if (!absolute && !value.startsWith('/')) return false;
    const url = new URL(value, 'https://destination.invalid');
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) return false;
    // Kiểm tra trước khi URL tự chuẩn hóa các đoạn . hoặc ..
    const path = (absolute ? value.replace(/^https?:\/\/[^/?#]*/i, '') : value).split(/[?#]/)[0];
    const decoded = decodeURIComponent(path);
    if (decoded.startsWith('//') || /[\u0000-\u001f\u007f-\u009f]/.test(decoded) || decoded.includes('\\') || decoded.split('/').some((part) => part === '.' || part === '..')) return false;
    return true;
  } catch { return false; }
}

export function validateDestination(values, airports) {
  const payload = destinationPayload(values);
  const errors = {};
  if (!payload.tenDiemDen) errors.tenDiemDen = 'Vui lòng nhập tên điểm đến';
  if (!payload.maSanBay) errors.maSanBay = 'Vui lòng chọn sân bay kết nối';
  for (const [field, limit] of Object.entries(DESTINATION_LIMITS)) {
    if (payload[field]?.length > limit) errors[field] = `Tối đa ${limit.toLocaleString('vi-VN')} ký tự`;
  }
  if (payload.maSanBay && Array.isArray(airports) && !airports.some((airport) => airport.maSanBay === payload.maSanBay)) errors.maSanBay = 'Sân bay không có trong danh sách hiện tại. Vui lòng chọn lại';
  if (payload.hinhAnh && !validDestinationImage(payload.hinhAnh)) errors.hinhAnh = 'Dùng URL http(s) hoặc đường dẫn bắt đầu bằng /, không chứa khoảng trắng hay đoạn lùi thư mục';
  return { isValid: Object.keys(errors).length === 0, errors, payload };
}

export function destinationFieldErrors(error) {
  const errors = {};
  for (const detail of error?.details || []) {
    if (Object.hasOwn(DESTINATION_LIMITS, detail.field)) errors[detail.field] = detail.message;
  }
  if (error?.code === 'DESTINATION_ALREADY_EXISTS' && !errors.tenDiemDen) errors.tenDiemDen = 'Điểm đến đã tồn tại ở sân bay này';
  if (error?.code === 'AIRPORT_NOT_FOUND') errors.maSanBay = 'Sân bay không còn tồn tại. Vui lòng tải lại danh sách';
  return errors;
}

export function destinationQuery({ keyword = '', maSanBay = '', page = 0, size = 10 } = {}) {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (keyword.trim()) query.set('keyword', keyword.trim());
  if (maSanBay.trim()) query.set('maSanBay', maSanBay.trim().toUpperCase());
  return query.toString();
}
