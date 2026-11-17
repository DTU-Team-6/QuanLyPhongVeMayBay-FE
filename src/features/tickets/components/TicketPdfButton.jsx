import { useState } from 'react';
import { ticketService, pdfFilename } from '../ticketService';

export default function TicketPdfButton({ ticket, disabled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function download() {
    if (disabled || loading) return;
    setLoading(true);
    setError('');
    try {
      const { blob, contentType, disposition } = await ticketService.downloadPdf(ticket.id);
      if (!contentType.toLowerCase().includes('application/pdf') || !blob.size) {
        throw new Error('Máy chủ không trả về tệp PDF hợp lệ.');
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFilename(disposition, ticket.id);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (requestError) {
      setError(requestError.code === 'TICKET_SNAPSHOT_MISSING'
        ? 'Vé chưa có dữ liệu PDF để xuất.'
        : requestError.status === 401 || requestError.status === 403
          ? 'Phiên đăng nhập không hợp lệ hoặc tài khoản không có quyền in vé.'
          : requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return <span className="inline-flex flex-col items-start"><button type="button" disabled={disabled || loading} onClick={download} className="whitespace-nowrap font-semibold text-[#0284c7] disabled:opacity-50">{loading ? 'Đang xuất...' : 'In vé'}</button>{error && <span role="alert" className="mt-1 max-w-40 text-xs text-rose-600">{error}</span>}</span>;
}
