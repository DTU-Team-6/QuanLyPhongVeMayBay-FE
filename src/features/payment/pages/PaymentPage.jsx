import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountSidebar from '../../account/components/AccountSidebar';
import Loading from '../../../components/common/Loading';
import paymentService from '../services/paymentService';
import { ApiError } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/formatters';
import { formatLocalDate } from '../utils/paymentFormatters';

/**
 * Màn hình 6.4.3 – Thanh toán vé (/tai-khoan/thanh-toan và /dat-ve/thanh-toan)
 * - Lấy danh sách đơn đặt chỗ chờ thanh toán thật từ BE: GET /api/v1/thanh-toan/lich-su?trangThai=CHO_THANH_TOAN
 * - Hỗ trợ thanh toán qua VNPAY hoặc PayPal (gọi POST /api/v1/thanh-toan/tao-url)
 * - Hiển thị số tiền VND và USD do BE trả về khi thanh toán PayPal
 */
export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [pendingList, setPendingList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY'); // 'VNPAY' | 'PAYPAL'

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Dữ liệu PayPal đã khởi tạo từ BE để hiển thị cả VND & USD trước khi chuyển hướng
  const [paypalPrepared, setPaypalPrepared] = useState(null);

  const loadPendingBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageRes = await paymentService.getPendingBookings({ page: 0, size: 50 });
      const list = Array.isArray(pageRes?.content) ? pageRes.content : [];
      setPendingList(list);

      // Tự động chọn đơn vừa đặt từ PassengerInfoPage hoặc từ Lịch sử giao dịch
      const preferredIds = [];
      if (state?.bookingDi?.id) preferredIds.push(state.bookingDi.id);
      if (state?.bookingVe?.id) preferredIds.push(state.bookingVe.id);
      if (state?.preselectDatChoId) preferredIds.push(state.preselectDatChoId);

      const validPreferred = preferredIds.filter((id) => list.some((item) => item.datChoId === id));
      if (validPreferred.length > 0) {
        setSelectedIds([validPreferred[0]]);
      } else if (list.length > 0) {
        setSelectedIds([list[0].datChoId]);
      } else {
        setSelectedIds([]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    loadPendingBookings();
  }, [loadPendingBookings]);

  // Danh sách các đơn đang được tick
  const selectedBookings = useMemo(
    () => pendingList.filter((item) => selectedIds.includes(item.datChoId)),
    [pendingList, selectedIds]
  );

  // Chỉ lấy giaTien từ BE khi chọn đúng 1 đơn (BE thanh toán theo từng datChoId, không tự cộng ở FE)
  const singleSelectedBooking = selectedBookings.length === 1 ? selectedBookings[0] : null;

  const isAllSelected = pendingList.length > 0 && selectedIds.length === pendingList.length;

  const toggleSelectOne = (datChoId) => {
    setPaypalPrepared(null);
    setActionError(null);
    setActionNotice(null);
    setSelectedIds((prev) =>
      prev.includes(datChoId) ? prev.filter((id) => id !== datChoId) : [...prev, datChoId]
    );
  };

  const toggleSelectAll = () => {
    setPaypalPrepared(null);
    setActionError(null);
    setActionNotice(null);
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingList.map((item) => item.datChoId));
    }
  };

  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    setPaypalPrepared(null);
    setActionError(null);
  };

  const handleCancelSelected = async () => {
    if (selectedBookings.length === 0) {
      setActionError('Vui lòng chọn ít nhất một mã đặt chỗ để hủy.');
      return;
    }
    setProcessing(true);
    setActionError(null);
    setActionNotice(null);
    try {
      for (const item of selectedBookings) {
        await paymentService.cancelBooking(item.datChoId);
      }
      setActionNotice('Đã hủy đặt chỗ thành công.');
      await loadPendingBookings();
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 405)) {
        setActionError(
          'Backend chưa hỗ trợ API hủy vé trực tuyến cho khách hàng. Vui lòng liên hệ tổng đài 1900 6868 để được hỗ trợ.'
        );
      } else {
        setActionError(err.message || 'Không thể hủy vé lúc này.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleProceedPayment = async () => {
    if (selectedBookings.length === 0) {
      setActionError('Vui lòng chọn một mã đặt chỗ cần thanh toán.');
      return;
    }
    if (selectedBookings.length > 1) {
      setActionError(
        'Mỗi giao dịch thanh toán áp dụng cho 1 mã đặt chỗ. Vui lòng chỉ chọn 1 mã đặt chỗ để thanh toán.'
      );
      return;
    }

    const target = selectedBookings[0];
    setProcessing(true);
    setActionError(null);
    setActionNotice(null);

    try {
      const origin = window.location.origin;
      const returnUrl =
        paymentMethod === 'VNPAY'
          ? `${origin}/dat-ve/thanh-toan/ket-qua?phuongThuc=VNPAY`
          : `${origin}/dat-ve/thanh-toan/ket-qua?phuongThuc=PAYPAL`;

      const paymentRes = await paymentService.createPaymentUrl({
        datChoId: target.datChoId,
        phuongThuc: paymentMethod,
        returnUrl,
      });

      if (!paymentRes?.paymentUrl) {
        setActionError('Máy chủ không trả về đường dẫn thanh toán.');
        return;
      }

      if (paymentMethod === 'PAYPAL') {
        // Quy tắc bắt buộc: hiển thị cả VND và USD do BE trả về trước khi thanh toán PayPal
        setPaypalPrepared(paymentRes);
      } else {
        // Chuyển hướng sang cổng thanh toán VNPay Sandbox
        window.location.href = paymentRes.paymentUrl;
      }
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.code === 'UNAUTHORIZED')) {
        setActionError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để thanh toán.');
      } else {
        setActionError(err.message || 'Không thể khởi tạo giao dịch thanh toán.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenPayPal = () => {
    if (!paypalPrepared?.paymentUrl) return;
    window.location.href = paypalPrepared.paymentUrl;
  };

  const handleCapturePayPalSandbox = async () => {
    // Dùng cho chế độ BE chạy với clientId test-paypal-client-id (PAYPAL-ORDER-...)
    if (!paypalPrepared?.paymentUrl) return;
    try {
      const urlObj = new URL(paypalPrepared.paymentUrl);
      const token = urlObj.searchParams.get('token');
      if (token) {
        navigate(`/dat-ve/thanh-toan/ket-qua?phuongThuc=PAYPAL&token=${encodeURIComponent(token)}`);
      }
    } catch {
      window.location.href = paypalPrepared.paymentUrl;
    }
  };

  const highlightBooking = singleSelectedBooking || pendingList[0] || null;
  const isSimulatedPayPal = paypalPrepared?.paymentUrl?.includes('PAYPAL-ORDER-');

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
          <span className="text-[#0f172a] font-medium">Thanh toán vé</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar trái */}
          <AccountSidebar />

          {/* Nội dung chính */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-5">
            <div>
              <h1 className="text-[24px] font-bold text-[#0f172a]">Thanh toán vé</h1>
              <p className="text-[13px] text-[#64748b] mt-1">
                Chọn vé cần thanh toán. Giá đã bao gồm thuế, phí và hành lý bổ sung.
              </p>
            </div>

            {/* Banner nhắc thanh toán */}
            {!loading && !error && highlightBooking && (
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] px-4 py-3 flex items-center gap-2.5 text-[13px] text-[#b45309]">
                <span className="size-5 rounded-full border border-[#d97706] text-[#d97706] flex items-center justify-center text-[11px] font-bold shrink-0">
                  i
                </span>
                <span>
                  Mã đặt chỗ <strong className="font-bold">{highlightBooking.maDatCho}</strong> đang chờ thanh toán.
                </span>
              </div>
            )}

            {/* Bảng vé chờ thanh toán */}
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-[0px_2px_8px_rgba(15,23,42,0.03)]">
              {loading ? (
                <Loading message="Đang tải danh sách vé chờ thanh toán..." />
              ) : error ? (
                <div className="p-8 text-center">
                  {error instanceof ApiError && (error.status === 401 || error.code === 'UNAUTHORIZED') ? (
                    <>
                      <p className="text-[14px] font-semibold text-[#0f172a] mb-2">
                        Vui lòng đăng nhập để xem và thanh toán vé của bạn
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
                        Không thể tải danh sách vé chờ thanh toán
                      </p>
                      <p className="text-[12px] text-[#64748b] mb-3">{error.message}</p>
                      <button
                        type="button"
                        onClick={loadPendingBookings}
                        className="px-4 py-1.5 bg-[#0284c7] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0369a1] cursor-pointer"
                      >
                        Thử lại
                      </button>
                    </>
                  )}
                </div>
              ) : pendingList.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-[15px] font-semibold text-[#334155]">
                    Bạn không có đơn đặt chỗ nào đang chờ thanh toán
                  </p>
                  <p className="text-[13px] text-[#64748b] mt-1">
                    Bạn có thể đặt chuyến bay mới hoặc kiểm tra lịch sử giao dịch.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Link
                      to="/"
                      className="px-4 py-2 bg-[#0284c7] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0369a1]"
                    >
                      Tìm chuyến bay
                    </Link>
                    <Link
                      to="/tai-khoan/lich-su-giao-dich"
                      className="px-4 py-2 border border-[#cbd5e1] text-[#334155] text-[13px] font-semibold rounded-[8px] hover:bg-[#f8fafc]"
                    >
                      Xem lịch sử giao dịch
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[12px] font-semibold text-[#64748b]">
                          <th className="py-3.5 px-4 w-10"></th>
                          <th className="py-3.5 px-4">Mã đặt chỗ</th>
                          <th className="py-3.5 px-4">Tuyến bay</th>
                          <th className="py-3.5 px-4">Ngày đặt</th>
                          <th className="py-3.5 px-4">Ngày bay</th>
                          <th className="py-3.5 px-4">Giá tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-[13px] text-[#334155]">
                        {pendingList.map((item) => {
                          const checked = selectedIds.includes(item.datChoId);
                          return (
                            <tr
                              key={item.datChoId}
                              onClick={() => toggleSelectOne(item.datChoId)}
                              className={`cursor-pointer transition-colors ${
                                checked ? 'bg-[#f0f9ff]/60' : 'hover:bg-[#f8fafc]'
                              }`}
                            >
                              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleSelectOne(item.datChoId)}
                                  className="size-4 rounded text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
                                />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#0284c7]">{item.maDatCho}</div>
                                <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef3c7] text-[#b45309]">
                                  Chờ thanh toán
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-[#0f172a]">
                                {item.tuyenBay || '—'}
                              </td>
                              <td className="py-3.5 px-4">{formatLocalDate(item.ngayDat, true)}</td>
                              <td className="py-3.5 px-4">{formatLocalDate(item.ngayBay, true)}</td>
                              <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                                {formatCurrency(item.giaTien)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Thanh chọn tất cả + nút hủy vé */}
            {!loading && !error && pendingList.length > 0 && (
              <div className="flex items-center justify-between gap-4 px-1">
                <label className="flex items-center gap-2.5 text-[13px] text-[#334155] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="size-4 rounded text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
                  />
                  <span>Chọn tất cả {pendingList.length} mã đặt chỗ</span>
                </label>

                <button
                  type="button"
                  disabled={processing || selectedBookings.length === 0}
                  onClick={handleCancelSelected}
                  className="px-4 py-2 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] font-semibold text-[#475569] hover:bg-[#fef2f2] hover:text-red-600 hover:border-red-300 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <span>Hủy vé</span>
                </button>
              </div>
            )}

            {/* Thông báo lỗi / thành công thao tác */}
            {actionError && (
              <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 text-[13px] text-red-700">
                ⚠️ {actionError}
              </div>
            )}
            {actionNotice && (
              <div className="bg-green-50 border border-green-200 rounded-[10px] px-4 py-3 text-[13px] text-green-700">
                ✓ {actionNotice}
              </div>
            )}

            {/* Khối Phương thức thanh toán */}
            {!loading && !error && pendingList.length > 0 && (
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.03)]">
                <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">Phương thức thanh toán</h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f5f9]">
                  <div>
                    <p className="text-[14px] font-bold text-[#0f172a]">
                      {selectedBookings.length === 0
                        ? 'Chưa chọn mã đặt chỗ'
                        : selectedBookings.length === 1
                          ? `Đã chọn 1 đơn • ${selectedBookings[0].maDatCho}`
                          : `Đã chọn ${selectedBookings.length} đơn (${selectedBookings.map((b) => b.maDatCho).join(', ')})`}
                    </p>
                    <p className="text-[12px] text-[#64748b] mt-0.5">
                      {singleSelectedBooking
                        ? `${singleSelectedBooking.tuyenBay || ''} · Ngày bay ${formatLocalDate(singleSelectedBooking.ngayBay)}`
                        : selectedBookings.length > 1
                          ? 'Vui lòng chọn 1 mã đặt chỗ mỗi lần thanh toán qua cổng trực tuyến'
                          : 'Tick chọn mã đặt chỗ ở bảng phía trên để thanh toán'}
                    </p>
                  </div>

                  <div className="text-right">
                    {singleSelectedBooking ? (
                      <p className="text-[24px] font-bold text-[#f97316]">
                        {formatCurrency(singleSelectedBooking.giaTien)}
                      </p>
                    ) : (
                      <p className="text-[14px] font-semibold text-[#94a3b8]">—</p>
                    )}
                  </div>
                </div>

                {/* Lựa chọn cổng thanh toán */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleMethodChange('VNPAY')}
                    className={`p-4 rounded-[10px] border text-left flex items-start gap-3 transition cursor-pointer ${
                      paymentMethod === 'VNPAY'
                        ? 'border-[#0284c7] bg-[#f0f9ff]'
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'VNPAY' ? 'border-[#0284c7]' : 'border-[#cbd5e1]'
                      }`}
                    >
                      {paymentMethod === 'VNPAY' && (
                        <span className="size-2 rounded-full bg-[#0284c7]" />
                      )}
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">VNPAY</p>
                      <p className="text-[12px] text-[#64748b] mt-0.5">
                        QR &amp; thẻ ngân hàng nội địa
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMethodChange('PAYPAL')}
                    className={`p-4 rounded-[10px] border text-left flex items-start gap-3 transition cursor-pointer ${
                      paymentMethod === 'PAYPAL'
                        ? 'border-[#0284c7] bg-[#f0f9ff]'
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'PAYPAL' ? 'border-[#0284c7]' : 'border-[#cbd5e1]'
                      }`}
                    >
                      {paymentMethod === 'PAYPAL' && (
                        <span className="size-2 rounded-full bg-[#0284c7]" />
                      )}
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">PayPal</p>
                      <p className="text-[12px] text-[#64748b] mt-0.5">
                        Ví điện tử &amp; thẻ quốc tế
                      </p>
                    </div>
                  </button>
                </div>

                {/* Hộp hiển thị quy đổi VND & USD do BE trả về khi chọn PayPal */}
                {paymentMethod === 'PAYPAL' && paypalPrepared && (
                  <div className="mt-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-[10px] p-4 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-[#0369a1]">
                          Xác nhận thanh toán PayPal ({paypalPrepared.maDatCho})
                        </p>
                        <p className="text-[12px] text-[#475569] mt-0.5">
                          Mã giao dịch: <span className="font-mono font-semibold">{paypalPrepared.maGiaoDich}</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[14px] font-bold text-[#0f172a]">
                          {formatCurrency(paypalPrepared.soTienVnd)}
                        </p>
                        <p className="text-[15px] font-bold text-[#f97316]">
                          ≈ {paypalPrepared.soTienUsd} USD
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#bae6fd]">
                      {isSimulatedPayPal ? (
                        <button
                          type="button"
                          onClick={handleCapturePayPalSandbox}
                          className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] cursor-pointer"
                        >
                          Xác nhận thanh toán PayPal Sandbox →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleOpenPayPal}
                          className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] cursor-pointer"
                        >
                          Chuyển đến cổng PayPal →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer nút thanh toán */}
                <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[12px] text-[#64748b]">
                    Thanh toán an toàn • Mã hóa bảo mật
                  </p>

                  <button
                    type="button"
                    disabled={processing || selectedBookings.length === 0}
                    onClick={handleProceedPayment}
                    className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang khởi tạo...</span>
                      </>
                    ) : (
                      <>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        <span>
                          {paymentMethod === 'VNPAY'
                            ? 'Thanh toán qua VNPAY'
                            : 'Thanh toán qua PayPal'}
                        </span>
                      </>
                    )}
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
