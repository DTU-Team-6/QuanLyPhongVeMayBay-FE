import { useState } from 'react';
import closeIcon from '../../../assets/employees/close.svg';
import trashIcon from '../../../assets/employees/trash.svg';
import trashWhiteIcon from '../../../assets/employees/trashWhite.svg';
import warningIcon from '../../../assets/employees/warning.svg';
import { formatNewsCode } from '../newsTypes';

/**
 * Hộp thoại xác nhận xóa tin tức (99.4.2) theo đúng mẫu thiết kế.
 */
export default function NewsDeleteDialog({ newsItem, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!newsItem) return null;

  const maTin = formatNewsCode(newsItem.id, newsItem.maTin);

  async function handleConfirm() {
    if (deleting) return;
    setDeleting(true);
    setErrorMessage('');
    try {
      await onConfirm(newsItem);
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể xóa tin tức lúc này. Vui lòng thử lại.');
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="news-delete-title"
        aria-describedby="news-delete-description"
        className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
      >
        <header className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 id="news-delete-title" className="text-[18px] font-bold text-[#0f172a]">
            Xác nhận xóa tin tức
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Đóng hộp thoại"
            className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-50 cursor-pointer"
          >
            <img src={closeIcon} alt="" className="size-4" />
          </button>
        </header>

        <div className="space-y-4 p-6">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#fef2f2]">
            <img src={trashIcon} alt="" className="size-5" />
          </span>

          <p id="news-delete-description" className="text-[15px] font-bold leading-snug text-[#0f172a]">
            Bạn có chắc chắn muốn xóa tin {maTin} – {newsItem.tieuDe}?
          </p>

          <p className="text-[13px] leading-relaxed text-[#64748b]">
            Bài viết sẽ bị xóa khỏi hệ thống và không còn hiển thị trên trang Tin tức của khách hàng.
          </p>

          <div className="flex items-start gap-2.5 rounded-xl border border-[#fde68a] bg-[#fffbeb] p-3.5 text-[12px] text-[#92400e]">
            <img src={warningIcon} alt="" className="mt-0.5 size-4 shrink-0" />
            <span>
              Thao tác này không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
            </span>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">
              {errorMessage}
            </p>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-[#f1f5f9] bg-[#f8fafc] px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="h-10 rounded-lg border border-[#cbd5e1] bg-white px-4 text-[13px] font-semibold text-[#334155] hover:bg-[#f1f5f9] disabled:opacity-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0284c7] px-4 text-[13px] font-semibold text-white hover:bg-[#0369a1] disabled:opacity-50 cursor-pointer"
          >
            <img src={trashWhiteIcon} alt="" className="size-4" />
            <span>{deleting ? 'Đang xóa...' : 'Xác nhận xóa'}</span>
          </button>
        </footer>
      </section>
    </div>
  );
}
