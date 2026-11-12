/**
 * Định dạng ngày LocalDate (YYYY-MM-DD) sang dd/MM/yyyy hoặc dd/MM/yy
 */
export function formatLocalDate(dateStr, shortYear = false) {
  if (!dateStr) return '—';
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const [, yyyy, mm, dd] = match;
  return shortYear ? `${dd}/${mm}/${yyyy.slice(2)}` : `${dd}/${mm}/${yyyy}`;
}

/**
 * Thông tin hiển thị cho trạng thái đặt chỗ từ BE (TrangThaiDatCho)
 */
export const BOOKING_STATUS_META = {
  CHO_THANH_TOAN: {
    label: 'Chờ thanh toán',
    badgeClass: 'bg-[#fef3c7] text-[#b45309]',
  },
  DA_THANH_TOAN: {
    label: 'Đã thanh toán',
    badgeClass: 'bg-[#dcfce7] text-[#15803d]',
  },
  DA_HUY: {
    label: 'Đã hủy',
    badgeClass: 'bg-[#fee2e2] text-[#b91c1c]',
  },
};

export function getBookingStatusMeta(trangThai) {
  return (
    BOOKING_STATUS_META[trangThai] || {
      label: trangThai || 'Không rõ',
      badgeClass: 'bg-[#f1f5f9] text-[#475569]',
    }
  );
}

/**
 * Nhãn phương thức thanh toán
 */
export function formatPaymentMethod(method) {
  switch (method) {
    case 'VNPAY':
      return 'VNPAY';
    case 'PAYPAL':
      return 'PayPal';
    case 'TIEN_MAT':
      return 'Tiền mặt';
    case 'MOMO':
      return 'MoMo';
    case 'THE_NOI_DIA':
      return 'Thẻ nội địa';
    default:
      return method || '—';
  }
}
