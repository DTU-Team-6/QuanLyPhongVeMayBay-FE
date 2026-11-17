export function validateLookup({ maDatCho, email, soDienThoai }) {
  const errors = {};
  const code = maDatCho.trim();
  const mail = email.trim();
  const phone = soDienThoai.trim();
  if (!code || code.length > 10) errors.maDatCho = 'Nhập mã đặt chỗ, tối đa 10 ký tự.';
  if (!mail || mail.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) errors.email = 'Nhập email hợp lệ, tối đa 100 ký tự.';
  if (!/^\+?[0-9 ]{8,20}$/.test(phone)) errors.soDienThoai = 'Số điện thoại cần 8–20 ký tự, chỉ gồm số, khoảng trắng và dấu + ở đầu.';
  return errors;
}

export function requireFlightLookup(response) {
  if (!response?.data || !Array.isArray(response.data.chuyenBay)) {
    throw new Error('Dữ liệu chuyến bay từ máy chủ không đúng định dạng.');
  }
  return response.data.chuyenBay;
}
