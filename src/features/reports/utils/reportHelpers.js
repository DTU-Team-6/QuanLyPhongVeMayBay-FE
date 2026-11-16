/**
 * Tiện ích hỗ trợ xử lý dữ liệu báo cáo, khoảng ngày và xuất file
 */

/**
 * Định dạng đối tượng Date thành chuỗi yyyy-MM-dd
 * @param {Date} date
 * @returns {string}
 */
export function formatDateToISO(date) {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Lấy khoảng thời gian theo preset nhanh
 * @param {'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'} presetType
 * @param {Date} [baseDate=new Date()]
 * @returns {{ startDate: string, endDate: string }}
 */
export function getPresetDateRange(presetType, baseDate = new Date()) {
  const target = new Date(baseDate.getTime());
  target.setHours(0, 0, 0, 0);

  switch (presetType) {
    case 'thisWeek': {
      // Tuần bắt đầu từ Thứ Hai (1) đến Chủ Nhật (0)
      const dayOfWeek = target.getDay(); // 0 is Sunday, 1 is Monday...
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(target);
      monday.setDate(target.getDate() + diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return {
        startDate: formatDateToISO(monday),
        endDate: formatDateToISO(sunday),
      };
    }

    case 'thisMonth': {
      const year = target.getFullYear();
      const month = target.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      return {
        startDate: formatDateToISO(firstDay),
        endDate: formatDateToISO(lastDay),
      };
    }

    case 'thisQuarter': {
      const year = target.getFullYear();
      const month = target.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      const firstDay = new Date(year, quarterStartMonth, 1);
      const lastDay = new Date(year, quarterStartMonth + 3, 0);

      return {
        startDate: formatDateToISO(firstDay),
        endDate: formatDateToISO(lastDay),
      };
    }

    case 'thisYear': {
      const year = target.getFullYear();
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);

      return {
        startDate: formatDateToISO(firstDay),
        endDate: formatDateToISO(lastDay),
      };
    }

    default:
      return {
        startDate: formatDateToISO(target),
        endDate: formatDateToISO(target),
      };
  }
}

/** Đọc ngày ISO chặt chẽ, dùng UTC để phép tính ngày không lệch theo DST/múi giờ. */
function parseISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '') || value < '0001-01-01') return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

export function getPreviousPeriod(startDateStr, endDateStr) {
  const start = parseISODate(startDateStr);
  const end = parseISODate(endDateStr);
  if (!start || !end || start > end) return { startDate: '', endDate: '' };
  const day = 86400000;
  const previousStart = new Date(start.getTime() - (end.getTime() - start.getTime() + day));
  if (previousStart.getUTCFullYear() < 1) return { startDate: '', endDate: '' };
  return {
    startDate: previousStart.toISOString().slice(0, 10),
    endDate: new Date(start.getTime() - day).toISOString().slice(0, 10),
  };
}

export const REPORT_TITLES = {
  THEO_NHAN_VIEN: 'Doanh thu theo nhân viên',
  THEO_HANG: 'Doanh thu theo hãng hàng không',
  THEO_THOI_GIAN: 'Doanh thu theo thời gian',
};

