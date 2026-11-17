import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { chatService } from '../chatService';
import ChatMessages from './ChatMessages';
import ChatComposer from './ChatComposer';

function mergeMessages(previous, incoming) {
  const byId = new Map(previous.map(message => [message.id, message]));
  incoming.forEach(message => byId.set(message.id, message));
  return [...byId.values()];
}

export default function CustomerChatWidget() {
  const { user, loading: authLoading } = useAuth();
  const [view, setView] = useState('closed');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasOlder, setHasOlder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState('');
  const serial = useRef(0);
  const isCustomer = user?.vaiTro === 'KHACH_HANG';

  const load = useCallback(async (requestedPage = 0, quiet = false) => {
    if (!isCustomer) return;
    const current = ++serial.current;
    if (requestedPage > 0) setLoadingOlder(true);
    else if (!quiet) setLoading(true);
    if (!quiet) setError('');
    try {
      const result = await chatService.customerHistory(requestedPage);
      if (current !== serial.current) return;
      setMessages(previous => requestedPage === 0 && !quiet ? result.content : mergeMessages(previous, result.content));
      if (!quiet) setPage(requestedPage);
      if (!quiet) setHasOlder(requestedPage + 1 < result.totalPages);
    } catch (requestError) {
      if (current === serial.current) setError(requestError.message || 'Không tải được hội thoại.');
    } finally {
      if (current === serial.current) { setLoading(false); setLoadingOlder(false); }
    }
  }, [isCustomer]);

  useEffect(() => {
    if (view !== 'open' || !isCustomer) return;
    load(0);
    const timer = window.setInterval(() => load(0, true), 10000);
    return () => { window.clearInterval(timer); serial.current += 1; };
  }, [view, isCustomer, load]);

  async function send(content) {
    const saved = await chatService.sendCustomer(content);
    if (saved?.id) setMessages(previous => mergeMessages(previous, [saved]));
    await load(0, true);
  }

  if (view === 'closed') return <button type="button" onClick={() => setView('open')} aria-label="Mở chat hỗ trợ" className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-xl hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l2-3.2A7.5 7.5 0 1 1 20 11.5Z" /></svg></button>;

  return <section aria-label="Chat hỗ trợ Vân Việt" className={`fixed bottom-4 right-4 z-50 flex w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${view === 'open' ? 'h-[min(560px,calc(100dvh-32px))]' : ''}`}>
    <div className="flex items-center justify-between bg-[#0284c7] px-4 py-3 text-white"><div><h2 className="font-bold">Chat với Admin</h2><p className="text-xs text-sky-100">Vân Việt • Hỗ trợ khách hàng</p></div><div className="flex gap-1"><button type="button" onClick={() => setView(view === 'open' ? 'minimized' : 'open')} aria-label={view === 'open' ? 'Thu nhỏ chat' : 'Mở rộng chat'} className="rounded p-2 hover:bg-white/15">{view === 'open' ? '−' : '▢'}</button><button type="button" onClick={() => setView('closed')} aria-label="Đóng chat" className="rounded p-2 hover:bg-white/15">×</button></div></div>
    {view === 'open' && (authLoading ? <p role="status" className="p-5 text-sm text-slate-500">Đang kiểm tra phiên đăng nhập...</p> : isCustomer ? <><ChatMessages messages={messages} loading={loading} error={error} onRetry={() => load(page)} onOlder={() => load(page + 1)} hasOlder={hasOlder} loadingOlder={loadingOlder} /><ChatComposer onSend={send} /></> : <div className="flex-1 p-5 text-sm text-slate-600">{user?.vaiTro === 'ADMIN' ? <><p>Quản trị viên xem và trả lời hội thoại tại trang quản lý.</p><Link to="/quan-ly-chat" className="mt-3 inline-block font-semibold text-[#0284c7] underline">Mở hộp thư Admin</Link></> : user ? <p>Chat hỗ trợ dành cho tài khoản Khách hàng.</p> : <><p>Đăng nhập tài khoản Khách hàng để gửi tin và xem lịch sử.</p><Link to="/dang-nhap" className="mt-3 inline-block font-semibold text-[#0284c7] underline">Đăng nhập</Link></>}</div>)}
  </section>;
}
