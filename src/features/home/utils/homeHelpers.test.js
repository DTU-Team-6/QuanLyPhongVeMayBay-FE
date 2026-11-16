import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFlightSearchUrl, localDateValue } from './homeHelpers.js';

test('chọn chuyến dùng đúng ngày địa phương của sân bay dù UTC khác ngày', () => {
  const url = new URL(buildFlightSearchUrl({
    sanBayDi: { maSanBay: 'LAX' }, sanBayDen: { maSanBay: 'HAN' },
    thoiGianKhoiHanh: { dateTime: '2026-11-16T23:30:00-08:00', timeZone: 'America/Los_Angeles' },
  }), 'https://example.test');
  assert.equal(url.pathname, '/chuyen-bay');
  assert.equal(url.searchParams.get('ngayDi'), '2026-11-16');
  assert.equal(url.searchParams.get('maDi'), 'LAX');
  assert.equal(url.searchParams.get('maDen'), 'HAN');
  assert.equal(url.searchParams.get('loaiVe'), 'oneWay');
});

test('ngày input giữ ngày địa phương thay vì chuyển sang UTC', () => {
  assert.equal(localDateValue(new Date(2026, 10, 16, 0, 30)), '2026-11-16');
});
