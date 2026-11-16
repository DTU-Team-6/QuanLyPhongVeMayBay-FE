import { useEffect, useState } from 'react';
import flightService from '../../../services/flightService';
import CheapFlightCard from './CheapFlightCard';
import FlightSkeletonCard from './FlightSkeletonCard';
import EmptyState from '../../../components/common/EmptyState';

/** Danh sách giá rẻ lấy trực tiếp từ hệ thống, giữ nguyên thứ tự giá do BE trả về. */
export default function TopCheapFlights({ onSelectFlight }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    flightService.getTopCheapFlights(10, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setFlights(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFlights([]);
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  return (
    <section aria-labelledby="top-cheap-title" className="w-full py-8 md:py-12 bg-[#f8fafc]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center self-start bg-[#e0f2fe] text-[#0369a1] text-[12px] font-semibold px-3 py-1 rounded-full">GIÁ TỐT NHẤT HÔM NAY</div>
            <h2 id="top-cheap-title" className="text-[#0f172a] text-[24px] md:text-[28px] font-bold tracking-tight">Top 10 chuyến bay giá rẻ nhất</h2>
            <p className="text-[#64748b] text-[14px]">Khám phá các chuyến bay còn chỗ, sắp xếp theo tổng giá vé từ thấp đến cao.</p>
          </div>
          <button type="button" onClick={reload} disabled={loading} className="text-[13px] font-semibold text-[#0284c7] hover:text-[#0369a1] py-2 shrink-0 cursor-pointer disabled:opacity-50">
            {loading ? 'Đang tải chuyến bay…' : 'Làm mới'}
          </button>
        </div>
        <div className="flex flex-col gap-4" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <><span className="sr-only">Đang tải danh sách chuyến bay giá rẻ</span>{Array.from({ length: 4 }, (_, index) => <FlightSkeletonCard key={index} />)}</>
          ) : error ? (
            <div role="alert"><EmptyState title="Chưa thể tải chuyến bay" description="Kết nối tạm thời gián đoạn. Vui lòng thử lại sau ít phút." actionLabel="Thử lại" onAction={reload} /></div>
          ) : flights.length === 0 ? (
            <EmptyState title="Chưa có chuyến bay giá rẻ khả dụng" description="Hiện chưa có chuyến bay còn chỗ phù hợp. Bạn có thể tìm hành trình khác hoặc quay lại sau." actionLabel="Tải lại danh sách" onAction={reload} />
          ) : flights.map((flight) => <CheapFlightCard key={flight.chuyenBayId} flight={flight} onSelect={onSelectFlight} />)}
        </div>
      </div>
    </section>
  );
}
