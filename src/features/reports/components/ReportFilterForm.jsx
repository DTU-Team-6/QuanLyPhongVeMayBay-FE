import { getPresetDateRange } from '../utils/reportHelpers';

/**
 * Form lọc điều kiện báo cáo theo thiết kế Figma 186:3340
 */
export default function ReportFilterForm({
  filter,
  onChange,
  onSubmit,
  loading = false,
  errors = {},
}) {
  const handlePresetClick = (presetType) => {
    const range = getPresetDateRange(presetType);
    onChange({
      startDate: range.startDate,
      endDate: range.endDate,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-[0px_4px_16px_0px_rgba(15,23,42,0.03)] w-full flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[#0f172a] text-[18px] font-semibold">
          Bộ lọc báo cáo
        </h2>
        <span className="text-[#64748b] text-[12px]">
          SRS 6.5.4.1 • Chuẩn API /api/v1/reports
        </span>
      </div>

      {/* Hàng 1: 3 bộ chọn loại hiển thị, loại báo cáo và tiêu chí gom nhóm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chọn kiểu hiển thị */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayMode" className="text-[#334155] text-[12px] font-semibold">
            Chọn kiểu hiển thị
          </label>
          <div className="relative">
            <select
              id="displayMode"
              name="displayMode"
              value={filter.displayMode || 'BOTH'}
              onChange={handleInputChange}
              className="w-full h-[40px] px-3 pr-8 rounded-[8px] border border-[#cbd5e1] bg-white text-[#0f172a] text-[14px] focus:outline-hidden focus:border-[#0284c7] transition appearance-none cursor-pointer"
            >
              <option value="BOTH">Cả hai (Bảng & Biểu đồ)</option>
              <option value="TABLE">Bảng</option>
              <option value="CHART">Biểu đồ</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748b]">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Báo cáo theo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reportType" className="text-[#334155] text-[12px] font-semibold">
            Báo cáo theo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="reportType"
              name="reportType"
              value={filter.reportType || 'THEO_NHAN_VIEN'}
              onChange={handleInputChange}
              className="w-full h-[40px] px-3 pr-8 rounded-[8px] border border-[#cbd5e1] bg-white text-[#0f172a] text-[14px] focus:outline-hidden focus:border-[#0284c7] transition appearance-none cursor-pointer"
            >
              <option value="THEO_NHAN_VIEN">Top nhân viên bán hàng</option>
              <option value="THEO_HANG">Hãng hàng không</option>
              <option value="THEO_THOI_GIAN">Doanh thu phòng vé (Thời gian)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748b]">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.reportType && (
            <p className="text-red-500 text-[12px] mt-0.5">{errors.reportType}</p>
          )}
        </div>

        {/* Gom nhóm thời gian */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="groupBy" className="text-[#334155] text-[12px] font-semibold">
            Tiêu chí gom nhóm
          </label>
          <div className="relative">
            <select
              id="groupBy"
              name="groupBy"
              value={filter.groupBy || 'DAY'}
              onChange={handleInputChange}
              className="w-full h-[40px] px-3 pr-8 rounded-[8px] border border-[#cbd5e1] bg-white text-[#0f172a] text-[14px] focus:outline-hidden focus:border-[#0284c7] transition appearance-none cursor-pointer"
            >
              <option value="DAY">Theo ngày (DAY)</option>
              <option value="MONTH">Theo tháng (MONTH)</option>
              <option value="YEAR">Theo năm (YEAR)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748b]">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng mô tả kiểu báo cáo */}
      <div className="flex flex-wrap gap-4 text-[#64748b] text-[12px]">
        <span>Bảng / Biểu đồ tròn / Biểu đồ đường</span>
        <span>•</span>
        <span>Doanh thu phòng vé / Top nhân viên bán hàng / Hãng hàng không</span>
      </div>

      {/* Nút chọn nhanh khoảng thời gian */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[#64748b] text-[12px] mr-1">Chọn nhanh:</span>
        {[
          { key: 'thisWeek', label: 'Tuần này' },
          { key: 'thisMonth', label: 'Tháng này' },
          { key: 'thisQuarter', label: 'Quý này' },
          { key: 'thisYear', label: 'Năm nay' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handlePresetClick(item.key)}
            className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] font-semibold text-[12px] px-3 py-1 rounded-full transition cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Hàng chọn ngày, đối chiếu và nút Xem báo cáo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-1">
        {/* Từ ngày */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-[#334155] text-[12px] font-semibold">
            Từ ngày <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={filter.startDate || ''}
            onChange={handleInputChange}
            className={`w-full h-[40px] px-3 rounded-[8px] border text-[#0f172a] text-[14px] bg-white transition focus:outline-hidden ${
              errors.startDate
                ? 'border-red-500 focus:border-red-600'
                : 'border-[#cbd5e1] focus:border-[#0284c7]'
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-[12px]">{errors.startDate}</p>
          )}
        </div>

        {/* Đến ngày */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label htmlFor="endDate" className="text-[#334155] text-[12px] font-semibold">
            Đến ngày <span className="text-red-500">*</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={filter.endDate || ''}
            onChange={handleInputChange}
            className={`w-full h-[40px] px-3 rounded-[8px] border text-[#0f172a] text-[14px] bg-white transition focus:outline-hidden ${
              errors.endDate
                ? 'border-red-500 focus:border-red-600'
                : 'border-[#cbd5e1] focus:border-[#0284c7]'
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-[12px]">{errors.endDate}</p>
          )}
        </div>

        {/* Checkbox So sánh với kỳ trước */}
        <div className="md:col-span-3 flex items-center h-[40px]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="comparePrevious"
              checked={filter.comparePrevious !== false}
              onChange={handleInputChange}
              className="size-4 text-[#0284c7] rounded-sm border-[#cbd5e1] focus:ring-[#0284c7] cursor-pointer"
            />
            <span className="text-[#334155] text-[13px]">
              So sánh với kỳ trước
            </span>
          </label>
        </div>

        {/* Nút Xem báo cáo */}
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[40px] bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Xem báo cáo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
