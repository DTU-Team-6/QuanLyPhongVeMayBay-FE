import { useEffect, useState } from 'react';
import { ticketService } from '../ticketService';

export default function TicketCancelDialog({ ticket, onClose, onCancelled }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function onEscape(event) {
      if (event.key === 'Escape' && !submitting) onClose();
    }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose, submitting]);

  const alreadyCancelled = ticket.trangThai === 'DA_HUY';
  const cancellable = ticket.trangThai === 'CHO_THANH_TOAN';

  async function handleConfirm() {
    if (!cancellable || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await ticketService.cancel(ticket.id);
      onCancelled?.(result);
    } catch (requestError) {
      if (requestError?.code === 'TICKET_ALREADY_CANCELLED') {
        setError('Vé này đã bị hủy trước đó.');
      } else if (requestError?.code === 'TICKET_NOT_CANCELLABLE') {
        setError('Chỉ có thể hủy vé thuộc đặt chỗ chưa thanh toán.');
      } else if (requestError?.status === 404 || requestError?.status === 405) {
        setError('API hủy vé chưa khả dụng trên Backend hiện tại.');
      } else {
        setError(requestError?.message || 'Không thể hủy vé. Vui lòng thử lại.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-ticket-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600" aria-hidden="true">!</div>
        <h2 id="cancel-ticket-title" className="text-lg font-bold text-[#172137]">Xác nhận hủy vé</h2>
        <p className="mt-2 text-sm leading-6 text-[#52637d]">
          Vé <strong>{ticket.maVe}</strong> của <strong>{ticket.tenNguoiDi}</strong>
          {ticket.maDatCho ? `, mã đặt chỗ ${ticket.maDatCho}` : ''}.
        </p>
        {!cancellable && (
          <div role="status" className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
            {alreadyCancelled ? 'Vé này đã hủy.' : 'Chỉ có thể hủy vé đang ở trạng thái chờ thanh toán.'}
          </div>
        )}
        {cancellable && (
          <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50/70 p-3 text-xs leading-5 text-rose-700">
            Hành động này sẽ chuyển trạng thái vé sang <strong>Đã hủy</strong> và không thể hoàn tác.
          </p>
        )}
        {error && (
          <div role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            autoFocus={!cancellable}
            className="rounded-lg border border-[#c9d7e7] px-4 py-2 text-sm font-semibold text-[#33435e] disabled:opacity-50"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={!cancellable || submitting}
            onClick={handleConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Đang hủy...' : 'Hủy vé'}
          </button>
        </div>
      </div>
    </div>
  );
}
