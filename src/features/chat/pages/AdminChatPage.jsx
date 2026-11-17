import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../../components/layout/AdminShell';
import { useAuth } from '../../../context/AuthContext';
import { chatService } from '../chatService';
import ChatMessages from '../components/ChatMessages';
import ChatComposer from '../components/ChatComposer';

function mergeMessages(previous, incoming) {
  const byId = new Map(previous.map(message => [message.id, message]));
  incoming.forEach(message => byId.set(message.id, message));
  return [...byId.values()];
}

export default function AdminChatPage() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.vaiTro === 'ADMIN';
  const [conversations, setConversations] = useState([]);
  const [conversationPage, setConversationPage] = useState(0);
  const [conversationTotal, setConversationTotal] = useState(0);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState('');
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(0);
  const [messageTotal, setMessageTotal] = useState(0);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [olderLoading, setOlderLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const request = useRef(0);

  const loadConversations = useCallback(async (page = 0, quiet = false) => {
    if (!isAdmin) return;
    if (!quiet) setConversationsLoading(true);
    try {
      const result = await chatService.conversations(page);
      setConversations(result.content);
      setConversationPage(page);
      setConversationTotal(result.totalPages);
      setConversationsError('');
    } catch (error) {
      setConversationsError(error.message || 'Không tải được danh sách hội thoại.');
    } finally {
      setConversationsLoading(false);
    }
  }, [isAdmin]);

  const loadMessages = useCallback(async (customerId, page = 0, quiet = false) => {
    if (!isAdmin || !customerId) return;
    const serial = ++request.current;
    if (page > 0) setOlderLoading(true);
    else if (!quiet) setMessagesLoading(true);
    try {
      const result = await chatService.adminHistory(customerId, page);
      if (serial !== request.current) return;
      setMessages(previous => page === 0 && !quiet ? result.content : mergeMessages(previous, result.content));
      if (!quiet) setMessagePage(page);
      setMessageTotal(result.totalPages);
      setMessagesError('');
    } catch (error) {
      if (serial === request.current) setMessagesError(error.message || 'Không tải được tin nhắn.');
    } finally {
      if (serial === request.current) { setMessagesLoading(false); setOlderLoading(false); }
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadConversations();
    const timer = window.setInterval(() => loadConversations(conversationPage, true), 10000);
    return () => window.clearInterval(timer);
  }, [isAdmin, conversationPage, loadConversations]);

  useEffect(() => {
    if (!selected || !isAdmin) return;
    setMessages([]);
    setMessagePage(0);
    loadMessages(selected.khachHangId);
    const timer = window.setInterval(() => loadMessages(selected.khachHangId, 0, true), 10000);
    return () => { window.clearInterval(timer); request.current += 1; };
  }, [selected, isAdmin, loadMessages]);

  async function send(content) {
    const saved = await chatService.sendAdmin(selected.khachHangId, content);
    if (saved?.id) setMessages(previous => mergeMessages(previous, [saved]));
    await loadMessages(selected.khachHangId, 0, true);
  }

  return <AdminShell user={user} activeKey="chat">
    <div className="mb-6 text-xs text-slate-500">Quản trị / Chat với khách hàng</div>
    <h1 className="text-2xl font-bold text-slate-900">Hội thoại khách hàng</h1>
    <p className="mt-1 text-sm text-slate-500">Xem lịch sử và trả lời khách hàng đã đăng nhập.</p>
    {authLoading && <p role="status" className="mt-6 text-sm">Đang kiểm tra quyền truy cập...</p>}
    {!authLoading && !isAdmin && <div role="alert" className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">Chỉ Admin được xem lịch sử hội thoại. <Link to="/dang-nhap?next=/quan-ly-chat" className="font-semibold underline">Đăng nhập Admin</Link></div>}
    {isAdmin && <div className="mt-6 grid min-h-[580px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[290px_minmax(0,1fr)]">
      <aside className={`border-b border-slate-200 md:border-b-0 md:border-r ${selected ? 'hidden md:block' : ''}`}><div className="flex items-center justify-between border-b border-slate-200 px-4 py-4"><h2 className="font-semibold">Cuộc hội thoại</h2><button type="button" onClick={() => loadConversations(conversationPage)} className="text-xs font-semibold text-[#0284c7]">Tải lại</button></div>
        {conversationsLoading && <p role="status" className="p-4 text-sm text-slate-500">Đang tải danh sách...</p>}
        {conversationsError && <p role="alert" className="p-4 text-sm text-rose-600">{conversationsError}</p>}
        {!conversationsLoading && !conversationsError && !conversations.length && <p className="p-4 text-sm text-slate-500">Chưa có hội thoại.</p>}
        <div className="max-h-[500px] overflow-y-auto">{conversations.map(item => <button key={item.khachHangId} type="button" onClick={() => setSelected(item)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-sky-50 ${selected?.khachHangId === item.khachHangId ? 'bg-sky-50' : ''}`}><span className="block truncate text-sm font-semibold text-slate-800">{item.hoTen || `Khách hàng #${item.khachHangId}`}</span><span className="block truncate text-xs text-slate-500">{item.email}</span></button>)}</div>
        {conversationTotal > 1 && <div className="flex items-center justify-between p-3 text-xs"><button type="button" disabled={conversationPage === 0 || conversationsLoading} onClick={() => loadConversations(conversationPage - 1)} className="text-[#0284c7] disabled:opacity-40">Trước</button><span>{conversationPage + 1}/{conversationTotal}</span><button type="button" disabled={conversationPage + 1 >= conversationTotal || conversationsLoading} onClick={() => loadConversations(conversationPage + 1)} className="text-[#0284c7] disabled:opacity-40">Sau</button></div>}
      </aside>
      <section className={`min-w-0 ${selected ? 'flex' : 'hidden md:flex'} h-[580px] flex-col`} aria-label="Nội dung hội thoại">
        {selected ? <><div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><button type="button" onClick={() => setSelected(null)} className="text-sm text-[#0284c7] md:hidden">← Trở lại</button><div><h2 className="font-semibold">{selected.hoTen || `Khách hàng #${selected.khachHangId}`}</h2><p className="text-xs text-slate-500">{selected.email}</p></div></div><ChatMessages viewerRole="ADMIN" messages={messages} loading={messagesLoading} error={messagesError} onRetry={() => loadMessages(selected.khachHangId, messagePage)} onOlder={() => loadMessages(selected.khachHangId, messagePage + 1)} hasOlder={messagePage + 1 < messageTotal} loadingOlder={olderLoading} /><ChatComposer key={selected.khachHangId} onSend={send} /></> : <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-500">Chọn một hội thoại để xem và trả lời.</div>}
      </section>
    </div>}
  </AdminShell>;
}
