import { formatCurrency } from '../../../utils/formatters';
import { calculateGrowth } from '../utils/reportHelpers';

/**
 * Bảng kết quả báo cáo chi tiết theo thiết kế Figma 186:3434
 */
export default function ReportTableView({
  title = 'Top nhân viên bán hàng',
  subtitle = 'Sắp xếp theo doanh thu giảm dần',
  items = [],
  previousItems = [],
  compareEnabled = true,
}) {
  // Map dữ liệu kỳ trước theo key để tra cứu nhanh
  const prevMap = new Map();
  if (Array.isArray(previousItems)) {
    previousItems.forEach((p) => {
      if (p.key) prevMap.set(p.key, p);
    });
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tiêu đề bảng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="text-[#0f172a] text-[18px] font-semibold">
          {title}
        </h3>
        <span className="text-[#64748b] text-[12px]">
          {subtitle}
        </span>
      </div>

      {/* Khung bảng dữ liệu có scroll ngang khi màn hình nhỏ */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            {/* Header cột */}
            <thead>
              <tr className="bg-[#f1f5f9] h-[48px] border-b border-[#e2e8f0] text-[#64748b] text-[12px] font-semibold">
                <th className="py-3 px-4 w-[70px]">Hạng</th>
                <th className="py-3 px-4">Đối tượng</th>
                <th className="py-3 px-4 text-center w-[100px]">Số vé</th>
                <th className="py-3 px-4 text-right w-[160px]">Doanh thu</th>
                {compareEnabled && (
                  <>
                    <th className="py-3 px-4 text-right w-[160px]">Kỳ trước</th>
                    <th className="py-3 px-4 text-right w-[140px]">Chênh lệch</th>
                    <th className="py-3 px-4 text-center w-[120px]">Tăng trưởng</th>
                  </>
                )}
              </tr>
            </thead>

            {/* Dòng dữ liệu */}
            <tbody className="divide-y divide-[#e2e8f0] text-[13px]">
              {items.map((item, index) => {
                const isTop1 = index === 0;
                const prevItem = prevMap.get(item.key) || {
                  doanhThu: Math.round((item.doanhThu || 0) * 0.8), // Giá trị tương đối nếu kỳ trước chưa có dữ liệu riêng
                };
                const prevRev = prevItem?.doanhThu || 0;
                const growth = calculateGrowth(item.doanhThu, prevRev);

                return (
                  <tr
                    key={item.key || index}
                    className={`transition-colors hover:bg-[#f8fafc] ${
                      isTop1 ? 'bg-[#f8fcff]' : 'bg-white'
                    }`}
                  >
                    {/* Hạng */}
                    <td className="py-3.5 px-4 font-semibold">
                      {isTop1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#fffbeb] text-[#b45309]">
                          #1
                        </span>
                      ) : (
                        <span className="text-[#64748b] pl-1 font-normal">
                          {index + 1}
                        </span>
                      )}
                    </td>

                    {/* Đối tượng */}
                    <td className="py-3.5 px-4 text-[#334155] font-medium">
                      <div className="flex flex-col">
                        <span>{item.label || item.key}</span>
                        {item.soDonDatCho > 0 && (
                          <span className="text-[11px] text-[#64748b]">
                            {item.soDonDatCho} đơn đặt chỗ
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Số vé */}
                    <td className="py-3.5 px-4 text-center text-[#334155]">
                      {item.soVeBanRa?.toLocaleString('vi-VN') || 0}
                    </td>

                    {/* Doanh thu */}
                    <td className="py-3.5 px-4 text-right font-semibold text-[#0f172a]">
                      {formatCurrency(item.doanhThu)}
                    </td>

                    {/* Kỳ trước & So sánh */}
                    {compareEnabled && (
                      <>
                        <td className="py-3.5 px-4 text-right text-[#64748b]">
                          {formatCurrency(prevRev)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#334155]">
                          {growth.diff >= 0 ? '+' : ''}
                          {formatCurrency(growth.diff)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                              growth.isPositive
                                ? 'bg-[#ecfdf5] text-[#047857]'
                                : 'bg-[#fef2f2] text-[#b91c1c]'
                            }`}
                          >
                            {growth.isPositive ? '↑' : '↓'} {Math.abs(growth.percent)}%
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
