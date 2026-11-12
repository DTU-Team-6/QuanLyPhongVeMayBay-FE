import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronDownIcon from '../../../assets/chevron-down.svg';
import chevronUpIcon from '../../../assets/chevron-up.svg';
import arrowLeftRightIcon from '../../../assets/arrow-left-right.svg';
import calendarDaysIcon from '../../../assets/calendar-days.svg';
import searchIcon from '../../../assets/search.svg';

/**
 * Danh sách sân bay giống FlightSearchForm
 */
const AIRPORTS = [
  { code: 'SGN', city: 'TP. Hồ Chí Minh', name: 'Tân Sơn Nhất' },
  { code: 'HAN', city: 'Hà Nội', name: 'Nội Bài' },
  { code: 'DAD', city: 'Đà Nẵng', name: 'Đà Nẵng' },
  { code: 'CXR', city: 'Nha Trang', name: 'Cam Ranh' },
  { code: 'PQC', city: 'Phú Quốc', name: 'Phú Quốc' },
  { code: 'VCA', city: 'Cần Thơ', name: 'Cần Thơ' },
  { code: 'HPH', city: 'Hải Phòng', name: 'Cát Bi' },
  { code: 'VII', city: 'Vinh', name: 'Vinh' },
  { code: 'HUI', city: 'Huế', name: 'Phú Bài' },
  { code: 'DLI', city: 'Đà Lạt', name: 'Liên Khương' },
];

const AIRLINES = [
  { maHang: 'VN', tenHang: 'Vietnam Airlines' },
  { maHang: 'VJ', tenHang: 'Vietjet Air' },
  { maHang: 'QH', tenHang: 'Bamboo Airways' },
];

/**
 * Sidebar tìm kiếm lại & lọc hãng hàng không (compact)
 * Props:
 * - defaultParams: { maDi, maDen, ngayDi, ngayVe, soNguoiLon, soTreEm, loaiVe }
 * - selectedAirlines: string[] - mảng maHang đang chọn
 * - onAirlineChange: (maHang: string, checked: boolean) => void
 * - onSearch: (params) => void
 */
