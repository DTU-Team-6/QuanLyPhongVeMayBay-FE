import { formatCurrency } from '../../../utils/formatters';
import { calculateGrowth } from '../utils/reportHelpers';

/**
 * 3 thẻ chỉ số KPI tổng hợp theo thiết kế Figma 186:3400 và 186:5810
 */
export default function ReportSummaryCards({ summary, previousSummary, compareEnabled = true }) {
  const tongDoanhThu = summary?.tongDoanhThu || 0;
  const tongSoVe = summary?.tongSoVe || 0;

  const prevDoanhThu = previousSummary?.tongDoanhThu || 0;
  const prevSoVe = previousSummary?.tongSoVe || 0;

  const revGrowth = calculateGrowth(tongDoanhThu, prevDoanhThu);
  const ticketGrowth = calculateGrowth(tongSoVe, prevSoVe);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Thẻ 1: Tổng doanh thu */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between min-h-[148px]">
        <div className="flex items-start justify-between w-full">
          <span className="text-[#64748b] text-[13px] font-normal">
            Tổng doanh thu
          </span>
          <div className="size-[36px] rounded-[8px] bg-[#f8fafc] flex items-center justify-center text-[#0284c7]">
            {/* Wallet Icon */}
            <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-[#0f172a] text-[28px] font-semibold leading-tight">
            {formatCurrency(tongDoanhThu)}
          </p>
        </div>

        {compareEnabled && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f1f5f9]">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                revGrowth.isPositive
                  ? 'bg-[#ecfdf5] text-[#047857]'
                  : 'bg-[#fef2f2] text-[#b91c1c]'
              }`}
            >
              {revGrowth.isPositive ? '↑' : '↓'} {Math.abs(revGrowth.percent)}%
            </span>
            <span className="text-[#64748b] text-[12px]">
              {formatCurrency(prevDoanhThu)} kỳ trước
            </span>
          </div>
        )}
      </div>

      {/* Thẻ 2: Số vé đã bán */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between min-h-[148px]">
        <div className="flex items-start justify-between w-full">
          <span className="text-[#64748b] text-[13px] font-normal">
            Số vé đã bán
          </span>
          <div className="size-[36px] rounded-[8px] bg-[#f8fafc] flex items-center justify-center text-[#0284c7]">
            {/* Tickets Icon */}
            <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-[#0f172a] text-[28px] font-semibold leading-tight">
            {tongSoVe.toLocaleString('vi-VN')} vé
          </p>
        </div>

        {compareEnabled && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f1f5f9]">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                ticketGrowth.isPositive
                  ? 'bg-[#ecfdf5] text-[#047857]'
                  : 'bg-[#fef2f2] text-[#b91c1c]'
              }`}
            >
              {ticketGrowth.isPositive ? '↑' : '↓'} {Math.abs(ticketGrowth.percent)}%
            </span>
            <span className="text-[#64748b] text-[12px]">
              {prevSoVe.toLocaleString('vi-VN')} vé kỳ trước
            </span>
          </div>
        )}
      </div>

      {/* Thẻ 3: Tăng trưởng doanh thu */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between min-h-[148px]">
        <div className="flex items-start justify-between w-full">
          <span className="text-[#64748b] text-[13px] font-normal">
            Tăng trưởng doanh thu
          </span>
          <div className="size-[36px] rounded-[8px] bg-[#f8fafc] flex items-center justify-center text-[#0284c7]">
            {/* Trending-up Icon */}
            <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <div className="mt-2">
          <p
            className={`text-[28px] font-semibold leading-tight ${
              revGrowth.isPositive ? 'text-[#0f172a]' : 'text-red-600'
            }`}
          >
            {revGrowth.isPositive ? `+${revGrowth.percent}%` : `${revGrowth.percent}%`}
          </p>
        </div>

        {compareEnabled && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#f1f5f9]">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                revGrowth.isPositive
                  ? 'bg-[#ecfdf5] text-[#047857]'
                  : 'bg-[#fef2f2] text-[#b91c1c]'
              }`}
            >
              {revGrowth.isPositive ? '↑' : '↓'} {Math.abs(revGrowth.percent)}%
            </span>
            <span className="text-[#64748b] text-[12px]">
              {revGrowth.diff >= 0 ? 'Tăng ' : 'Giảm '}
              {formatCurrency(Math.abs(revGrowth.diff))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
