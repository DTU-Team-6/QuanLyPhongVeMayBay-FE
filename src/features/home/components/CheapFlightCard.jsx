import { formatCurrency, formatTime, formatDuration } from '../../../utils/formatters';
import planeIcon from '../../../assets/plane.svg';

/**
 * Thẻ hiển thị một chuyến bay giá rẻ trong danh sách Top 10
 * Đồng bộ với Prototype trên Figma
 */
export default function CheapFlightCard({ flight, onSelect }) {
  if (!flight) return null;

  const {
    chuyenBayId,
    maChuyenBay,
    hangHangKhong,
    sanBayDi,
    sanBayDen,
    thoiGianKhoiHanh,
    thoiGianHaCanh,
    thoiLuongBayPhut,
    loaiKhoangReNhat,
    tongGiaVe,
    giaBan,
    soGheTrong,
    hanhLyXachTayKg,
    hanhLyKyGuiKg,
  } = flight;

  // Lấy màu thương hiệu của hãng hoặc mặc định
  const getAirlineColor = (maHang) => {
    switch (maHang) {
      case 'VN':
        return 'bg-[#e0f2fe] text-[#0284c7]';
      case 'VJ':
        return 'bg-[#fef2f2] text-[#dc2626]';
      case 'QH':
        return 'bg-[#ecfdf5] text-[#059669]';
      default:
        return 'bg-[#f1f5f9] text-[#334155]';
    }
  };

  const khoangText = loaiKhoangReNhat === 'THUONG_GIA' ? 'Thương gia' : 'Phổ thông';
  const displayPrice = tongGiaVe || giaBan;

  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-[#0284c7] transition-all rounded-[12px] p-4 md:p-[20px] shadow-xs flex flex-col gap-[16px] w-full">
      {/* Khối thông tin chi tiết */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Hãng hàng không */}
        <div className="flex items-center gap-[10px] w-full md:w-[180px] shrink-0">
          <div
            className={`size-[36px] rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden ${getAirlineColor(
              hangHangKhong?.maHang
            )}`}
          >
            {hangHangKhong?.logoUrl ? (
              <img
                src={hangHangKhong.logoUrl}
                alt={hangHangKhong.tenHang || 'Hãng bay'}
                className="size-full object-contain p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
            ) : null}
            <img
              src={planeIcon}
              alt=""
              className="size-[20px]"
              style={{ display: hangHangKhong?.logoUrl ? 'none' : 'block' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#334155] text-[13px] leading-tight">
              {hangHangKhong?.tenHang || 'Hãng hàng không'}
            </span>
            <span className="text-[#64748b] text-[12px]">
              {maChuyenBay} • {khoangText}
            </span>
          </div>
        </div>

        {/* Khởi hành - Hành trình - Đến nơi */}
        <div className="flex items-center justify-between flex-1 gap-2 sm:gap-6">
          {/* Giờ khởi hành */}
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[#0f172a] text-[20px] sm:text-[22px] leading-tight">
              {formatTime(thoiGianKhoiHanh?.dateTime, thoiGianKhoiHanh?.timeZone)}
            </span>
            <span className="text-[#64748b] text-[12px]">
              {sanBayDi?.thanhPho || sanBayDi?.tenSanBay} ({sanBayDi?.maSanBay})
            </span>
          </div>

          {/* Thời lượng & Đường nối */}
          <div className="flex flex-col items-center flex-1 min-w-[90px] max-w-[200px]">
            <span className="text-[#64748b] text-[11px] whitespace-nowrap mb-1">
              {formatDuration(thoiLuongBayPhut)}
            </span>
            <div className="flex items-center gap-1.5 w-full">
              <div className="h-px bg-[#cbd5e1] flex-1" />
              <img src={planeIcon} alt="" className="size-[14px] shrink-0 opacity-70" />
              <div className="h-px bg-[#cbd5e1] flex-1" />
            </div>
            <span className="text-[#047857] text-[11px] font-medium mt-1">
              Bay thẳng
            </span>
          </div>

          {/* Giờ đến nơi */}
          <div className="flex flex-col text-right">
            <span className="font-semibold text-[#0f172a] text-[20px] sm:text-[22px] leading-tight">
              {formatTime(thoiGianHaCanh?.dateTime, thoiGianHaCanh?.timeZone)}
            </span>
            <span className="text-[#64748b] text-[12px]">
              {sanBayDen?.thanhPho || sanBayDen?.tenSanBay} ({sanBayDen?.maSanBay})
            </span>
          </div>
        </div>

        {/* Cụm Giá vé */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 w-full md:w-[140px] shrink-0">
          <span className="font-semibold text-[#0284c7] text-[18px] sm:text-[20px]">
            {formatCurrency(displayPrice)}
          </span>
          <span className="text-[#64748b] text-[11px]">
            / khách • đã gồm thuế
          </span>
        </div>
      </div>

      {/* Đường phân cách */}
      <div className="h-px bg-[#e2e8f0] w-full" />

      {/* Điều kiện vé và nút chọn chuyến */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-[#64748b] text-[12px]">
          {hanhLyXachTayKg || 7}kg xách tay
          {hanhLyKyGuiKg ? ` • ${hanhLyKyGuiKg}kg ký gửi` : ' • Chưa gồm ký gửi'}
          {soGheTrong !== undefined && soGheTrong !== null ? ` • Còn ${soGheTrong} ghế trống` : ''}
        </p>

        <button
          type="button"
          onClick={() => onSelect?.(flight)}
          className="w-full sm:w-auto bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] transition cursor-pointer"
        >
          Chọn chuyến
        </button>
      </div>
    </div>
  );
}
