import { useState } from 'react';
import arrowLeftIcon from '../../../assets/employees/arrowLeft.svg';
import infoIcon from '../../../assets/employees/info.svg';
import saveIcon from '../../../assets/employees/save.svg';
import calendarIcon from '../../../assets/employees/calendar.svg';
import mailIcon from '../../../assets/employees/mail.svg';
import eyeOffIcon from '../../../assets/employees/eyeOff.svg';
import chevronIcon from '../../../assets/employees/chevron.svg';
import { employeePayload, fieldErrorsFromApi, validateEmployee } from '../employeeValidation';

const emptyEmployee = {
  maNhanVien: '', hoTen: '', ngaySinh: '', gioiTinh: '', email: '',
  matKhau: '', soDienThoai: '', vaiTro: 'NHAN_VIEN',
};
const inputClass = 'mt-1.5 h-10 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] focus:border-2 focus:border-[#0284c7] focus:outline-none disabled:bg-[#f1f5f9]';
const secondaryClass = 'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-50';

function Field({ label, name, type = 'text', value, onChange, error, disabled, maxLength, placeholder, autoComplete, icon }) {
  return <label className="block text-xs font-semibold text-[#334155]">{label}
    <span className="relative block"><input name={name} type={type} value={value || ''} onChange={onChange} disabled={disabled} maxLength={maxLength} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className={`${inputClass} ${icon ? 'pr-9' : ''} ${type === 'date' ? 'employee-date' : ''} ${error ? '!border-red-500' : ''}`} />{icon && <img src={icon} alt="" className="pointer-events-none absolute right-3 top-[18px] size-4" />}</span>
    {error && <span id={`${name}-error`} className="mt-1 block text-xs font-normal text-red-600">{error}</span>}
  </label>;
}

export default function EmployeeForm({ mode, employee, onCancel, onSave, canSubmit = true }) {
  const [values, setValues] = useState(() => employee ? { ...emptyEmployee, ...employee } : { ...emptyEmployee });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateEmployee(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    setMessage('');
    try {
      await onSave(employeePayload(values, mode));
    } catch (error) {
      setErrors(fieldErrorsFromApi(error));
      setMessage(error.message || 'Không thể lưu nhân viên. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={submit} noValidate className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
    <div className="mb-5"><h2 className="text-lg font-semibold text-[#0f172a]">{mode === 'create' ? 'Thông tin nhân viên mới' : `Thông tin nhân viên ${employee.maNhanVien}`}</h2><p className="mt-1 text-sm text-[#64748b]">Điền đầy đủ thông tin. Các trường có dấu * là bắt buộc.</p></div>
    {!canSubmit && <div role="status" className="mb-5 rounded-lg border border-[#bae6fd] bg-[#e0f2fe] px-4 py-3 text-sm text-[#075985]">Bản xem giao diện: cần đăng nhập Admin để lưu thông tin nhân viên.</div>}
    {message && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      <Field label="Mã NV *" name="maNhanVien" value={values.maNhanVien} onChange={update} error={errors.maNhanVien} disabled={mode === 'edit'} maxLength={20} autoComplete="off" />
      <Field label="Họ tên *" name="hoTen" value={values.hoTen} onChange={update} error={errors.hoTen} maxLength={40} autoComplete="name" />
      <Field label="Ngày sinh *" name="ngaySinh" type="date" value={values.ngaySinh} onChange={update} error={errors.ngaySinh} icon={calendarIcon} />
      <label className="block text-xs font-semibold text-[#334155]">Giới tính *<span className="relative block"><select name="gioiTinh" value={values.gioiTinh} onChange={update} aria-invalid={Boolean(errors.gioiTinh)} className={`${inputClass} appearance-none pr-9`}><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option></select><img src={chevronIcon} alt="" className="pointer-events-none absolute right-3 top-[18px] size-4" /></span>{errors.gioiTinh && <span className="mt-1 block font-normal text-red-600">{errors.gioiTinh}</span>}</label>
      <Field label="Email *" name="email" type="email" value={values.email} onChange={update} error={errors.email} maxLength={40} autoComplete="email" icon={mailIcon} />
      <Field label="SĐT *" name="soDienThoai" type="tel" value={values.soDienThoai} onChange={update} error={errors.soDienThoai} maxLength={13} autoComplete="tel" />
      <label className="block text-xs font-semibold text-[#334155]">Phân quyền *<span className="relative block"><select name="vaiTro" value={values.vaiTro} onChange={update} aria-invalid={Boolean(errors.vaiTro)} className={`${inputClass} appearance-none pr-9`}><option value="NHAN_VIEN">Nhân viên</option><option value="ADMIN">Quản trị viên</option></select><img src={chevronIcon} alt="" className="pointer-events-none absolute right-3 top-[18px] size-4" /></span>{errors.vaiTro && <span className="mt-1 block font-normal text-red-600">{errors.vaiTro}</span>}</label>
      {mode === 'create' && <Field label="Mật khẩu *" name="matKhau" type="password" value={values.matKhau} onChange={update} error={errors.matKhau} maxLength={20} autoComplete="new-password" icon={eyeOffIcon} />}
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#64748b]">Phân quyền khả dụng: <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 font-semibold text-[#0369a1]">Quản trị viên</span><span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 font-semibold">Nhân viên</span></div>
    <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-[#e2e8f0] pt-5">
      <button type="button" onClick={onCancel} disabled={saving} className={secondaryClass}><img src={arrowLeftIcon} alt="" className="size-4" />Quay lại</button>
      <div className="flex gap-3">{mode === 'create' && <button type="button" disabled={saving} onClick={() => { setValues({ ...emptyEmployee }); setErrors({}); setMessage(''); }} className={secondaryClass}>Xóa trắng</button>}{mode === 'edit' && <button type="button" disabled={saving} onClick={onCancel} className={secondaryClass}>Hủy</button>}<button type="submit" disabled={saving || !canSubmit} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0284c7] px-4 text-sm font-semibold text-white hover:bg-[#0369a1] disabled:opacity-50"><img src={saveIcon} alt="" className="size-4" />{saving ? 'Đang lưu...' : mode === 'create' ? 'Lưu' : 'Xác nhận'}</button></div>
    </div>
  </form>;
}

export function EmployeeFormInfo({ mode }) {
  return <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#e0f2fe] p-4 text-[13px] text-[#0369a1]"><img src={infoIcon} alt="" className="mt-0.5 size-[18px]" /><span>{mode === 'create' ? 'Mật khẩu phải có ít nhất 8 ký tự.' : 'Mã nhân viên không thể thay đổi. Thay đổi quyền sẽ có hiệu lực trong lần đăng nhập tiếp theo.'}</span></div>;
}
