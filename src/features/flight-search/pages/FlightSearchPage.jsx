import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Loading from '../../../components/common/Loading';
import FlightSearchSidebar from '../components/FlightSearchSidebar';
import DateTabBar from '../components/DateTabBar';
import SortTabBar from '../components/SortTabBar';
import FlightCard from '../components/FlightCard';
import SelectedFlightBar from '../components/SelectedFlightBar';
import FlightDetailModal from '../components/FlightDetailModal';
import flightSearchService from '../services/flightSearchService';

/**
 * Trang danh sách chuyến bay – 6.4.6
 * - Đọc params từ URL: maDi, maDen, ngayDi, ngayVe, soNguoiLon, soTreEm, soEmBe, loaiVe
 * - Gọi API GET /api/v1/flights tìm chuyến đi (và chuyến về nếu khứ hồi)
 * - Cho phép lọc hãng, sắp xếp, chuyển ngày
 * - Modal chi tiết (6.4.7) tích hợp sẵn ở đây
 */
export default function FlightSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ---- Đọc query params ----
  const maDi = searchParams.get('maDi') || 'SGN';
  const maDen = searchParams.get('maDen') || 'HAN';
  const loaiVe = searchParams.get('loaiVe') || 'oneWay';
  const soNguoiLon = Number(searchParams.get('soNguoiLon')) || 1;
  const soTreEm = Number(searchParams.get('soTreEm')) || 0;
  const soEmBe = Number(searchParams.get('soEmBe')) || 0;
  const ngayDiParam = searchParams.get('ngayDi') || new Date().toISOString().split('T')[0];
  const ngayVeParam = searchParams.get('ngayVe') || '';

  const [ngayDi, setNgayDi] = useState(ngayDiParam);
  const [ngayVe, setNgayVe] = useState(ngayVeParam);

  // Đồng bộ state khi URL thay đổi từ bên ngoài (Sidebar hoặc HomePage)
  useEffect(() => {
    setNgayDi(ngayDiParam);
  }, [ngayDiParam]);

  useEffect(() => {
    setNgayVe(ngayVeParam);
  }, [ngayVeParam]);

  // ---- Trạng thái tải dữ liệu ----
  const [danhSachDi, setDanhSachDi] = useState([]);
  const [danhSachVe, setDanhSachVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVe, setLoadingVe] = useState(false);
  const [error, setError] = useState(null);

  // ---- Giá theo ngày (DateTabBar) ----
  const [minPriceMapDi, setMinPriceMapDi] = useState(null);

  // ---- Lọc + sắp xếp ----
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [sortKey, setSortKey] = useState('deXuat');

  // ---- Chuyến đã chọn ----
  const [chuyenDaChon, setChuyenDaChon] = useState({ di: null, ve: null });

  // ---- Modal chi tiết ----
  const [modalFlight, setModalFlight] = useState(null);
  const [modalContext, setModalContext] = useState('di');

  // Tổng tiền hiển thị ở thanh dưới (dùng tongGiaVe do BE trả về)
  const tongTien = useMemo(() => {
    if (chuyenDaChon.di?.tongGiaVe == null) return null;
    const t1 = Number(chuyenDaChon.di.tongGiaVe) || 0;
    const t2 = chuyenDaChon.ve?.tongGiaVe != null ? Number(chuyenDaChon.ve.tongGiaVe) : 0;
    return t1 + t2;
  }, [chuyenDaChon]);

  // ---- Hàm gọi API tìm chuyến ----
  const fetchChuyenDi = useCallback(async () => {
    if (!maDi || !maDen || !ngayDi) return;
    setLoading(true);
    setError(null);
    try {
      const data = await flightSearchService.searchFlights({
        maDi,
        maDen,
        ngayDi,
        soNguoiLon,
        soTreEm,
      });
      setDanhSachDi(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      setDanhSachDi([]);
    } finally {
      setLoading(false);
    }
  }, [maDi, maDen, ngayDi, soNguoiLon, soTreEm]);

  const fetchChuyenVe = useCallback(async () => {
    if (loaiVe !== 'roundTrip' || !ngayVe || !maDi || !maDen) {
      setDanhSachVe([]);
      return;
    }
    setLoadingVe(true);
    try {
      const data = await flightSearchService.searchFlights({
        maDi: maDen,
        maDen: maDi,
        ngayDi: ngayVe,
        soNguoiLon,
        soTreEm,
      });
      setDanhSachVe(Array.isArray(data) ? data : []);
    } catch {
      setDanhSachVe([]);
    } finally {
      setLoadingVe(false);
    }
  }, [loaiVe, maDi, maDen, ngayVe, soNguoiLon, soTreEm]);

  const fetchMinPriceDi = useCallback(async () => {
    if (!maDi || !maDen || !ngayDi) return;
    const base = new Date(ngayDi + 'T00:00:00');
    const start = new Date(base);
    start.setDate(base.getDate() - 2);
    const end = new Date(base);
    end.setDate(base.getDate() + 2);
    const fmt = (d) => d.toISOString().split('T')[0];
    const map = await flightSearchService.getMinPriceByDateRange({
      maDi,
      maDen,
      ngayBatDau: fmt(start),
      ngayKetThuc: fmt(end),
      soNguoiLon,
      soTreEm,
    });
    setMinPriceMapDi(map);
  }, [maDi, maDen, ngayDi, soNguoiLon, soTreEm]);

  useEffect(() => {
    fetchChuyenDi();
    fetchMinPriceDi();
  }, [fetchChuyenDi, fetchMinPriceDi]);

  useEffect(() => {
    if (loaiVe === 'roundTrip') {
      fetchChuyenVe();
    } else {
      setDanhSachVe([]);
      setChuyenDaChon((prev) => ({ ...prev, ve: null }));
    }
  }, [fetchChuyenVe, loaiVe]);

  // ---- Lọc + sắp xếp danh sách ----
  const sortFlights = useCallback(
    (list) => {
      const clone = [...list];
      switch (sortKey) {
        case 'giaThapDenCao':
          clone.sort((a, b) => (Number(a.tongGiaVe) || 0) - (Number(b.tongGiaVe) || 0));
          break;
        case 'thoiGianKhoiHanh':
          clone.sort((a, b) => {
            const da = typeof a.thoiGianKhoiHanh === 'string' ? a.thoiGianKhoiHanh : a.thoiGianKhoiHanh?.dateTime;
            const db = typeof b.thoiGianKhoiHanh === 'string' ? b.thoiGianKhoiHanh : b.thoiGianKhoiHanh?.dateTime;
            return new Date(da) - new Date(db);
          });
          break;
        case 'hangHangKhong':
          clone.sort((a, b) =>
            (a.hangHangKhong?.tenHang || '').localeCompare(b.hangHangKhong?.tenHang || '')
          );
          break;
        default:
          break;
      }
      return clone;
    },
    [sortKey]
  );

  const filterByAirline = useCallback(
    (list) => {
      if (!selectedAirlines.length) return list;
      return list.filter((f) => selectedAirlines.includes(f.hangHangKhong?.maHang));
    },
    [selectedAirlines]
  );

  const danhSachDiFiltered = useMemo(
    () => sortFlights(filterByAirline(danhSachDi)),
    [danhSachDi, sortFlights, filterByAirline]
  );

  const danhSachVeFiltered = useMemo(
    () => sortFlights(filterByAirline(danhSachVe)),
    [danhSachVe, sortFlights, filterByAirline]
  );

  const giaThapNhatDi = useMemo(
    () =>
      danhSachDiFiltered.length
        ? Math.min(...danhSachDiFiltered.map((f) => Number(f.tongGiaVe) || Infinity))
        : null,
    [danhSachDiFiltered]
  );

  const giaThapNhatVe = useMemo(
    () =>
      danhSachVeFiltered.length
        ? Math.min(...danhSachVeFiltered.map((f) => Number(f.tongGiaVe) || Infinity))
        : null,
    [danhSachVeFiltered]
  );

  // ---- Xử lý thay đổi ngày (DateTabBar) ----
  const handleDateDiChange = (dateStr) => {
    setNgayDi(dateStr);
    const next = new URLSearchParams(searchParams);
    next.set('ngayDi', dateStr);
    setSearchParams(next, { replace: true });
  };

  // ---- Xử lý lọc hãng ----
  const handleAirlineChange = (maHang, checked) => {
    setSelectedAirlines((prev) =>
      checked ? [...prev, maHang] : prev.filter((m) => m !== maHang)
    );
  };

  // ---- Xử lý tìm kiếm lại từ Sidebar ----
  const handleSidebarSearch = (params) => {
    setChuyenDaChon({ di: null, ve: null });
    const next = new URLSearchParams({
      maDi: params.maDi,
      maDen: params.maDen,
      ngayDi: params.ngayDi,
      soNguoiLon: String(params.soNguoiLon),
      soTreEm: String(params.soTreEm),
      soEmBe: String(soEmBe),
      loaiVe: params.loaiVe,
    });
    if (params.loaiVe === 'roundTrip' && params.ngayVe) {
      next.set('ngayVe', params.ngayVe);
    }
    navigate(`/chuyen-bay?${next.toString()}`);
  };

  // ---- Xử lý chọn chuyến (so sánh theo hangVeId) ----
  const handleSelectFlight = (flight, context) => {
    setChuyenDaChon((prev) => {
      const currentId = prev[context]?.hangVeId ?? prev[context]?.chuyenBayId;
      const nextId = flight.hangVeId ?? flight.chuyenBayId;
      return {
        ...prev,
        [context]: currentId === nextId ? null : flight,
      };
    });
  };

  // ---- Xử lý modal ----
  const handleOpenDetail = (flight, context) => {
    setModalFlight(flight);
    setModalContext(context);
  };

  const handleModalConfirm = (flight) => {
    setChuyenDaChon((prev) => ({ ...prev, [modalContext]: flight }));
    setModalFlight(null);
  };

  const tenHanhTrinh = loaiVe === 'roundTrip' ? `${maDi} ⇌ ${maDen}` : `${maDi} → ${maDen}`;
  const showReturnSection = loaiVe === 'roundTrip';

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-28">
      {/* ---- Tiêu đề hành trình ---- */}
      <div className="bg-[#0284c7] text-white px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[22px] font-bold">{tenHanhTrinh}</h1>
          <p className="text-[13px] text-sky-100 mt-1">
            {loaiVe === 'roundTrip' ? 'Khứ hồi' : 'Một chiều'}
            {' · '}
            {ngayDi}
            {loaiVe === 'roundTrip' && ngayVe && ` – ${ngayVe}`}
            {' · '}
            {soNguoiLon} người lớn
            {soTreEm > 0 && ` · ${soTreEm} trẻ em`}
            {soEmBe > 0 && ` · ${soEmBe} em bé`}
          </p>
        </div>
      </div>

      {/* ---- Layout 2 cột ---- */}
      <div className="max-w-6xl mx-auto px-4 pt-6 flex gap-6">
        <div className="w-[260px] shrink-0 hidden lg:block">
          <FlightSearchSidebar
            defaultParams={{ maDi, maDen, ngayDi, ngayVe, soNguoiLon, soTreEm, loaiVe }}
            selectedAirlines={selectedAirlines}
            onAirlineChange={handleAirlineChange}
            onSearch={handleSidebarSearch}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* ===== CHIỀU ĐI ===== */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[14px] font-bold text-[#334155] flex items-center gap-2">
              <span className="bg-[#e0f2fe] text-[#0284c7] px-2.5 py-0.5 rounded-full text-[12px]">
                Chuyến đi
              </span>
              {maDi} → {maDen} · {ngayDi}
            </h2>

            <DateTabBar
              selectedDate={ngayDi}
              onDateChange={handleDateDiChange}
              minPriceMap={minPriceMapDi}
            />

            <SortTabBar activeSort={sortKey} onSortChange={setSortKey} />

            {loading ? (
              <Loading message="Đang tìm chuyến bay..." />
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center">
                <p className="text-red-600 font-semibold mb-2">Không thể tải danh sách chuyến bay</p>
                <p className="text-red-500 text-[12px]">{error.message}</p>
                <button
                  type="button"
                  onClick={fetchChuyenDi}
                  className="mt-3 px-4 py-1.5 bg-red-600 text-white text-[12px] font-semibold rounded-[6px] hover:bg-red-700 transition cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : danhSachDiFiltered.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-10 text-center">
                <p className="text-[15px] font-semibold text-[#334155]">Không có chuyến bay phù hợp</p>
                <p className="text-[13px] text-[#64748b] mt-1">
                  Thử thay đổi ngày bay hoặc bỏ bộ lọc hãng hàng không.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {danhSachDiFiltered.map((flight) => {
                  const key = flight.hangVeId || `${flight.chuyenBayId}-${flight.loaiKhoang}`;
                  const selected =
                    (chuyenDaChon.di?.hangVeId ?? chuyenDaChon.di?.chuyenBayId) ===
                    (flight.hangVeId ?? flight.chuyenBayId);
                  return (
                    <FlightCard
                      key={key}
                      flight={flight}
                      isSelected={selected}
                      isCheapest={giaThapNhatDi != null && Number(flight.tongGiaVe) === giaThapNhatDi}
                      onSelect={(f) => handleSelectFlight(f, 'di')}
                      onDetail={(f) => handleOpenDetail(f, 'di')}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* ===== CHIỀU VỀ ===== */}
          {showReturnSection && (
            <div className="flex flex-col gap-3">
              <h2 className="text-[14px] font-bold text-[#334155] flex items-center gap-2">
                <span className="bg-[#fef3c7] text-[#d97706] px-2.5 py-0.5 rounded-full text-[12px]">
                  Chuyến về
                </span>
                {maDen} → {maDi} · {ngayVe || '—'}
              </h2>

              {loadingVe ? (
                <Loading message="Đang tìm chuyến về..." />
              ) : danhSachVeFiltered.length === 0 ? (
                <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 text-center">
                  <p className="text-[13px] text-[#64748b]">
                    {ngayVe ? 'Không có chuyến về phù hợp' : 'Vui lòng chọn ngày về'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {danhSachVeFiltered.map((flight) => {
                    const key = flight.hangVeId || `${flight.chuyenBayId}-${flight.loaiKhoang}`;
                    const selected =
                      (chuyenDaChon.ve?.hangVeId ?? chuyenDaChon.ve?.chuyenBayId) ===
                      (flight.hangVeId ?? flight.chuyenBayId);
                    return (
                      <FlightCard
                        key={key}
                        flight={flight}
                        isSelected={selected}
                        isCheapest={giaThapNhatVe != null && Number(flight.tongGiaVe) === giaThapNhatVe}
                        onSelect={(f) => handleSelectFlight(f, 've')}
                        onDetail={(f) => handleOpenDetail(f, 've')}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---- Bar đã chọn chuyến ---- */}
      <SelectedFlightBar
        selectedFlights={chuyenDaChon}
        loaiVe={loaiVe}
        soNguoiLon={soNguoiLon}
        soTreEm={soTreEm}
        soEmBe={soEmBe}
        tongTien={tongTien}
      />

      {/* ---- Modal chi tiết chuyến bay (6.4.7) ---- */}
      {modalFlight && (
        <FlightDetailModal
          flight={modalFlight}
          flightVe={modalContext === 've' ? null : chuyenDaChon.ve}
          loaiVe={loaiVe}
          soNguoiLon={soNguoiLon}
          soTreEm={soTreEm}
          onClose={() => setModalFlight(null)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}
