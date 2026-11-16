import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adultDateLimit, validateRegistration } from '../authValidation.js';

function Field({ label, name, type = 'text', autoComplete, hint, hintClassName = '', error, ...props }) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#334155] md:mb-1 md:text-[12px]">{label}</span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
        className={`h-[48px] w-full rounded-[8px] border bg-white px-3.5 text-sm text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-2 focus:border-[#0284c7] md:h-[40px] md:rounded-[6px] md:px-3 md:text-sm ${
          error ? 'border-red-500' : 'border-[#cbd5e1]'
        }`}
        {...props}
      />
      {hint && <span id={hintId} className={`mt-2 block text-sm leading-relaxed text-[#64748b] md:mt-1 md:text-[10px] ${hintClassName}`}>{hint}</span>}
      {error && <span id={errorId} className="mt-1 block text-sm text-red-600 md:text-[11px]">{error}</span>}
    </label>
  );
}

function PasswordField({ label, name, autoComplete, error, hint, hintClassName = '' }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#334155] md:mb-1 md:text-[12px]">{label}</span>
      <span className="relative block">
        <input
          required
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          minLength={8}
          aria-invalid={Boolean(error)}
          aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
          className={`h-[48px] w-full rounded-[8px] border bg-white px-3.5 pr-12 text-sm text-[#0f172a] outline-none transition focus:border-2 focus:border-[#0284c7] md:h-[40px] md:rounded-[6px] md:px-3 md:pr-10 md:text-sm ${
            error ? 'border-red-500' : 'border-[#cbd5e1]'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#64748b] md:w-8"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 md:size-4">
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
        </button>
      </span>
      {hint && <span id={hintId} className={`mt-2 block text-sm leading-relaxed text-[#64748b] md:mt-1 md:text-[10px] ${hintClassName}`}>{hint}</span>}
      {error && <span id={errorId} className="mt-1 block text-sm text-red-600 md:text-[11px]">{error}</span>}
    </label>
  );
}

function SelectField({ label, name, children, defaultValue, hint, error, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#334155] md:mb-1 md:text-[12px]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={onChange}
        className={`h-[48px] w-full appearance-none rounded-[8px] border bg-white px-3.5 text-sm text-[#0f172a] outline-none focus:border-2 focus:border-[#0284c7] md:h-[40px] md:rounded-[6px] md:px-3 md:text-sm ${error ? 'border-red-500' : 'border-[#cbd5e1]'}`}
      >
        {children}
      </select>
      {hint && <span className="mt-2 block text-sm leading-relaxed text-[#64748b] md:mt-1 md:text-[10px]">{hint}</span>}
      {error && <span id={`${name}-error`} className="mt-1 block text-sm text-red-600 md:text-[11px]">{error}</span>}
    </label>
  );
}

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = Object.fromEntries(new FormData(form));
    const nextErrors = validateRegistration({
      password: values.password,
      confirmPassword: values.confirmPassword,
      dateOfBirth: values.dateOfBirth,
      phone: values.phone,
    });
    setErrors(nextErrors);
    setNotice('');

    if (Object.keys(nextErrors).length > 0) {
      form.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setNotice('Thông tin hợp lệ. Đăng ký chưa được kết nối với hệ thống.');
  };

  const clearFieldError = (name) => {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setNotice('');
  };

  return (
    <section className="w-full flex-1 bg-[#f8fafc] px-4 py-8 md:px-6 md:py-5">
      <div className="mx-auto w-full max-w-[800px]">
        <header className="mb-6">
          <h1 className="text-[26px] font-bold tracking-tight text-[#0f172a] sm:text-[32px] md:text-[20px]">
            Đăng ký tài khoản
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#64748b] sm:text-base md:text-[12px]">
            Một tài khoản, mọi hành trình. Cùng Vân Việt khám phá những điểm đến mới.
          </p>
        </header>

        <div className="rounded-[14px] border border-[#dce5ef] bg-white p-6 shadow-sm md:rounded-[8px]">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0f172a]">Thông tin đăng ký</h2>
            <p className="mt-1 text-xs text-[#64748b]">Các trường có dấu * là bắt buộc.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 md:grid md:grid-cols-2 md:items-start md:gap-x-4 md:gap-y-[26px] md:space-y-0">
            <Field label="Email *" name="email" type="email" autoComplete="email" placeholder="email@example.com" error={errors.email} onChange={() => clearFieldError('email')} />
            <Field label="Họ và tên *" name="fullName" autoComplete="name" placeholder="Nhập họ và tên" error={errors.fullName} onChange={() => clearFieldError('fullName')} />
            <PasswordField
              label="Mật khẩu *"
              name="password"
              autoComplete="new-password"
              hint="Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số."
              hintClassName="md:hidden"
              error={errors.password}
            />
            <PasswordField
              label="Xác nhận mật khẩu *"
              name="confirmPassword"
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
            <p className="hidden text-[10px] leading-relaxed text-[#64748b] md:col-span-2 md:block md:-mt-2">
              Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số.
            </p>

            <Field
              label="Ngày sinh *"
              name="dateOfBirth"
              type="date"
              autoComplete="bday"
              max={adultDateLimit()}
              error={errors.dateOfBirth}
              hint="Chủ tài khoản phải đủ 18 tuổi."
              onChange={() => clearFieldError('dateOfBirth')}
            />

            <SelectField label="Giới tính" name="gender" defaultValue="Nu" hint="Nam / Nữ / Khác" error={errors.gender} onChange={() => clearFieldError('gender')}>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </SelectField>

            <Field
              label="Số điện thoại *"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại"
              inputMode="tel"
              error={errors.phone}
              onChange={() => clearFieldError('phone')}
            />
            <Field
              label="CMND/Hộ chiếu *"
              name="identityDocument"
              autoComplete="off"
              placeholder="Nhập số trên giấy tờ tùy thân"
              maxLength={20}
              hint="Nhập số giấy tờ trùng khớp với giấy tờ tùy thân khi bay, tối đa 20 ký tự."
              hintClassName="md:hidden"
              error={errors.identityDocument}
              onChange={() => clearFieldError('identityDocument')}
            />

            <SelectField label="Quốc tịch" name="nationality" defaultValue="VN" error={errors.nationality} onChange={() => clearFieldError('nationality')}>
              <option value="VN">Việt Nam</option>
              <option value="US">Hoa Kỳ</option>
              <option value="JP">Nhật Bản</option>
              <option value="KR">Hàn Quốc</option>
              <option value="ZZ">Khác</option>
            </SelectField>

            <p className="text-sm leading-relaxed text-[#64748b] md:self-end md:pb-1 md:text-[10px]">
              <span>Nhập số giấy tờ trùng khớp với giấy tờ tùy thân khi bay, tối đa 20 ký tự.</span>
            </p>

            <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm leading-relaxed text-[#475569] md:col-span-2 md:gap-1.5 md:pt-0 md:text-[11px]">
              <input required type="checkbox" name="acceptTerms" className="mt-0.5 size-4 shrink-0 accent-[#0284c7] md:size-3.5" />
              <span>
                Tôi đồng ý với <Link to="/dieu-khoan" className="font-medium text-[#0284c7] hover:underline">Điều khoản sử dụng</Link> và{' '}
                <Link to="/chinh-sach-bao-mat" className="font-medium text-[#0284c7] hover:underline">Chính sách bảo mật</Link>.
              </span>
            </label>

            {notice && (
              <p role="status" className="rounded-lg bg-[#eff6ff] px-4 py-3 text-sm text-[#075985] md:col-span-2 md:text-[11px]">
                {notice}
              </p>
            )}

            <button
              type="submit"
              className="h-[48px] w-full rounded-[8px] bg-[#0284c7] text-sm font-semibold text-white transition hover:bg-[#0369a1] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] md:col-span-2 md:justify-self-end md:h-[40px] md:w-auto md:rounded-[6px] md:px-4 md:text-sm"
            >
              Đăng ký
            </button>
          </form>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-[#64748b] md:mt-4 md:justify-center md:gap-1 md:text-[11px]">
          <span>Đã có tài khoản?</span>
          <Link to="/dang-nhap" className="font-semibold text-[#0284c7] hover:text-[#0369a1]">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </section>
  );
}
