import { useState } from 'react';
import { Link } from 'react-router-dom';

function PlaneLoginIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 text-[#0284c7]">
      <path d="M4 12h15m-6-6 6 6-6 6M5 5v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

function AuthField({ label, type, name, autoComplete, visible, onToggle, icon, placeholder }) {
  const inputType = type === 'password' && visible ? 'text' : type;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#334155] md:mb-1 md:text-[12px]">{label}</span>
      <span className="relative block">
        <input
          required
          type={inputType}
          name={name}
          autoComplete={autoComplete}
          className="h-[54px] w-full rounded-[9px] border border-[#cbd5e1] bg-white px-4 pr-12 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-2 focus:border-[#0284c7] md:h-[36px] md:rounded-[5px] md:px-2 md:pr-8 md:text-[12px]"
          placeholder={placeholder || (type === 'email' ? 'name@example.com' : 'Nhập mật khẩu')}
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#64748b] md:w-7"
          >
            <span className="md:scale-75"><EyeIcon visible={visible} /></span>
          </button>
        ) : icon ? (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center">
            <span className="md:scale-75">{icon}</span>
          </span>
        ) : null}
      </span>
    </label>
  );
}

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notice, setNotice] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('Giao diện đã sẵn sàng. Đăng nhập sẽ được kết nối với hệ thống sau.');
  };

  return (
    <section className="w-full flex-1 bg-[#f8fafc] px-4 py-10 md:px-6 md:py-9">
      <div className="mx-auto w-full max-w-[600px] md:max-w-[356px]">
        <div className="rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm sm:p-9 md:rounded-[8px] md:p-4">
          <div className="mx-auto mb-6 flex size-[64px] items-center justify-center rounded-[18px] bg-[#e0f2fe] md:mb-2 md:size-[36px] md:rounded-[9px]">
            <PlaneLoginIcon />
          </div>
          <h1 className="text-center text-[30px] font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[36px] md:text-[22px]">
            Chào mừng bạn trở lại
          </h1>
          <p className="mt-3 text-center text-base leading-relaxed text-[#64748b] sm:text-lg md:mt-2 md:text-[14px]">
            Đăng nhập để quản lý hành trình của bạn.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 md:mt-4 md:space-y-3">
            <AuthField
              label="Email/Tài khoản"
              type="text"
              name="email"
              autoComplete="username"
              placeholder="minhanh.nguyen@email.com"
              icon={<MailIcon />}
            />
            <AuthField
              label="Mật khẩu"
              type="password"
              name="password"
              autoComplete="current-password"
              visible={passwordVisible}
              onToggle={() => setPasswordVisible((current) => !current)}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#475569] sm:text-base md:gap-1.5 md:text-[11px]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 accent-[#0284c7] md:size-3.5"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={() => setNotice('Khôi phục mật khẩu sẽ được bổ sung khi kết nối API.')}
                className="text-sm font-semibold text-[#0284c7] hover:text-[#0369a1] sm:text-base md:text-[11px]"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="h-[58px] w-full rounded-[9px] bg-[#0284c7] text-base font-semibold text-white transition hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] md:h-[36px] md:rounded-[5px] md:text-[12px]"
            >
              Đăng nhập
            </button>
          </form>

          <div className="my-7 flex items-center gap-4 text-sm text-[#94a3b8] md:my-4 md:gap-2 md:text-[11px]">
            <span className="h-px flex-1 bg-[#e2e8f0]" />
            <span>Hoặc</span>
            <span className="h-px flex-1 bg-[#e2e8f0]" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-2">
            {['Google', 'Facebook'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setNotice(`Đăng nhập ${provider} sẽ được kết nối sau.`)}
                className="flex h-[54px] items-center justify-center gap-2 rounded-[9px] border border-[#cbd5e1] text-sm font-medium text-[#475569] transition hover:border-[#0284c7] hover:bg-[#f8fafc] sm:text-base md:h-[34px] md:gap-1 md:rounded-[5px] md:text-[12px]"
              >
                <span className="font-bold text-[#0284c7]">{provider === 'Google' ? 'G' : 'f'}</span>
                {provider}
              </button>
            ))}
          </div>

          {notice && (
            <p role="status" className="mt-5 rounded-lg bg-[#eff6ff] px-4 py-3 text-sm text-[#075985] md:mt-3 md:px-2 md:py-1.5 md:text-[11px]">
              {notice}
            </p>
          )}

          <p className="mt-8 flex flex-wrap items-center justify-between gap-2 text-sm text-[#64748b] sm:text-base md:mt-4 md:justify-center md:gap-1 md:text-[11px]">
            <span>Chưa có tài khoản?</span>
            <Link to="/dang-ky" className="font-semibold text-[#0284c7] hover:text-[#0369a1]">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748b] sm:text-base md:mt-3 md:text-[10px]">
          Thông tin của bạn được bảo mật và mã hóa an toàn.
        </p>
      </div>
    </section>
  );
}
