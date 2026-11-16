import { getPreviousPeriod } from './reportHelpers.js';

/** Gom kết quả độc lập, giữ lỗi kỳ trước/biểu đồ tách khỏi báo cáo chính. */
export async function loadReportBundle(filter, fetchReport, signal) {
  const applied = { ...filter };
  const period = getPreviousPeriod(applied.startDate, applied.endDate);
  const requests = new Map();
  const request = (type, previous = false) => {
    const dates = previous ? period : applied;
    const payload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      reportType: type,
      groupBy: applied.groupBy,
      trangThaiDatCho: 'DA_THANH_TOAN',
    };
    const key = JSON.stringify(payload);
    if (!requests.has(key)) {
      requests.set(key, fetchReport(payload, { signal }).then((data) => {
        if (!data || !Array.isArray(data.items) || !data.summary ||
            data.reportType !== type || data.startDate !== dates.startDate ||
            data.endDate !== dates.endDate) {
          throw new Error('Dữ liệu báo cáo không hợp lệ. Vui lòng thử lại.');
        }
        return data;
      }));
    }
    return requests.get(key);
  };
  const withCharts = applied.displayMode !== 'TABLE';
  const [current, previous, trend, airlines, previousTrend] = await Promise.allSettled([
    request(applied.reportType),
    applied.comparePrevious ? request(applied.reportType, true) : null,
    withCharts ? request('THEO_THOI_GIAN') : null,
    withCharts ? request('THEO_HANG') : null,
    withCharts && applied.comparePrevious ? request('THEO_THOI_GIAN', true) : null,
  ]);
  if (signal?.aborted) throw new DOMException('Đã hủy yêu cầu', 'AbortError');
  if (current.status === 'rejected') throw current.reason;
  const resolved = (response) => response.status === 'fulfilled' ? response.value : null;
  return {
    applied,
    period,
    report: current.value,
    previous: resolved(previous),
    trend: resolved(trend),
    airlines: resolved(airlines),
    previousTrend: resolved(previousTrend),
    previousFailed: applied.comparePrevious && previous.status === 'rejected',
    chartsFailed: withCharts && (trend.status === 'rejected' || airlines.status === 'rejected'),
    previousTrendFailed: withCharts && applied.comparePrevious && previousTrend.status === 'rejected',
  };
}
