import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountSidebar from '../../account/components/AccountSidebar';
import Loading from '../../../components/common/Loading';
import paymentService from '../services/paymentService';
import { ApiError } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/formatters';
import { formatLocalDate, getBookingStatusMeta } from '../utils/paymentFormatters';

const PAGE_SIZE = 6;

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'CHO_THANH_TOAN', label: 'Chờ thanh toán' },
  { value: 'DA_THANH_TOAN', label: 'Đã thanh toán' },
  { value: 'DA_HUY', label: 'Đã hủy' },
];

/**
 * Màn hình 6.4.4 – Xem lịch sử giao dịch (/tai-khoan/lich-su-giao-dich)
 * Lấy dữ liệu thật từ GET /api/v1/thanh-toan/lich-su (có lọc ngày, trạng thái, phân trang)
 */
export default function TransactionHistoryPage() {
  const navigate = useNavigate();

  // Bộ lọc nhập trên form
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [trangThai, setTrangThai] = useState('');

  // Bộ lọc đang áp dụng cho API
  const [appliedFilters, setAppliedFilters] = useState({
    tuNgay: '',
    denNgay: '',
    trangThai: '',
  });
  const [page, setPage] = useState(0);

  // Kết quả từ BE (PageResponse<TransactionHistoryDto>)
  const [pageData, setPageData] = useState({
    content: [],
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getTransactionHistory({
        tuNgay: appliedFilters.tuNgay || undefined,
        denNgay: appliedFilters.denNgay || undefined,
        trangThai: appliedFilters.trangThai || undefined,
        page,
        size: PAGE_SIZE,
      });
      setPageData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setAppliedFilters({ tuNgay, denNgay, trangThai });
  };

  const { content = [], totalElements = 0, totalPages = 0 } = pageData;
  const startRecord = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endRecord = Math.min((page + 1) * PAGE_SIZE, totalElements);

  // Danh sách số trang hiển thị
  const pageNumbers = Array.from({ length: Math.max(totalPages, 1) }, (_, idx) => idx);

  return (
    <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-72px)] py-6 px-4 lg:px-8">
      <div className="max-w-[1140px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#64748b] mb-5 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0284c7]">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/tai-khoan" className="hover:text-[#0284c7]">
            Tài khoản
          </Link>
          <span>/</span>
          <span className="text-[#0f172a] font-medium">Lịch sử giao dịch</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar trái */}
          <AccountSidebar />

          {/* Nội dung chính */}
          <div className="flex-1 min-w-0 w-full">
            <div className="mb-5">
              <h1 className="text-[24px] font-bold text-[#0f172a]">Lịch sử giao dịch</h1>
              <p className="text-[13px] text-[#64748b] mt-1">
                Theo dõi toàn bộ vé đã đặt và trạng thái thanh toán của bạn.
              </p>
            </div>

            {/* Bộ lọc */}
            <form
              onSubmit={handleFilterSubmit}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end mb-5"
            >
              <div className="sm:col-span-4">
                <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={tuNgay}
                  onChange={(e) => setTuNgay(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={denNgay}
                  min={tuNgay || undefined}
                  onChange={(e) => setDenNgay(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={trangThai}
                  onChange={(e) => setTrangThai(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 flex">
                <button
                  type="submit"
                  className="w-full h-10 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Lọc</span>
                </button>
              </div>
            </form>

            {/* Bảng lịch sử */}
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-[0px_2px_8px_rgba(15,23,42,0.03)]">
              {loading ? (
                <Loading message="Đang tải lịch sử giao dịch..." />
              ) : error ? (
                <div className="p-8 text-center">
                  {error instanceof ApiError && (error.status === 401 || error.code === 'UNAUTHORIZED') ? (
                    <>
                      <p className="text-[14px] font-semibold text-[#0f172a] mb-2">
                        Vui lòng đăng nhập để xem lịch sử giao dịch
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/dang-nhap')}
                        className="mt-2 px-5 py-2 bg-[#0284c7] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0369a1] cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] font-semibold text-red-600 mb-1">
                        Không thể tải lịch sử giao dịch
                      </p>
                      <p className="text-[12px] text-[#64748b] mb-3">{error.message}</p>
                      <button
                        type="button"
                        onClick={fetchHistory}
                        className="px-4 py-1.5 bg-[#0284c7] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0369a1] cursor-pointer"
                      >
                        Thử lại
                      </button>
                    </>
                  )}
                </div>
              ) : content.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-[14px] font-semibold text-[#334155]">
                    Không có giao dịch nào phù hợp
                  </p>
                  <p className="text-[12px] text-[#64748b] mt-1">
                    Thử thay đổi khoảng ngày hoặc bộ lọc trạng thái.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[12px] font-semibold text-[#64748b]">
                        <th className="py-3.5 px-4">Mã đặt chỗ</th>
                        <th className="py-3.5 px-4">Tuyến bay</th>
                        <th className="py-3.5 px-4">Ngày đặt</th>
                        <th className="py-3.5 px-4">Ngày bay</th>
                        <th className="py-3.5 px-4">Giá tiền</th>
                        <th className="py-3.5 px-4">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-[13px] text-[#334155]">
                      {content.map((item) => {
                        const statusMeta = getBookingStatusMeta(item.trangThai);
                        return (
                          <tr key={item.datChoId} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                              {item.maDatCho}
                            </td>
                            <td className="py-3.5 px-4">{item.tuyenBay || '—'}</td>
                            <td className="py-3.5 px-4">{formatLocalDate(item.ngayDat)}</td>
                            <td className="py-3.5 px-4">{formatLocalDate(item.ngayBay)}</td>
                            <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                              {formatCurrency(item.giaTien)}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.badgeClass}`}
                                >
                                  {statusMeta.label}
                                </span>
                                {item.trangThai === 'CHO_THANH_TOAN' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate('/tai-khoan/thanh-toan', {
                                        state: { preselectDatChoId: item.datChoId },
                                      })
                                    }
                                    className="text-[11px] font-semibold text-[#0284c7] hover:underline cursor-pointer"
                                  >
                                    Thanh toán →
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Phân trang */}
            {!loading && !error && totalElements > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#64748b]">
                <p>
                  Hiển thị {startRecord}–{endRecord} trong {totalElements} bản ghi
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={pageData.isFirst || page <= 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-[6px] text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Trước
                  </button>

                  {pageNumbers.map((pNum) => (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={`size-8 rounded-[6px] text-[12px] font-semibold border transition cursor-pointer ${
                        pNum === page
                          ? 'bg-[#0284c7] border-[#0284c7] text-white'
                          : 'bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]'
                      }`}
                    >
                      {pNum + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={pageData.isLast || page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-[6px] text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
