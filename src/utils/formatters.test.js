import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatTime, formatDate, formatFullDate, formatDuration } from './formatters.js';

test('formatCurrency formats numbers to Vietnamese currency', () => {
  assert.equal(formatCurrency(1800000), '1.800.000 ₫');
  assert.equal(formatCurrency(0), '0 ₫');
  assert.equal(formatCurrency(null), '0 ₫');
});

test('formatDuration formats flight minutes to hours and minutes', () => {
  assert.equal(formatDuration(130), '2 giờ 10 phút');
  assert.equal(formatDuration(60), '1 giờ');
  assert.equal(formatDuration(45), '45 phút');
  assert.equal(formatDuration(0), '0 phút');
});

test('formatTime extracts airport local time with timezone', () => {
  const iso = '2026-11-12T08:00:00+07:00';
  const time = formatTime(iso, 'Asia/Ho_Chi_Minh');
  assert.equal(time, '08:00');
});

test('formatDate formats date to dd/MM/yyyy', () => {
  const iso = '2026-11-12T08:00:00+07:00';
  const formatted = formatDate(iso, 'Asia/Ho_Chi_Minh');
  assert.equal(formatted, '12/11/2026');
});
