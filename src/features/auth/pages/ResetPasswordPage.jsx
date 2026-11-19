import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import { validatePassword } from '../authValidation';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token] = useState(() => location.hash.slice(1));
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const validToken = /^[A-Za-z0-9_-]{43}$/.test(token);

  useEffect(() => {
    if (location.hash) navigate(location.pathname, { replace: true });
  }, [location.hash, location.pathname, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending || !validToken) return;
    const passwordError = validatePassword(password);
    if (passwordError || password !== confirmation) {
      setError(passwordError || 'Mật khẩu xác nhận chưa khớp.');
      return;
    }
    setPending(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      navigate('/dang-nhap', { replace: true, state: { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.' } });
    } catch (requestError) {
      setError(requestError.code === 'PASSWORD_RESET_INVALID'
        ? 'Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.'
        : requestError.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setPending(false);
    }
  };

  const inputClass = 'mt-2 h-12 w-full rounded-[8px] border border-[#cbd5e1] px-3 text-base font-normal text-[#0f172a] focus:border-[#0284c7] focus:outline-none';
  return (
    <section className="w-full flex-1 bg-[#f8fafc] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <h1 className="text-center text-[26px] font-bold text-[#0f172a]">Đặt lại mật khẩu</h1>
        {validToken ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-[#334155]">
              Mật khẩu mới
              <input className={inputClass} type="password" autoComplete="new-password" required value={password}
                onChange={(event) => setPassword(event.target.value)} disabled={pending} />
            </label>
            <p className="text-sm text-[#64748b]">Ít nhất 8 ký tự, có chữ hoa, chữ thường và số; tối đa 72 byte.</p>
            <label className="block text-sm font-semibold text-[#334155]">
              Xác nhận mật khẩu mới
              <input className={inputClass} type="password" autoComplete="new-password" required value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)} disabled={pending} />
            </label>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={pending} className="h-12 w-full rounded-[8px] bg-[#0284c7] text-sm font-semibold text-white hover:bg-[#0369a1] disabled:opacity-70">
              {pending ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        ) : (
          <p role="alert" className="mt-6 text-sm text-red-700">Liên kết không hợp lệ hoặc đã hết hạn.</p>
        )}
        <Link to="/quen-mat-khau" className="mt-5 block text-center text-sm font-semibold text-[#0284c7] hover:underline">Yêu cầu liên kết mới</Link>
      </div>
    </section>
  );
}
