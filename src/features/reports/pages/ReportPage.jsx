import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import reportService from '../../../services/reportService';
import { useAuth } from '../../../context/AuthContext';
import AdminShell from '../../../components/layout/AdminShell';
import { getPresetDateRange, validateReportFilter, buildReportCSV, downloadCSV, REPORT_TITLES } from '../utils/reportHelpers';
import { loadReportBundle } from '../utils/reportRequests';
import ReportFilterForm from '../components/ReportFilterForm';
import ReportSummaryCards from '../components/ReportSummaryCards';
import ReportTableView from '../components/ReportTableView';
import ReportChartView from '../components/ReportChartView';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/common/Loading';

/** Màn hình 6.5.4.1/6.5.4.2 chỉ hiển thị kết quả gắn với điều kiện đã gửi. */
export default function ReportPage() {
  const { user, loading: authLoading, checkAuth } = useAuth();
  const canManage = !authLoading && ['ADMIN', 'NHAN_VIEN'].includes(user?.vaiTro);
  const initialFilter = useRef({ ...getPresetDateRange('thisWeek'), reportType: 'THEO_NHAN_VIEN', groupBy: 'DAY', displayMode: 'BOTH', comparePrevious: true });
  const [filter, setFilter] = useState(initialFilter.current);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  const activeRequest = useRef(null);

  const load = useCallback(async (draft) => {
    if (!canManage) return;
    const validation = validateReportFilter(draft);
    setErrors(validation.errors);
    if (!validation.isValid) return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const applied = { ...draft };
    setLastRequest(applied);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const bundle = await loadReportBundle(applied, reportService.generateReport, controller.signal);
      if (!controller.signal.aborted) setResult(bundle);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setResult(null);
      setError(requestError);
      if (requestError.status === 401) await checkAuth();
      const fieldErrors = {};
      for (const detail of requestError.details || []) if (['startDate', 'endDate', 'reportType', 'groupBy'].includes(detail.field)) fieldErrors[detail.field] = detail.message;
      setErrors(fieldErrors);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [canManage, checkAuth]);

  useEffect(() => {
    if (canManage) load(initialFilter.current);
    else { setResult(null); setError(null); }
    return () => activeRequest.current?.abort();
  }, [canManage, user?.id, load]);

  function change(updates) {
    setFilter((previous) => ({ ...previous, ...updates }));
    setErrors((previous) => { const next = { ...previous }; for (const key of Object.keys(updates)) delete next[key]; return next; });
  }
  function exportCSV() {
    const report = result.report;
    downloadCSV(buildReportCSV(report), `bao-cao-${report.reportType.toLowerCase()}-${report.startDate}-${report.endDate}.csv`);
  }
  const errorText = error?.status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : error?.status === 403 ? 'Tài khoản không có quyền xem báo cáo này.' : error?.status === 0 ? 'Không thể kết nối đến hệ thống. Vui lòng thử lại.' : error?.message;

  return <AdminShell user={user} activeKey="reports">
    {authLoading ? <Loading message="Đang kiểm tra quyền truy cập…" /> : !canManage ? <div className="rounded-xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-xl font-bold">Thống kê báo cáo</h1><p className="text-slate-600 mt-3">Chức năng dành cho nhân viên và quản trị viên.</p><Link to="/dang-nhap" state={{ from: '/bao-cao' }} className="inline-block mt-4 text-sky-700 underline">Đăng nhập bằng tài khoản được cấp quyền</Link></div> : <div className="flex flex-col gap-6">
      <div><p className="text-xs text-slate-500 mb-2">{user.vaiTro === 'ADMIN' ? 'Quản trị' : 'Nhân viên'} / Thống kê báo cáo</p><h1 className="text-2xl font-bold text-slate-900">Thống kê báo cáo doanh thu</h1><p className="mt-2 text-sm text-slate-500">Chọn khoảng thời gian và loại thống kê để tạo báo cáo từ giao dịch đã thanh toán.</p></div>
      <div className="print:hidden"><ReportFilterForm filter={filter} onChange={change} onSubmit={() => load(filter)} loading={loading} errors={errors} /></div>
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><p>{errorText || 'Không thể tạo báo cáo. Vui lòng thử lại.'}</p>{error.status === 401 ? <Link to="/dang-nhap" state={{ from: '/bao-cao' }} className="underline font-semibold">Đăng nhập lại</Link> : error.status !== 403 && <button type="button" onClick={() => load(lastRequest || filter)} className="underline font-semibold mt-2">Thử lại</button>}</div>}
      {loading && <div role="status" className="bg-white border border-slate-200 rounded-xl p-10"><Loading message="Đang tạo báo cáo…" /></div>}
      {!loading && result && <section aria-label="Kết quả báo cáo" className="flex flex-col gap-6">
        <div><h2 className="text-xl font-semibold">{REPORT_TITLES[result.report.reportType]}</h2><p className="text-sm text-slate-600 mt-1">Kỳ <strong>{result.report.startDate}</strong> đến <strong>{result.report.endDate}</strong>{result.applied.comparePrevious && <> • Đối chiếu <strong>{result.period.startDate}</strong> đến <strong>{result.period.endDate}</strong></>} • Đơn vị tiền: {result.report.tienTe}</p></div>
        {(result.previousFailed || result.previousTrendFailed || result.chartsFailed) && <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{result.previousFailed || result.previousTrendFailed ? 'Chưa tải được đầy đủ kỳ trước. Các mục đối chiếu thiếu dữ liệu được để trống. ' : ''}{result.chartsFailed ? 'Một số biểu đồ chưa tải được. Số liệu báo cáo chính vẫn được hiển thị. ' : ''}<button type="button" onClick={() => load(result.applied)} className="underline font-semibold">Tải lại</button></div>}
        <ReportSummaryCards summary={result.report.summary} previousSummary={result.previous?.summary} compareEnabled={result.applied.comparePrevious} currency={result.report.tienTe} />
        {result.report.items.length === 0 ? <EmptyState title="Không có dữ liệu trong khoảng thời gian đã chọn" description="Thử khoảng thời gian khác hoặc loại báo cáo khác để xem số liệu." /> : <>
          {result.applied.displayMode !== 'TABLE' && <ReportChartView selectedReport={result.report} trendReport={result.trend} previousTrend={result.previousTrend} airlineReport={result.airlines} compareEnabled={result.applied.comparePrevious} />}
          {result.applied.displayMode !== 'CHART' && <ReportTableView report={result.report} previousReport={result.previous} compareEnabled={result.applied.comparePrevious} />}
        </>}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 print:hidden"><button type="button" onClick={() => window.print()} className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold">In báo cáo</button><button type="button" onClick={exportCSV} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold">Xuất CSV</button></div>
      </section>}
    </div>}
  </AdminShell>;
}
