import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import TopCheapFlights from '../components/TopCheapFlights';
import ServiceCommitments from '../components/ServiceCommitments';

/**
 * Trang chủ hệ thống Quản lý phòng bán vé máy bay (SRS 6.1)
 * Hiển thị Banner tìm kiếm vé, khu vực Top 10 chuyến bay giá rẻ nhất (99.2),
 * và khối cam kết chất lượng dịch vụ đồng bộ thiết kế Figma.
 */
export default function HomePage() {
  const navigate = useNavigate();

  /**
   * Khi người dùng chọn một chuyến bay giá rẻ ở trang chủ,
   * điều hướng sang trang tìm kiếm chuyến bay với các params tương ứng.
   */
  const handleSelectFlight = (flight) => {
    const maDi = flight.sanBayDi?.maSanBay || '';
    const maDen = flight.sanBayDen?.maSanBay || '';
    // Lấy ngày từ chuyến bay (YYYY-MM-DD), hỗ trợ cả object { dateTime, timeZone } và string
    let ngayDi = '';
    const rawTime = typeof flight.thoiGianKhoiHanh === 'string'
      ? flight.thoiGianKhoiHanh
      : flight.thoiGianKhoiHanh?.dateTime;
    if (rawTime) {
      ngayDi = rawTime.slice(0, 10);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      ngayDi = tomorrow.toISOString().split('T')[0];
    }

    const params = new URLSearchParams({
      maDi,
      maDen,
      ngayDi,
      soNguoiLon: '1',
      soTreEm: '0',
      loaiVe: 'oneWay',
    });
    navigate(`/chuyen-bay?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Phần Hero Banner & Biểu mẫu tìm kiếm */}
      <HeroBanner />

      {/* 2. Cam kết dịch vụ phòng vé */}
      <ServiceCommitments />

      {/* 3. Khu vực hiển thị Top 10 chuyến bay giá rẻ nhất */}
      <TopCheapFlights onSelectFlight={handleSelectFlight} />
    </div>
  );
}
