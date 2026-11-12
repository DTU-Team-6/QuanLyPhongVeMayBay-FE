import { useState, useEffect } from 'react';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Card chi tiết thanh toán – hiển thị bên phải trang hành khách (6.4.8)
 * Chỉ hiển thị các giá trị do BE trả về, không tự tính lại.
 */
export default function PaymentSummaryCard({
  chuyenDi,
  chuyenVe,
  loaiVe,
  soNguoiLon,
  soTreEm,
  soEmBe = 0,
  tongTien,
}) {
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!chuyenDi) return null;

  const tienTe = chuyenDi?.tienTe || 'VND';
  const tenTuyen =
    chuyenDi.sanBayDi?.maSanBay && chuyenDi.sanBayDen?.maSanBay
      ? `${chuyenDi.sanBayDi.maSanBay} ⇌ ${chuyenDi.sanBayDen.maSanBay}`
      : '';

  const giaBanDi = chuyenDi?.giaBan ?? null;
  const giaBanVe = chuyenVe?.giaBan ?? null;
  const thuePhiDi = chuyenDi?.thuePhi ?? null;
  const thuePhiVe = chuyenVe?.thuePhi ?? null;

  return (
    <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-4 shadow-sm flex flex-col gap-3">
      <h3 className="text-[13px] font-bold text-[#334155]">Chi tiết thanh toán</h3>

      <div className="text-[12px] text-[#64748b] flex flex-col gap-1">
        <p>{loaiVe === 'roundTrip' ? 'Hành trình khứ hồi' : 'Hành trình một chiều'}</p>
        {tenTuyen && <p className="font-semibold text-[#334155]">{tenTuyen}</p>}
        <p>
          {soNguoiLon} người lớn
          {soTreEm > 0 && ` · ${soTreEm} trẻ em`}
          {soEmBe > 0 && ` · ${soEmBe} em bé`}
        </p>
      </div>

      <hr className="border-[#f1f5f9]" />

      <div className="flex flex-col gap-2 text-[13px]">
        {giaBanDi != null && (
          <div className="flex justify-between">
            <span className="text-[#64748b]">Giá vé cơ bản chiều đi (/ khách)</span>
            <span className="font-semibold">{formatCurrency(giaBanDi, tienTe)}</span>
          </div>
        )}

        {loaiVe === 'roundTrip' && giaBanVe != null && (
          <div className="flex justify-between">
            <span className="text-[#64748b]">Giá vé cơ bản chiều về (/ khách)</span>
            <span className="font-semibold">{formatCurrency(giaBanVe, tienTe)}</span>
          </div>
        )}

        {thuePhiDi != null && (
          <div className="flex justify-between">
            <span className="text-[#64748b]">Thuế &amp; phí chiều đi (/ khách)</span>
            <span className="font-semibold">{formatCurrency(thuePhiDi, tienTe)}</span>
          </div>
        )}

        {loaiVe === 'roundTrip' && thuePhiVe != null && (
          <div className="flex justify-between">
            <span className="text-[#64748b]">Thuế &amp; phí chiều về (/ khách)</span>
            <span className="font-semibold">{formatCurrency(thuePhiVe, tienTe)}</span>
          </div>
        )}
      </div>

      <hr className="border-[#e2e8f0]" />

      <div className="flex justify-between items-center">
        <span className="font-bold text-[#334155] text-[13px]">Đơn giá / khách</span>
        <span className="text-[20px] font-bold text-[#f97316]">
          {tongTien != null ? formatCurrency(tongTien, tienTe) : '—'}
        </span>
      </div>
      <p className="text-[11px] text-[#94a3b8] -mt-2">
        Tổng tiền chính xác toàn đơn sẽ được hệ thống tính khi xác nhận đặt chỗ.
      </p>

      <div
        className={`flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12px] font-semibold ${
          secondsLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-[#fef3c7] text-[#d97706]'
        }`}
      >
        <span>⏱</span>
        <span>Vé được giữ chỗ trong {formatCountdown(secondsLeft)}</span>
      </div>

      <div className="bg-[#f0f9ff] rounded-[8px] p-3 text-center">
        <p className="text-[11px] text-[#64748b]">Hỗ trợ thông tin hành khách</p>
        <p className="text-[14px] font-bold text-[#0284c7] mt-0.5">1900 6868</p>
      </div>
    </div>
  );
}
