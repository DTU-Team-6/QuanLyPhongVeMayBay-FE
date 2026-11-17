import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../../../utils/formatters';
import { myFlightsService } from '../myFlightsService';
import { validateLookup } from '../lookupValidation';

const initial = { maDatCho: '', email: '', soDienThoai: '' };
const statuses = { DUNG_GIO: 'Đúng giờ', DELAY: 'Hoãn chuyến', DA_HUY: 'Đã hủy' };

function FlightCard({ flight }) {
  const departure = flight.thoiGianKhoiHanh;
  const arrival = flight.thoiGianHaCanh;
  const status = flight.trangThaiChuyenBay;
  return <article className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{flight.tenHangHangKhong || 'Hãng hàng không'}</p><h3 className="mt-1 text-lg font-bold text-[#0f172a]">{flight.maChuyenBay || '—'}</h3></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'DUNG_GIO' ? 'bg-emerald-50 text-emerald-700' : status === 'DA_HUY' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{statuses[status] || status || 'Chưa cập nhật'}</span></div>
    <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div><p className="text-2xl font-bold text-[#0f172a]">{formatTime(departure?.dateTime, departure?.timeZone)}</p><p className="mt-1 text-sm font-semibold text-[#0284c7]">{flight.sanBayDi?.maSanBay || '—'}</p><p className="text-xs text-[#64748b]">{flight.sanBayDi?.thanhPho || flight.sanBayDi?.tenSanBay || '—'}</p></div><div className="min-w-12 text-center text-[#94a3b8]">✈</div><div className="text-right"><p className="text-2xl font-bold text-[#0f172a]">{formatTime(arrival?.dateTime, arrival?.timeZone)}</p><p className="mt-1 text-sm font-semibold text-[#0284c7]">{flight.sanBayDen?.maSanBay || '—'}</p><p className="text-xs text-[#64748b]">{flight.sanBayDen?.thanhPho || flight.sanBayDen?.tenSanBay || '—'}</p></div></div>
    <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-xs text-[#64748b] sm:grid-cols-2"><span>Khởi hành: {formatDate(departure?.dateTime, departure?.timeZone)} ({departure?.timeZone || '—'})</span><span className="sm:text-right">Hạ cánh: {formatDate(arrival?.dateTime, arrival?.timeZone)} ({arrival?.timeZone || '—'})</span></div>
  </article>;
}

export default function MyFlightsPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [flights, setFlights] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    const validation = validateLookup(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setLoading(true);
    setRequestError('');
    setFlights(null);
    try {
      const result = await myFlightsService.lookup(form);
      setFlights(result);
    } catch (error) {
      for (const detail of error.details || []) {
        if (['maDatCho', 'email', 'soDienThoai'].includes(detail.field)) {
          setErrors(previous => ({ ...previous, [detail.field]: detail.message }));
        }
      }
      setRequestError(error.code === 'BOOKING_LOOKUP_FAILED'
        ? 'Không tìm thấy chuyến bay với thông tin đã cung cấp. Hãy kiểm tra lại cả ba trường.'
        : error.code === 'LOOKUP_RATE_LIMITED'
          ? 'Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau.'
          : error.status === 403
            ? 'Không thể xác minh yêu cầu tra cứu (CSRF). Vui lòng tải lại trang và thử lại.'
            : error.message || 'Không thể tra cứu chuyến bay.');
    } finally {
      setLoading(false);
    }
  }

  return <div className="w-full bg-[#f8fafc]"><div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
    <nav className="mb-6 text-xs text-[#64748b]"><Link to="/" className="hover:text-[#0284c7]">Trang chủ</Link> / Xem chuyến bay của tôi</nav>
    <div className="mb-7"><span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-semibold text-[#0369a1]">TRA CỨU NHANH</span><h1 className="mt-4 text-3xl font-bold text-[#0f172a] sm:text-4xl">Xem chuyến bay của tôi</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">Nhập đúng mã đặt chỗ, email và số điện thoại đã dùng khi đặt vé. Không cần đăng nhập.</p></div>
    <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start"><form onSubmit={submit} noValidate className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold text-[#0f172a]">Thông tin xác minh</h2><p className="mt-1 text-xs leading-5 text-[#64748b]">Cả ba thông tin phải khớp cùng một đặt chỗ.</p>
      <div className="mt-6 space-y-4">{[
        ['maDatCho', 'Mã đặt chỗ', 'Ví dụ: MH002', 'text', 10],
        ['email', 'Email', 'email@example.com', 'email', 100],
        ['soDienThoai', 'Số điện thoại', 'Số điện thoại khi đặt vé', 'tel', 20],
      ].map(([field, label, placeholder, type, maxLength]) => <div key={field}><label htmlFor={`lookup-${field}`} className="block text-xs font-semibold text-[#334155]">{label} *</label><input id={`lookup-${field}`} type={type} value={form[field]} onChange={event => update(field, event.target.value)} maxLength={maxLength} autoComplete={field === 'email' ? 'email' : field === 'soDienThoai' ? 'tel' : 'off'} disabled={loading} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `lookup-${field}-error` : undefined} placeholder={placeholder} className={`mt-2 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-[#0284c7] disabled:bg-slate-50 ${errors[field] ? 'border-rose-400' : 'border-[#cbd5e1]'}`} />{errors[field] && <p id={`lookup-${field}-error`} role="alert" className="mt-1 text-xs text-rose-600">{errors[field]}</p>}</div>)}</div>
      <button type="submit" disabled={loading} className="mt-6 h-11 w-full rounded-lg bg-[#0284c7] text-sm font-semibold text-white hover:bg-[#0369a1] disabled:opacity-50">{loading ? 'Đang tra cứu...' : 'Tra cứu chuyến bay'}</button>
      {requestError && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{requestError}</p>}
      <p className="mt-4 text-xs leading-5 text-[#64748b]">Hệ thống chỉ trả thông tin chuyến bay sau khi xác minh đủ ba trường; không hiển thị dữ liệu hành khách hoặc thanh toán.</p>
    </form>
    <section aria-label="Kết quả tra cứu" className="space-y-4">{loading && <div role="status" className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">Đang xác minh và tải chuyến bay...</div>}{flights === null && !loading && <div className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e0f2fe] text-2xl text-[#0284c7]">✈</div><h2 className="mt-4 font-semibold text-[#0f172a]">Chuyến bay của bạn sẽ hiển thị tại đây</h2><p className="mt-2 text-sm text-[#64748b]">Điền thông tin bên trái để tra cứu.</p></div>}{flights && <><h2 className="text-lg font-bold text-[#0f172a]">Kết quả chuyến bay ({flights.length})</h2>{flights.length ? flights.map(flight => <FlightCard key={flight.chuyenBayId} flight={flight} />) : <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">Đặt chỗ đã xác minh nhưng chưa có chuyến bay để hiển thị.</div>}</>}</section></div>
  </div></div>;
}
