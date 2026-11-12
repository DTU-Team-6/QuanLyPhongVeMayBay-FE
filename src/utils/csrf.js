/**
 * Đọc giá trị cookie theo tên từ document.cookie
 * Dùng để lấy token CSRF từ cookie XSRF-TOKEN do backend đặt
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}
