import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatLocalDate,
  getBookingStatusMeta,
  formatPaymentMethod,
} from './paymentFormatters.js';

test('formatLocalDate định dạng đúng YYYY-MM-DD sang dd/MM/yyyy và dd/MM/yy', () => {
  assert.equal(formatLocalDate('2026-11-15'), '15/11/2026');
  assert.equal(formatLocalDate('2026-11-15', true), '15/11/26');
  assert.equal(formatLocalDate(null), '—');
  assert.equal(formatLocalDate(''), '—');
  assert.equal(formatLocalDate('invalid-date'), 'invalid-date');
});

test('getBookingStatusMeta trả về đúng label và class cho từng trạng thái đặt chỗ', () => {
  const choThanhToan = getBookingStatusMeta('CHO_THANH_TOAN');
  assert.equal(choThanhToan.label, 'Chờ thanh toán');
  assert.ok(choThanhToan.badgeClass.includes('text-[#b45309]'));

  const daThanhToan = getBookingStatusMeta('DA_THANH_TOAN');
  assert.equal(daThanhToan.label, 'Đã thanh toán');
  assert.ok(daThanhToan.badgeClass.includes('text-[#15803d]'));

  const daHuy = getBookingStatusMeta('DA_HUY');
  assert.equal(daHuy.label, 'Đã hủy');
  assert.ok(daHuy.badgeClass.includes('text-[#b91c1c]'));

  const unknown = getBookingStatusMeta('UNKNOWN_STATUS');
  assert.equal(unknown.label, 'UNKNOWN_STATUS');
});

test('formatPaymentMethod hiển thị tên phương thức thanh toán thân thiện', () => {
  assert.equal(formatPaymentMethod('VNPAY'), 'VNPAY');
  assert.equal(formatPaymentMethod('PAYPAL'), 'PayPal');
  assert.equal(formatPaymentMethod('TIEN_MAT'), 'Tiền mặt');
  assert.equal(formatPaymentMethod(null), '—');
});
