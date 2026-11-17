import { useState } from 'react';
import { validateMessage } from '../chatUtils';

export default function ChatComposer({ onSend, disabled }) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (sending || disabled) return;
    const validation = validateMessage(draft);
    if (validation) { setError(validation); return; }
    setSending(true);
    setError('');
    try {
      await onSend(draft.trim());
      setDraft('');
    } catch (requestError) {
      setError(requestError.status === 401 || requestError.status === 403
        ? 'Phiên đăng nhập đã hết hạn hoặc tài khoản không có quyền gửi tin nhắn.'
        : requestError.message || 'Không gửi được tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  }

  return <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3">
    {error && <p role="alert" className="mb-2 text-xs text-rose-600">{error}</p>}
    <div className="flex items-end gap-2"><label className="sr-only" htmlFor="chat-message">Tin nhắn</label><textarea id="chat-message" rows={2} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} disabled={disabled || sending} placeholder="Nhập tin nhắn..." className="min-h-11 max-h-28 flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0284c7] disabled:bg-slate-50" /><button type="submit" disabled={disabled || sending || !draft.trim()} className="min-h-11 rounded-xl bg-[#0284c7] px-4 text-sm font-semibold text-white disabled:opacity-50">{sending ? 'Đang gửi' : 'Gửi'}</button></div>
  </form>;
}
