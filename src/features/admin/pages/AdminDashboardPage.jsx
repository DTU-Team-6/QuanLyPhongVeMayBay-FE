import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../../components/layout/AdminShell';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency, getInitials } from '../../../utils/formatters';
import reportService from '../../../services/reportService';
import {
  calculateGrowth,
  getPresetDateRange,
  getPreviousPeriod,
} from '../../reports/utils/reportHelpers';
import employeeService from '../../employees/employeeService';
import { ticketService } from '../../tickets/ticketService';
import newsService from '../../news/services/newsService';
import { chatService } from '../../chat/chatService';
import {
  AirlineRevenueBars,
  RevenueAreaChart,
  TicketStatusDonut,
} from '../components/DashboardCharts';

const PERIOD_OPTIONS = [
  { key: 'thisWeek', label: 'Tuần này', groupBy: 'DAY' },
  { key: 'thisMonth', label: 'Tháng này', groupBy: 'DAY' },
  { key: 'thisQuarter', label: 'Quý này', groupBy: 'MONTH' },
  { key: 'thisYear', label: 'Năm nay', groupBy: 'MONTH' },
];

const TICKET_STATUS_META = {
  CHO_THANH_TOAN: { label: 'Chờ thanh toán', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 ring-amber-200/70' },
  DA_THANH_TOAN: { label: 'Đã thanh toán', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70' },
  DA_HUY: { label: 'Đã hủy', dot: 'bg-slate-400', pill: 'bg-slate-100 text-slate-600 ring-slate-200/70' },
};

function formatDateLabel(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function GrowthBadge({ growth, fallbackLabel }) {
  if (!growth) {
    return <span className="text-xs text-[#64748b]">{fallbackLabel}</span>;
  }
  const positive = growth.isPositive;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}
      >
        {positive ? '↑' : '↓'} {Math.abs(growth.percent)}%
      </span>
      <span className="text-[#64748b]">so với kỳ trước</span>
    </span>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.vaiTro === 'ADMIN';
  const isStaffOrAdmin = isAdmin || user?.vaiTro === 'NHAN_VIEN';

  const [periodKey, setPeriodKey] = useState('thisMonth');
  const [activeTab, setActiveTab] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [metrics, setMetrics] = useState({
    report: null,
    prevReport: null,
    airlineReport: null,
    ticketsTotal: 0,
    ticketsPending: 0,
    ticketsPaid: 0,
    ticketsCancelled: 0,
    recentTickets: [],
    employeesTotal: null,
    employees: [],
    newsTotal: 0,
    recentNews: [],
    conversationsTotal: null,
    conversations: [],
  });

  const currentPeriod = PERIOD_OPTIONS.find((p) => p.key === periodKey) || PERIOD_OPTIONS[1];
  const dateRange = getPresetDateRange(currentPeriod.key);

  const loadDashboard = useCallback(async () => {
    if (!isStaffOrAdmin) return;
    setLoading(true);
    const range = getPresetDateRange(currentPeriod.key);
    const prevRange = getPreviousPeriod(range.startDate, range.endDate);

    const [
      reportRes,
      prevReportRes,
      airlineRes,
      ticketsRes,
      pendingRes,
      paidRes,
      cancelledRes,
      newsRes,
      employeesRes,
      chatRes,
    ] = await Promise.allSettled([
      reportService.generateReport({
        startDate: range.startDate,
        endDate: range.endDate,
        reportType: 'THEO_THOI_GIAN',
        groupBy: currentPeriod.groupBy,
        trangThaiDatCho: 'DA_THANH_TOAN',
      }),
      prevRange.startDate && prevRange.endDate
        ? reportService.generateReport({
            startDate: prevRange.startDate,
            endDate: prevRange.endDate,
            reportType: 'THEO_THOI_GIAN',
            groupBy: currentPeriod.groupBy,
            trangThaiDatCho: 'DA_THANH_TOAN',
          })
        : Promise.resolve(null),
      reportService.generateReport({
        startDate: range.startDate,
        endDate: range.endDate,
        reportType: 'THEO_HANG',
        groupBy: currentPeriod.groupBy,
        trangThaiDatCho: 'DA_THANH_TOAN',
      }),
      ticketService.list({ trang: 0, kichThuoc: 6 }),
      ticketService.list({ trangThai: 'CHO_THANH_TOAN', trang: 0, kichThuoc: 1 }),
      ticketService.list({ trangThai: 'DA_THANH_TOAN', trang: 0, kichThuoc: 1 }),
      ticketService.list({ trangThai: 'DA_HUY', trang: 0, kichThuoc: 1 }),
      newsService.getNewsList({ page: 0, size: 5 }),
      isAdmin ? employeeService.list({ trang: 0, kichThuoc: 6 }) : Promise.resolve(null),
      isAdmin ? chatService.conversations(0, 6) : Promise.resolve(null),
    ]);

    setMetrics({
      report: reportRes.status === 'fulfilled' ? reportRes.value : null,
      prevReport: prevReportRes.status === 'fulfilled' ? prevReportRes.value : null,
      airlineReport: airlineRes.status === 'fulfilled' ? airlineRes.value : null,
      ticketsTotal: ticketsRes.status === 'fulfilled' ? (ticketsRes.value?.totalElements ?? 0) : 0,
      ticketsPending: pendingRes.status === 'fulfilled' ? (pendingRes.value?.totalElements ?? 0) : 0,
      ticketsPaid: paidRes.status === 'fulfilled' ? (paidRes.value?.totalElements ?? 0) : 0,
      ticketsCancelled: cancelledRes.status === 'fulfilled' ? (cancelledRes.value?.totalElements ?? 0) : 0,
      recentTickets: ticketsRes.status === 'fulfilled' ? (ticketsRes.value?.content || []) : [],
      newsTotal: newsRes.status === 'fulfilled' ? (newsRes.value?.totalElements ?? 0) : 0,
      recentNews: newsRes.status === 'fulfilled' ? (newsRes.value?.content || []) : [],
      employeesTotal: employeesRes.status === 'fulfilled' && employeesRes.value ? (employeesRes.value.tongSo ?? 0) : null,
      employees: employeesRes.status === 'fulfilled' && employeesRes.value ? (employeesRes.value.nhanVien || []) : [],
      conversationsTotal: chatRes.status === 'fulfilled' && chatRes.value ? (chatRes.value.totalElements ?? chatRes.value.content?.length ?? 0) : null,
      conversations: chatRes.status === 'fulfilled' && chatRes.value ? (chatRes.value.content || []) : [],
    });
    setLastUpdated(new Date());
    setLoading(false);
  }, [currentPeriod.groupBy, currentPeriod.key, isAdmin, isStaffOrAdmin]);

  useEffect(() => {
    if (!authLoading && isStaffOrAdmin) {
      loadDashboard();
    }
  }, [authLoading, isStaffOrAdmin, loadDashboard]);

  const effectiveTab = !isAdmin && activeTab !== 'news' ? 'news' : activeTab;

  const revenue = Number(metrics.report?.summary?.tongDoanhThu || 0);
  const prevRevenue = Number(metrics.prevReport?.summary?.tongDoanhThu || 0);
  const revGrowth = metrics.report && metrics.prevReport ? calculateGrowth(revenue, prevRevenue) : null;

  const soldTickets = Number(metrics.report?.summary?.tongSoVe || 0);
  const prevSoldTickets = Number(metrics.prevReport?.summary?.tongSoVe || 0);
  const ticketGrowth = metrics.report && metrics.prevReport ? calculateGrowth(soldTickets, prevSoldTickets) : null;
  const paidOrders = Number(metrics.report?.summary?.tongSoDonDatCho || 0);

  const paidPercent = metrics.ticketsTotal > 0 ? Math.round((metrics.ticketsPaid / metrics.ticketsTotal) * 100) : 0;

  return (
    <AdminShell user={user} activeKey="dashboard">
      {/* Banner điều hành đầu trang */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0c2d48] to-[#0369a1] p-6 text-white shadow-md">
        <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-sky-400/15 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-cyan-300/10 blur-2xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-sky-200 ring-1 ring-white/15">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {isAdmin ? 'TRUNG TÂM ĐIỀU HÀNH QUẢN TRỊ' : 'KHÔNG GIAN LÀM VIỆC NHÂN VIÊN'}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[26px]">
              Xin chào, {user?.hoTen || (isAdmin ? 'Quản trị viên' : 'Nhân viên')}
            </h1>
            <p className="mt-1 text-xs text-sky-100/80 sm:text-sm">
              Kỳ thống kê: <strong className="text-white">{formatDateLabel(dateRange.startDate)}</strong> –{' '}
              <strong className="text-white">{formatDateLabel(dateRange.endDate)}</strong>
              {lastUpdated && (
                <span>
                  {' '}• Cập nhật {lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Bộ chọn nhanh kỳ thống kê */}
            <div className="inline-flex rounded-xl bg-white/10 p-1 ring-1 ring-white/15" role="group" aria-label="Chọn kỳ thống kê">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPeriodKey(opt.key)}
                  disabled={loading}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    periodKey === opt.key
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-sky-100 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading || !isStaffOrAdmin}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25 disabled:opacity-50 cursor-pointer"
            >
              <svg className={`size-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </section>

      {authLoading && (
        <div role="status" className="mb-6 rounded-xl border border-[#bae6fd] bg-[#e0f2fe] px-4 py-3 text-sm text-[#075985]">
          Đang kiểm tra phiên đăng nhập...
        </div>
      )}

      {!authLoading && !isStaffOrAdmin && (
        <div role="alert" className="mb-6 rounded-xl border border-[#bae6fd] bg-[#e0f2fe] p-4 text-sm text-[#075985]">
          Cần đăng nhập bằng tài khoản Admin hoặc Nhân viên để xem Dashboard quản trị.{' '}
          <Link to="/dang-nhap?next=/quan-ly" className="font-semibold underline">
            Đến trang đăng nhập
          </Link>
        </div>
      )}

      {/* 4 Thẻ chỉ số KPI */}
      <section aria-label="Chỉ số hiệu suất chính" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Doanh thu */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-[#bae6fd] hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#64748b]">Doanh thu ({currentPeriod.label.toLowerCase()})</p>
              <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-[#0f172a]">
                {formatCurrency(revenue)}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] ring-1 ring-sky-100">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 border-t border-[#f1f5f9] pt-3">
            <GrowthBadge growth={revGrowth} fallbackLabel={`${paidOrders} đơn đã thanh toán`} />
          </div>
        </div>

        {/* KPI 2: Vé bán trong kỳ */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#64748b]">Vé bán ra ({currentPeriod.label.toLowerCase()})</p>
              <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-[#0f172a]">
                {soldTickets.toLocaleString('vi-VN')} <span className="text-sm font-medium text-[#64748b]">vé</span>
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 border-t border-[#f1f5f9] pt-3">
            <GrowthBadge growth={ticketGrowth} fallbackLabel={`${paidOrders} đơn đặt chỗ thành công`} />
          </div>
        </div>

        {/* KPI 3: Tổng vé & Tỷ lệ thanh toán */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-amber-200 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#64748b]">Tổng vé trên hệ thống</p>
              <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-[#0f172a]">
                {metrics.ticketsTotal.toLocaleString('vi-VN')}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 border-t border-[#f1f5f9] pt-3">
            <div className="flex items-center justify-between text-xs text-[#64748b]">
              <span>Tỷ lệ đã thanh toán</span>
              <span className="font-semibold tabular-nums text-[#0f172a]">{paidPercent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${paidPercent}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 4: Nhân sự / Nội dung */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-indigo-200 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#64748b]">
                {isAdmin ? 'Nhân sự phòng vé' : 'Bài viết tin tức'}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-[#0f172a]">
                {isAdmin ? (metrics.employeesTotal ?? '—') : metrics.newsTotal}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3 text-xs text-[#64748b]">
            <span>{metrics.newsTotal} bài tin tức</span>
            {isAdmin && <span>{metrics.conversationsTotal ?? 0} hội thoại chat</span>}
          </div>
        </div>
      </section>

      {/* Hàng phân tích trực quan: Biểu đồ doanh thu (8 cột) + Cơ cấu trạng thái vé (4 cột) */}
      <section className="mb-6 grid gap-6 xl:grid-cols-12">
        <div className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Xu hướng doanh thu</h2>
              <p className="text-xs text-[#64748b]">
                Di chuột vào từng điểm để xem doanh thu & số vé bán ra theo {currentPeriod.groupBy === 'DAY' ? 'ngày' : 'tháng'}.
              </p>
            </div>
            <Link
              to="/quan-ly/bao-cao"
              className="rounded-lg border border-[#cbd5e1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:border-[#0284c7] hover:text-[#0284c7]"
            >
              Xem báo cáo chi tiết →
            </Link>
          </div>

          <RevenueAreaChart items={metrics.report?.items || []} loading={loading} />

          {/* Tỷ trọng hãng bay ngay dưới biểu đồ */}
          <div className="mt-6 border-t border-[#f1f5f9] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#64748b]">
                Doanh thu theo hãng hàng không
              </h3>
              <span className="text-[11px] text-[#64748b]">{currentPeriod.label}</span>
            </div>
            <AirlineRevenueBars items={metrics.airlineReport?.items || []} />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Cơ cấu trạng thái vé</h2>
              <p className="text-xs text-[#64748b]">Phân bổ toàn bộ vé hiện có</p>
            </div>
            <Link to="/quan-ly-ban-ve" className="text-xs font-semibold text-[#0284c7] hover:underline">
              Chi tiết
            </Link>
          </div>

          <TicketStatusDonut
            paid={metrics.ticketsPaid}
            pending={metrics.ticketsPending}
            cancelled={metrics.ticketsCancelled}
          />

          <div className="mt-6 rounded-xl bg-[#f0f9ff] p-3.5 text-xs text-[#0369a1] ring-1 ring-[#bae6fd]/60">
            <p className="font-semibold">Lưu ý vận hành</p>
            <p className="mt-1 leading-5 text-[#075985]">
              {metrics.ticketsPending > 0
                ? `Hiện có ${metrics.ticketsPending} vé đang chờ thanh toán cần theo dõi.`
                : 'Không có vé tồn đọng chờ thanh toán. Hệ thống vận hành ổn định.'}
            </p>
          </div>
        </div>
      </section>

      {/* Hàng dữ liệu vận hành: Vé bán gần đây (7 cột) + Bảng tab Nhân sự / Tin tức / Hội thoại (5 cột) */}
      <section className="grid gap-6 xl:grid-cols-12">
        {/* Vé bán gần đây */}
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs xl:col-span-7">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Vé bán gần đây</h2>
              <p className="text-xs text-[#64748b]">6 bản ghi vé mới nhất trên hệ thống</p>
            </div>
            <Link
              to="/quan-ly-ban-ve"
              className="rounded-lg bg-[#f0f9ff] px-3 py-1.5 text-xs font-semibold text-[#0284c7] transition hover:bg-[#e0f2fe]"
            >
              Quản lý vé →
            </Link>
          </div>

          {metrics.recentTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#64748b]">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1e293b]">
                {loading ? 'Đang tải danh sách vé...' : 'Chưa có vé nào được tạo'}
              </p>
              <p className="mt-1 text-xs text-[#64748b]">
                Các đơn đặt chỗ và vé mới xuất sẽ tự động cập nhật tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  <tr>
                    <th scope="col" className="px-5 py-3">Mã vé / Hành khách</th>
                    <th scope="col" className="px-4 py-3">Hành trình</th>
                    <th scope="col" className="px-4 py-3 text-right">Tổng tiền</th>
                    <th scope="col" className="px-5 py-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {metrics.recentTickets.map((ticket) => {
                    const st = TICKET_STATUS_META[ticket.trangThai] || {
                      label: ticket.trangThai || '—',
                      dot: 'bg-slate-400',
                      pill: 'bg-slate-100 text-slate-600 ring-slate-200',
                    };
                    return (
                      <tr key={ticket.id} className="transition hover:bg-[#f8fafc]">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-[#0f172a]">{ticket.tenNguoiDi || '—'}</div>
                          <div className="mt-0.5 text-[11px] text-[#64748b]">
                            {ticket.maVe} {ticket.maDatCho ? `• PNR ${ticket.maDatCho}` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f1f5f9] px-2 py-0.5 font-semibold text-[#1e293b]">
                            {ticket.maSanBayDi} <span className="text-[#0284c7]">✈</span> {ticket.maSanBayDen}
                          </span>
                          <div className="mt-1 text-[11px] text-[#64748b]">
                            {ticket.maChuyenBay} • {formatDateLabel(ticket.ngayDi)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold tabular-nums text-[#0f172a]">
                          {ticket.tongGia != null ? formatCurrency(ticket.tongGia) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${st.pill}`}>
                            <span className={`size-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Khối Tab: Nhân sự / Tin tức / Hội thoại */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs xl:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] px-5 py-3.5">
            <div className="inline-flex rounded-xl bg-[#f1f5f9] p-1" role="tablist">
              {isAdmin && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={effectiveTab === 'staff'}
                  onClick={() => setActiveTab('staff')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    effectiveTab === 'staff' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Nhân sự ({metrics.employeesTotal ?? 0})
                </button>
              )}
              <button
                type="button"
                role="tab"
                aria-selected={effectiveTab === 'news'}
                onClick={() => setActiveTab('news')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  effectiveTab === 'news' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Tin tức ({metrics.newsTotal})
              </button>
              {isAdmin && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={effectiveTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    effectiveTab === 'chat' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Hội thoại ({metrics.conversationsTotal ?? 0})
                </button>
              )}
            </div>

            <Link
              to={effectiveTab === 'staff' ? '/quan-ly-nhan-vien' : effectiveTab === 'chat' ? '/quan-ly-chat' : '/quan-ly-tin-tuc'}
              className="text-xs font-semibold text-[#0284c7] hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="flex-1 divide-y divide-[#f1f5f9]">
            {effectiveTab === 'staff' && (
              metrics.employees.length === 0 ? (
                <div className="px-5 py-14 text-center text-xs text-[#64748b]">
                  {loading ? 'Đang tải danh sách nhân sự...' : 'Chưa có nhân viên nào.'}
                </div>
              ) : (
                metrics.employees.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#f8fafc]">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100 text-xs font-bold text-[#0369a1]">
                      {getInitials(emp.hoTen, emp.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#0f172a]">
                        {emp.hoTen} <span className="font-normal text-[#64748b]">({emp.maNhanVien})</span>
                      </p>
                      <p className="truncate text-[11px] text-[#64748b]">{emp.email}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        emp.vaiTro === 'ADMIN'
                          ? 'bg-sky-50 text-[#0284c7] ring-1 ring-sky-200/70'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/70'
                      }`}
                    >
                      {emp.vaiTro === 'ADMIN' ? 'Admin' : 'Nhân viên'}
                    </span>
                  </div>
                ))
              )
            )}

            {effectiveTab === 'news' && (
              metrics.recentNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                  <p className="text-xs font-semibold text-[#334155]">Chưa có bài viết tin tức nào</p>
                  <Link
                    to="/quan-ly-tin-tuc/them-moi"
                    className="mt-3 rounded-lg bg-[#0284c7] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0369a1]"
                  >
                    + Đăng tin mới
                  </Link>
                </div>
              ) : (
                metrics.recentNews.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#f8fafc]">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#0f172a]">{item.tieuDe}</p>
                      <p className="mt-0.5 text-[11px] text-[#64748b]">
                        {item.loaiTin} • {item.trangThai === 'HIEN_THI' ? 'Đang hiển thị' : 'Đang ẩn'}
                      </p>
                    </div>
                    <Link
                      to={`/quan-ly-tin-tuc/${item.id}/chinh-sua`}
                      className="shrink-0 text-xs font-semibold text-[#0284c7] hover:underline"
                    >
                      Sửa
                    </Link>
                  </div>
                ))
              )
            )}

            {effectiveTab === 'chat' && (
              metrics.conversations.length === 0 ? (
                <div className="px-5 py-14 text-center text-xs text-[#64748b]">
                  Chưa có cuộc hội thoại nào từ khách hàng.
                </div>
              ) : (
                metrics.conversations.map((conv) => (
                  <Link
                    key={conv.khachHangId}
                    to="/quan-ly-chat"
                    className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#f8fafc]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                      {getInitials(conv.hoTen, conv.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#0f172a]">
                        {conv.hoTen || `Khách hàng #${conv.khachHangId}`}
                      </p>
                      <p className="truncate text-[11px] text-[#64748b]">{conv.email}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0284c7]">Trả lời →</span>
                  </Link>
                ))
              )
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
