import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowLeftRightIcon from '../../../assets/arrow-left-right.svg';
import chevronDownIcon from '../../../assets/chevron-down.svg';
import chevronUpIcon from '../../../assets/chevron-up.svg';
import calendarDaysIcon from '../../../assets/calendar-days.svg';
import searchIcon from '../../../assets/search.svg';

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

/**
 * Biểu mẫu tìm kiếm chuyến bay trên Trang chủ theo chuẩn Figma 6.1
 */
export default function FlightSearchForm({ onSearch }) {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('roundTrip'); // 'oneWay' | 'roundTrip'
  const [cabinClass, setCabinClass] = useState('Phổ thông');
  const [maDi, setMaDi] = useState('SGN');
  const [maDen, setMaDen] = useState('HAN');

  // Ngày khởi hành mặc định (hôm nay hoặc ngày mai)
  const today = new Date();
  const defaultDeparture = new Date(today);
  defaultDeparture.setDate(today.getDate() + 1);
  const defaultReturn = new Date(today);
  defaultReturn.setDate(today.getDate() + 4);

  const formatDateValue = (d) => d.toISOString().split('T')[0];

  const [ngayDi, setNgayDi] = useState(formatDateValue(defaultDeparture));
  const [ngayVe, setNgayVe] = useState(formatDateValue(defaultReturn));

  // Bộ chọn hành khách
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);
  const [soNguoiLon, setSoNguoiLon] = useState(1);
  const [soTreEm, setSoTreEm] = useState(0);
  const [soEmBe, setSoEmBe] = useState(0);

  const swapAirports = () => {
    const temp = maDi;
    setMaDi(maDen);
    setMaDen(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      maDi,
      maDen,
      ngayDi,
      soNguoiLon: String(soNguoiLon),
      soTreEm: String(soTreEm),
      soEmBe: String(soEmBe),
      loaiVe: tripType,
    });
    if (tripType === 'roundTrip' && ngayVe) {
      query.append('ngayVe', ngayVe);
    }

    if (onSearch) {
      onSearch({ maDi, maDen, ngayDi, ngayVe, soNguoiLon, soTreEm, soEmBe, tripType });
    } else {
      navigate(`/chuyen-bay?${query.toString()}`);
    }
  };

  const passengerSummary = `${soNguoiLon} người lớn • ${soTreEm} trẻ em • ${soEmBe} em bé`;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-[0px_4px_16px_0px_rgba(15,23,42,0.03)] w-full">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-5">
        {/* Lựa chọn loại hành trình & hạng vé */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-[14px]">
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
              className="text-[#0284c7] focus:ring-[#0284c7]"
            />
            <span
              className={
                tripType === 'oneWay' ? 'font-semibold text-[#0284c7]' : 'font-semibold text-[#64748b]'
              }
            >
              Một chiều
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-[14px]">
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
              className="text-[#0284c7] focus:ring-[#0284c7]"
            />
            <span
              className={
                tripType === 'roundTrip' ? 'font-semibold text-[#0284c7]' : 'font-semibold text-[#64748b]'
              }
            >
              Khứ hồi
            </span>
          </label>

          <div className="ml-auto bg-[#f1f5f9] px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#64748b]">
            {cabinClass}
          </div>
        </div>

        {/* Điểm đi và Điểm đến */}
        <div className="flex flex-col sm:flex-row items-end gap-3">
          {/* Điểm đi */}
          <div className="flex-1 w-full">
            <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Điểm đi
            </label>
            <div className="relative">
              <select
                value={maDi}
                onChange={(e) => setMaDi(e.target.value)}
                className="w-full h-[40px] px-3 pr-8 bg-white border border-[#cbd5e1] rounded-[8px] text-[14px] text-[#0f172a] focus:outline-hidden focus:border-[#0284c7] appearance-none cursor-pointer"
              >
                {AIRPORTS.map((apt) => (
                  <option key={apt.code} value={apt.code}>
                    {apt.code} — {apt.city} ({apt.name})
                  </option>
                ))}
              </select>
              <img
                src={chevronDownIcon}
                alt=""
                className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              />
            </div>
          </div>

          {/* Nút đổi chiều */}
          <button
            type="button"
            onClick={swapAirports}
            title="Đổi điểm đi / điểm đến"
            className="size-[40px] bg-[#e0f2fe] hover:bg-[#bae6fd] rounded-[8px] flex items-center justify-center shrink-0 transition cursor-pointer self-center sm:self-end"
          >
            <img src={arrowLeftRightIcon} alt="Đổi chiều" className="size-[18px]" />
          </button>

          {/* Điểm đến */}
          <div className="flex-1 w-full">
            <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Điểm đến
            </label>
            <div className="relative">
              <select
                value={maDen}
                onChange={(e) => setMaDen(e.target.value)}
                className="w-full h-[40px] px-3 pr-8 bg-white border border-[#cbd5e1] rounded-[8px] text-[14px] text-[#0f172a] focus:outline-hidden focus:border-[#0284c7] appearance-none cursor-pointer"
              >
                {AIRPORTS.map((apt) => (
                  <option key={apt.code} value={apt.code}>
                    {apt.code} — {apt.city} ({apt.name})
                  </option>
                ))}
              </select>
              <img
                src={chevronDownIcon}
                alt=""
                className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Ngày đi và Ngày về */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Ngày đi
            </label>
            <div className="relative">
              <input
                type="date"
                value={ngayDi}
                min={formatDateValue(new Date())}
                onChange={(e) => setNgayDi(e.target.value)}
                className="w-full h-[40px] px-3 pr-8 bg-white border border-[#cbd5e1] rounded-[8px] text-[14px] text-[#0f172a] focus:outline-hidden focus:border-[#0284c7]"
              />
              <img
                src={calendarDaysIcon}
                alt=""
                className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
              Ngày về
            </label>
            <div className="relative">
              <input
                type="date"
                value={ngayVe}
                min={ngayDi}
                disabled={tripType === 'oneWay'}
                onChange={(e) => setNgayVe(e.target.value)}
                className={`w-full h-[40px] px-3 pr-8 border rounded-[8px] text-[14px] focus:outline-hidden ${
                  tripType === 'oneWay'
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-[#cbd5e1] text-[#0f172a] focus:border-[#0284c7]'
                }`}
              />
              <img
                src={calendarDaysIcon}
                alt=""
                className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none ${
                  tripType === 'oneWay' ? 'opacity-40' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Hành khách */}
        <div className="relative">
          <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
            Hành khách
          </label>
          <button
            type="button"
            onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
            className="w-full h-[40px] px-3 bg-white border-2 border-[#0284c7] rounded-[8px] text-[14px] text-[#0f172a] flex items-center justify-between text-left cursor-pointer"
          >
            <span>{passengerSummary}</span>
            <img
              src={passengerDropdownOpen ? chevronUpIcon : chevronDownIcon}
              alt=""
              className="size-4"
            />
          </button>

          {/* Panel tăng giảm số lượng hành khách */}
          {passengerDropdownOpen && (
            <div className="mt-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4 flex flex-col gap-3 shadow-md z-20">
              {/* Người lớn */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#334155] text-[13px]">Người lớn</p>
                  <p className="text-[#64748b] text-[11px]">Từ 12 tuổi trở lên</p>
                </div>
                <div className="flex items-center gap-4 text-[14px]">
                  <button
                    type="button"
                    disabled={soNguoiLon <= 1}
                    onClick={() => setSoNguoiLon(soNguoiLon - 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-semibold text-[#334155] w-4 text-center">
                    {soNguoiLon}
                  </span>
                  <button
                    type="button"
                    disabled={soNguoiLon >= 9}
                    onClick={() => setSoNguoiLon(soNguoiLon + 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trẻ em */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                <div>
                  <p className="font-semibold text-[#334155] text-[13px]">Trẻ em</p>
                  <p className="text-[#64748b] text-[11px]">Từ 2 đến dưới 12 tuổi</p>
                </div>
                <div className="flex items-center gap-4 text-[14px]">
                  <button
                    type="button"
                    disabled={soTreEm <= 0}
                    onClick={() => setSoTreEm(soTreEm - 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-semibold text-[#334155] w-4 text-center">
                    {soTreEm}
                  </span>
                  <button
                    type="button"
                    disabled={soTreEm >= 9}
                    onClick={() => setSoTreEm(soTreEm + 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Em bé */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                <div>
                  <p className="font-semibold text-[#334155] text-[13px]">Em bé</p>
                  <p className="text-[#64748b] text-[11px]">Dưới 2 tuổi</p>
                </div>
                <div className="flex items-center gap-4 text-[14px]">
                  <button
                    type="button"
                    disabled={soEmBe <= 0}
                    onClick={() => setSoEmBe(soEmBe - 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-semibold text-[#334155] w-4 text-center">
                    {soEmBe}
                  </span>
                  <button
                    type="button"
                    disabled={soEmBe >= soNguoiLon}
                    onClick={() => setSoEmBe(soEmBe + 1)}
                    className="size-7 rounded-md bg-white border border-[#cbd5e1] text-[#0284c7] font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPassengerDropdownOpen(false)}
                className="mt-1 w-full py-1 text-center text-xs font-semibold text-[#0284c7] hover:underline cursor-pointer"
              >
                Xong
              </button>
            </div>
          )}
        </div>

        {/* Thanh tìm vé và ghi chú */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[#64748b] text-[12px]">
            Giá đã bao gồm thuế và phí
          </p>
          <button
            type="submit"
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-[14px] h-[40px] px-6 rounded-[8px] flex items-center gap-2 transition cursor-pointer"
          >
            <img src={searchIcon} alt="" className="size-4" />
            <span>Tìm vé</span>
          </button>
        </div>
      </form>
    </div>
  );
}
