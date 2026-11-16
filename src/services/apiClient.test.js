import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient, ApiError, trimTrailingSlashes } from './apiClient.js';

test('API gửi cookie và đọc lỗi RFC 9457 theo code/details', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/api/v1/flights/top-cheap?limit=10');
      assert.equal(options.credentials, 'include');
      return new Response(JSON.stringify({ detail: 'Khoảng ngày không hợp lệ', code: 'VALIDATION_ERROR', details: [{ field: 'startDate', message: 'Sai ngày' }] }), { status: 400, headers: { 'content-type': 'application/problem+json' } });
    };
    await assert.rejects(apiClient('/flights/top-cheap?limit=10'), (error) => error instanceof ApiError && error.status === 400 && error.code === 'VALIDATION_ERROR' && error.details[0].field === 'startDate');
  } finally { globalThis.fetch = originalFetch; }
});

test('API xin cookie CSRF trước POST và gửi header token đúng', async () => {
  const originalFetch = globalThis.fetch;
  const originalDocument = globalThis.document;
  const calls = [];
  globalThis.document = { cookie: '' };
  try {
    globalThis.fetch = async (url, options) => {
      calls.push(url);
      if (url.endsWith('/csrf')) {
        globalThis.document.cookie = 'XSRF-TOKEN=csrf-value';
        return new Response(null, { status: 204 });
      }
      assert.equal(options.headers.get('X-XSRF-TOKEN'), 'csrf-value');
      assert.equal(options.headers.get('Content-Type'), 'application/json');
      assert.equal(options.credentials, 'include');
      return new Response(JSON.stringify({ data: { id: 1 } }), { headers: { 'content-type': 'application/json' } });
    };
    const result = await apiClient('/auth/login', { method: 'POST', body: '{}' });
    assert.deepEqual(calls, ['/api/v1/auth/csrf', '/api/v1/auth/login']);
    assert.equal(result.data.id, 1);
  } finally { globalThis.fetch = originalFetch; globalThis.document = originalDocument; }
});

test('API không đổi request bị hủy thành lỗi mạng', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new DOMException('Đã hủy', 'AbortError'); };
    await assert.rejects(apiClient('/flights/top-cheap'), { name: 'AbortError' });
  } finally { globalThis.fetch = originalFetch; }
});

test('chuẩn hóa API base chỉ bỏ slash cuối và giữ nguyên origin/path bên trong', () => {
  assert.equal(trimTrailingSlashes('https://example.test/backend///'), 'https://example.test/backend');
  assert.equal(trimTrailingSlashes('https://example.test/a//b/'), 'https://example.test/a//b');
  assert.equal(trimTrailingSlashes('https://example.test/backend'), 'https://example.test/backend');
  assert.equal(trimTrailingSlashes(''), '');
  assert.equal(trimTrailingSlashes('/'.repeat(100000)), '');
});
