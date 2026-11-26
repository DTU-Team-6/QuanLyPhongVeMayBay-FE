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
import { formatCurrency } from '../../../utils/formatters';

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

  // ---- Chặng đang chọn cho vé khứ hồi ('di' hoặc 've') ----
  const [currentLeg, setCurrentLeg] = useState('di');

  useEffect(() => {
    if (loaiVe !== 'roundTrip') {
      setCurrentLeg('di');
    }
  }, [loaiVe]);

  // ---- Trạng thái tải dữ liệu ----
  const [danhSachDi, setDanhSachDi] = useState([]);
  const [danhSachVe, setDanhSachVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVe, setLoadingVe] = useState(false);
  const [error, setError] = useState(null);

  // ---- Giá theo ngày (DateTabBar) ----
  const [minPriceMapDi, setMinPriceMapDi] = useState(null);
  const [minPriceMapVe, setMinPriceMapVe] = useState(null);

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

  const fetchMinPriceVe = useCallback(async () => {
    if (loaiVe !== 'roundTrip' || !maDi || !maDen || !ngayVe) return;
    const base = new Date(ngayVe + 'T00:00:00');
    const start = new Date(base);
    start.setDate(base.getDate() - 2);
    const end = new Date(base);
    end.setDate(base.getDate() + 2);
    const fmt = (d) => d.toISOString().split('T')[0];
    const map = await flightSearchService.getMinPriceByDateRange({
      maDi: maDen,
      maDen: maDi,
      ngayBatDau: fmt(start),
      ngayKetThuc: fmt(end),
      soNguoiLon,
      soTreEm,
    });
    setMinPriceMapVe(map);
  }, [loaiVe, maDi, maDen, ngayVe, soNguoiLon, soTreEm]);

  useEffect(() => {
    fetchChuyenDi();
    fetchMinPriceDi();
  }, [fetchChuyenDi, fetchMinPriceDi]);

  useEffect(() => {
    if (loaiVe === 'roundTrip') {
      fetchChuyenVe();
      fetchMinPriceVe();
    } else {
      setDanhSachVe([]);
      setMinPriceMapVe(null);
      setChuyenDaChon((prev) => ({ ...prev, ve: null }));
    }
  }, [fetchChuyenVe, fetchMinPriceVe, loaiVe]);

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
    setChuyenDaChon((prev) => ({ ...prev, di: null }));
    const next = new URLSearchParams(searchParams);
    next.set('ngayDi', dateStr);
    if (loaiVe === 'roundTrip' && ngayVe && dateStr > ngayVe) {
      setNgayVe(dateStr);
      setChuyenDaChon({ di: null, ve: null });
      next.set('ngayVe', dateStr);
    }
    setSearchParams(next, { replace: true });
  };

  const handleDateVeChange = (dateStr) => {
    setNgayVe(dateStr);
    setChuyenDaChon((prev) => ({ ...prev, ve: null }));
    const next = new URLSearchParams(searchParams);
    next.set('ngayVe', dateStr);
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
    setCurrentLeg('di');
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
      const isUnselecting = currentId === nextId;
      const nextSelection = {
        ...prev,
        [context]: isUnselecting ? null : flight,
      };

      if (!isUnselecting && loaiVe === 'roundTrip') {
        if (context === 'di') {
          // Khách chọn vé 1 xong -> Tự động chuyển sang ngày khách đã chọn để chọn vé 2
          setCurrentLeg('ve');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        } else if (context === 've' && !prev.di) {
          // Nếu khách chưa chọn vé 1 mà chọn vé 2 trước -> chuyển về vé 1
          setCurrentLeg('di');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      }

      return nextSelection;
    });
  };

  // ---- Xử lý modal ----
  const handleOpenDetail = (flight, context) => {
    setModalFlight(flight);
    setModalContext(context);
  };

  const handleModalConfirm = (flight) => {
    setChuyenDaChon((prev) => {
      const nextSelection = { ...prev, [modalContext]: flight };
      if (loaiVe === 'roundTrip') {
        if (modalContext === 'di') {
          setCurrentLeg('ve');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        } else if (modalContext === 've' && !prev.di) {
          setCurrentLeg('di');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      }
      return nextSelection;
    });
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
          {/* ---- Tab chuyển đổi chặng khi đặt vé khứ hồi ---- */}
          {loaiVe === 'roundTrip' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-2.5 rounded-[14px] border border-[#e2e8f0] shadow-xs">
              {/* Tab 1: Chuyến đi */}
              <button
                type="button"
                onClick={() => setCurrentLeg('di')}
                className={`text-left p-3.5 rounded-[10px] border transition cursor-pointer relative ${
                  currentLeg === 'di'
                    ? 'bg-[#f0f9ff] border-[#0284c7] shadow-xs ring-1 ring-[#0284c7]/20'
                    : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      currentLeg === 'di' ? 'bg-[#0284c7] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                    }`}
                  >
                    1. Chuyến đi
                  </span>
                  {chuyenDaChon.di ? (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Đã chọn vé
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#94a3b8]">Đang chọn</span>
                  )}
                </div>
                <p className="text-[15px] font-bold text-[#0f172a]">
                  {maDi} → {maDen}
                </p>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Ngày {ngayDi}
                  {chuyenDaChon.di && (
                    <span className="text-[#0284c7] font-medium">
                      {' · '}
                      {chuyenDaChon.di.hangHangKhong?.tenHang || chuyenDaChon.di.maChuyenBay}
                      {' ('}
                      {formatCurrency(chuyenDaChon.di.tongGiaVe, chuyenDaChon.di.tienTe || 'VND')}
                      {')'}
                    </span>
                  )}
                </p>
              </button>

              {/* Tab 2: Chuyến về */}
              <button
                type="button"
                onClick={() => setCurrentLeg('ve')}
                className={`text-left p-3.5 rounded-[10px] border transition cursor-pointer relative ${
                  currentLeg === 've'
                    ? 'bg-[#f0f9ff] border-[#0284c7] shadow-xs ring-1 ring-[#0284c7]/20'
                    : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      currentLeg === 've' ? 'bg-[#0284c7] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                    }`}
                  >
                    2. Chuyến về
                  </span>
                  {chuyenDaChon.ve ? (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Đã chọn vé
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#94a3b8]">
                      {currentLeg === 've' ? 'Đang chọn' : 'Chưa chọn'}
                    </span>
                  )}
                </div>
                <p className="text-[15px] font-bold text-[#0f172a]">
                  {maDen} → {maDi}
                </p>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Ngày {ngayVe || '—'}
                  {chuyenDaChon.ve && (
                    <span className="text-[#0284c7] font-medium">
                      {' · '}
                      {chuyenDaChon.ve.hangHangKhong?.tenHang || chuyenDaChon.ve.maChuyenBay}
                      {' ('}
                      {formatCurrency(chuyenDaChon.ve.tongGiaVe, chuyenDaChon.ve.tienTe || 'VND')}
                      {')'}
                    </span>
                  )}
                </p>
              </button>
            </div>
          )}

          {/* ===== CHIỀU ĐI ===== */}
          {(!showReturnSection || currentLeg === 'di') && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#334155] flex items-center gap-2">
                  <span className="bg-[#e0f2fe] text-[#0284c7] px-2.5 py-0.5 rounded-full text-[12px]">
                    Chuyến đi
                  </span>
                  {maDi} → {maDen} · Ngày {ngayDi}
                </h2>
                {loaiVe === 'roundTrip' && chuyenDaChon.di && (
                  <button
                    type="button"
                    onClick={() => setCurrentLeg('ve')}
                    className="text-xs font-semibold text-[#0284c7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Xem chuyến về →
                  </button>
                )}
              </div>

              <DateTabBar
                selectedDate={ngayDi}
                minDate={(() => {
                  const d = new Date();
                  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                })()}
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
          )}

          {/* ===== CHIỀU VỀ ===== */}
          {showReturnSection && currentLeg === 've' && (
            <div className="flex flex-col gap-3">
              {/* Card tóm tắt vé chiều đi đã chọn */}
              {chuyenDaChon.di && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-[10px] p-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0284c7] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      Chiều đi đã chọn
                    </span>
                    <span className="font-semibold text-[13px] text-[#0f172a]">
                      {chuyenDaChon.di.hangHangKhong?.tenHang || chuyenDaChon.di.maChuyenBay}
                    </span>
                    <span className="text-[12px] text-[#64748b]">
                      • Ngày {ngayDi} • {formatCurrency(chuyenDaChon.di.tongGiaVe, chuyenDaChon.di.tienTe || 'VND')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentLeg('di')}
                    className="text-[12px] font-semibold text-[#0284c7] hover:underline cursor-pointer"
                  >
                    ← Đổi chuyến đi
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#334155] flex items-center gap-2">
                  <span className="bg-[#fef3c7] text-[#d97706] px-2.5 py-0.5 rounded-full text-[12px]">
                    Chuyến về
                  </span>
                  {maDen} → {maDi} · Ngày {ngayVe || '—'}
                </h2>
                <button
                  type="button"
                  onClick={() => setCurrentLeg('di')}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#0284c7] flex items-center gap-1 cursor-pointer"
                >
                  ← Quay lại chuyến đi
                </button>
              </div>

              {/* DateTabBar cho ngày về */}
              {ngayVe && (
                <DateTabBar
                  selectedDate={ngayVe}
                  onDateChange={handleDateVeChange}
                  minPriceMap={minPriceMapVe}
                  minDate={ngayDi}
                />
              )}

              <SortTabBar activeSort={sortKey} onSortChange={setSortKey} />

              {loadingVe ? (
                <Loading message="Đang tìm chuyến về..." />
              ) : danhSachVeFiltered.length === 0 ? (
                <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 text-center">
                  <p className="text-[14px] font-semibold text-[#334155]">
                    {ngayVe ? 'Không có chuyến về phù hợp' : 'Vui lòng chọn ngày về'}
                  </p>
                  <p className="text-[12px] text-[#64748b] mt-1">
                    Thử chọn ngày bay khác hoặc bỏ bộ lọc hãng hàng không.
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
          modalContext={modalContext}
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
