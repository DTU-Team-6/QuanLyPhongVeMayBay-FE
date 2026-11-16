import test from 'node:test';
import assert from 'node:assert/strict';
import { DESTINATION_LIMITS, destinationPayload, destinationQuery, validateDestination, validDestinationImage, destinationFieldErrors } from './destinationHelpers.js';

const airports = [{ maSanBay: 'DAD' }, { maSanBay: 'HAN' }];
const valid = { tenDiemDen: 'Cầu Rồng', maSanBay: 'DAD', moTa: '', hinhAnh: '' };

test('form điểm đến bắt buộc tên/sân bay, chỉ chọn sân bay có trong API', () => {
  const missing = validateDestination({ tenDiemDen: '   ', maSanBay: '' }, airports);
  assert.equal(missing.isValid, false);
  assert.ok(missing.errors.tenDiemDen);
  assert.ok(missing.errors.maSanBay);
  assert.ok(validateDestination({ ...valid, maSanBay: 'XXX' }, airports).errors.maSanBay);
  assert.equal(validateDestination(valid, airports).isValid, true);
});

test('độ dài từng trường khớp DTO và không bắt buộc mô tả/ảnh', () => {
  for (const [field, limit] of Object.entries(DESTINATION_LIMITS)) {
    assert.ok(validateDestination({ ...valid, [field]: 'a'.repeat(limit + 1) }).errors[field]);
  }
  assert.equal(validateDestination({ ...valid, tenDiemDen: 'a'.repeat(100), moTa: 'a'.repeat(5000) }, airports).isValid, true);
});

test('payload chuẩn hóa tên/mã sân bay, bỏ field ngoài hợp đồng', () => {
  assert.deepEqual(destinationPayload({ tenDiemDen: '  Cầu   Rồng  ', maSanBay: ' dad ', moTa: '  Giới thiệu  ', hinhAnh: ' ', id: 999 }), {
    tenDiemDen: 'Cầu Rồng', maSanBay: 'DAD', moTa: 'Giới thiệu', hinhAnh: null,
  });
});

test('ảnh chỉ nhận đường dẫn website hoặc http(s) an toàn', () => {
  for (const value of ['', '/assets/destinations/danang.jpg', 'https://images.example.test/a%20b.jpg?width=400', 'http://localhost:8080/assets/a.jpg']) {
    assert.equal(validDestinationImage(value), true, value);
  }
  for (const value of ['javascript:alert(1)', 'data:image/svg+xml,test', '//example.test/a.jpg', '/assets/../a.jpg', '/assets/%2e%2e/a.jpg', '/assets\\a.jpg', '/a b.jpg', '/%2fexample.com/a.jpg', '/a%0ab.jpg', '/a%7fb.jpg', 'https://user:password@example.test/a.jpg', 'https://', 'not-a-url']) {
    assert.equal(validDestinationImage(value), false, value);
  }
});

test('lỗi BE được gắn đúng field và xử lý mã trùng/sân bay bị xóa', () => {
  assert.deepEqual(destinationFieldErrors({ code: 'DESTINATION_ALREADY_EXISTS' }), { tenDiemDen: 'Điểm đến đã tồn tại ở sân bay này' });
  assert.ok(destinationFieldErrors({ code: 'AIRPORT_NOT_FOUND' }).maSanBay);
  assert.deepEqual(destinationFieldErrors({ details: [{ field: 'moTa', message: 'Quá dài' }, { field: 'other', message: 'Bỏ qua' }] }), { moTa: 'Quá dài' });
});

test('query tìm kiếm encode dấu và ký tự đặc biệt, giữ đúng phân trang', () => {
  const query = new URLSearchParams(destinationQuery({ keyword: '  Cầu & Rồng  ', maSanBay: ' dad ', page: 2, size: 10 }));
  assert.equal(query.get('keyword'), 'Cầu & Rồng');
  assert.equal(query.get('maSanBay'), 'DAD');
  assert.equal(query.get('page'), '2');
  assert.equal(query.get('size'), '10');
  assert.equal(new URLSearchParams(destinationQuery()).has('keyword'), false);
});
