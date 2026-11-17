import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function LoginIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 text-[#0284c7]">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 text-[#0284c7]">
      <path d="M3.75 6.75h16.5v10.5H3.75z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m4.5 7.5 7.5 5.25 7.5-5.25" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      {visible ? (
        <>
          <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.3 0 9.5 6 9.5 6a16 16 0 0 1-3.2 3.8M6.2 6.9C3.8 8.5 2.5 12 2.5 12s3.2 6 9.5 6c1 0 1.9-.2 2.7-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function AuthField({ label, type, name, autoComplete, visible, onToggle, onChange, icon, placeholder }) {
  const inputType = type === 'password' && visible ? 'text' : type;

  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[#334155]">{label}</span>
      <span className="relative block">
        <input
          required
          type={inputType}
          name={name}
          autoComplete={autoComplete}
          onChange={onChange}
          className="h-[42px] w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 pr-10 text-sm text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-2 focus:border-[#0284c7]"
          placeholder={placeholder || (type === 'email' ? 'name@example.com' : 'Nhập mật khẩu')}
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#64748b]"
          >
            <EyeIcon visible={visible} />
          </button>
        ) : icon ? (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center">
            {icon}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notice, setNotice] = useState(location.state?.message || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setNotice(location.state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const values = Object.fromEntries(new FormData(event.currentTarget));
    setIsSubmitting(true);
    setErrorMessage('');
    setNotice('');

    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate('/', { replace: true });
    } catch (error) {
      if (error?.code === 'INVALID_CREDENTIALS') {
        setErrorMessage('Email hoặc mật khẩu không đúng.');
      } else if (error?.code === 'ACCOUNT_INACTIVE') {
        setErrorMessage('Tài khoản đã bị khóa hoặc chưa được kích hoạt.');
      } else if (error?.code === 'NETWORK_ERROR') {
        setErrorMessage('Không thể kết nối Backend. Vui lòng kiểm tra mạng và thử lại.');
      } else {
        setErrorMessage(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full flex-1 bg-[#f8fafc] px-4 py-10 md:px-6 md:py-9">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
          <div className="mx-auto mb-3 flex size-[50px] items-center justify-center rounded-[14px] bg-[#e0f2fe]">
            <LoginIcon />
          </div>
          <h1 className="text-center text-[26px] font-bold leading-tight tracking-tight text-[#0f172a]">
            Chào mừng bạn trở lại
          </h1>
          <p className="mt-2 text-center text-base leading-5 text-[#64748b]">
            Đăng nhập để quản lý hành trình của bạn.
          </p>

          {notice && (
            <p role="status" className="mt-4 rounded-lg bg-[#eff6ff] px-3 py-2 text-sm text-[#075985]">
              {notice}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-[14px]">
            <AuthField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="minhanh.nguyen@email.com"
              icon={<MailIcon />}
              onChange={() => setErrorMessage('')}
            />
            <AuthField
              label="Mật khẩu"
              type="password"
              name="password"
              autoComplete="current-password"
              visible={passwordVisible}
              onToggle={() => setPasswordVisible((current) => !current)}
              onChange={() => setErrorMessage('')}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-not-allowed items-center gap-2 text-xs text-[#475569]">
                <input
                  type="checkbox"
                  disabled
                  title="Backend chưa hỗ trợ ghi nhớ đăng nhập."
                  className="size-4 cursor-not-allowed accent-[#0284c7] disabled:opacity-50"
                />
                <span>
                  Ghi nhớ đăng nhập
                  <span className="ml-1 text-[10px] text-[#94a3b8]">(chưa hỗ trợ)</span>
                </span>
              </label>
              <button
                type="button"
                onClick={() => setNotice('Khôi phục mật khẩu sẽ được bổ sung khi kết nối API.')}
                className="text-xs font-semibold text-[#0284c7] hover:text-[#0369a1]"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="h-[42px] w-full rounded-[8px] bg-[#0284c7] text-sm font-semibold text-white transition hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {errorMessage && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="my-6 flex items-center gap-3 text-xs text-[#94a3b8]">
            <span className="h-px flex-1 bg-[#e2e8f0]" />
            <span>Hoặc</span>
            <span className="h-px flex-1 bg-[#e2e8f0]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Facebook'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setNotice(`Đăng nhập ${provider} sẽ được kết nối sau.`)}
                className="flex h-[42px] items-center justify-center gap-2 rounded-[8px] border border-[#cbd5e1] text-sm font-medium text-[#475569] transition hover:border-[#0284c7] hover:bg-[#f8fafc]"
              >
                <span className="font-bold text-[#0284c7]">{provider === 'Google' ? 'G' : 'f'}</span>
                {provider}
              </button>
            ))}
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-1 text-xs text-[#64748b]">
            <span>Chưa có tài khoản?</span>
            <Link to="/dang-ky" className="font-semibold text-[#0284c7] hover:text-[#0369a1]">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[#64748b]">
          Thông tin của bạn được bảo mật và mã hóa an toàn.
        </p>
      </div>
    </section>
  );
}
