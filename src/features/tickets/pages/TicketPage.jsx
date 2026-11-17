import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../../components/layout/AdminShell';
import { useAuth } from '../../../context/AuthContext';
import { ticketService, TICKET_SEARCH_OPTIONS, TICKET_STATES } from '../ticketService';
import TicketEditDialog from '../components/TicketEditDialog';
import TicketCancelDialog from '../components/TicketCancelDialog';
import TicketPdfButton from '../components/TicketPdfButton';

const PAGE_SIZE = 20;
const initialFilter = { trang: 0, kichThuoc: PAGE_SIZE };
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

function dateLabel(value) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function Status({ value }) {
  const labels = { CHO_THANH_TOAN: 'Chờ thanh toán', DA_THANH_TOAN: 'Đã thanh toán', DA_HUY: 'Đã hủy' };
  const color = value === 'DA_THANH_TOAN' ? 'bg-emerald-50 text-emerald-700' : value === 'DA_HUY' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700';
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${color}`}>{labels[value] || value || '—'}</span>;
}

export default function TicketPage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.vaiTro === 'ADMIN' || user?.vaiTro === 'NHAN_VIEN';
  const [searchBy, setSearchBy] = useState('MA_DAT_CHO');
  const [keyword, setKeyword] = useState('');
  const [state, setState] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [editTicket, setEditTicket] = useState(null);
  const [cancelTicket, setCancelTicket] = useState(null);

  const reload = useCallback(async () => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await ticketService.list(filter);
      setPage(result);
    } catch (requestError) {
      setPage(null);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [canManage, filter]);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => {
    if (!canManage) return;
    let active = true;
    Promise.all([
      ticketService.list({ trang: 0, kichThuoc: 1 }),
      ticketService.list({ trangThai: 'CHO_THANH_TOAN', trang: 0, kichThuoc: 1 }),
      ticketService.list({ trangThai: 'DA_THANH_TOAN', trang: 0, kichThuoc: 1 }),
    ]).then(([all, pending, issued]) => {
      if (active) setSummary({ all: all.totalElements, pending: pending.totalElements, issued: issued.totalElements });
    }).catch(() => { if (active) setSummary(null); });
    return () => { active = false; };
  }, [canManage, notice]);

  function search(event) {
    event.preventDefault();
    if (!canManage) return;
    const term = keyword.trim();
    setFilter({ ...initialFilter, ...(state ? { trangThai: state } : {}), ...(term ? { tieuChi: searchBy, tuKhoa: term } : {}) });
  }

  function reset() {
    setKeyword(''); setState(''); setSearchBy('MA_DAT_CHO'); setFilter(initialFilter);
  }

  const rows = page?.content || [];
  const total = page?.totalElements ?? 0;
  const currentPage = page?.pageNumber ?? filter.trang;
  const pages = page?.totalPages ?? 0;
  const start = total ? currentPage * PAGE_SIZE + 1 : 0;
  const end = Math.min((currentPage + 1) * PAGE_SIZE, total);

  return <AdminShell user={user} activeKey="tickets">
    <div className="mb-7 flex flex-wrap justify-between gap-2 text-xs text-[#667895]"><span>Quản trị / Quản lý bán vé</span><span>Vân Việt • HCM</span></div>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-[24px] font-bold tracking-tight">Quản lý bán vé</h1><p className="mt-1 text-sm text-[#667895]">Theo dõi đơn đặt chỗ, cập nhật vé và xuất vé điện tử.</p></div>
      <Link to="/chuyen-bay" className="rounded-lg bg-[#0284c7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0369a1]">Tìm vé trống</Link>
    </div>
    {!authLoading && !canManage && <div role="alert" className="mb-5 rounded-lg border border-[#bae6fd] bg-[#e0f2fe] p-4 text-sm text-[#075985]">Cần đăng nhập bằng tài khoản Admin hoặc Nhân viên để quản lý bán vé. <Link to="/dang-nhap" className="font-semibold underline">Đến trang đăng nhập</Link></div>}
    {authLoading && <p role="status" className="mb-5 text-sm text-[#667895]">Đang kiểm tra phiên đăng nhập...</p>}
    {notice && <div role="status" className="mb-5 rounded-lg border border-[#a7e6c5] bg-[#ecfdf5] p-4 text-sm text-[#047857]">{notice}</div>}
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {[['Đơn đặt chỗ', summary?.all], ['Chờ thanh toán', summary?.pending], ['Đã xuất vé', summary?.issued]].map(([label, count]) => <div key={label} className="rounded-xl border border-[#dce5ef] bg-white p-5 shadow-sm"><div className="text-xs font-medium text-[#667895]">{label}</div><div className="mt-2 text-2xl font-bold text-[#172137]">{count ?? '—'}</div></div>)}
    </div>
    <form onSubmit={search} className="mb-6 grid gap-4 rounded-xl border border-[#dce5ef] bg-white p-5 shadow-sm md:grid-cols-[180px_minmax(0,1fr)_180px_auto_auto] md:items-end">
      <label className="text-xs font-semibold text-[#33435e]">Tìm theo<select disabled={!canManage || loading} value={searchBy} onChange={event => setSearchBy(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] bg-white px-3 text-sm font-normal disabled:opacity-50">{TICKET_SEARCH_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <label className="text-xs font-semibold text-[#33435e]">Từ khóa<input disabled={!canManage || loading} maxLength={40} value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Nhập mã vé, mã đặt chỗ hoặc tên" className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] px-3 text-sm font-normal disabled:opacity-50" /></label>
      <label className="text-xs font-semibold text-[#33435e]">Trạng thái<select disabled={!canManage || loading} value={state} onChange={event => setState(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] bg-white px-3 text-sm font-normal disabled:opacity-50">{TICKET_STATES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <button disabled={!canManage || loading} className="h-10 rounded-lg bg-[#0284c7] px-5 text-sm font-semibold text-white disabled:opacity-50">Tìm</button>
      <button type="button" disabled={!canManage || loading} onClick={reset} className="h-10 rounded-lg border border-[#c9d7e7] px-4 text-sm font-semibold text-[#33435e] disabled:opacity-50">Đặt lại</button>
    </form>
    <div className="overflow-hidden rounded-xl border border-[#dce5ef] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] px-5 py-4"><h2 className="text-sm font-bold">Danh sách vé</h2><span className="text-xs text-[#667895]">{page ? `${total} vé` : 'Dữ liệu từ hệ thống'}</span></div>
      {error && <div role="alert" className="m-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error.status === 404 || error.status === 405 ? 'API danh sách vé chưa khả dụng trên Backend đang kết nối.' : error.message}<button type="button" onClick={reload} className="ml-3 font-semibold underline">Thử lại</button></div>}
      {loading && <p role="status" className="p-8 text-center text-sm text-[#667895]">Đang tải danh sách vé...</p>}
      {!loading && page && !rows.length && <div className="px-5 py-14 text-center"><div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#e0f2fe] text-xl text-[#0284c7]">◫</div><h3 className="font-semibold">Chưa có vé bán</h3><p className="mt-2 text-sm text-[#667895]">Không có vé phù hợp với bộ lọc hiện tại.</p><Link to="/chuyen-bay" className="mt-4 inline-block text-sm font-semibold text-[#0284c7]">Nhập vé bán</Link></div>}
      {!loading && rows.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead className="bg-[#f5f8fc] text-xs font-semibold text-[#667895]"><tr>{['STT', 'Tên người đi', 'Mã đặt chỗ', 'Tuyến bay', 'Ngày đi', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(column => <th key={column} scope="col" className="px-4 py-3">{column}</th>)}</tr></thead><tbody>{rows.map((ticket, index) => <tr key={ticket.id} className="border-t border-[#e9eef5]"><td className="px-4 py-4 text-[#667895]">{start + index}</td><td className="px-4 py-4 font-semibold">{ticket.tenNguoiDi || '—'}<div className="text-xs font-normal text-[#667895]">{ticket.maVe}</div></td><td className="px-4 py-4">{ticket.maDatCho || '—'}</td><td className="px-4 py-4">{ticket.maSanBayDi} → {ticket.maSanBayDen}<div className="text-xs text-[#667895]">{ticket.maChuyenBay}</div></td><td className="px-4 py-4">{dateLabel(ticket.ngayDi)}</td><td className="px-4 py-4 font-semibold">{ticket.tongGia == null ? '—' : money.format(ticket.tongGia)}</td><td className="px-4 py-4"><Status value={ticket.trangThai} /></td><td className="px-4 py-4"><div className="flex items-center gap-2"><button type="button" disabled={!canManage} onClick={() => setEditTicket(ticket)} className="font-semibold text-[#0284c7] disabled:opacity-50">Sửa</button><button type="button" disabled={!canManage} onClick={() => setCancelTicket(ticket)} className="font-semibold text-rose-600 disabled:opacity-50">Xóa</button><TicketPdfButton ticket={ticket} disabled={!canManage} /></div></td></tr>)}</tbody></table></div>}
      {page && pages > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] px-5 py-4 text-xs text-[#667895]"><span>Hiển thị {start}–{end} / {total} vé</span><div className="flex items-center gap-2"><button type="button" disabled={currentPage === 0 || loading} onClick={() => setFilter(value => ({ ...value, trang: value.trang - 1 }))} className="rounded border border-[#c9d7e7] px-3 py-1.5 disabled:opacity-40">Trước</button><span>Trang {currentPage + 1} / {pages}</span><button type="button" disabled={currentPage + 1 >= pages || loading} onClick={() => setFilter(value => ({ ...value, trang: value.trang + 1 }))} className="rounded border border-[#c9d7e7] px-3 py-1.5 disabled:opacity-40">Sau</button></div></div>}
    </div>
    {editTicket && <TicketEditDialog ticket={editTicket} onClose={() => setEditTicket(null)} onSaved={() => { setEditTicket(null); setNotice('Cập nhật vé thành công.'); reload(); }} />}
    {cancelTicket && <TicketCancelDialog ticket={cancelTicket} onClose={() => setCancelTicket(null)} />}
  </AdminShell>;
}
