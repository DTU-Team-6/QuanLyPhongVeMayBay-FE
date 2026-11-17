import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage, requirePage, sortMessages } from './chatUtils.js';

test('tin nhắn trống và quá dài không được gửi', () => {
  assert.ok(validateMessage('   '));
  assert.ok(validateMessage('a'.repeat(2001)));
  assert.equal(validateMessage(' Xin chào '), '');
});

test('lịch sử phải là phân trang thật và hiển thị theo thời gian tăng dần', () => {
  assert.throws(() => requirePage({ data: {} }));
  const page = requirePage({ data: { content: [], totalPages: 0 } });
  assert.deepEqual(page.content, []);
  assert.deepEqual(sortMessages([{ guiLuc: '2026-11-12T04:58:00Z' }, { guiLuc: '2026-11-12T04:57:00Z' }]).map(x => x.guiLuc), ['2026-11-12T04:57:00Z', '2026-11-12T04:58:00Z']);
});