export function validateReportFilter(filter) {
  const errors = {};
  for (const [field, label] of [['startDate', 'ngày bắt đầu'], ['endDate', 'ngày kết thúc']]) {
    if (!filter?.[field]) errors[field] = `Vui lòng chọn ${label}`;
    else if (!parseISODate(filter[field])) errors[field] = `${label.charAt(0).toUpperCase() + label.slice(1)} không đúng định dạng`;
  }
  if (!errors.startDate && !errors.endDate && filter.startDate > filter.endDate) errors.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
  if (!Object.hasOwn(REPORT_TITLES, filter?.reportType || '')) errors.reportType = 'Vui lòng chọn loại báo cáo hợp lệ';
  if (filter?.groupBy && !['DAY', 'MONTH', 'YEAR'].includes(filter.groupBy)) errors.groupBy = 'Tiêu chí gom nhóm không hợp lệ';
  if (filter?.displayMode && !['BOTH', 'TABLE', 'CHART'].includes(filter.displayMode)) errors.displayMode = 'Kiểu hiển thị không hợp lệ';
  if (filter?.comparePrevious && !errors.startDate && !errors.endDate && !getPreviousPeriod(filter.startDate, filter.endDate).startDate) errors.startDate = 'Khoảng ngày không đủ để đối chiếu kỳ trước';
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateGrowth(current, previous) {
  if (current == null || previous == null) return { diff: null, percent: null, isPositive: null };
  const curr = Number(current);
  const prev = Number(previous);
  if (!Number.isFinite(curr) || !Number.isFinite(prev)) return { diff: null, percent: null, isPositive: null };
  const diff = curr - prev;
  // Tỷ lệ tăng từ 0 không xác định; không thể diễn đạt là tăng 100%.
  const percent = prev === 0 ? (curr === 0 ? 0 : null) : Math.round((diff / Math.abs(prev)) * 1000) / 10;
  return { diff, percent, isPositive: diff >= 0 };
}

export function formatGrowth(growth) {
  return growth.percent == null ? '—' : `${growth.percent > 0 ? '+' : ''}${growth.percent.toLocaleString('vi-VN')}%`;
}

export function orderedReportItems(report) {
  const items = [...(report?.items || [])];
  return report?.reportType === 'THEO_THOI_GIAN'
    ? items.sort((a, b) => String(a.key).localeCompare(String(b.key)))
    : items.sort((a, b) => Number(b.doanhThu) - Number(a.doanhThu));
}

/** Kỳ trước trả thành công nhưng không có đối tượng này nghĩa là doanh thu bằng 0. */
export function previousRevenue(item, previousReport) {
  if (!previousReport) return null;
  return previousReport.items.find((previous) => previous.key === item.key)?.doanhThu ?? 0;
}

/** Gom các hãng còn lại thành Khác để hình tròn luôn thể hiện toàn bộ doanh thu. */
export function revenueShares(items = []) {
  const positive = items.filter((item) => Number(item.doanhThu) > 0).sort((a, b) => Number(b.doanhThu) - Number(a.doanhThu));
  const total = positive.reduce((sum, item) => sum + Number(item.doanhThu), 0);
  if (!total) return [];
  const visible = positive.slice(0, 5).map((item) => ({ label: item.label || item.key || 'Chưa phân loại', amount: Number(item.doanhThu) }));
  if (positive.length > 5) visible.push({ label: 'Các hãng khác', amount: positive.slice(5).reduce((sum, item) => sum + Number(item.doanhThu), 0) });
  return visible.map((item) => ({ ...item, percent: item.amount / total * 100 }));
}

function csvCell(value) {
  let text = String(value ?? '');
  // Bảo vệ tên đối tượng do người dùng nhập khỏi bị Excel hiểu là công thức.
  if (/^[\s]*[=+\-@]/.test(text) && typeof value !== 'number') text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildReportCSV(report) {
  const summary = report?.summary || {};
  const currency = report?.tienTe || 'VND';
  const rows = [
    ['BÁO CÁO DOANH THU PHÒNG VÉ VÂN VIỆT'],
    [`Khoảng thời gian: ${report?.startDate || ''} đến ${report?.endDate || ''}`],
    [`Loại báo cáo: ${REPORT_TITLES[report?.reportType] || report?.reportType || ''}`],
    [],
    ['STT', 'Đối tượng', 'Số đơn đặt chỗ', 'Số vé bán ra', `Doanh thu (${currency})`, `Lợi nhuận (${currency})`],
    ...orderedReportItems(report).map((item, index) => [index + 1, item.label || item.key || 'Khách đặt trực tuyến', item.soDonDatCho ?? 0, item.soVeBanRa ?? 0, item.doanhThu ?? 0, item.loiNhuan ?? 0]),
    ['', 'TỔNG CỘNG', summary.tongSoDonDatCho ?? 0, summary.tongSoVe ?? 0, summary.tongDoanhThu ?? 0, summary.tongLoiNhuan ?? 0],
  ];
  return '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

export function downloadCSV(csvContent, filename = 'bao-cao-doanh-thu.csv') {
  const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
