export default function TicketEditDialog({ onClose }) {
  return <div role="dialog" aria-modal="true" aria-label="Sửa vé" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><div className="rounded-xl bg-white p-6"><p>Form sửa vé đang được triển khai.</p><button type="button" onClick={onClose}>Đóng</button></div></div>;
}
