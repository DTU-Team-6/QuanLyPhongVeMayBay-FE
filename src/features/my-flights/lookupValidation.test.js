import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLookup, requireFlightLookup } from './lookupValidation.js';

test('tra cứu cần đủ ba thông tin theo DTO Backend', () => {
  assert.deepEqual(validateLookup({ maDatCho: 'MH002', email: 'a@example.com', soDienThoai: '0935847238' }), {});
  const errors = validateLookup({ maDatCho: '', email: 'sai', soDienThoai: '123' });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'maDatCho', 'soDienThoai']);
  assert.ok(validateLookup({ maDatCho: '12345678901', email: 'a@example.com', soDienThoai: '0935847238' }).maDatCho);
});

test('không hiển thị kết quả sai hợp đồng như dữ liệu thật', () => {
  assert.throws(() => requireFlightLookup({ data: {} }));
  assert.deepEqual(requireFlightLookup({ data: { chuyenBay: [] } }), []);
});
