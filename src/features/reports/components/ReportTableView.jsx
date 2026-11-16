import { formatCurrency } from '../../../utils/formatters';
import { calculateGrowth, formatGrowth, orderedReportItems, previousRevenue, REPORT_TITLES } from '../utils/reportHelpers';

export default function ReportTableView({ report, previousReport, compareEnabled = true }) {
  const items = orderedReportItems(report);
  const byTime = report.reportType === 'THEO_THOI_GIAN';
  const compareRows = compareEnabled && !byTime;
  const currency = report.tienTe;
  return <div>
    <div className="flex flex-wrap justify-between gap-2 mb-3"><h3 className="font-semibold text-lg">{REPORT_TITLES[report.reportType]}</h3><p className="text-xs text-slate-500">{byTime ? 'Sắp xếp theo thời gian' : 'Sắp xếp theo doanh thu giảm dần'}</p></div>
    {byTime && compareEnabled && <p className="text-xs text-slate-500 mb-3">Đối chiếu tổng hai kỳ ở các thẻ chỉ số; bảng hiển thị từng mốc của kỳ hiện tại.</p>}
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-sm text-left min-w-[740px]">
      <caption className="sr-only">{REPORT_TITLES[report.reportType]} từ {report.startDate} đến {report.endDate}</caption>
      <thead className="bg-slate-100 text-slate-600 text-xs"><tr><th scope="col" className="p-4">{byTime ? 'STT' : 'Hạng'}</th><th scope="col" className="p-4">{byTime ? 'Thời gian' : 'Đối tượng'}</th><th scope="col" className="p-4 text-right">Số vé</th><th scope="col" className="p-4 text-right">Doanh thu</th>{compareRows && <><th scope="col" className="p-4 text-right">Kỳ trước</th><th scope="col" className="p-4 text-right">Chênh lệch</th><th scope="col" className="p-4 text-right">Tăng trưởng</th></>}</tr></thead>
      <tbody className="divide-y divide-slate-200">{items.map((item, index) => {
        const previous = previousRevenue(item, previousReport);
        const growth = calculateGrowth(item.doanhThu, previous);
        return <tr key={item.key ?? `online-${index}`} className="hover:bg-slate-50"><td className="p-4 text-slate-500">{index + 1}</td><th scope="row" className="p-4 font-medium text-slate-700">{item.label || item.key || 'Khách đặt trực tuyến'}</th><td className="p-4 text-right">{Number(item.soVeBanRa).toLocaleString('vi-VN')}</td><td className="p-4 text-right font-semibold whitespace-nowrap">{formatCurrency(item.doanhThu, currency)}</td>{compareRows && <><td className="p-4 text-right whitespace-nowrap">{previous == null ? '—' : formatCurrency(previous, currency)}</td><td className="p-4 text-right whitespace-nowrap">{growth.diff == null ? '—' : `${growth.diff > 0 ? '+' : ''}${formatCurrency(growth.diff, currency)}`}</td><td className="p-4 text-right"><span className={growth.isPositive === false ? 'text-red-700' : 'text-emerald-700'} title={previous === 0 ? 'Kỳ trước bằng 0' : undefined}>{formatGrowth(growth)}</span></td></>}</tr>;
      })}</tbody>
    </table></div>
  </div>;
}