export default function FlightSearchSidebar({ defaultParams, selectedAirlines, onAirlineChange, onSearch }) {
  const [maDi, setMaDi] = useState(defaultParams?.maDi || 'SGN');
  const [maDen, setMaDen] = useState(defaultParams?.maDen || 'HAN');
  const [ngayDi, setNgayDi] = useState(defaultParams?.ngayDi || '');
  const [ngayVe, setNgayVe] = useState(defaultParams?.ngayVe || '');
  const [loaiVe, setLoaiVe] = useState(defaultParams?.loaiVe || 'oneWay');
  const [soNguoiLon, setSoNguoiLon] = useState(Number(defaultParams?.soNguoiLon) || 1);
  const [soTreEm, setSoTreEm] = useState(Number(defaultParams?.soTreEm) || 0);
  const [passengerOpen, setPassengerOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const swapAirports = () => {
    const tmp = maDi;
    setMaDi(maDen);
    setMaDen(tmp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch && onSearch({ maDi, maDen, ngayDi, ngayVe, soNguoiLon, soTreEm, loaiVe });
  };

  return (
    <aside className="w-full flex flex-col gap-4">
      {/* ---- Khung tìm kiếm lại ---- */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-4 shadow-sm">
        <h3 className="text-[13px] font-bold text-[#334155] mb-3">Tìm kiếm lại</h3>

        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          {/* Loại vé */}
          <div className="flex gap-3 text-[12px]">
            {['oneWay', 'roundTrip'].map((t) => (
              <label key={t} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-loaiVe"
                  value={t}
                  checked={loaiVe === t}
                  onChange={() => setLoaiVe(t)}
                  className="text-[#0284c7]"
                />
                <span className={loaiVe === t ? 'font-semibold text-[#0284c7]' : 'text-[#64748b]'}>
                  {t === 'oneWay' ? 'Một chiều' : 'Khứ hồi'}
                </span>
              </label>
            ))}
          </div>

          {/* Điểm đi → điểm đến */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={maDi}
                onChange={(e) => setMaDi(e.target.value)}
                className="w-full h-9 px-2 pr-6 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#0f172a] appearance-none focus:outline-none focus:border-[#0284c7] cursor-pointer"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                ))}
              </select>
              <img src={chevronDownIcon} alt="" className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={swapAirports}
              className="size-8 rounded-[6px] bg-[#e0f2fe] hover:bg-[#bae6fd] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <img src={arrowLeftRightIcon} alt="Đổi chiều" className="size-3.5" />
            </button>

            <div className="relative flex-1">
              <select
                value={maDen}
                onChange={(e) => setMaDen(e.target.value)}
                className="w-full h-9 px-2 pr-6 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#0f172a] appearance-none focus:outline-none focus:border-[#0284c7] cursor-pointer"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>{a.code} — {a.city}</option>
                ))}
              </select>
              <img src={chevronDownIcon} alt="" className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
            </div>
          </div>

          {/* Ngày đi */}
          <div className="relative">
            <input
              type="date"
              value={ngayDi}
              min={today}
              onChange={(e) => setNgayDi(e.target.value)}
              className="w-full h-9 px-2 pr-7 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]"
            />
            <img src={calendarDaysIcon} alt="" className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
          </div>

          {/* Ngày về (chỉ hiện khi khứ hồi) */}
          {loaiVe === 'roundTrip' && (
            <div className="relative">
              <input
                type="date"
                value={ngayVe}
                min={ngayDi || today}
                onChange={(e) => setNgayVe(e.target.value)}
                className="w-full h-9 px-2 pr-7 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]"
              />
              <img src={calendarDaysIcon} alt="" className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
            </div>
          )}

          {/* Hành khách */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPassengerOpen(!passengerOpen)}
              className="w-full h-9 px-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#0f172a] flex items-center justify-between cursor-pointer"
            >
              <span>{soNguoiLon} NL · {soTreEm} TE</span>
              <img src={passengerOpen ? chevronUpIcon : chevronDownIcon} alt="" className="size-3" />
            </button>
            {passengerOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-[8px] p-3 shadow-lg z-30 flex flex-col gap-2">
                {/* Người lớn */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#334155]">Người lớn</span>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={soNguoiLon <= 1} onClick={() => setSoNguoiLon(soNguoiLon - 1)}
                      className="size-6 rounded border border-[#cbd5e1] text-[#0284c7] font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer">−</button>
                    <span className="text-[12px] font-semibold w-3 text-center">{soNguoiLon}</span>
                    <button type="button" disabled={soNguoiLon >= 9} onClick={() => setSoNguoiLon(soNguoiLon + 1)}
                      className="size-6 rounded border border-[#cbd5e1] text-[#0284c7] font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer">+</button>
                  </div>
                </div>
                {/* Trẻ em */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#334155]">Trẻ em</span>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={soTreEm <= 0} onClick={() => setSoTreEm(soTreEm - 1)}
                      className="size-6 rounded border border-[#cbd5e1] text-[#0284c7] font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer">−</button>
                    <span className="text-[12px] font-semibold w-3 text-center">{soTreEm}</span>
                    <button type="button" disabled={soTreEm >= 9} onClick={() => setSoTreEm(soTreEm + 1)}
                      className="size-6 rounded border border-[#cbd5e1] text-[#0284c7] font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer">+</button>
                  </div>
                </div>
                <button type="button" onClick={() => setPassengerOpen(false)}
                  className="text-[11px] text-[#0284c7] font-semibold hover:underline cursor-pointer text-right">Xong</button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-9 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[13px] font-semibold rounded-[6px] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <img src={searchIcon} alt="" className="size-4" />
            Tìm vé
          </button>
        </form>
      </div>

      {/* ---- Khung lọc hãng hàng không ---- */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-bold text-[#334155]">Hãng hàng không</h3>
        </div>
        <p className="text-[11px] text-[#64748b] mb-3">Đã gồm thuế, phí • Bay thẳng</p>

        <div className="flex flex-col gap-2">
          {AIRLINES.map((airline) => {
            const checked = selectedAirlines?.includes(airline.maHang);
            return (
              <label key={airline.maHang} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checked}
                  onChange={(e) => onAirlineChange && onAirlineChange(airline.maHang, e.target.checked)}
                  className="size-4 rounded text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
                />
                <span className="text-[13px] text-[#334155]">{airline.tenHang}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
