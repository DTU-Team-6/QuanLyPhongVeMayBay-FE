import { useState } from 'react';
import closeIcon from '../../../assets/employees/close.svg';
import trashIcon from '../../../assets/employees/trash.svg';
import trashWhiteIcon from '../../../assets/employees/trashWhite.svg';
import warningIcon from '../../../assets/employees/warning.svg';

export default function EmployeeDeleteDialog({ employee, onCancel, onConfirm }) {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function confirm() {
    if (saving) return;
    setSaving(true);
    setErrorMessage('');
    try {
      await onConfirm(employee);
    } catch (error) {
      setErrorMessage(error.message || 'Không thể xóa nhân viên. Vui lòng thử lại.');
      setSaving(false);
    }
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onCancel(); }}>
    <section role="alertdialog" aria-modal="true" aria-labelledby="employee-delete-title" aria-describedby="employee-delete-description" className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(15,23,42,0.19)]">
      <header className="flex items-center justify-between border-b border-[#e2e8f0] p-6"><h2 id="employee-delete-title" className="text-xl font-semibold text-[#0f172a]">Xác nhận xóa nhân viên</h2><button type="button" onClick={onCancel} disabled={saving} aria-label="Đóng hộp thoại" className="rounded p-1 hover:bg-[#f1f5f9] disabled:opacity-50"><img src={closeIcon} alt="" className="size-5" /></button></header>
      <div className="space-y-5 p-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#fef2f2]"><img src={trashIcon} alt="" className="size-6" /></span>
        <p id="employee-delete-description" className="text-base font-semibold text-[#0f172a]">Bạn có chắc chắn muốn xóa nhân viên {employee.maNhanVien} - {employee.hoTen}?</p>
        <p className="text-sm text-[#64748b]">Tài khoản này sẽ không thể đăng nhập vào hệ thống. Dữ liệu vé đã bán và báo cáo doanh thu vẫn được giữ lại.</p>
        <div className="flex items-start gap-3 rounded-lg bg-[#fffbeb] p-4 text-[13px] text-[#92400e]"><img src={warningIcon} alt="" className="mt-0.5 size-[18px]" /><span>Thao tác này không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.</span></div>
        {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
      </div>
      <footer className="flex justify-end gap-3 bg-[#f8fafc] px-6 py-4"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm font-semibold text-[#334155] hover:bg-[#f1f5f9] disabled:opacity-50">Hủy</button><button type="button" onClick={confirm} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#ef4444] px-4 text-sm font-semibold text-white hover:bg-[#dc2626] disabled:opacity-50"><img src={trashWhiteIcon} alt="" className="size-4" />{saving ? 'Đang xóa...' : 'Xác nhận xóa'}</button></footer>
    </section>
  </div>;
}
