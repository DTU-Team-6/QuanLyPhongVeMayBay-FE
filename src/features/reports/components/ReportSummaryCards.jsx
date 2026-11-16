import { formatCurrency } from '../../../utils/formatters';
import { calculateGrowth, formatGrowth } from '../utils/reportHelpers';

export default function ReportSummaryCards({ summary, previousSummary, compareEnabled = true, currency = 'VND' }) {
  const revenueGrowth = calculateGrowth(summary.tongDoanhThu, previousSummary?.tongDoanhThu);
  const cards = [
    { title: 'Tổng doanh thu', value: formatCurrency(summary.tongDoanhThu, currency), previous: previousSummary ? formatCurrency(previousSummary.tongDoanhThu, currency) : null, growth: revenueGrowth },
    { title: 'Số vé đã bán', value: `${Number(summary.tongSoVe).toLocaleString('vi-VN')} vé`, previous: previousSummary ? `${Number(previousSummary.tongSoVe).toLocaleString('vi-VN')} vé` : null, growth: calculateGrowth(summary.tongSoVe, previousSummary?.tongSoVe) },
    { title: compareEnabled ? 'Tăng trưởng doanh thu' : 'Lợi nhuận', value: compareEnabled ? formatGrowth(revenueGrowth) : formatCurrency(summary.tongLoiNhuan, currency), note: compareEnabled ? !previousSummary ? 'Chưa có dữ liệu đối chiếu' : revenueGrowth.percent == null ? 'Kỳ trước bằng 0; tỷ lệ tăng trưởng không xác định' : `${revenueGrowth.diff >= 0 ? 'Tăng' : 'Giảm'} ${formatCurrency(Math.abs(revenueGrowth.diff), currency)}` : 'Doanh thu trừ tổng giá vốn' },
  ];
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{cards.map((card) => <div key={card.title} className="bg-white border border-slate-200 rounded-xl p-6 min-w-0">
    <p className="text-sm text-slate-500">{card.title}</p><p className="text-[25px] font-semibold text-slate-900 mt-3 break-words">{card.value}</p>
    {compareEnabled && card.growth && <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500"><span className={card.growth.isPositive === false ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold'}>{formatGrowth(card.growth)}</span> • {card.previous ? `${card.previous} kỳ trước` : 'Chưa có dữ liệu đối chiếu'}</p>}
    {card.note && <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">{card.note}</p>}
  </div>)}</div>;
}
