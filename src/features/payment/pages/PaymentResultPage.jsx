import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../../../components/common/Loading';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../../../utils/formatters';
import { formatPaymentMethod } from '../utils/paymentFormatters';

/**
 * Trang tiếp nhận và xác thực kết quả thanh toán từ cổng VNPay / PayPal qua Backend
 * Routes: /dat-ve/thanh-toan/ket-qua và /thanh-toan/that-bai
 */
export default function PaymentResultPage({ isCancelled = false }) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(!isCancelled);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isCancelled) return;

    const phuongThuc = searchParams.get('phuongThuc');
    const vnpTxnRef = searchParams.get('vnp_TxnRef');
    const token = searchParams.get('token') || searchParams.get('orderId');

    const verify = async () => {
      setLoading(true);
      setError(null);
      try {
        if (vnpTxnRef || phuongThuc === 'VNPAY') {
          const params = new URLSearchParams(searchParams);
          params.delete('phuongThuc');
          const res = await paymentService.verifyVnPayCallback(params.toString());
          setResult(res);
        } else if (token || phuongThuc === 'PAYPAL') {
          const res = await paymentService.capturePayPalOrder(token);
          setResult(res);
        } else {
          setError('Không tìm thấy thông tin giao dịch để xác nhận.');
        }
      } catch (err) {
        setError(err.message || 'Không thể xác nhận giao dịch với máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [isCancelled, searchParams]);

  const isSuccess = !isCancelled && result?.trangThai === 'THANH_CONG';

  return (
    <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-72px)] py-12 px-4">
      <div className="max-w-lg mx-auto bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
        {loading ? (
          <Loading message="Đang xác thực kết quả thanh toán với máy chủ..." />
        ) : isCancelled ? (
          <div className="text-center py-4">
            <div className="size-14 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold mb-4">
              !
            </div>
            <h1 className="text-[20px] font-bold text-[#0f172a]">Giao dịch đã bị hủy</h1>
            <p className="text-[13px] text-[#64748b] mt-2">
              Bạn đã hủy thanh toán. Đơn đặt chỗ vẫn giữ trạng thái chờ thanh toán nếu còn trong thời hạn.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/tai-khoan/thanh-toan"
                className="px-5 py-2 bg-[#0284c7] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0369a1]"
              >
                Thanh toán lại
              </Link>
              <Link
                to="/tai-khoan/lich-su-giao-dich"
                className="px-5 py-2 border border-[#cbd5e1] text-[#334155] text-[13px] font-semibold rounded-[8px] hover:bg-[#f8fafc]"
              >
                Lịch sử giao dịch
              </Link>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="size-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">
              ✕
            </div>
            <h1 className="text-[20px] font-bold text-[#0f172a]">Xác nhận thanh toán thất bại</h1>
            <p className="text-[13px] text-red-600 mt-2">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/tai-khoan/thanh-toan"
                className="px-5 py-2 bg-[#0284c7] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0369a1]"
              >
                Quay lại thanh toán
              </Link>
              <Link
                to="/"
                className="px-5 py-2 border border-[#cbd5e1] text-[#334155] text-[13px] font-semibold rounded-[8px] hover:bg-[#f8fafc]"
              >
                Trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="text-center mb-6">
              <div
                className={`size-14 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-3 ${
                  isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {isSuccess ? '✓' : '✕'}
              </div>
              <h1 className="text-[20px] font-bold text-[#0f172a]">
                {isSuccess ? 'Thanh toán thành công' : 'Thanh toán không thành công'}
              </h1>
              <p className="text-[13px] text-[#64748b] mt-1">{result?.thongBao}</p>
            </div>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 flex flex-col gap-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Mã đặt chỗ</span>
                <span className="font-bold text-[#0f172a]">{result?.maDatCho || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Mã giao dịch</span>
                <span className="font-mono font-semibold text-[#334155]">{result?.maGiaoDich || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Phương thức</span>
                <span className="font-semibold text-[#334155]">
                  {formatPaymentMethod(result?.phuongThuc)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Số tiền</span>
                <span className="font-bold text-[#f97316]">{formatCurrency(result?.soTien)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/tai-khoan/lich-su-giao-dich"
                className="px-5 py-2.5 bg-[#0284c7] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0369a1]"
              >
                Xem lịch sử giao dịch
              </Link>
              {!isSuccess && (
                <Link
                  to="/tai-khoan/thanh-toan"
                  className="px-5 py-2.5 border border-[#0284c7] text-[#0284c7] text-[13px] font-semibold rounded-[8px] hover:bg-[#f0f9ff]"
                >
                  Thử thanh toán lại
                </Link>
              )}
              <Link
                to="/"
                className="px-5 py-2.5 border border-[#cbd5e1] text-[#334155] text-[13px] font-semibold rounded-[8px] hover:bg-[#f8fafc]"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
