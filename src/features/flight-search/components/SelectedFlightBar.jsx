import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Bar cố định dưới cùng hiển thị khi đã chọn đủ chuyến bay
 * - Hiển thị số chuyến đã chọn, hãng, tổng tiền (do BE trả về)
 * - Nút "Xác nhận đặt vé →" điều hướng tới /dat-ve/hanh-khach
 */
export default function SelectedFlightBar({
  selectedFlights,
  loaiVe,
  soNguoiLon,
  soTreEm,
  soEmBe = 0,
  tongTien,
}) {
  const navigate = useNavigate();

  const soChuyenDaChon = [selectedFlights?.di, selectedFlights?.ve].filter(Boolean).length;

  const hangDi = selectedFlights?.di?.hangHangKhong?.tenHang || '';
  const hangVe = selectedFlights?.ve?.hangHangKhong?.tenHang || '';
  const tenHang =
    hangDi && hangVe && hangDi !== hangVe ? `${hangDi}, ${hangVe}` : hangDi || hangVe;

  const canProceed =
    loaiVe === 'roundTrip'
      ? !!selectedFlights?.di && !!selectedFlights?.ve
      : !!selectedFlights?.di;

  if (!canProceed) return null;

  const handleConfirm = () => {
    navigate('/dat-ve/hanh-khach', {
      state: {
        chuyenDi: selectedFlights?.di || null,
        chuyenVe: selectedFlights?.ve || null,
        soNguoiLon,
        soTreEm,
        soEmBe,
        loaiVe,
        tongTien,
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] shadow-[0_-4px_16px_rgba(15,23,42,0.08)] z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold text-[#334155]">
            Đã chọn {soChuyenDaChon} chuyến bay
            {tenHang && <span className="text-[#64748b] font-normal"> • {tenHang}</span>}
          </p>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            {soNguoiLon} người lớn
            {soTreEm > 0 && ` · ${soTreEm} trẻ em`}
            {soEmBe > 0 && ` · ${soEmBe} em bé`}
            {loaiVe === 'roundTrip' && ' · Khứ hồi'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {tongTien != null && (
            <div className="text-right">
              <p className="text-[12px] text-[#64748b]">Tổng giá vé / khách</p>
              <p className="text-[20px] font-bold text-[#f97316]">
                {formatCurrency(tongTien, selectedFlights?.di?.tienTe || 'VND')}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-[14px] px-6 py-2.5 rounded-[8px] flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
          >
            → Xác nhận đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}
