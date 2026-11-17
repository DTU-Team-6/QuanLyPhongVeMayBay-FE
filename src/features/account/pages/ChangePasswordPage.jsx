import { useState } from 'react';
import AccountPageLayout from '../components/AccountPageLayout';

function PasswordField({ label, name, value, onChange, error }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">{label} *</span>
      <span className="relative block">
        <input
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-10 w-full rounded-[8px] border bg-white px-3 pr-10 text-[13px] text-[#0f172a] outline-none focus:border-[#0284c7] ${error ? 'border-red-500' : 'border-[#cbd5e1]'}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#64748b]"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {visible ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" strokeWidth={1.7} />
              </>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.3 0 9.5 6 9.5 6a16 16 0 0 1-3.2 3.8M6.2 6.9C3.8 8.5 2.5 12 2.5 12s3.2 6 9.5 6c1 0 1.9-.2 2.7-.5M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            )}
          </svg>
        </button>
      </span>
      {error && <span id={errorId} className="mt-1 block text-[12px] text-red-600">{error}</span>}
    </label>
  );
}

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [notice, setNotice] = useState('');
  const isStrong = newPassword.length >= 8 && new TextEncoder().encode(newPassword).length <= 72
    && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const confirmationError = confirmation && confirmation !== newPassword ? 'Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.' : '';

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmation('');
    setNotice('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('Chưa hỗ trợ đổi mật khẩu. Không có thay đổi nào được lưu.');
  };

  return (
    <AccountPageLayout title="Đổi mật khẩu" description="Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.">
      <section className="rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[16px] font-bold text-[#0f172a]">Bảo mật tài khoản</h2>
        <form onSubmit={handleSubmit} className="mt-5 max-w-[500px] space-y-4">
          <PasswordField label="Mật khẩu hiện tại" name="currentPassword" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <div>
            <PasswordField label="Mật khẩu mới" name="newPassword" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => <span key={index} className={`h-1 flex-1 rounded ${isStrong ? 'bg-[#10b981]' : 'bg-[#e2e8f0]'}`} />)}
            </div>
            <p className={`mt-1 text-[12px] ${isStrong ? 'text-[#059669]' : 'text-[#64748b]'}`}>
              {isStrong ? 'Đã đáp ứng yêu cầu. ' : ''}Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số; tối đa 72 byte khi mã hóa.
            </p>
          </div>
          <PasswordField label="Xác nhận mật khẩu mới" name="confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} error={confirmationError} />
          <label className="flex items-center gap-2 text-[12px] text-[#64748b]">
            <input type="checkbox" disabled className="size-4 accent-[#0284c7]" />
            Đăng xuất khỏi các thiết bị khác (chưa hỗ trợ)
          </label>
          {notice && <p role="status" className="text-[13px] text-[#b45309]">{notice}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reset} className="rounded-[8px] border border-[#cbd5e1] px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50">Hủy</button>
            <button type="submit" className="rounded-[8px] bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1]">Cập nhật mật khẩu</button>
          </div>
        </form>
      </section>
      <p className="mt-5 rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1]">
        Không chia sẻ mật khẩu hoặc mã xác thực với bất kỳ ai, kể cả nhân viên phòng vé.
      </p>
    </AccountPageLayout>
  );
}
