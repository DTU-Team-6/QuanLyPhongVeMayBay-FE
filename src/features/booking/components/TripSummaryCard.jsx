import { formatTime, formatDate, formatDuration } from '../../../utils/formatters';
import { formatLoaiKhoang } from '../../flight-search/components/FlightCard';

/**
 * Card tóm tắt hành trình đã chọn – hiển thị bên phải trang hành khách (6.4.8)
 */
export default function TripSummaryCard({ chuyenDi, chuyenVe, loaiVe }) {
  if (!chuyenDi) return null;

  const renderChieu = (f, label) => {
    if (!f) return null;
    const tzDi = f.thoiGianKhoiHanh?.timeZone || 'Asia/Ho_Chi_Minh';
    const dtDi = typeof f.thoiGianKhoiHanh === 'string' ? f.thoiGianKhoiHanh : f.thoiGianKhoiHanh?.dateTime;
    const tzDen = f.thoiGianHaCanh?.timeZone || 'Asia/Ho_Chi_Minh';
    const dtDen = typeof f.thoiGianHaCanh === 'string' ? f.thoiGianHaCanh : f.thoiGianHaCanh?.dateTime;

    return (
      <div className={`pb-3 ${label === 'Chuyến đi' && chuyenVe ? 'border-b border-[#e2e8f0] mb-3' : ''}`}>
        <span
          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-2 ${
            label === 'Chuyến đi'
              ? 'bg-[#e0f2fe] text-[#0284c7]'
              : 'bg-[#fef3c7] text-[#d97706]'
          }`}
        >
          {label}
        </span>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[16px] font-bold text-[#0f172a]">{f.sanBayDi?.maSanBay}</span>
          <span className="text-[14px] font-bold text-[#0284c7]">{formatTime(dtDi, tzDi)}</span>
          <span className="text-[#94a3b8]">→</span>
          <span className="text-[14px] font-bold text-[#0284c7]">{formatTime(dtDen, tzDen)}</span>
          <span className="text-[16px] font-bold text-[#0f172a]">{f.sanBayDen?.maSanBay}</span>
        </div>

        <p className="text-[12px] text-[#64748b]">
          {formatDate(dtDi, tzDi)}
          {f.thoiLuongBayPhut && <span> · {formatDuration(f.thoiLuongBayPhut)}</span>}
        </p>

        <p className="text-[12px] text-[#64748b] mt-0.5">
          {f.hangHangKhong?.tenHang || f.hangHangKhong?.maHang}
          {f.maChuyenBay && <span> · {f.maChuyenBay}</span>}
          {f.loaiKhoang && <span> · {formatLoaiKhoang(f.loaiKhoang)}</span>}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-4 shadow-sm">
      <h3 className="text-[13px] font-bold text-[#334155] mb-3 flex items-center gap-2">
        ✈ Hành trình đã chọn
      </h3>

      {renderChieu(chuyenDi, 'Chuyến đi')}
      {loaiVe === 'roundTrip' && renderChieu(chuyenVe, 'Chiều về')}
    </div>
  );
}
