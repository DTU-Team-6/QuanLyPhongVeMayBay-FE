function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function isAdult(dateOfBirth, today = new Date()) {
  return Boolean(parseLocalDate(dateOfBirth)) && dateOfBirth <= adultDateLimit(today);
}

export function adultDateLimit(today = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(today);
  const part = (name) => Number(parts.find((item) => item.type === name).value);
  const year = part('year') - 18;
  const month = part('month');
  const day = Math.min(part('day'), new Date(Date.UTC(year, month, 0)).getUTCDate());
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function validatePassword(password) {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password || '')) {
    return 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.';
  }
  if (new TextEncoder().encode(password).length > 72) {
    return 'Mật khẩu không được vượt quá 72 byte khi mã hóa.';
  }
  return '';
}

export function validateRegistration(values, today = new Date()) {
  const errors = {};
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận chưa khớp.';
  }
  if (!isAdult(values.dateOfBirth, today)) {
    errors.dateOfBirth = 'Chủ tài khoản phải đủ 18 tuổi.';
  }
  if (!/^\+?[0-9 ]{8,20}$/.test((values.phone || '').trim())) {
    errors.phone = 'Số điện thoại không đúng định dạng.';
  }

  return errors;
}
