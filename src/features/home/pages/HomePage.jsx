import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import TopCheapFlights from '../components/TopCheapFlights';
import ServiceCommitments from '../components/ServiceCommitments';
import { buildFlightSearchUrl } from '../utils/homeHelpers';

/** Trang chủ 6.1 và Top 10 chuyến bay giá rẻ 99.2. */
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      <ServiceCommitments />
      <TopCheapFlights onSelectFlight={(flight) => navigate(buildFlightSearchUrl(flight))} />
    </div>
  );
}
