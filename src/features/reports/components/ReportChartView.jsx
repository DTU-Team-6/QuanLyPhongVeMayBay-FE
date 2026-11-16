import { formatCurrency } from '../../../utils/formatters';
import { orderedReportItems, revenueShares } from '../utils/reportHelpers';

const PALETTE = ['#0284c7', '#38bdf8', '#7dd3fc', '#f59e0b', '#10b981', '#94a3b8'];
const W = 680, H = 260, LEFT = 70, RIGHT = 25, TOP = 30, BOTTOM = 45;

function dayValue(value) {
  const date = value.length === 4 ? `${value}-01-01` : value.length === 7 ? `${value}-01` : value;
  return new Date(`${date}T00:00:00Z`).getTime();
}

function chartPoints(report, maxValue) {
  if (!report) return [];
  const start = dayValue(report.startDate), end = dayValue(report.endDate);
  return orderedReportItems(report).map((item) => ({
    ...item,
    x: LEFT + (end === start ? 0.5 : Math.max(0, Math.min(1, (dayValue(String(item.key)) - start) / (end - start)))) * (W - LEFT - RIGHT),
    y: H - BOTTOM - Number(item.doanhThu) / maxValue * (H - TOP - BOTTOM),
  }));
}

/** Hai bộ dữ liệu riêng lấy từ API: doanh thu theo thời gian và tỷ trọng theo hãng. */
export default function ReportChartView({ selectedReport, trendReport, previousTrend, airlineReport, compareEnabled = true }) {
  const staff = selectedReport?.reportType === 'THEO_NHAN_VIEN' ? orderedReportItems(selectedReport) : [];
  const maxStaffRevenue = Math.max(1, ...staff.map((item) => Number(item.doanhThu)));
  const currency = trendReport?.tienTe || airlineReport?.tienTe || 'VND';
  const values = [...(trendReport?.items || []), ...(compareEnabled ? previousTrend?.items || [] : [])].map((item) => Number(item.doanhThu));
  const maxValue = Math.max(1, ...values);
  const current = chartPoints(trendReport, maxValue);
  const previous = compareEnabled ? chartPoints(previousTrend, maxValue) : [];
  const path = (points) => points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const shares = revenueShares(airlineReport?.items);
  const circumference = 2 * Math.PI * 38;
  let offset = 0;
  const unit = currency === 'VND' ? 1000000 : 1;
  const unitsLabel = currency === 'VND' ? 'triệu đồng' : currency;
  return <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
    {staff.length > 0 && (
      <section className="xl:col-span-12 bg-white border border-slate-200 rounded-xl p-5" aria-label="Biểu đồ doanh thu theo nhân viên">
        <h3 className="text-lg font-semibold">Doanh thu theo nhân viên</h3>
        <p className="text-xs text-slate-500 mt-1">Kỳ hiện tại • Sắp xếp theo doanh thu giảm dần</p>
        <ol className="mt-5 space-y-4">
          {staff.map((item, index) => (
            <li key={item.key ?? `online-${index}`} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="text-slate-700">{index + 1}. {item.label || item.key || 'Khách đặt trực tuyến'}</span>
              <div>
                <div className="h-3 rounded bg-sky-50" aria-hidden="true">
                  <div className="h-full rounded bg-sky-600" style={{ width: `${Math.max(0, Number(item.doanhThu)) / maxStaffRevenue * 100}%` }} />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-700">{formatCurrency(item.doanhThu, selectedReport.tienTe)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    )}
    <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5 min-w-0">
      <h3 className="text-lg font-semibold">Xu hướng doanh thu</h3>
      <p className="text-xs text-slate-500 mt-1">{trendReport ? `Tổng doanh thu ${formatCurrency(trendReport.summary.tongDoanhThu, currency)} • Đơn vị: ${unitsLabel}` : 'Chưa tải được dữ liệu biểu đồ.'}</p>
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600"><span className="flex items-center gap-2"><span className="w-5 h-1 bg-sky-600" />Kỳ hiện tại</span>{compareEnabled && previousTrend && <span className="flex items-center gap-2"><span className="w-5 h-1 bg-slate-400" />Kỳ trước</span>}</div>
      {trendReport && (current.length || previous.length) ? <div className="overflow-x-auto mt-3"><svg role="img" aria-label="Biểu đồ doanh thu theo thời gian. Di chuột vào điểm để xem ngày và số tiền." viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[480px]">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => { const y = H - BOTTOM - ratio * (H - TOP - BOTTOM); return <g key={ratio}><line x1={LEFT} x2={W - RIGHT} y1={y} y2={y} stroke="#e2e8f0" /><text x={LEFT - 9} y={y + 4} textAnchor="end" fill="#64748b" fontSize="11">{(maxValue * ratio / unit).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}</text></g>; })}
        <path d={path(previous)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
        <path d={path(current)} fill="none" stroke="#0284c7" strokeWidth="2.5" />
        {previous.map((point) => <circle key={point.key} cx={point.x} cy={point.y} r="3.5" fill="#94a3b8"><title>Kỳ trước • {point.label}: {formatCurrency(point.doanhThu, currency)}</title></circle>)}
        {current.map((point, index) => <g key={point.key}><circle cx={point.x} cy={point.y} r="4" fill="#0284c7"><title>{point.label}: {formatCurrency(point.doanhThu, currency)}</title></circle>{(index % Math.max(1, Math.ceil(current.length / 5)) === 0 || index === current.length - 1) && <text x={point.x} y={H - 17} textAnchor="middle" fontSize="10" fill="#64748b">{point.key}</text>}</g>)}
      </svg></div> : <p className="py-12 text-center text-sm text-slate-500">{trendReport ? 'Chưa có giao dịch trong kỳ.' : 'Không có dữ liệu biểu đồ để hiển thị.'}</p>}
      <p className="text-xs text-slate-500 mt-2">Các điểm là những mốc có giao dịch. {compareEnabled && previousTrend ? 'Hai kỳ được đặt theo vị trí tương đối trong khoảng ngày; rê chuột để xem mốc thực tế.' : ''}</p>
    </div>
    <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 min-w-0">
      <h3 className="text-lg font-semibold">Tỷ trọng doanh thu theo hãng</h3>
      <p className="text-xs text-slate-500 mt-1">Doanh thu vé đã thanh toán trong kỳ hiện tại</p>
      {shares.length ? <>
        <div className="relative size-40 mx-auto my-5"><svg role="img" aria-label="Tỷ trọng doanh thu từng hãng hàng không" viewBox="0 0 100 100" className="size-full -rotate-90"><circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="14" fill="none" />{shares.map((share, index) => {
          const dashOffset = -offset;
          const length = share.percent / 100 * circumference;
          offset += length;
          return <circle key={share.label} cx="50" cy="50" r="38" stroke={PALETTE[index]} strokeWidth="14" strokeDasharray={`${length} ${circumference}`} strokeDashoffset={dashOffset} fill="none"><title>{share.label}: {formatCurrency(share.amount, airlineReport.tienTe)} ({share.percent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%)</title></circle>;
        })}</svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"><strong className="text-xl">{(Number(airlineReport.summary.tongDoanhThu) / unit).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}</strong><span className="text-[10px] text-slate-500">{unitsLabel}</span></div></div>
        <ul className="space-y-3 border-t border-slate-100 pt-4">{shares.map((share, index) => <li key={share.label} className="flex items-start gap-2 text-xs"><span className="mt-1 size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: PALETTE[index] }} /><span className="flex-1 min-w-0"><strong className="block text-slate-700 font-medium">{share.label}</strong><span className="text-slate-500">{formatCurrency(share.amount, airlineReport.tienTe)}</span></span><strong>{share.percent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</strong></li>)}</ul>
      </> : <p className="py-16 text-center text-sm text-slate-500">{airlineReport ? 'Chưa có doanh thu theo hãng trong kỳ.' : 'Chưa tải được dữ liệu theo hãng.'}</p>}
    </div>
  </div>;
}
