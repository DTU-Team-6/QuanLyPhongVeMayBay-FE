/**
 * Định dạng tiền tệ VND theo quy ước giao diện (ví dụ: 1.800.000 ₫)
 * Tuyệt đối không tự tính lại tiền, chỉ format giá trị BE trả về.
 */
export function formatCurrency(amount, currency = 'VND') {
  if (amount === undefined || amount === null) return '0 ₫';
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return `${amount} ${currency}`;

  const formatted = new Intl.NumberFormat('vi-VN').format(num);
  return currency === 'VND' ? `${formatted} ₫` : `${formatted} ${currency}`;
}

/**
 * Định dạng giờ phút (HH:mm) theo timeZone của sân bay
 * @param {string} isoString - Chuỗi ISO 8601 kèm offset từ backend
 * @param {string} timeZone - Múi giờ IANA do backend trả về (ví dụ: "Asia/Ho_Chi_Minh")
 */
export function formatTime(isoString, timeZone = 'Asia/Ho_Chi_Minh') {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timeZone || 'Asia/Ho_Chi_Minh',
    }).format(date);
  } catch {
    // Fallback nếu chuỗi có định dạng T HH:mm
    const match = isoString.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : isoString;
  }
}

/**
 * Định dạng ngày (dd/MM/yyyy) theo timeZone của sân bay
 */
export function formatDate(isoString, timeZone = 'Asia/Ho_Chi_Minh') {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: timeZone || 'Asia/Ho_Chi_Minh',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Định dạng thứ và ngày (ví dụ: Thứ năm, 12/11/2026)
 */
export function formatFullDate(isoString, timeZone = 'Asia/Ho_Chi_Minh') {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const dayName = new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      timeZone: timeZone || 'Asia/Ho_Chi_Minh',
    }).format(date);
    const dateFormatted = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: timeZone || 'Asia/Ho_Chi_Minh',
    }).format(date);
    // Viết hoa chữ cái đầu (thứ năm -> Thứ năm)
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return `${capitalized}, ${dateFormatted}`;
  } catch {
    return isoString;
  }
}

/**
 * Định dạng thời lượng bay từ số phút sang "X giờ Y phút"
 */
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 phút';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} giờ ${remainingMinutes} phút`;
  }
  if (hours > 0) {
    return `${hours} giờ`;
  }
  return `${remainingMinutes} phút`;
}
