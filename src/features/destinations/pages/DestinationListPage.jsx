import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/common/Loading';
import EmptyState from '../../../components/common/EmptyState';
import DestinationWorkspace from '../components/DestinationWorkspace';
import DestinationImage from '../components/DestinationImage';
import destinationService from '../services/destinationService';
import useDestinationAirports from '../hooks/useDestinationAirports';

const PAGE_SIZE = 10;

function DestinationListContent() {
  const { checkAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notice] = useState(location.state?.notice || '');
  const [keyword, setKeyword] = useState('');
  const [airport, setAirport] = useState('');
  const [query, setQuery] = useState({ keyword: '', maSanBay: '', page: 0 });
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const airportState = useDestinationAirports();

  useEffect(() => {
    // Chỉ xóa thông báo khỏi lịch sử; màn hình hiện tại không phụ thuộc kết quả điều hướng.
    if (location.state?.notice) void navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);
    destinationService.list({ ...query, size: PAGE_SIZE }, { signal: controller.signal })
      .then((page) => {
        if (controller.signal.aborted) return;
        if (page.totalPages > 0 && page.pageNumber >= page.totalPages) {
          setQuery((previous) => ({ ...previous, page: page.totalPages - 1 }));
        } else setData(page);
      })
      .catch(async (requestError) => {
        if (controller.signal.aborted) return;
        setError(requestError);
        if (requestError.status === 401) await checkAuth();
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, revision, checkAuth]);

  function search(event) {
    event.preventDefault();
    setQuery({ keyword: keyword.trim(), maSanBay: airport, page: 0 });
  }
  function clear() {
    setKeyword('');
    setAirport('');
    setQuery({ keyword: '', maSanBay: '', page: 0 });
  }
  const first = data?.totalElements ? data.pageNumber * PAGE_SIZE + 1 : 0;
  const last = data ? Math.min((data.pageNumber + 1) * PAGE_SIZE, data.totalElements) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-2">Quản lý / Điểm đến</p>
          <h1 className="text-2xl font-bold text-slate-900">Danh sách điểm đến</h1>
          <p className="text-sm text-slate-500 mt-2">Tra cứu điểm đến và sân bay kết nối trong hệ thống.</p>
        </div>
        <Link to="/quan-ly-diem-den/them-moi" className="inline-flex justify-center rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white">+ Thêm điểm đến</Link>
      </div>
      {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
      <form onSubmit={search} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto] gap-4 bg-white border border-slate-200 p-5 rounded-xl">
        <div>
          <label htmlFor="destination-search" className="block text-xs font-semibold text-slate-700 mb-2">Tìm điểm đến</label>
          <input id="destination-search" type="search" value={keyword} maxLength={100} onChange={(event) => setKeyword(event.target.value)} placeholder="Tên điểm đến, sân bay hoặc thành phố" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
        </div>
        <div>
          <label htmlFor="destination-airport-filter" className="block text-xs font-semibold text-slate-700 mb-2">Sân bay kết nối</label>
          <select id="destination-airport-filter" value={airport} onChange={(event) => setAirport(event.target.value)} disabled={airportState.loading || !!airportState.error} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm disabled:bg-slate-50">
            <option value="">{airportState.loading ? 'Đang tải sân bay…' : 'Tất cả sân bay'}</option>
            {airportState.airports.map((item) => <option key={item.maSanBay} value={item.maSanBay}>{item.maSanBay} — {item.tenSanBay} ({item.thanhPho})</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="h-10 rounded-lg bg-sky-600 hover:bg-sky-700 px-4 text-sm font-semibold text-white">Tìm kiếm</button>
          <button type="button" onClick={clear} className="h-10 rounded-lg border border-slate-300 px-4 text-sm text-slate-700">Đặt lại</button>
        </div>
      </form>
      {airportState.error && <div role="status" className="text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg">Chưa tải được bộ lọc sân bay. <button type="button" onClick={airportState.reload} className="font-semibold underline">Tải lại sân bay</button></div>}
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><p>{error.status === 403 ? 'Tài khoản không có quyền xem danh sách.' : 'Chưa thể tải danh sách điểm đến. Vui lòng thử lại.'}</p>{error.status !== 403 && <button type="button" onClick={() => setRevision((value) => value + 1)} className="font-semibold underline mt-2">Thử lại</button>}</div>}
      {loading && <div role="status" className="rounded-xl border border-slate-200 bg-white p-10"><Loading message="Đang tải điểm đến…" /></div>}
      {!loading && !error && data && (data.content.length === 0 ? (
        <EmptyState title={query.keyword || query.maSanBay ? 'Không tìm thấy điểm đến phù hợp' : 'Chưa có điểm đến'} description={query.keyword || query.maSanBay ? 'Thử từ khóa khác hoặc bỏ bộ lọc sân bay.' : 'Chọn Thêm điểm đến để tạo thông tin đầu tiên.'} actionLabel={query.keyword || query.maSanBay ? 'Xóa bộ lọc' : undefined} onAction={clear} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[720px]">
              <caption className="sr-only">Danh sách điểm đến, trang {data.pageNumber + 1}</caption>
              <thead className="bg-slate-100 text-slate-600 text-xs"><tr><th scope="col" className="p-4">Điểm đến</th><th scope="col" className="p-4">Sân bay kết nối</th><th scope="col" className="p-4">Thành phố / Quốc gia</th></tr></thead>
              <tbody className="divide-y divide-slate-200">
                {data.content.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 max-w-[440px]">
                      <div className="flex gap-3 items-start">
                        <DestinationImage src={item.hinhAnh} name={item.tenDiemDen} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 break-words">{item.tenDiemDen}</p>
                          {item.moTa ? <details className="mt-1 text-xs text-slate-500"><summary className="cursor-pointer text-sky-700">Xem mô tả</summary><p className="mt-2 whitespace-pre-wrap break-words">{item.moTa}</p></details> : <p className="mt-1 text-xs text-slate-500">Chưa có mô tả</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><strong className="font-medium text-slate-700">{item.maSanBay}</strong><p className="text-xs text-slate-500 mt-1">{item.tenSanBay}</p></td>
                    <td className="p-4 text-slate-700">{item.thanhPho}<p className="text-xs text-slate-500 mt-1">{item.quocGia}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-3 border-t border-slate-200 p-4 text-xs text-slate-500">
            <p>Hiển thị {first.toLocaleString('vi-VN')}–{last.toLocaleString('vi-VN')} / {data.totalElements.toLocaleString('vi-VN')} điểm đến</p>
            <nav aria-label="Phân trang điểm đến" className="flex items-center gap-3">
              <button type="button" disabled={data.pageNumber <= 0} onClick={() => setQuery((previous) => ({ ...previous, page: data.pageNumber - 1 }))} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 disabled:opacity-40">Trang trước</button>
              <span aria-live="polite">{data.pageNumber + 1} / {data.totalPages}</span>
              <button type="button" disabled={data.pageNumber + 1 >= data.totalPages} onClick={() => setQuery((previous) => ({ ...previous, page: data.pageNumber + 1 }))} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 disabled:opacity-40">Trang sau</button>
            </nav>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DestinationListPage() {
  return <DestinationWorkspace><DestinationListContent /></DestinationWorkspace>;
}
