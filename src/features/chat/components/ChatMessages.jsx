import { messageTime, sortMessages } from '../chatUtils';

export default function ChatMessages({ messages, loading, error, onRetry, onOlder, hasOlder, loadingOlder, viewerRole = 'KHACH_HANG' }) {
  return <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] px-4 py-3" aria-live="polite">
    {hasOlder && <button type="button" disabled={loadingOlder} onClick={onOlder} className="mx-auto mb-3 block text-xs font-semibold text-[#0284c7] disabled:opacity-50">{loadingOlder ? 'Đang tải...' : 'Xem tin nhắn cũ hơn'}</button>}
    {loading && <p role="status" className="py-4 text-center text-sm text-slate-500">Đang tải hội thoại...</p>}
    {error && <div role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}<button type="button" onClick={onRetry} className="ml-2 font-semibold underline">Thử lại</button></div>}
    {!loading && !error && !messages.length && <p className="py-10 text-center text-sm text-slate-500">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.</p>}
    <div className="space-y-3">{sortMessages(messages).map(message => {
      const own = message.nguoiGuiVaiTro === viewerRole;
      return <div key={message.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-5 ${own ? 'rounded-br-sm bg-[#0284c7] text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'}`}><p className="whitespace-pre-wrap break-words">{message.noiDung}</p><time dateTime={message.guiLuc} className={`mt-1 block text-[10px] ${own ? 'text-sky-100' : 'text-slate-500'}`}>{messageTime(message.guiLuc)}</time></div></div>;
    })}</div>
  </div>;
}
