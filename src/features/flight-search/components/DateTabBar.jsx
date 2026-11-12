import { useState, useEffect } from 'react';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Dải tab ngày ngang (5 ngày: 2 trước + hôm nay chọn + 2 sau)
 * - Mỗi tab: tên thứ, ngày tháng, giá thấp nhất từ BE (nếu có) hoặc "--"
 * - Tab đang chọn: nền xanh đậm (#0284c7), chữ trắng
 */

/**
 * Lấy 5 ngày: 2 trước, ngày hiện tại, 2 sau
 * @param {string} selectedDate - 'YYYY-MM-DD'
 */
function buildDateRange(selectedDate) {
  const base = new Date(selectedDate + 'T00:00:00');
  const days = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    // Định dạng YYYY-MM-DD local
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${yyyy}-${mm}-${dd}`);
  }
  return days;
}

/**
 * Tên thứ tiếng Việt ngắn gọn
 */
function getShortWeekday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return names[d.getDay()];
}

/**
 * Hiển thị dd/MM
 */
function formatDayMonth(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

export default function DateTabBar({ selectedDate, onDateChange, minPriceMap }) {
  // minPriceMap: { 'YYYY-MM-DD': number } hoặc null
  const days = buildDateRange(selectedDate);

  return (
    <div className="flex border border-[#e2e8f0] rounded-[10px] overflow-hidden bg-white shadow-sm">
      {days.map((dateStr) => {
        const isSelected = dateStr === selectedDate;
        const price = minPriceMap?.[dateStr];

        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onDateChange(dateStr)}
            className={`flex-1 flex flex-col items-center py-2.5 px-1 cursor-pointer transition-colors
              ${isSelected
                ? 'bg-[#0284c7] text-white'
                : 'bg-white text-[#64748b] hover:bg-[#f0f9ff]'
              }
              border-r border-[#e2e8f0] last:border-r-0`}
          >
            {/* Tên thứ */}
            <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-sky-100' : 'text-[#94a3b8]'}`}>
              {getShortWeekday(dateStr)}
            </span>
            {/* Ngày tháng */}
            <span className={`text-[13px] font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-[#334155]'}`}>
              {formatDayMonth(dateStr)}
            </span>
            {/* Giá thấp nhất */}
            <span className={`text-[11px] mt-1 ${isSelected ? 'text-sky-100' : 'text-[#64748b]'}`}>
              {price != null ? formatCurrency(price) : '--'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
