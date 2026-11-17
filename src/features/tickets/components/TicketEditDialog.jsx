import { useEffect, useState } from 'react';
import { ticketService, validateTicketEdit } from '../ticketService';

export default function TicketEditDialog({ ticket, onClose, onSaved }) {
  const [name, setName] = useState(ticket.tenNguoiDi || '');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [saving, setSaving] = useState(false);
  const editable = ticket.trangThai === 'CHO_THANH_TOAN';

  useEffect(() => {
    function onEscape(event) { if (event.key === 'Escape' && !saving) onClose(); }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose, saving]);

  async function save(event) {
    event.preventDefault();
    if (saving || !editable) return;
    const payload = { hoTenNguoiDi: name.trim(), emailThanhToan: email.trim() };
    const validation = validateTicketEdit(payload);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setRequestError('');
    try {
      await ticketService.update(ticket.id, payload);
      onSaved();
    } catch (error) {
      const fieldErrors = {};
      for (const item of error.details || []) {
        if (item.field === 'hoTenNguoiDi' || item.field === 'emailThanhToan') fieldErrors[item.field] = item.message;
      }
      setErrors(fieldErrors);
      setRequestError(error.code === 'TICKET_NOT_EDITABLE'
        ? 'Vé hoặc đơn đặt chỗ không còn ở trạng thái chờ thanh toán nên không thể sửa.'
        : error.status === 401 || error.status === 403
          ? 'Phiên đăng nhập không hợp lệ hoặc tài khoản không có quyền sửa vé.'
          : error.message);
    } finally {
      setSaving(false);
    }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-labelledby="edit-ticket-title" className="w-full max-w-[430px] rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="edit-ticket-title" className="text-lg font-bold text-[#172137]">Sửa nhanh vé</h2><p className="mt-1 text-xs text-[#667895]">{ticket.maDatCho || ticket.maVe} • {ticket.maSanBayDi} → {ticket.maSanBayDen}</p></div><button type="button" disabled={saving} onClick={onClose} aria-label="Đóng" className="text-xl leading-none text-[#667895]">×</button></div>
      <div className="mt-4 text-xs font-semibold text-amber-700">{editable ? '● Chờ thanh toán' : 'Vé không ở trạng thái chờ thanh toán'}</div>
      {!editable && <p role="alert" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Backend chỉ cho sửa khi vé và đơn đặt chỗ đều đang chờ thanh toán.</p>}
      {requestError && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{requestError}</p>}
      <form onSubmit={save} noValidate>
        <label className="mt-5 block text-xs font-semibold text-[#33435e]">Tên người đi *<input value={name} onChange={event => setName(event.target.value)} disabled={saving || !editable} maxLength={50} aria-invalid={!!errors.hoTenNguoiDi} className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] px-3 text-sm font-normal disabled:bg-slate-50" /></label>
        {errors.hoTenNguoiDi && <p role="alert" className="mt-1 text-xs text-rose-600">{errors.hoTenNguoiDi}</p>}
        <label className="mt-4 block text-xs font-semibold text-[#33435e]">Email thanh toán *<input type="email" value={email} onChange={event => setEmail(event.target.value)} disabled={saving || !editable} maxLength={100} aria-invalid={!!errors.emailThanhToan} placeholder="Nhập email thanh toán" className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] px-3 text-sm font-normal disabled:bg-slate-50" /></label>
        {errors.emailThanhToan && <p role="alert" className="mt-1 text-xs text-rose-600">{errors.emailThanhToan}</p>}
        <p className="mt-4 rounded-lg border border-[#bae6fd] bg-[#e0f2fe] p-3 text-xs leading-5 text-[#075985]">API danh sách chưa trả email thanh toán hiện tại. Vui lòng nhập email chính xác trước khi lưu; yêu cầu cập nhật sẽ gửi cả tên và email.</p>
        <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-[#c9d7e7] px-4 py-2 text-sm font-semibold text-[#33435e]">Hủy</button><button type="submit" disabled={!editable || saving} className="rounded-lg bg-[#0284c7] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button></div>
      </form>
    </div>
  </div>;
}
