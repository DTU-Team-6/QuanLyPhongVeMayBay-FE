import { useEffect } from 'react';

export default function TicketCancelDialog({ ticket, onClose }) {
  useEffect(() => {
    function onEscape(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose]);

  const alreadyCancelled = ticket.trangThai === 'DA_HUY';
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-labelledby="cancel-ticket-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600" aria-hidden="true">!</div>
      <h2 id="cancel-ticket-title" className="text-lg font-bold text-[#172137]">Xác nhận hủy vé</h2>
      <p className="mt-2 text-sm leading-6 text-[#52637d]">Vé <strong>{ticket.maVe}</strong> của <strong>{ticket.tenNguoiDi}</strong>{ticket.maDatCho ? `, mã đặt chỗ ${ticket.maDatCho}` : ''}.</p>
      <div role="status" className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
        {alreadyCancelled ? 'Vé này đã hủy.' : 'Backend develop chưa cung cấp API hủy vé và quy tắc hoàn tiền. Chưa thể gửi yêu cầu hủy vé.'}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} autoFocus className="rounded-lg border border-[#c9d7e7] px-4 py-2 text-sm font-semibold text-[#33435e]">Đóng</button>
        <button type="button" disabled className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white opacity-50">Hủy vé</button>
      </div>
    </div>
  </div>;
}
