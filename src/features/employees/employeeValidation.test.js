import test from 'node:test';
import assert from 'node:assert/strict';
import { employeePayload, fieldErrorsFromApi, validateEmployee } from './employeeValidation.js';

const valid = {
  maNhanVien: 'NV008', hoTen: 'Nguyễn Văn An', ngaySinh: '1995-05-12',
  gioiTinh: 'Nam', email: 'an@example.com', matKhau: 'abcdefgh',
  soDienThoai: '0901234567', vaiTro: 'NHAN_VIEN',
};

test('validateEmployee kiểm tra đúng trường khi thêm và sửa', () => {
  assert.deepEqual(validateEmployee(valid, 'create'), {});
  assert.deepEqual(validateEmployee(valid, 'edit'), {});
  assert.ok(validateEmployee({ ...valid, maNhanVien: '', matKhau: '' }, 'create').maNhanVien);
  assert.equal(validateEmployee({ ...valid, maNhanVien: '', matKhau: '' }, 'edit').maNhanVien, undefined);
  assert.ok(validateEmployee({ ...valid, vaiTro: 'KHACH_HANG' }, 'edit').vaiTro);
});

test('employeePayload không gửi mã nhân viên và mật khẩu khi sửa', () => {
  const payload = employeePayload(valid, 'edit');
  assert.equal(payload.maNhanVien, undefined);
  assert.equal(payload.matKhau, undefined);
  assert.equal(payload.hoTen, valid.hoTen);
});

test('fieldErrorsFromApi ánh xạ lỗi Backend vào đúng trường', () => {
  assert.deepEqual(fieldErrorsFromApi({ details: [{ field: 'email', message: 'Email đã được sử dụng.' }] }), { email: 'Email đã được sử dụng.' });
});
