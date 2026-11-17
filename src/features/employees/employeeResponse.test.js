import test from 'node:test';
import assert from 'node:assert/strict';
import { requireEmployeeList } from './employeeResponse.js';

test('GET nhân viên giữ dữ liệu đúng hợp đồng', () => {
  const list = { nhanVien: [], tongSo: 0, tongTrang: 0, trang: 0, kichThuoc: 20 };
  assert.equal(requireEmployeeList({ data: list }), list);
});

test('GET nhân viên thiếu dữ liệu phải báo lỗi thay vì hiển thị danh sách rỗng', () => {
  assert.throws(() => requireEmployeeList(null), /không đúng hợp đồng/);
  assert.throws(() => requireEmployeeList({ data: { nhanVien: [], tongSo: undefined } }), /không đúng hợp đồng/);
});
