import { useState } from 'react';
import AccountPageLayout from '../components/AccountPageLayout';
import authService from '../../../services/authService';

function PasswordField({ label, name, value, onChange, error, disabled }) {
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
          required
          disabled={disabled}
          autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-10 w-full rounded-[8px] border bg-white px-3 pr-10 text-[13px] text-[#0f172a] outline-none focus:border-[#0284c7] ${error ? 'border-red-500' : 'border-[#cbd5e1]'}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#64748b] disabled:cursor-wait"
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isStrong = newPassword.length >= 8 && new TextEncoder().encode(newPassword).length <= 72
    && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const confirmationError = confirmation && confirmation !== newPassword ? 'Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.' : '';

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmation('');
    setNotice('');
    setErrorMessage('');
  };

  const handleForgotPassword = () => {
    setErrorMessage('');
    setNotice('Chức năng quên mật khẩu chưa được kết nối API. Hiện bạn chưa thể đặt lại mật khẩu tại đây.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setNotice('');
    setErrorMessage('');

    if (!isStrong) {
      setErrorMessage('Mật khẩu mới cần tối thiểu 8 ký tự, có chữ hoa, chữ thường và số; tối đa 72 byte khi mã hóa.');
      return;
    }

    if (confirmation !== newPassword) {
      setErrorMessage('Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmation('');
      setNotice('Đổi mật khẩu thành công. Phiên hiện tại có thể còn hiệu lực tối đa 15 phút; sau đó bạn cần đăng nhập lại.');
    } catch (error) {
      if (error?.code === 'CURRENT_PASSWORD_INVALID') {
        setErrorMessage('Mật khẩu hiện tại không đúng.');
      } else if (error?.code === 'PASSWORD_UNCHANGED') {
        setErrorMessage('Mật khẩu mới phải khác mật khẩu hiện tại.');
      } else if (error?.code === 'VALIDATION_ERROR') {
        setErrorMessage(error.details?.find((detail) => detail.field === 'newPassword')?.message
          || 'Mật khẩu mới chưa đáp ứng yêu cầu của Backend.');
      } else if (error?.code === 'NETWORK_ERROR') {
        setErrorMessage('Không thể kết nối Backend. Vui lòng kiểm tra mạng và thử lại.');
      } else if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
        setErrorMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setErrorMessage(error?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccountPageLayout title="Đổi mật khẩu" description="Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.">
      <section className="rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[16px] font-bold text-[#0f172a]">Bảo mật tài khoản</h2>
        <form onSubmit={handleSubmit} className="mt-5 max-w-[500px] space-y-4">
          <div>
            <PasswordField
              label="Mật khẩu hiện tại"
              name="currentPassword"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                setNotice('');
                setErrorMessage('');
              }}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isSubmitting}
              className="mt-2 text-[12px] font-semibold text-[#0284c7] hover:text-[#0369a1] disabled:cursor-wait disabled:opacity-70"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div>
            <PasswordField
              label="Mật khẩu mới"
              name="newPassword"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setNotice('');
                setErrorMessage('');
              }}
              disabled={isSubmitting}
            />
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => <span key={index} className={`h-1 flex-1 rounded ${isStrong ? 'bg-[#10b981]' : 'bg-[#e2e8f0]'}`} />)}
            </div>
            <p className={`mt-1 text-[12px] ${isStrong ? 'text-[#059669]' : 'text-[#64748b]'}`}>
              {isStrong ? 'Đã đáp ứng yêu cầu. ' : ''}Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số; tối đa 72 byte khi mã hóa.
            </p>
          </div>
          <PasswordField
            label="Xác nhận mật khẩu mới"
            name="confirmation"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setNotice('');
              setErrorMessage('');
            }}
            error={confirmationError}
            disabled={isSubmitting}
          />
          {notice && <p role="status" className="text-[13px] text-[#0369a1]">{notice}</p>}
          {errorMessage && <p role="alert" className="text-[13px] text-red-600">{errorMessage}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reset} disabled={isSubmitting} className="rounded-[8px] border border-[#cbd5e1] px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="rounded-[8px] bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1] disabled:cursor-wait disabled:opacity-70">
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      </section>
      <p className="mt-5 rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1]">
        Không chia sẻ mật khẩu hoặc mã xác thực với bất kỳ ai, kể cả nhân viên phòng vé.
      </p>
    </AccountPageLayout>
  );
}
