import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTicketEdit, pdfFilename } from './ticketUtils.js';

test('form sửa vé tuân thủ giới hạn Backend', () => {
  assert.deepEqual(validateTicketEdit({ hoTenNguoiDi: 'Nguyen Van An', emailThanhToan: 'an@example.com' }), {});
  const errors = validateTicketEdit({ hoTenNguoiDi: 'An', emailThanhToan: 'sai-email' });
  assert.ok(errors.hoTenNguoiDi);
  assert.ok(errors.emailThanhToan);
});

test('tên PDF lấy từ Content-Disposition và loại ký tự không an toàn', () => {
  assert.equal(pdfFilename('attachment; filename="ve-12.pdf"', 12), 've-12.pdf');
  assert.equal(pdfFilename("attachment; filename*=UTF-8''ve%20moi.pdf", 12), 've moi.pdf');
  assert.equal(pdfFilename('attachment; filename="bad/path.pdf"', 12), 'bad_path.pdf');
});
