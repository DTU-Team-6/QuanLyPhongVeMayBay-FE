import { useEffect, useRef, useState } from 'react';
import { formatTime, formatDuration, formatCurrency, formatFullDate } from '../../../utils/formatters';
import { formatLoaiKhoang } from './FlightCard';
import flightService from '../../../services/flightService';

/**
 * Modal overlay chi tiết chuyến bay (6.4.7)
 * - Gọi GET /api/v1/flights/{id} để lấy danh sách hạng vé của chuyến bay từ DB
 * - Hiển thị chi tiết chuyến đi (và chuyến về nếu khứ hồi)
 * - Hiển thị giá vé cơ bản, thuế phí, tổng thanh toán do BE trả về (không tự tính)
 */
export default function FlightDetailModal({
  flight,
  flightVe,
  loaiVe,
  soNguoiLon,
  soTreEm,
  onClose,
  onConfirm,
}) {
  const overlayRef = useRef(null);
  const [selectedFare, setSelectedFare] = useState(flight);
  const [fareOptions, setFareOptions] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Cập nhật khi flight prop thay đổi và gọi API chi tiết chuyến bay từ BE
  useEffect(() => {
    if (!flight) return;
    setSelectedFare(flight);

    if (flight.chuyenBayId) {
      setLoadingDetail(true);
      flightService
        .getFlightDetail(flight.chuyenBayId)
        .then((detail) => {
          if (detail?.hangVe && Array.isArray(detail.hangVe) && detail.hangVe.length > 0) {
            setFareOptions(detail.hangVe);
            const matched = detail.hangVe.find((h) => h.hangVeId === flight.hangVeId);
            if (matched) setSelectedFare(matched);
          } else {
            setFareOptions([flight]);
          }
        })
        .catch(() => {
          setFareOptions([flight]);
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      setFareOptions([flight]);
    }
  }, [flight]);

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose && onClose();
  };

  if (!flight || !selectedFare) return null;

  const renderFlightBlock = (f, label) => {
    if (!f) return null;
    const tzDi = f.thoiGianKhoiHanh?.timeZone || 'Asia/Ho_Chi_Minh';
    const dtDi = typeof f.thoiGianKhoiHanh === 'string' ? f.thoiGianKhoiHanh : f.thoiGianKhoiHanh?.dateTime;
    const tzDen = f.thoiGianHaCanh?.timeZone || 'Asia/Ho_Chi_Minh';
    const dtDen = typeof f.thoiGianHaCanh === 'string' ? f.thoiGianHaCanh : f.thoiGianHaCanh?.dateTime;

    return (
      <div className="border border-[#e2e8f0] rounded-[10px] p-4 mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
                label === 'Chuyến đi' ? 'bg-[#e0f2fe] text-[#0284c7]' : 'bg-[#fef3c7] text-[#d97706]'
              }`}
            >
              {label}
            </span>
            <span className="text-[12px] text-[#64748b]">• {formatFullDate(dtDi, tzDi)}</span>
          </div>
          <span className="text-[11px] bg-[#f1f5f9] text-[#475569] px-2.5 py-0.5 rounded-full font-semibold">
            {formatLoaiKhoang(f.loaiKhoang)}
          </span>
        </div>

        {/* Logo + hãng + mã chuyến */}
        <div className="flex items-center gap-3 mb-4">
          {f.hangHangKhong?.logoUrl ? (
            <img
              src={f.hangHangKhong.logoUrl}
              alt={f.hangHangKhong.tenHang}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <div className="h-8 w-14 bg-[#e2e8f0] rounded flex items-center justify-center text-[11px] font-bold text-[#64748b]">
              {f.hangHangKhong?.maHang || '??'}
            </div>
          )}
          <div>
            <p className="text-[13px] font-semibold text-[#334155]">
              {f.hangHangKhong?.tenHang || f.hangHangKhong?.maHang} · {f.maChuyenBay}
            </p>
            <p className="text-[11px] text-[#94a3b8]">
              Thời gian bay: {formatDuration(f.thoiLuongBayPhut)}
              {f.soGheTrong != null && ` · Còn ${f.soGheTrong} ghế trống`}
            </p>
          </div>
        </div>

        {/* Hành trình: giờ + sân bay */}
        <div className="flex items-center gap-4">
          <div className="text-center min-w-[90px]">
            <p className="text-[22px] font-bold text-[#0f172a]">{formatTime(dtDi, tzDi)}</p>
            <p className="text-[13px] font-semibold text-[#334155]">{f.sanBayDi?.maSanBay}</p>
            <p className="text-[11px] text-[#64748b]">{f.sanBayDi?.tenSanBay}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[11px] text-[#94a3b8]">{formatDuration(f.thoiLuongBayPhut)}</span>
            <div className="flex w-full items-center gap-1">
              <div className="flex-1 h-px bg-[#cbd5e1]" />
              <span className="text-[#0284c7] text-base">✈</span>
              <div className="flex-1 h-px bg-[#cbd5e1]" />
            </div>
            <span className="text-[11px] text-[#64748b]">Bay thẳng</span>
          </div>

          <div className="text-center min-w-[90px]">
            <p className="text-[22px] font-bold text-[#0f172a]">{formatTime(dtDen, tzDen)}</p>
            <p className="text-[13px] font-semibold text-[#334155]">{f.sanBayDen?.maSanBay}</p>
            <p className="text-[11px] text-[#64748b]">{f.sanBayDen?.tenSanBay}</p>
          </div>
        </div>

        {/* Hành lý miễn phí */}
        <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-[12px] text-[#64748b]">
          <span>Hành lý mỗi chiều:</span>
          {f.hanhLyXachTayKg > 0 && <span className="font-medium text-[#334155]">{f.hanhLyXachTayKg}kg xách tay</span>}
          {f.hanhLyKyGuiKg > 0 && <span className="font-medium text-[#334155]">{f.hanhLyKyGuiKg}kg ký gửi miễn phí</span>}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ---- Header Modal ---- */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <div>
            <h2 className="text-[16px] font-bold text-[#0f172a]">Chi tiết chuyến bay</h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              {loaiVe === 'roundTrip' ? 'Hành trình khứ hồi' : 'Hành trình một chiều'}
              {' · '}
              {soNguoiLon} người lớn
              {soTreEm > 0 && ` · ${soTreEm} trẻ em`}
              {' · '}
              Giá đã gồm thuế, phí
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-[#f1f5f9] text-[#64748b] text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ---- Nội dung scroll ---- */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {/* Chọn hạng vé nếu chuyến bay có nhiều hạng */}
          {fareOptions.length > 1 && (
            <div className="mb-4">
              <p className="text-[12px] font-semibold text-[#334155] mb-2">Chọn hạng vé cho chuyến bay này:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fareOptions.map((opt) => {
                  const active = opt.hangVeId === selectedFare.hangVeId;
                  return (
                    <button
                      key={opt.hangVeId}
                      type="button"
                      onClick={() => setSelectedFare(opt)}
                      className={`p-3 rounded-[8px] border text-left transition cursor-pointer ${
                        active
                          ? 'border-[#0284c7] bg-[#f0f9ff]'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-[#0f172a]">
                          {formatLoaiKhoang(opt.loaiKhoang)}
                        </span>
                        <span className="text-[13px] font-bold text-[#0284c7]">
                          {formatCurrency(opt.tongGiaVe, opt.tienTe)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748b] mt-1">
                        {opt.hanhLyXachTayKg}kg xách tay • {opt.hanhLyKyGuiKg}kg ký gửi • Còn {opt.soGheTrong} ghế
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loadingDetail && (
            <p className="text-[12px] text-[#64748b] mb-2">Đang cập nhật thông tin hạng vé...</p>
          )}

          {/* Chuyến đi / đang xem */}
          {renderFlightBlock(selectedFare, 'Chuyến đi')}

          {/* Chuyến về (nếu khứ hồi và đã chọn) */}
          {loaiVe === 'roundTrip' && flightVe && renderFlightBlock(flightVe, 'Chuyến về')}

          {/* ---- Tóm tắt giá từ BE ---- */}
          <div className="bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0] p-4">
            <h3 className="text-[13px] font-bold text-[#334155] mb-3">Chi tiết giá vé (1 hành khách)</h3>

            <div className="flex flex-col gap-2 text-[13px]">
              {selectedFare.giaBan != null && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Giá vé cơ bản</span>
                  <span className="font-semibold">{formatCurrency(selectedFare.giaBan, selectedFare.tienTe)}</span>
                </div>
              )}

              {selectedFare.thuePhi != null && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Thuế, phí sân bay và phụ thu</span>
                  <span className="font-semibold">{formatCurrency(selectedFare.thuePhi, selectedFare.tienTe)}</span>
                </div>
              )}

              {selectedFare.tongGiaVe != null && (
                <div className="flex justify-between pt-2 border-t border-[#e2e8f0] mt-1">
                  <span className="font-bold text-[#334155]">Tổng cộng / khách</span>
                  <span className="font-bold text-[18px] text-[#f97316]">
                    {formatCurrency(selectedFare.tongGiaVe, selectedFare.tienTe)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-[8px] p-3 mt-3 text-[12px] text-[#0369a1]">
            Đổi vé có thu phí và chênh lệch giá. Hoàn vé theo điều kiện của hãng hàng không.
          </div>
        </div>

        {/* ---- Footer: nút hành động ---- */}
        <div className="border-t border-[#e2e8f0] px-5 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-semibold text-[#64748b] border border-[#cbd5e1] rounded-[8px] hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => onConfirm && onConfirm(selectedFare)}
            className="px-6 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[8px] transition cursor-pointer"
          >
            → Tiếp tục / Chọn
          </button>
        </div>
      </div>
    </div>
  );
}
