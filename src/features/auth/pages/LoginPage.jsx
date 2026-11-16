import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/common/Loading';

/** Đăng nhập bằng cookie HttpOnly để dùng các màn hình nghiệp vụ được phân quyền. */
export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const requestedPath = location.state?.from;
  const returnTo = typeof requestedPath === 'string' && requestedPath.startsWith('/') && !requestedPath.startsWith('//') && requestedPath !== '/dang-nhap' ? requestedPath : '/';
  if (loading) return <Loading message="Đang kiểm tra phiên đăng nhập…" />;
  if (user) return <Navigate to={returnTo} replace />;
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      await login({ email: email.trim(), password });
      setPassword('');
      navigate(returnTo, { replace: true });
    } catch (requestError) {
      setError(requestError.status === 0 ? 'Không thể kết nối. Vui lòng thử lại.' : requestError.message || 'Đăng nhập không thành công.');
    } finally { setPending(false); }
  }
  return <div className="w-full px-6 py-12"><form onSubmit={submit} className="max-w-md mx-auto p-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
    <div><h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1><p className="text-sm text-slate-500 mt-2">Chào mừng bạn trở lại phòng vé Vân Việt.</p></div>
    {error && <p role="alert" className="rounded-lg p-3 bg-red-50 text-sm text-red-700">{error}</p>}
    <div><label htmlFor="login-email" className="block text-sm font-semibold mb-2">Email</label><input id="login-email" type="email" autoComplete="username" required maxLength={100} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300" /></div>
    <div><label htmlFor="login-password" className="block text-sm font-semibold mb-2">Mật khẩu</label><input id="login-password" type="password" autoComplete="current-password" required maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300" /></div>
    <button type="submit" disabled={pending} className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-60">{pending ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
  </form></div>;
}
