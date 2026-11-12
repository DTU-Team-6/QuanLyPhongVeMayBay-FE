import { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import TopCheapFlights from '../components/TopCheapFlights';
import ServiceCommitments from '../components/ServiceCommitments';

/**
 * Trang chủ hệ thống Quản lý phòng bán vé máy bay (SRS 6.1)
 * Hiển thị Banner tìm kiếm vé, khu vực Top 10 chuyến bay giá rẻ nhất (99.2),
 * và khối cam kết chất lượng dịch vụ đồng bộ thiết kế Figma.
 */
export default function HomePage() {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    // Khi có chức năng đặt vé ở task sau, chuyển hướng sang màn hình khai báo hành khách / đặt chỗ
    alert(`Bạn đã chọn chuyến bay ${flight.maChuyenBay} (${flight.sanBayDi?.maSanBay} → ${flight.sanBayDen?.maSanBay})!`);
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
