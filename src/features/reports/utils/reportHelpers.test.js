import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateToISO,
  getPresetDateRange,
  getPreviousPeriod,
  validateReportFilter,
  calculateGrowth,
  buildReportCSV,
} from './reportHelpers.js';

test('formatDateToISO formats date object to yyyy-MM-dd correctly', () => {
  const d = new Date(2026, 10, 5); // month 10 is Nov (0-indexed)
  assert.equal(formatDateToISO(d), '2026-11-05');
  assert.equal(formatDateToISO(null), '');
});

test('getPresetDateRange returns valid date ranges for thisWeek and thisMonth', () => {
  const base = new Date(2026, 10, 5); // Thursday Nov 5, 2026
  const week = getPresetDateRange('thisWeek', base);
  // Monday of Nov 5 is Nov 2, Sunday is Nov 8
  assert.equal(week.startDate, '2026-11-02');
  assert.equal(week.endDate, '2026-11-08');

  const month = getPresetDateRange('thisMonth', base);
  assert.equal(month.startDate, '2026-11-01');
  assert.equal(month.endDate, '2026-11-30');

  const year = getPresetDateRange('thisYear', base);
  assert.equal(year.startDate, '2026-01-01');
  assert.equal(year.endDate, '2026-12-31');
});

test('getPreviousPeriod calculates matching previous time range', () => {
  // Period 2026-10-26 to 2026-11-01 is 7 days
  const prev = getPreviousPeriod('2026-10-26', '2026-11-01');
  assert.equal(prev.startDate, '2026-10-19');
  assert.equal(prev.endDate, '2026-10-25');
});

test('validateReportFilter catches missing and inverted dates', () => {
  // Valid filter
  const valid = validateReportFilter({
    startDate: '2026-10-26',
    endDate: '2026-11-01',
    reportType: 'THEO_NHAN_VIEN',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});

  // Missing dates
  const missing = validateReportFilter({
    startDate: '',
    endDate: '',
    reportType: '',
  });
  assert.equal(missing.isValid, false);
  assert.ok(missing.errors.startDate);
  assert.ok(missing.errors.endDate);
  assert.ok(missing.errors.reportType);

  // Inverted dates
  const inverted = validateReportFilter({
    startDate: '2026-11-10',
    endDate: '2026-11-01',
    reportType: 'THEO_HANG',
  });
  assert.equal(inverted.isValid, false);
  assert.equal(inverted.errors.endDate, 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
});

test('calculateGrowth calculates percentage and differences accurately', () => {
  const result = calculateGrowth(720000000, 600000000);
  assert.equal(result.diff, 120000000);
  assert.equal(result.percent, 20);
  assert.equal(result.isPositive, true);

  const decrease = calculateGrowth(400, 500);
  assert.equal(decrease.diff, -100);
  assert.equal(decrease.percent, -20);
  assert.equal(decrease.isPositive, false);
});

test('buildReportCSV generates UTF-8 BOM CSV text with headers and rows', () => {
  const report = {
    startDate: '2026-10-26',
    endDate: '2026-11-01',
    reportType: 'THEO_NHAN_VIEN',
    summary: {
      tongSoDonDatCho: 10,
      tongSoVe: 20,
      tongDoanhThu: 50000000,
      tongLoiNhuan: 5000000,
    },
    items: [
      {
        key: 'NV001',
        label: 'Lê Thu Hà',
        soDonDatCho: 6,
        soVeBanRa: 12,
        doanhThu: 30000000,
        loiNhuan: 3000000,
      },
    ],
  };

  const csv = buildReportCSV(report);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('Lê Thu Hà'));
  assert.ok(csv.includes('30000000'));
  assert.ok(csv.includes('TỔNG CỘNG'));
});
