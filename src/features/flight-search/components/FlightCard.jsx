import { formatTime, formatDuration, formatCurrency } from '../../../utils/formatters';

/**
 * Helper chuyển enum LoaiKhoang từ BE sang nhãn tiếng Việt
 */
export function formatLoaiKhoang(loaiKhoang) {
  if (loaiKhoang === 'THUONG_GIA') return 'Thương gia';
  if (loaiKhoang === 'PHO_THONG') return 'Phổ thông';
  return loaiKhoang || 'Phổ thông';
}

/**
 * Card hiển thị một chuyến bay trong danh sách kết quả tìm kiếm (6.4.6)
 * Khớp contract FlightSearchResponse của BE:
 * - chuyenBayId, hangVeId, maChuyenBay
 * - hangHangKhong: { maHang, tenHang, logoUrl }
 * - sanBayDi, sanBayDen: { maSanBay, tenSanBay, thanhPho, quocGia }
 * - thoiGianKhoiHanh, thoiGianHaCanh: { dateTime, timeZone }
 * - thoiLuongBayPhut, loaiKhoang
 * - giaBan, thuePhi, tongGiaVe, tienTe
 * - soGheTrong, hanhLyXachTayKg, hanhLyKyGuiKg
 */
export default function FlightCard({ flight, isSelected, isCheapest, onSelect, onDetail }) {
  const {
    maChuyenBay,
    hangHangKhong,
    sanBayDi,
    sanBayDen,
    thoiGianKhoiHanh,
    thoiGianHaCanh,
    thoiLuongBayPhut,
    loaiKhoang,
    tongGiaVe,
    tienTe = 'VND',
    soGheTrong,
    hanhLyXachTayKg,
    hanhLyKyGuiKg,
  } = flight;

  // Múi giờ từ FlightTimeDto của BE (không tự đoán)
  const tzDi = thoiGianKhoiHanh?.timeZone || 'Asia/Ho_Chi_Minh';
  const dtDi = typeof thoiGianKhoiHanh === 'string' ? thoiGianKhoiHanh : thoiGianKhoiHanh?.dateTime;

  const tzDen = thoiGianHaCanh?.timeZone || 'Asia/Ho_Chi_Minh';
  const dtDen = typeof thoiGianHaCanh === 'string' ? thoiGianHaCanh : thoiGianHaCanh?.dateTime;

  // Màu giá: xanh nếu đang chọn, cam nếu rẻ nhất, mặc định đen
  let priceColor = 'text-[#0f172a]';
  if (isSelected) priceColor = 'text-[#0284c7] font-bold';
  else if (isCheapest) priceColor = 'text-[#f97316] font-bold';

  return (
    <div
      className={`bg-white rounded-[12px] border p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-shadow
        ${isSelected ? 'border-[#0284c7] shadow-[0_0_0_2px_#bae6fd]' : 'border-[#e2e8f0] hover:shadow-md'}`}
    >
      {/* ---- Cột trái: hãng + mã chuyến ---- */}
      <div className="flex flex-col items-center gap-1 w-28 shrink-0">
        {hangHangKhong?.logoUrl ? (
          <img
            src={hangHangKhong.logoUrl}
            alt={hangHangKhong.tenHang || hangHangKhong.maHang}
            className="h-8 w-auto object-contain"
          />
        ) : (
          <div className="h-8 w-16 bg-[#e2e8f0] rounded flex items-center justify-center text-[11px] text-[#64748b] font-bold">
            {hangHangKhong?.maHang || '??'}
          </div>
        )}
        <span className="text-[11px] text-[#64748b] font-semibold text-center leading-tight">
          {hangHangKhong?.tenHang || hangHangKhong?.maHang}
        </span>
        <span className="text-[11px] text-[#94a3b8]">{maChuyenBay}</span>
        <span className="text-[10px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-full mt-0.5 font-medium">
          {formatLoaiKhoang(loaiKhoang)}
        </span>
      </div>

      {/* ---- Cột giữa: thời gian + hành trình ---- */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[20px] font-bold text-[#0f172a] leading-none">
              {formatTime(dtDi, tzDi)}
            </p>
            <p className="text-[12px] text-[#64748b] mt-1">
              {sanBayDi?.thanhPho ? `${sanBayDi.thanhPho} (${sanBayDi.maSanBay})` : sanBayDi?.maSanBay}
            </p>
          </div>

          {/* Đường kẻ hành trình */}
          <div className="flex-1 flex flex-col items-center gap-0.5 min-w-[90px] max-w-[180px]">
            <span className="text-[11px] text-[#94a3b8]">{formatDuration(thoiLuongBayPhut)}</span>
            <div className="flex items-center w-full gap-1">
              <div className="flex-1 h-px bg-[#cbd5e1]" />
              <span className="text-[#0284c7] text-xs">✈</span>
              <div className="flex-1 h-px bg-[#cbd5e1]" />
            </div>
            <span className="text-[11px] text-[#64748b]">Bay thẳng</span>
          </div>

          <div className="text-center">
            <p className="text-[20px] font-bold text-[#0f172a] leading-none">
              {formatTime(dtDen, tzDen)}
            </p>
            <p className="text-[12px] text-[#64748b] mt-1">
              {sanBayDen?.thanhPho ? `${sanBayDen.thanhPho} (${sanBayDen.maSanBay})` : sanBayDen?.maSanBay}
            </p>
          </div>
        </div>

        {/* Hành lý & số ghế trống */}
        <div className="text-[11px] text-[#64748b] flex flex-wrap items-center gap-x-3 gap-y-1">
          {hanhLyXachTayKg > 0 && <span>{hanhLyXachTayKg}kg xách tay</span>}
          {hanhLyKyGuiKg > 0 && <span>• {hanhLyKyGuiKg}kg ký gửi</span>}
          {soGheTrong != null && (
            <span className={soGheTrong <= 5 ? 'text-[#f97316] font-semibold' : ''}>
              • Còn {soGheTrong} ghế
            </span>
          )}
        </div>
      </div>

      {/* ---- Cột phải: giá + nút ---- */}
      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-auto">
        {isCheapest && !isSelected && (
          <span className="text-[10px] bg-[#fff7ed] text-[#f97316] border border-[#fed7aa] px-2 py-0.5 rounded-full font-semibold">
            Rẻ nhất
          </span>
        )}

        <p className={`text-[18px] ${priceColor}`}>
          {formatCurrency(tongGiaVe, tienTe)}
        </p>
        <p className="text-[11px] text-[#94a3b8]">/ khách • đã gồm thuế</p>

        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => onDetail && onDetail(flight)}
            className="px-3 py-1.5 text-[12px] font-semibold text-[#0284c7] border border-[#0284c7] rounded-[6px] hover:bg-[#f0f9ff] transition cursor-pointer"
          >
            Chi tiết
          </button>

          <button
            type="button"
            onClick={() => onSelect && onSelect(flight)}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[6px] transition cursor-pointer
              ${isSelected
                ? 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
                : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
              }`}
          >
            {isSelected ? '✓ Đã chọn' : 'Chọn chuyến'}
          </button>
        </div>
      </div>
    </div>
  );
}
