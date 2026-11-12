import { useState, useEffect } from 'react';
import flightService from '../../../services/flightService';
import CheapFlightCard from './CheapFlightCard';
import FlightSkeletonCard from './FlightSkeletonCard';
import EmptyState from '../../../components/common/EmptyState';

// Dữ liệu mẫu chuẩn DTO TopCheapFlightResponse để xem trước giao diện khi backend chưa chạy
const MOCK_TOP_CHEAP_FLIGHTS = [
  {
    chuyenBayId: 1,
    maChuyenBay: 'VN 210',
    hangHangKhong: { maHang: 'VN', tenHang: 'Vietnam Airlines', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T08:00:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T10:10:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 130,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 1450000,
    thuePhi: 350000,
    tongGiaVe: 1800000,
    tienTe: 'VND',
    soGheTrong: 14,
    hanhLyXachTayKg: 10,
    hanhLyKyGuiKg: 23,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 2,
    maChuyenBay: 'VJ 152',
    hangHangKhong: { maHang: 'VJ', tenHang: 'Vietjet Air', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T10:45:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T12:55:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 130,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 1300000,
    thuePhi: 350000,
    tongGiaVe: 1650000,
    tienTe: 'VND',
    soGheTrong: 8,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 0,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 3,
    maChuyenBay: 'QH 202',
    hangHangKhong: { maHang: 'QH', tenHang: 'Bamboo Airways', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'DAD', tenSanBay: 'Đà Nẵng', thanhPho: 'Đà Nẵng', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T06:30:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T07:50:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 80,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 750000,
    thuePhi: 250000,
    tongGiaVe: 1000000,
    tienTe: 'VND',
    soGheTrong: 20,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 20,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 4,
    maChuyenBay: 'VN 128',
    hangHangKhong: { maHang: 'VN', tenHang: 'Vietnam Airlines', logoUrl: '' },
    sanBayDi: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'DAD', tenSanBay: 'Đà Nẵng', thanhPho: 'Đà Nẵng', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T13:15:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T14:35:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 80,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 850000,
    thuePhi: 280000,
    tongGiaVe: 1130000,
    tienTe: 'VND',
    soGheTrong: 16,
    hanhLyXachTayKg: 10,
    hanhLyKyGuiKg: 23,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 5,
    maChuyenBay: 'VJ 324',
    hangHangKhong: { maHang: 'VJ', tenHang: 'Vietjet Air', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'PQC', tenSanBay: 'Phú Quốc', thanhPho: 'Phú Quốc', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T09:20:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T10:25:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 65,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 620000,
    thuePhi: 260000,
    tongGiaVe: 880000,
    tienTe: 'VND',
    soGheTrong: 25,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 0,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 6,
    maChuyenBay: 'QH 156',
    hangHangKhong: { maHang: 'QH', tenHang: 'Bamboo Airways', logoUrl: '' },
    sanBayDi: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'CXR', tenSanBay: 'Cam Ranh', thanhPho: 'Nha Trang', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T11:00:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T12:50:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 110,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 950000,
    thuePhi: 300000,
    tongGiaVe: 1250000,
    tienTe: 'VND',
    soGheTrong: 18,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 20,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 7,
    maChuyenBay: 'VN 382',
    hangHangKhong: { maHang: 'VN', tenHang: 'Vietnam Airlines', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'HPH', tenSanBay: 'Cát Bi', thanhPho: 'Hải Phòng', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T15:40:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T17:45:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 125,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 1200000,
    thuePhi: 340000,
    tongGiaVe: 1540000,
    tienTe: 'VND',
    soGheTrong: 10,
    hanhLyXachTayKg: 10,
    hanhLyKyGuiKg: 23,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 8,
    maChuyenBay: 'VJ 278',
    hangHangKhong: { maHang: 'VJ', tenHang: 'Vietjet Air', logoUrl: '' },
    sanBayDi: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'PQC', tenSanBay: 'Phú Quốc', thanhPho: 'Phú Quốc', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T07:15:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T09:25:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 130,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 1100000,
    thuePhi: 330000,
    tongGiaVe: 1430000,
    tienTe: 'VND',
    soGheTrong: 15,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 0,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 9,
    maChuyenBay: 'QH 312',
    hangHangKhong: { maHang: 'QH', tenHang: 'Bamboo Airways', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'VII', tenSanBay: 'Vinh', thanhPho: 'Vinh', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T12:00:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T13:45:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 105,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 980000,
    thuePhi: 310000,
    tongGiaVe: 1290000,
    tienTe: 'VND',
    soGheTrong: 12,
    hanhLyXachTayKg: 7,
    hanhLyKyGuiKg: 20,
    trangThai: 'DANG_MO_BAN',
  },
  {
    chuyenBayId: 10,
    maChuyenBay: 'VN 218',
    hangHangKhong: { maHang: 'VN', tenHang: 'Vietnam Airlines', logoUrl: '' },
    sanBayDi: { maSanBay: 'SGN', tenSanBay: 'Tân Sơn Nhất', thanhPho: 'TP. HCM', quocGia: 'Việt Nam' },
    sanBayDen: { maSanBay: 'HAN', tenSanBay: 'Nội Bài', thanhPho: 'Hà Nội', quocGia: 'Việt Nam' },
    thoiGianKhoiHanh: { dateTime: '2026-11-12T19:30:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiGianHaCanh: { dateTime: '2026-11-12T21:40:00+07:00', timeZone: 'Asia/Ho_Chi_Minh' },
    thoiLuongBayPhut: 130,
    loaiKhoangReNhat: 'PHO_THONG',
    giaBan: 1550000,
    thuePhi: 350000,
    tongGiaVe: 1900000,
    tienTe: 'VND',
    soGheTrong: 9,
    hanhLyXachTayKg: 10,
    hanhLyKyGuiKg: 23,
    trangThai: 'DANG_MO_BAN',
  },
];

/**
 * Khu vực hiển thị Top 10 chuyến bay giá rẻ nhất
 * Gọi API GET /api/v1/flights/top-cheap?limit=10
 * Xử lý đầy đủ trạng thái Loading (Skeleton) và Empty state
 */
export default function TopCheapFlights({ onSelectFlight }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const fetchTopCheapFlights = async () => {
    setLoading(true);
    setError(null);
    setIsUsingMock(false);
    try {
      const data = await flightService.getTopCheapFlights(10);
      if (Array.isArray(data) && data.length > 0) {
        setFlights(data);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.warn('Backend chưa sẵn sàng hoặc không kết nối được:', err);
      setError(err?.message || 'Không thể kết nối đến máy chủ backend');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setError(null);
    setIsUsingMock(true);
    setFlights(MOCK_TOP_CHEAP_FLIGHTS);
  };

  useEffect(() => {
    fetchTopCheapFlights();
  }, []);

  return (
    <section className="w-full py-8 md:py-12 bg-[#f8fafc]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col gap-6">
        {/* Tiêu đề mục Top 10 chuyến bay */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center self-start bg-[#e0f2fe] text-[#0369a1] text-[12px] font-semibold px-3 py-1 rounded-full">
              GIÁ TỐT NHẤT HÔM NAY
            </div>
            <h2 className="text-[#0f172a] text-[24px] md:text-[28px] font-bold tracking-tight">
              Top 10 chuyến bay giá rẻ nhất
            </h2>
            <p className="text-[#64748b] text-[14px]">
              Cập nhật giá vé ưu đãi tốt nhất từ các hãng hàng không hàng đầu theo thời gian thực.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isUsingMock && (
              <span className="text-[12px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
                Đang xem dữ liệu mẫu demo
              </span>
            )}
            <button
              type="button"
              onClick={fetchTopCheapFlights}
              disabled={loading}
              className="text-[13px] font-semibold text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <svg
                className={`size-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới từ API
            </button>
          </div>
        </div>

        {/* Nội dung danh sách / Loading / Empty */}
        <div className="flex flex-col gap-4">
          {loading ? (
            // Trạng thái Loading: Hiển thị 4 thẻ Skeleton
            <>
              <FlightSkeletonCard />
              <FlightSkeletonCard />
              <FlightSkeletonCard />
              <FlightSkeletonCard />
            </>
          ) : error || flights.length === 0 ? (
            // Trạng thái Trống hoặc Lỗi
            <div className="flex flex-col gap-3">
              <EmptyState
                title={error ? 'Chưa thể kết nối máy chủ API' : 'Chưa có chuyến bay giá rẻ khả dụng'}
                description={
                  error
                    ? `${error}. (VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}). Bạn có thể kiểm tra backend hoặc xem trước dữ liệu mẫu demo.`
                    : 'Hiện tại hệ thống chưa có chuyến bay giá rẻ nào phù hợp hoặc các chuyến bay đã cất cánh.'
                }
                actionLabel="Thử kết nối lại API"
                onAction={fetchTopCheapFlights}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={loadMockData}
                  className="text-xs text-[#0284c7] hover:underline font-semibold cursor-pointer py-1"
                >
                  ⚡ Bấm vào đây để tải 10 chuyến bay mẫu demo kiểm tra hiển thị giao diện
                </button>
              </div>
            </div>
          ) : (
            // Trạng thái Thành công: Danh sách chuyến bay giá rẻ
            flights.map((flight) => (
              <CheapFlightCard
                key={flight.chuyenBayId || flight.maChuyenBay}
                flight={flight}
                onSelect={onSelectFlight}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
