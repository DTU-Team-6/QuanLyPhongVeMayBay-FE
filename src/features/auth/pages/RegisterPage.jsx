import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateRegistration } from '../authValidation.js';

function adultDateLimit() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

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
        className={`h-[48px] w-full rounded-[8px] border bg-white px-3.5 text-sm text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-2 focus:border-[#0284c7] md:h-[32px] md:rounded-[5px] md:px-2 md:text-[12px] ${
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
          className={`h-[48px] w-full rounded-[8px] border bg-white px-3.5 pr-12 text-sm text-[#0f172a] outline-none transition focus:border-2 focus:border-[#0284c7] md:h-[32px] md:rounded-[5px] md:px-2 md:pr-8 md:text-[12px] ${
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

function SelectField({ label, name, children, defaultValue, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#334155] md:mb-1 md:text-[12px]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-[48px] w-full appearance-none rounded-[8px] border border-[#cbd5e1] bg-white px-3.5 text-sm text-[#0f172a] outline-none focus:border-2 focus:border-[#0284c7] md:h-[32px] md:rounded-[5px] md:px-2 md:text-[12px]"
      >
        {children}
      </select>
      {hint && <span className="mt-2 block text-sm leading-relaxed text-[#64748b] md:mt-1 md:text-[10px]">{hint}</span>}
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
    });
    setErrors(nextErrors);
    setNotice('');

    if (Object.keys(nextErrors).length > 0) {
      form.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setNotice('Thông tin hợp lệ. Đăng ký tài khoản sẽ được kết nối với hệ thống sau.');
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
      <div className="mx-auto max-w-[760px] md:max-w-[504px]">
        <header className="mb-6 md:mb-3">
          <h1 className="text-[26px] font-bold tracking-tight text-[#0f172a] sm:text-[32px] md:text-[20px]">
            Đăng ký tài khoản
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#64748b] sm:text-base md:text-[12px]">
            Một tài khoản, mọi hành trình. Cùng Vân Việt khám phá những điểm đến mới.
          </p>
        </header>

        <div className="rounded-[14px] border border-[#dce5ef] bg-white p-5 shadow-sm sm:p-8 md:rounded-[8px] md:p-4">
          <div className="mb-6 md:mb-3">
            <h2 className="text-xl font-bold text-[#0f172a] md:text-[15px]">Thông tin đăng ký</h2>
            <p className="mt-1 text-sm text-[#64748b] md:mt-1 md:text-[11px]">Các trường có dấu * là bắt buộc.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 md:grid md:grid-cols-2 md:items-start md:gap-x-3 md:gap-y-3 md:space-y-0">
            <Field label="Email *" name="email" type="email" autoComplete="email" placeholder="email@example.com" />
            <Field label="Họ và tên *" name="fullName" autoComplete="name" placeholder="Nhập họ và tên" />
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

            <SelectField label="Giới tính" name="gender" defaultValue="Nu" hint="Nam / Nữ / Khác">
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
            />
            <Field
              label="CMND/Hộ chiếu *"
              name="identityDocument"
              autoComplete="off"
              placeholder="Nhập số trên giấy tờ tùy thân"
              hint="Nhập số giấy tờ 12 chữ số, trùng khớp với giấy tờ tùy thân khi bay."
              hintClassName="md:hidden"
            />

            <SelectField label="Quốc tịch" name="nationality" defaultValue="Việt Nam">
              <option>Việt Nam</option>
              <option>Hoa Kỳ</option>
              <option>Nhật Bản</option>
              <option>Hàn Quốc</option>
              <option>Khác</option>
            </SelectField>

            <p className="text-sm leading-relaxed text-[#64748b] md:self-end md:pb-1 md:text-[10px]">
              <span className="md:hidden">Nhập số giấy tờ 12 chữ số, trùng khớp với giấy tờ tùy thân khi bay.</span>
              <span className="hidden md:inline">Nhập số giấy tờ 12 chữ số, trùng khớp với giấy tờ tùy thân khi bay.</span>
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
              className="h-[48px] w-full rounded-[8px] bg-[#0284c7] text-sm font-semibold text-white transition hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] md:col-span-2 md:justify-self-end md:h-[32px] md:w-auto md:rounded-[5px] md:px-4 md:text-[11px]"
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
