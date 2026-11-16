import test from 'node:test';
import assert from 'node:assert/strict';
import { createDestinationApi } from './destinationApi.js';

const page = { content: [{ id: 1, tenDiemDen: 'Cầu Rồng' }], pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1, isFirst: true, isLast: true };

test('list đọc envelope phân trang và chuyển signal hủy tới API', async () => {
  const controller = new AbortController();
  const api = createDestinationApi(async (endpoint, options) => {
    assert.equal(endpoint, '/destinations?page=0&size=10&maSanBay=DAD');
    assert.equal(options.signal, controller.signal);
    return { data: page };
  });
  assert.deepEqual(await api.list({ maSanBay: 'DAD' }, { signal: controller.signal }), page);
});

test('sân bay lấy từ endpoint thực tế và response sai cấu trúc bị từ chối', async () => {
  const api = createDestinationApi(async (endpoint) => {
    assert.equal(endpoint, '/destinations/airports');
    return { data: [{ maSanBay: 'DAD', tenSanBay: 'Đà Nẵng' }] };
  });
  assert.equal((await api.airports())[0].maSanBay, 'DAD');
  const broken = createDestinationApi(async () => ({ data: null }));
  await assert.rejects(broken.list({}), /không hợp lệ/);
  await assert.rejects(broken.airports(), /không hợp lệ/);
});

test('create lấy CSRF trước POST và chỉ gửi đúng payload', async () => {
  const calls = [];
  const payload = { tenDiemDen: 'Cầu Rồng', maSanBay: 'DAD', moTa: null, hinhAnh: null };
  const controller = new AbortController();
  const api = createDestinationApi(async (endpoint, options) => {
    calls.push(endpoint);
    assert.equal(options.signal, controller.signal);
    if (endpoint === '/auth/csrf') return null;
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), payload);
    return { data: { id: 2, ...payload } };
  });
  assert.equal((await api.create(payload, { signal: controller.signal })).id, 2);
  assert.deepEqual(calls, ['/auth/csrf', '/destinations']);
});

test('không POST khi CSRF lỗi; không tự gửi lại mutation khi BE báo trùng', async () => {
  let calls = 0;
  const denied = Object.assign(new Error('CSRF'), { status: 403 });
  const api = createDestinationApi(async () => { calls += 1; throw denied; });
  await assert.rejects(api.create({}), (error) => error === denied);
  assert.equal(calls, 1);
  const duplicate = Object.assign(new Error('Trùng'), { status: 409, code: 'DESTINATION_ALREADY_EXISTS' });
  const second = createDestinationApi(async (endpoint) => { if (endpoint === '/auth/csrf') return null; throw duplicate; });
  await assert.rejects(second.create({}), (error) => error.code === 'DESTINATION_ALREADY_EXISTS');
});
