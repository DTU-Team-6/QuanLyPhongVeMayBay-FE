import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const returnTo = location.state?.from;
  const safeReturnTo = typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
    ? returnTo : '/quan-ly-nhan-vien';

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (!email.trim() || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    setBusy(true);
    try {
      const account = await login(email.trim(), password);
      if (account?.vaiTro === 'ADMIN') navigate(safeReturnTo, { replace: true });
      else setError('Tài khoản này không có quyền quản lý nhân viên.');
    } catch (requestError) {
      setError(requestError.status === 401
        ? 'Email hoặc mật khẩu không đúng.'
        : requestError.message || 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="mx-auto w-full max-w-[440px] py-10 sm:py-16">
    <div className="rounded-xl border border-[#dce5ef] bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[#172137]">Đăng nhập quản trị</h1>
      <p className="mt-2 text-sm text-[#667895]">Dùng tài khoản Admin để quản lý nhân viên.</p>
      {user?.vaiTro === 'ADMIN' && <p className="mt-5 rounded-lg bg-[#eafbf3] p-3 text-sm text-[#086b51]">Bạn đã đăng nhập Admin. <Link to="/quan-ly-nhan-vien" className="font-semibold underline">Mở quản lý nhân viên</Link></p>}
      {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-[#334155]">Email
          <input type="email" required autoComplete="username" maxLength={100} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[#cbd5e1] px-3 font-normal focus:border-[#0284c7] focus:outline-none" />
        </label>
        <label className="block text-sm font-semibold text-[#334155]">Mật khẩu
          <input type="password" required autoComplete="current-password" maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[#cbd5e1] px-3 font-normal focus:border-[#0284c7] focus:outline-none" />
        </label>
        <button type="submit" disabled={busy} className="h-11 w-full rounded-lg bg-[#0284c7] px-4 font-semibold text-white hover:bg-[#0369a1] disabled:opacity-50">{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  </div>;
}
