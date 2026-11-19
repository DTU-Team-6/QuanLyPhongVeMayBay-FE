import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMinPriceDateRange } from '../utils/flightDateHelpers.js';

test('giá theo ngày dùng đúng năm ngày lịch kể cả qua ranh giới tháng/năm', () => {
  assert.deepEqual(buildMinPriceDateRange('2026-11-23'), {
    ngayBatDau: '2026-11-21',
    ngayKetThuc: '2026-11-25',
  });
  assert.deepEqual(buildMinPriceDateRange('2027-01-01'), {
    ngayBatDau: '2026-12-30',
    ngayKetThuc: '2027-01-03',
  });
});

test('từ chối ngày không hợp lệ trước khi yêu cầu dải giá', () => {
  assert.equal(buildMinPriceDateRange('2026-02-30'), null);
  assert.equal(buildMinPriceDateRange('not-a-date'), null);
});
