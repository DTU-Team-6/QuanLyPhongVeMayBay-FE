import test from 'node:test';
import assert from 'node:assert/strict';
import { loadReportBundle } from './reportRequests.js';

const filter = { startDate: '2026-11-09', endDate: '2026-11-15', reportType: 'THEO_THOI_GIAN', groupBy: 'DAY', displayMode: 'BOTH', comparePrevious: true };
const response = (query) => ({ ...query, tienTe: 'VND', summary: { tongDoanhThu: 10, tongSoVe: 1 }, items: [{ key: '2026-11-10', doanhThu: 10 }] });

test('bundle gọi đúng loại dữ liệu và dùng chung request biểu đồ trùng báo cáo', async () => {
  const calls = [];
  const controller = new AbortController();
  const result = await loadReportBundle(filter, async (query, options) => {
    calls.push(query);
    assert.equal(options.signal, controller.signal);
    return response(query);
  }, controller.signal);
  assert.equal(calls.length, 3);
  assert.equal(result.report, result.trend);
  assert.equal(result.previous, result.previousTrend);
  assert.equal(result.airlines.reportType, 'THEO_HANG');
  assert.equal(result.previous.startDate, '2026-11-02');
  assert.equal(result.previous.endDate, '2026-11-08');
});

test('lỗi kỳ trước không dựng số liệu giả hoặc chặn kỳ hiện tại', async () => {
  const result = await loadReportBundle(filter, async (query) => {
    if (query.startDate === '2026-11-02') throw new Error('Kỳ trước lỗi');
    return response(query);
  });
  assert.equal(result.report.summary.tongDoanhThu, 10);
  assert.equal(result.previous, null);
  assert.equal(result.previousFailed, true);
  assert.equal(result.previousTrend, null);
});

test('snapshot không đổi khi người dùng sửa draft trong lúc API đang chạy', async () => {
  const draft = { ...filter, displayMode: 'TABLE', comparePrevious: false };
  let complete;
  const loading = loadReportBundle(draft, (query) => new Promise((resolve) => { complete = () => resolve(response(query)); }));
  draft.startDate = '2020-01-01';
  complete();
  const result = await loading;
  assert.equal(result.applied.startDate, '2026-11-09');
  assert.equal(result.report.startDate, '2026-11-09');
  assert.equal(result.trend, null);
});

test('request hủy không trả bundle cũ và dữ liệu sai kỳ không được chấp nhận', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(loadReportBundle(filter, async (query) => response(query), controller.signal), { name: 'AbortError' });
  await assert.rejects(loadReportBundle(filter, async (query) => ({ ...response(query), startDate: '2020-01-01' })), /không hợp lệ/);
});

test('lỗi báo cáo chính được trả nguyên trạng để UI xử lý 401/403/validation', async () => {
  const denied = Object.assign(new Error('Không đủ quyền'), { status: 403, code: 'ACCESS_DENIED' });
  await assert.rejects(loadReportBundle(filter, async () => { throw denied; }), (error) => error === denied);
});
