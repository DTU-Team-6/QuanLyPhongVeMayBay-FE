import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await authService.forgotPassword(email.trim());
      setNotice('Nếu tài khoản phù hợp tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi qua email.');
    } catch (requestError) {
      setError(requestError.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="w-full flex-1 bg-[#f8fafc] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <h1 className="text-center text-[26px] font-bold text-[#0f172a]">Quên mật khẩu</h1>
        <p className="mt-2 text-center text-sm text-[#64748b]">Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-[#334155]">
            Email
            <input type="email" name="email" autoComplete="email" maxLength={100} required value={email}
              onChange={(event) => setEmail(event.target.value)} disabled={pending}
              className="mt-2 h-12 w-full rounded-[8px] border border-[#cbd5e1] px-3 text-base font-normal text-[#0f172a] focus:border-[#0284c7] focus:outline-none" />
          </label>
          {notice && <p role="status" className="rounded-lg bg-[#eff6ff] px-3 py-2 text-sm text-[#075985]">{notice}</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={pending} className="h-12 w-full rounded-[8px] bg-[#0284c7] text-sm font-semibold text-white hover:bg-[#0369a1] disabled:opacity-70">
            {pending ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>
        <Link to="/dang-nhap" className="mt-5 block text-center text-sm font-semibold text-[#0284c7] hover:underline">Quay lại đăng nhập</Link>
      </div>
    </section>
  );
}
