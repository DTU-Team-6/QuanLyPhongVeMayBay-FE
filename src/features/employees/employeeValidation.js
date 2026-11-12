const NAME_PATTERN = /^[\p{L} ]+$/u;
const CODE_PATTERN = /^[A-Za-z0-9]+$/;
const PHONE_PATTERN = /^[0-9]{10,13}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Kiểm tra trước khi gửi theo ràng buộc DTO của Backend. Backend vẫn là nơi
 * quyết định hợp lệ cuối cùng và kiểm tra trùng dữ liệu.
 */
export function validateEmployee(values, mode) {
  const errors = {};
  const name = values.hoTen?.trim() || '';
  const email = values.email?.trim() || '';
  const birthday = values.ngaySinh || '';

  if (mode === 'create') {
    if (!values.maNhanVien?.trim()) errors.maNhanVien = 'Vui lòng nhập mã nhân viên.';
    else if (values.maNhanVien.length > 20 || !CODE_PATTERN.test(values.maNhanVien)) errors.maNhanVien = 'Mã gồm tối đa 20 chữ cái hoặc chữ số.';
    if (!values.matKhau) errors.matKhau = 'Vui lòng nhập mật khẩu.';
    else if (values.matKhau.length < 8 || values.matKhau.length > 20) errors.matKhau = 'Mật khẩu phải có 8–20 ký tự.';
  }

  if (!name) errors.hoTen = 'Vui lòng nhập họ tên.';
  else if (name.length > 40 || !NAME_PATTERN.test(name)) errors.hoTen = 'Họ tên gồm tối đa 40 chữ cái và khoảng trắng.';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || Number.isNaN(Date.parse(`${birthday}T00:00:00Z`))) errors.ngaySinh = 'Vui lòng chọn ngày sinh hợp lệ.';
  else if (birthday >= new Date().toISOString().slice(0, 10)) errors.ngaySinh = 'Ngày sinh phải trước hôm nay.';

  if (!['Nam', 'Nu', 'Khac'].includes(values.gioiTinh)) errors.gioiTinh = 'Vui lòng chọn giới tính.';
  if (!email) errors.email = 'Vui lòng nhập email.';
  else if (email.length > 40 || !EMAIL_PATTERN.test(email)) errors.email = 'Email không hợp lệ hoặc quá 40 ký tự.';
  if (!PHONE_PATTERN.test(values.soDienThoai || '')) errors.soDienThoai = 'Số điện thoại phải gồm 10–13 chữ số.';
  if (!['ADMIN', 'NHAN_VIEN'].includes(values.vaiTro)) errors.vaiTro = 'Vai trò chỉ có Admin hoặc Nhân viên.';

  return errors;
}

export function employeePayload(values, mode) {
  const shared = {
    hoTen: values.hoTen.trim(),
    ngaySinh: values.ngaySinh,
    gioiTinh: values.gioiTinh,
    email: values.email.trim(),
    soDienThoai: values.soDienThoai,
    vaiTro: values.vaiTro,
  };
  return mode === 'create'
    ? { maNhanVien: values.maNhanVien.trim(), ...shared, matKhau: values.matKhau }
    : shared;
}

export function fieldErrorsFromApi(error) {
  return Object.fromEntries((error.details || []).filter((detail) => detail.field && detail.message).map((detail) => [detail.field, detail.message]));
}
