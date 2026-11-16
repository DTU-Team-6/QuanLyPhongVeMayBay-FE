function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function isAdult(dateOfBirth, today = new Date()) {
  const birthDate = parseLocalDate(dateOfBirth);
  if (!birthDate) return false;

  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age >= 18;
}

export function validateRegistration(values, today = new Date()) {
  const errors = {};

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password || '')) {
    errors.password = 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.';
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận chưa khớp.';
  }
  if (!isAdult(values.dateOfBirth, today)) {
    errors.dateOfBirth = 'Chủ tài khoản phải đủ 18 tuổi.';
  }

  return errors;
}
