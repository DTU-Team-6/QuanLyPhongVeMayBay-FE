/**
 * Tiện ích hỗ trợ xử lý dữ liệu báo cáo, khoảng ngày và xuất file
 */

/**
 * Định dạng đối tượng Date thành chuỗi yyyy-MM-dd
 * @param {Date} date
 * @returns {string}
 */
export function formatDateToISO(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
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

/**
 * Tính toán khoảng thời gian đối chiếu của kỳ liền trước (cùng độ dài số ngày)
 * @param {string} startDateStr - yyyy-MM-dd
 * @param {string} endDateStr - yyyy-MM-dd
 * @returns {{ startDate: string, endDate: string }}
 */
export function getPreviousPeriod(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) {
    return { startDate: '', endDate: '' };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const prevEnd = new Date(start.getTime());
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd.getTime());
  prevStart.setDate(prevStart.getDate() - diffDays + 1);

  return {
    startDate: formatDateToISO(prevStart),
    endDate: formatDateToISO(prevEnd),
  };
}

/**
 * Kiểm tra tính hợp lệ của bộ lọc báo cáo ở phía Client
 * @param {Object} filter
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateReportFilter(filter) {
  const errors = {};

  if (!filter?.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu';
  }

  if (!filter?.endDate) {
    errors.endDate = 'Vui lòng chọn ngày kết thúc';
  }

  if (filter?.startDate && filter?.endDate) {
    const start = new Date(filter.startDate);
    const end = new Date(filter.endDate);

    if (isNaN(start.getTime())) {
      errors.startDate = 'Ngày bắt đầu không đúng định dạng';
    }
    if (isNaN(end.getTime())) {
      errors.endDate = 'Ngày kết thúc không đúng định dạng';
    }

    if (!errors.startDate && !errors.endDate && start > end) {
      errors.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    }
  }

  if (!filter?.reportType) {
    errors.reportType = 'Vui lòng chọn loại báo cáo';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Tính toán % tăng trưởng và chênh lệch giữa hai số
 * @param {number} current
 * @param {number} previous
 * @returns {{ diff: number, percent: number, isPositive: boolean }}
 */
export function calculateGrowth(current, previous) {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  const diff = curr - prev;

  let percent = 0;
  if (prev !== 0) {
    percent = (diff / prev) * 100;
  } else if (curr > 0) {
    percent = 100;
  }

  return {
    diff,
    percent: Math.round(percent * 10) / 10,
    isPositive: diff >= 0,
  };
}

/**
 * Chuyển dữ liệu báo cáo thành file CSV UTF-8 kèm BOM
 * @param {Object} report
 * @returns {string} CSV content
 */
export function buildReportCSV(report) {
  const summary = report?.summary || {};
  const items = report?.items || [];

  const headers = ['STT', 'Hạng', 'Đối tượng', 'Số đơn đặt chỗ', 'Số vé bán ra', 'Doanh thu (VNĐ)', 'Lợi nhuận (VNĐ)'];

  const rows = items.map((item, index) => [
    index + 1,
    `#${index + 1}`,
    `"${(item.label || item.key || '').replace(/"/g, '""')}"`,
    item.soDonDatCho || 0,
    item.soVeBanRa || 0,
    item.doanhThu || 0,
    item.loiNhuan || 0,
  ]);

  // Thêm dòng tổng kết
  rows.push([
    '',
    'TỔNG CỘNG',
    '',
    summary.tongSoDonDatCho || 0,
    summary.tongSoVe || 0,
    summary.tongDoanhThu || 0,
    summary.tongLoiNhuan || 0,
  ]);

  const csvRows = [
    `"BÁO CÁO DOANH THU PHÒNG VÉ VÂN VIỆT"`,
    `"Khoảng thời gian: ${report?.startDate || ''} đến ${report?.endDate || ''}"`,
    `"Loại báo cáo: ${report?.reportType || ''}"`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ];

  // Thêm UTF-8 Byte Order Mark (BOM) \uFEFF để Excel hiển thị đúng dấu tiếng Việt
  return '\uFEFF' + csvRows.join('\r\n');
}

/**
 * Kích hoạt tải file CSV về trình duyệt
 * @param {string} csvContent
 * @param {string} filename
 */
export function downloadCSV(csvContent, filename = 'bao-cao-doanh-thu.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
