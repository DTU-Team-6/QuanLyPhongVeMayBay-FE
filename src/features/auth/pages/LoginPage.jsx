import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    if (!email.trim() || !password) { setError('Vui lòng nhập email và mật khẩu.'); return; }
    setSaving(true);
    setError('');
    try {
      const user = await authService.login({ email: email.trim(), password });
      await checkAuth();
      const next = params.get('next');
      navigate(next?.startsWith('/') && !next.startsWith('//') ? next : user?.vaiTro === 'KHACH_HANG' ? '/' : '/quan-ly-ban-ve', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Đăng nhập thất bại.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-12"><form onSubmit={submit} className="w-full rounded-xl border border-[#dce5ef] bg-white p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-bold text-[#172137]">Đăng nhập tài khoản</h1><p className="mt-2 text-sm text-[#667895]">Sử dụng tài khoản được cấp để truy cập hệ thống quản lý.</p>{error && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<label className="mt-6 block text-sm font-semibold text-[#33435e]">Email<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} maxLength={100} required disabled={saving} className="mt-2 h-11 w-full rounded-lg border border-[#c9d7e7] px-3 font-normal" /></label><label className="mt-5 block text-sm font-semibold text-[#33435e]">Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} maxLength={72} required disabled={saving} className="mt-2 h-11 w-full rounded-lg border border-[#c9d7e7] px-3 font-normal" /></label><button type="submit" disabled={saving} className="mt-7 h-11 w-full rounded-lg bg-[#0284c7] text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Đang đăng nhập...' : 'Đăng nhập'}</button></form></div>;
}
