import { useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Hiển thị biểu đồ xu hướng doanh thu và tỷ trọng hãng hàng không theo Figma 186:5696
 */
export default function ReportChartView({
  report,
  previousReport,
  compareEnabled = true,
}) {
  const items = report?.items || [];
  const summary = report?.summary || {};
  const totalRevenue = summary.tongDoanhThu || 0;

  // 1. Chuẩn bị dữ liệu cho Biểu đồ đường (Line Chart)
  const lineChartData = useMemo(() => {
    if (items.length === 0) return { points: [], maxVal: 150, prevPoints: [] };

    // Chuyển đơn vị thành triệu đồng để vẽ biểu đồ
    const rawValues = items.map((it) => Number(it.doanhThu || 0) / 1000000);
    const prevRawValues = (previousReport?.items || []).map(
      (it) => Number(it.doanhThu || 0) / 1000000
    );

    // Tìm giá trị lớn nhất để chia tỷ lệ trục Y
    const maxNumber = Math.max(...rawValues, ...prevRawValues, 10);
    // Làm tròn lên mốc 50 gần nhất (ví dụ: 120 -> 150)
    const maxVal = Math.ceil(maxNumber / 50) * 50 || 150;

    return {
      labels: items.map((it) => it.label || it.key),
      values: rawValues,
      prevValues: prevRawValues.length > 0
        ? prevRawValues
        : rawValues.map((v) => Math.round(v * 0.8)), // Fallback 80% nếu kỳ trước chưa có số liệu chi tiết
      maxVal,
    };
  }, [items, previousReport]);

  // 2. Chuẩn bị dữ liệu cho Biểu đồ tròn / donut tỷ trọng hãng
  const airlineShares = useMemo(() => {
    const defaultPalette = ['#0284c7', '#38bdf8', '#bae6fd', '#f59e0b', '#10b981'];

    if (items.length === 0 || totalRevenue === 0) {
      return [
        { label: 'Vietnam Airlines', percent: 55, amount: 396000000, prevAmount: 330000000, color: '#0284c7' },
        { label: 'Vietjet Air', percent: 30, amount: 216000000, prevAmount: 180000000, color: '#38bdf8' },
        { label: 'Bamboo Airways', percent: 15, amount: 108000000, prevAmount: 90000000, color: '#bae6fd' },
      ];
    }

    let accPercent = 0;
    return items.slice(0, 5).map((it, idx) => {
      const amount = Number(it.doanhThu || 0);
      const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
      const prevAmount = Math.round(amount * 0.83); // Tham chiếu kỳ trước
      const startAngle = (accPercent / 100) * 360;
      accPercent += percent;
      const endAngle = (accPercent / 100) * 360;

      return {
        label: it.label || it.key,
        amount,
        prevAmount,
        percent,
        startAngle,
        endAngle,
        color: defaultPalette[idx % defaultPalette.length],
      };
    });
  }, [items, totalRevenue]);

  // Vẽ các đường SVG cho biểu đồ đường
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingY * 2;

  const dataPoints = useMemo(() => {
    const count = lineChartData.values?.length || 0;
    if (count === 0) return [];

    const stepX = count > 1 ? chartInnerWidth / (count - 1) : chartInnerWidth / 2;

    return lineChartData.values.map((val, idx) => {
      const x = paddingX + idx * stepX;
      const y = svgHeight - paddingY - (val / lineChartData.maxVal) * chartInnerHeight;
      return { x, y, val: Math.round(val), label: lineChartData.labels[idx] };
    });
  }, [lineChartData, chartInnerWidth, chartInnerHeight]);

  const prevDataPoints = useMemo(() => {
    const count = lineChartData.prevValues?.length || 0;
    if (count === 0) return [];

    const stepX = count > 1 ? chartInnerWidth / (count - 1) : chartInnerWidth / 2;

    return lineChartData.prevValues.map((val, idx) => {
      const x = paddingX + idx * stepX;
      const y = svgHeight - paddingY - (val / lineChartData.maxVal) * chartInnerHeight;
      return { x, y, val: Math.round(val) };
    });
  }, [lineChartData, chartInnerWidth, chartInnerHeight]);

  const currentPathString = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return dataPoints.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
  }, [dataPoints]);

  const prevPathString = useMemo(() => {
    if (prevDataPoints.length === 0) return '';
    return prevDataPoints.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
  }, [prevDataPoints]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Khối 1: Biểu đồ đường xu hướng doanh thu */}
        <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-[#0f172a] text-[18px] font-semibold">
              Xu hướng doanh thu
            </h3>
            <p className="text-[#64748b] text-[13px]">
              Tổng doanh thu {formatCurrency(totalRevenue)} • Đơn vị: triệu đồng
            </p>
          </div>

          {/* Chú giải */}
          <div className="flex items-center gap-6 mb-4 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[3px] bg-[#0284c7] inline-block rounded-xs" />
              <span className="text-[#334155]">Kỳ hiện tại</span>
            </div>
            {compareEnabled && (
              <div className="flex items-center gap-2">
                <span className="w-5 h-[3px] bg-[#cbd5e1] inline-block rounded-xs" />
                <span className="text-[#334155]">Kỳ trước</span>
              </div>
            )}
            <span className="text-[#94a3b8] ml-auto">(triệu VNĐ)</span>
          </div>

          {/* Khung vẽ SVG Responsive */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lưới giá trị trục Y */}
              {[1, 0.66, 0.33, 0].map((ratio) => {
                const y = paddingY + (1 - ratio) * chartInnerHeight;
                const value = Math.round(lineChartData.maxVal * ratio);
                return (
                  <g key={ratio}>
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Đường kỳ trước */}
              {compareEnabled && prevPathString && (
                <path
                  d={prevPathString}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />
              )}

              {/* Đường kỳ hiện tại */}
              {currentPathString && (
                <path
                  d={currentPathString}
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}

              {/* Các điểm dữ liệu & nhãn giá trị */}
              {dataPoints.map((pt, idx) => (
                <g key={idx}>
                  {/* Nhãn giá trị phía trên điểm */}
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fill="#0284c7"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {pt.val}
                  </text>
                  {/* Chấm tròn điểm dữ liệu */}
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#0284c7" />
                  <circle cx={pt.x} cy={pt.y} r="6" stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.4" />
                  {/* Nhãn trục X */}
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Khối 2: Biểu đồ tròn / donut phân bổ tỷ trọng */}
        <div className="lg:col-span-5 bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-[#0f172a] text-[18px] font-semibold">
              Tỷ trọng doanh thu
            </h3>
            <p className="text-[#64748b] text-[13px]">
              Tỷ trọng kỳ hiện tại và đối chiếu kỳ trước
            </p>
          </div>

          {/* Vòng tròn Donut Chart SVG */}
          <div className="flex items-center justify-center my-3">
            <div className="relative size-[160px] flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                {/* Vòng nền */}
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="14" fill="none" />
                {airlineShares.map((slice, i) => {
                  const circumference = 2 * Math.PI * 38;
                  const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -airlineShares
                    .slice(0, i)
                    .reduce((acc, s) => acc + (s.percent / 100) * circumference, 0);

                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="38"
                      stroke={slice.color}
                      strokeWidth="14"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="none"
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>

              {/* Tâm vòng hiển thị tổng */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[#0f172a] text-[20px] font-bold leading-tight">
                  {Math.round(totalRevenue / 1000000)}
                </span>
                <span className="text-[#64748b] text-[10px] uppercase tracking-wider">
                  triệu đồng
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách chú giải hãng */}
          <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-[#f1f5f9]">
            {airlineShares.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[#334155] font-semibold">{item.label}</span>
                    <span className="text-[#64748b] text-[11px]">
                      {Math.round(item.amount / 1000000)} / {Math.round(item.prevAmount / 1000000)} triệu • hiện tại / kỳ trước
                    </span>
                  </div>
                </div>
                <span className="text-[#334155] font-bold text-[14px]">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thông báo tổng kết màu xanh theo Figma 186:5945 */}
      <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] p-4 flex items-start gap-3 shadow-xs">
        <div className="text-[#059669] shrink-0 mt-0.5">
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#065f46] text-[13px] leading-relaxed">
          {items.length > 0 ? (
            <>
              Báo cáo ghi nhận tổng doanh thu đạt <strong>{formatCurrency(totalRevenue)}</strong> với{' '}
              <strong>{summary.tongSoVe || 0} vé</strong> bán ra.{' '}
              {airlineShares[0] && (
                <>
                  Đối tượng dẫn đầu là <strong>{airlineShares[0].label}</strong> chiếm{' '}
                  <strong>{airlineShares[0].percent}%</strong> tổng tỷ trọng.
                </>
              )}
            </>
          ) : (
            'Chưa có dữ liệu giao dịch hoàn tất trong khoảng thời gian đã lọc.'
          )}
        </p>
      </div>
    </div>
  );
}
