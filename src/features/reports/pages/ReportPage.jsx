import { useState, useEffect, useCallback } from 'react';
import reportService from '../../../services/reportService';
import { useAuth } from '../../../context/AuthContext';
import {
  getPresetDateRange,
  getPreviousPeriod,
  validateReportFilter,
  buildReportCSV,
  downloadCSV,
} from '../utils/reportHelpers';
import ReportFilterForm from '../components/ReportFilterForm';
import ReportSummaryCards from '../components/ReportSummaryCards';
import ReportTableView from '../components/ReportTableView';
import ReportChartView from '../components/ReportChartView';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/common/Loading';

/**
 * Màn hình Tạo báo cáo (SRS 6.5.4.1) và Kết quả thống kê (SRS 6.5.4.2)
 * Thiết kế chuẩn theo Figma node 186:3277 (Staff Bảng) và 186:5696 (Admin Biểu đồ)
 */
export default function ReportPage() {
  const { user } = useAuth();

  // Khởi tạo bộ lọc mặc định: Tuần này
  const initialRange = getPresetDateRange('thisWeek');
  const [filter, setFilter] = useState({
    startDate: initialRange.startDate,
    endDate: initialRange.endDate,
    reportType: 'THEO_NHAN_VIEN',
    groupBy: 'DAY',
    displayMode: 'BOTH',
    comparePrevious: true,
  });

  const [filterErrors, setFilterErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Dữ liệu báo cáo kỳ hiện tại và kỳ đối chiếu trước đó
  const [reportData, setReportData] = useState(null);
  const [previousReportData, setPreviousReportData] = useState(null);

  // Tính khoảng thời gian đối chiếu của kỳ trước
  const prevPeriod = getPreviousPeriod(filter.startDate, filter.endDate);

  const fetchReports = useCallback(async (currentFilter) => {
    const validation = validateReportFilter(currentFilter);
    if (!validation.isValid) {
      setFilterErrors(validation.errors);
      return;
    }
    setFilterErrors({});
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Gọi API cho kỳ hiện tại
      const currentRes = await reportService.createReport({
        startDate: currentFilter.startDate,
        endDate: currentFilter.endDate,
        reportType: currentFilter.reportType,
        groupBy: currentFilter.groupBy || 'DAY',
        trangThaiDatCho: 'DA_THANH_TOAN',
      });

      setReportData(currentRes);

      // 2. Nếu bật so sánh với kỳ trước, gọi thêm dữ liệu đối chiếu
      if (currentFilter.comparePrevious) {
        const prev = getPreviousPeriod(currentFilter.startDate, currentFilter.endDate);
        if (prev.startDate && prev.endDate) {
          try {
            const prevRes = await reportService.createReport({
              startDate: prev.startDate,
              endDate: prev.endDate,
              reportType: currentFilter.reportType,
              groupBy: currentFilter.groupBy || 'DAY',
              trangThaiDatCho: 'DA_THANH_TOAN',
            });
            setPreviousReportData(prevRes);
          } catch {
            // Không chặn hiển thị nếu kỳ trước chưa có dữ liệu
            setPreviousReportData(null);
          }
        }
      } else {
        setPreviousReportData(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', err);
      setErrorMessage(
        err.message || 'Không thể tạo báo cáo. Vui lòng kiểm tra kết nối máy chủ backend.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động tải báo cáo lần đầu khi vào trang
  useEffect(() => {
    fetchReports(filter);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (updates) => {
    setFilter((prev) => ({ ...prev, ...updates }));
    // Xóa lỗi của trường vừa thay đổi
    if (Object.keys(updates).some((key) => filterErrors[key])) {
      setFilterErrors((prev) => {
        const next = { ...prev };
        Object.keys(updates).forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const handleFilterSubmit = () => {
    fetchReports(filter);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    const csv = buildReportCSV(reportData);
    const filename = `bao-cao-${filter.reportType.toLowerCase()}-${filter.startDate}-${filter.endDate}.csv`;
    downloadCSV(csv, filename);
  };

  const scrollToFilter = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reportTypeTitles = {
    THEO_NHAN_VIEN: 'Top nhân viên bán hàng',
    THEO_HANG: 'Doanh thu theo hãng hàng không',
    THEO_THOI_GIAN: 'Doanh thu phòng vé theo thời gian',
  };

  const currentTitle = reportTypeTitles[filter.reportType] || 'Thống kê báo cáo';

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Đường dẫn & Thông tin hệ thống */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#64748b] text-[12px] gap-2 border-b border-[#e2e8f0] pb-3">
          <div className="flex items-center gap-2">
            <span className="hover:text-[#0284c7] cursor-pointer">
              {user?.vaiTro === 'ADMIN' ? 'Quản trị' : 'Nhân viên'}
            </span>
            <span>/</span>
            <span className="font-semibold text-[#0f172a]">Thống kê báo cáo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#0284c7]">Vân Việt • HCM</span>
            <span>•</span>
            <span>Hệ thống hoạt động ổn định</span>
          </div>
        </div>

        {/* Tiêu đề trang & Mốc thời gian đối chiếu */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[#0f172a] text-[24px] sm:text-[28px] font-bold tracking-tight">
            {user?.vaiTro === 'ADMIN' ? 'Thống kê báo cáo doanh thu' : 'Thống kê báo cáo'}
          </h1>
          <p className="text-[#64748b] text-[14px]">
            Kỳ <strong>{filter.startDate}</strong> đến <strong>{filter.endDate}</strong>
            {filter.comparePrevious && prevPeriod.startDate && (
              <>
                {' '}• Đối chiếu <strong>{prevPeriod.startDate}</strong> đến <strong>{prevPeriod.endDate}</strong>
              </>
            )}
            {' '}• Đơn vị tiền: <strong>VNĐ</strong>
          </p>
        </div>

        {/* Form lọc báo cáo */}
        <div className="print:hidden">
          <ReportFilterForm
            filter={filter}
            onChange={handleFilterChange}
            onSubmit={handleFilterSubmit}
            loading={loading}
            errors={filterErrors}
          />
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[13px]">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchReports(filter)}
              className="text-[13px] font-semibold underline hover:text-red-900 cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Trạng thái tải dữ liệu */}
        {loading && (
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-12 shadow-xs">
            <Loading message="Đang truy vấn số liệu thống kê từ hệ thống..." />
          </div>
        )}

        {/* Dữ liệu trống */}
        {!loading && !errorMessage && (!reportData || reportData?.items?.length === 0) && (
          <EmptyState
            title="Không có dữ liệu báo cáo trong khoảng thời gian đã chọn"
            description="Hãy thử mở rộng khoảng ngày hoặc chọn tiêu chí lọc khác để xem số liệu thống kê."
            actionLabel="Đặt lại tuần này"
            onAction={() => {
              const week = getPresetDateRange('thisWeek');
              handleFilterChange({ startDate: week.startDate, endDate: week.endDate });
              fetchReports({ ...filter, startDate: week.startDate, endDate: week.endDate });
            }}
          />
        )}

        {/* Kết quả báo cáo */}
        {!loading && reportData && reportData.items && reportData.items.length > 0 && (
          <div className="flex flex-col gap-8">
            {/* 3 Thẻ chỉ số KPI */}
            <ReportSummaryCards
              summary={reportData.summary}
              previousSummary={previousReportData?.summary}
              compareEnabled={filter.comparePrevious}
            />

            {/* Chế độ xem Biểu đồ */}
            {(filter.displayMode === 'BOTH' || filter.displayMode === 'CHART') && (
              <ReportChartView
                report={reportData}
                previousReport={previousReportData}
                compareEnabled={filter.comparePrevious}
              />
            )}

            {/* Chế độ xem Bảng */}
            {(filter.displayMode === 'BOTH' || filter.displayMode === 'TABLE') && (
              <ReportTableView
                title={currentTitle}
                subtitle="Sắp xếp theo doanh thu giảm dần"
                items={reportData.items}
                previousItems={previousReportData?.items}
                compareEnabled={filter.comparePrevious}
              />
            )}

            {/* Thanh thao tác: Quay lại, In, Xuất Excel */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e2e8f0] print:hidden">
              <button
                type="button"
                onClick={scrollToFilter}
                className="h-[40px] px-4 rounded-[8px] border border-[#cbd5e1] bg-white hover:bg-slate-50 text-[#334155] text-[14px] font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Quay lại bộ lọc</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-[40px] px-4 rounded-[8px] border border-[#cbd5e1] bg-white hover:bg-slate-50 text-[#334155] text-[14px] font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>In báo cáo</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-[40px] px-4 rounded-[8px] bg-[#0284c7] hover:bg-[#0369a1] text-white text-[14px] font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Xuất Excel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
