export function validateTicketEdit({ hoTenNguoiDi, emailThanhToan }) {
  const errors = {};
  const name = hoTenNguoiDi.trim();
  const email = emailThanhToan.trim();
  if (name.length < 10 || name.length > 50) errors.hoTenNguoiDi = 'Họ tên phải có từ 10 đến 50 ký tự.';
  if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.emailThanhToan = 'Nhập email hợp lệ, tối đa 100 ký tự.';
  return errors;
}

export function pdfFilename(disposition, id) {
  const encoded = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
  const plain = disposition.match(/filename\s*=\s*"?([^";]+)"?/i)?.[1];
  let name = encoded || plain || `ve-${id}.pdf`;
  try { if (encoded) name = decodeURIComponent(encoded); } catch { name = `ve-${id}.pdf`; }
  name = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').trim();
  return name.toLowerCase().endsWith('.pdf') ? name : `ve-${id}.pdf`;
}
