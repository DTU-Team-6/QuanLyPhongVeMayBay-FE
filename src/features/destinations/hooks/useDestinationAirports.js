import { useEffect, useState } from 'react';
import destinationService from '../services/destinationService';

export default function useDestinationAirports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    destinationService.airports({ signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setAirports(data); })
      .catch((requestError) => { if (!controller.signal.aborted) { setAirports([]); setError(requestError); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  return { airports, loading, error, reload: () => setRevision((value) => value + 1) };
}
