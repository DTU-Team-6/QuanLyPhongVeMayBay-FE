import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getInitials } from '../../../utils/formatters';
import AccountPageLayout from '../components/AccountPageLayout';
import { uploadAvatarImage } from '../services/imageUploadService';

const fieldClass = 'w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]';

function EditPersonalInfo({ user, onClose, onSave }) {
  const dialogRef = useRef(null);
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const isCustomer = user.vaiTro === 'KHACH_HANG';

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!savingRef.current) onClose();
      }
    };
    dialog.showModal();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      dialog.close();
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const payload = {
      hoTen: values.hoTen.trim(),
      soDienThoai: values.soDienThoai.trim() || null,
      ngaySinh: values.ngaySinh || null,
      gioiTinh: values.gioiTinh,
      diaChi: values.diaChi.trim() || null,
      ...(isCustomer && {
        cmndPassport: values.cmndPassport.trim(),
        quocTich: values.quocTich.trim(),
      }),
    };
    if (!payload.hoTen || (isCustomer && !payload.quocTich)) {
      setNotice('Họ tên và quốc tịch không được để trống.');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setNotice('');
    try {
      await onSave(payload);
    } catch (error) {
      const details = error?.details?.map((detail) => detail.message).filter(Boolean).join(' ');
      setNotice(details || error?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        if (!savingRef.current) onClose();
      }}
      aria-labelledby="edit-personal-info-title"
      className="m-auto w-[calc(100%-2rem)] max-w-[760px] max-h-[90vh] overflow-y-auto rounded-[14px] bg-white p-0 text-[#0f172a] shadow-xl backdrop:bg-[#0f172a]/50"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] px-5 py-5 sm:px-6">
          <div>
            <h2 id="edit-personal-info-title" className="text-[18px] font-bold">Chỉnh sửa thông tin cá nhân</h2>
            <p className="mt-1 text-[12px] text-[#64748b]">Email không thể thay đổi tại đây.</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Đóng" className="rounded p-1 text-[#64748b] hover:bg-slate-100 disabled:opacity-50">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <fieldset disabled={saving} className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className="text-[12px] font-semibold text-[#334155]">
            Họ và tên
            <input name="hoTen" required maxLength={100} defaultValue={user?.hoTen || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Ngày sinh
            <input name="ngaySinh" type="date" defaultValue={user?.ngaySinh || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Giới tính
            <select name="gioiTinh" required defaultValue={user?.gioiTinh || ''} className={`${fieldClass} mt-1.5`}>
              <option value="">Chưa có dữ liệu</option>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </select>
          </label>
          {isCustomer && <label className="text-[12px] font-semibold text-[#334155]">
            Quốc tịch
            <input name="quocTich" required maxLength={50} defaultValue={user?.quocTich || ''} className={`${fieldClass} mt-1.5`} />
          </label>}
          <label className="text-[12px] font-semibold text-[#334155]">
            Email
            <input name="email" type="email" readOnly value={user?.email || ''} className={`${fieldClass} mt-1.5 bg-slate-50`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Số điện thoại
            <input name="soDienThoai" type="tel" maxLength={20} pattern="[+]?[0-9 ]{8,20}" defaultValue={user?.soDienThoai || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Địa chỉ
            <input name="diaChi" maxLength={255} defaultValue={user?.diaChi || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          {isCustomer && <label className="text-[12px] font-semibold text-[#334155] sm:col-span-2">
            CMND/Hộ chiếu
            <input name="cmndPassport" maxLength={20} defaultValue={user?.cmndPassport || ''} className={`${fieldClass} mt-1.5`} />
          </label>}
          <p className="rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1] sm:col-span-2">
            Họ tên và ngày sinh cần trùng khớp với giấy tờ tùy thân.
          </p>
          {notice && <p role="alert" className="text-[13px] text-[#b45309] sm:col-span-2">{notice}</p>}
        </fieldset>
        <div className="flex justify-end gap-2 bg-[#f8fafc] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-[8px] border border-[#cbd5e1] bg-white px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50 disabled:opacity-50">Hủy</button>
          <button type="submit" disabled={saving} className="rounded-[8px] bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1] disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </div>
      </form>
    </dialog>
  );
}

export default function PersonalInfoPage() {
  const { user, loading, refreshPersonalInfo, updatePersonalInfo, updateAvatar } = useAuth();
  const [editingUserId, setEditingUserId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [notice, setNotice] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [avatarNotice, setAvatarNotice] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [retry, setRetry] = useState(0);
  const avatarInputRef = useRef(null);
  const avatarUploadingRef = useRef(false);
  const previewUrlRef = useRef('');
  const closeEditor = useCallback(() => setEditingUserId(null), []);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  useEffect(() => {
    setEditingUserId(null);
  }, [user?.id]);

  useEffect(() => {
    if (loading || !user?.id) return;
    let active = true;
    setProfileLoading(true);
    setProfileError('');
    refreshPersonalInfo().catch((error) => {
      if (active) setProfileError(error?.message || 'Không thể tải hồ sơ.');
    }).finally(() => {
      if (active) setProfileLoading(false);
    });
    return () => { active = false; };
  }, [loading, user?.id, refreshPersonalInfo, retry]);

  const handleSave = async (profile) => {
    await updatePersonalInfo(profile);
    setEditingUserId(null);
    setNotice('Cập nhật thông tin cá nhân thành công.');
  };
  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || avatarUploadingRef.current) return;

    setAvatarError('');
    setAvatarNotice('');
    avatarUploadingRef.current = true;
    let previewUrl = '';
    try {
      previewUrl = URL.createObjectURL(file);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = previewUrl;
      setAvatarPreview(previewUrl);
      setAvatarUploading(true);
      const publicId = await uploadAvatarImage(file);
      const result = await updateAvatar(publicId);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
      setAvatarPreview('');
      setAvatarNotice(
        result.oldAvatarCleanupStatus === 'FAILED' || result.oldAvatarCleanupStatus === 'LEGACY_NOT_TRACKED'
          ? 'Đã cập nhật ảnh đại diện. Ảnh cũ không được xóa tự động.'
          : 'Cập nhật ảnh đại diện thành công.'
      );
    } catch (error) {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
      setAvatarPreview('');
      setAvatarError(error?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
    } finally {
      avatarUploadingRef.current = false;
      setAvatarUploading(false);
    }
  };
  const gender = { Nam: 'Nam', Nu: 'Nữ', Khac: 'Khác' }[user?.gioiTinh] || user?.gioiTinh;
  const dateOfBirth = user?.ngaySinh
    ? user.ngaySinh.split('-').reverse().join('/')
    : '';
  const fields = [
    ['Họ và tên', user?.hoTen],
    ['Ngày sinh', dateOfBirth],
    ['Giới tính', gender],
    ...(user?.vaiTro === 'KHACH_HANG' ? [['Quốc tịch', user?.quocTich]] : []),
    ['Email', user?.email],
    ['Số điện thoại', user?.soDienThoai],
    ['Địa chỉ', user?.diaChi],
    ...(user?.vaiTro === 'KHACH_HANG' ? [['CMND/Hộ chiếu', user?.cmndPassport]] : []),
  ];

  return (
    <AccountPageLayout title="Thông tin cá nhân" description="Quản lý thông tin để đặt vé nhanh hơn trong những lần tiếp theo.">
      <section className="rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.03)] sm:p-6">
        <div className="flex items-center gap-4 border-b border-[#e2e8f0] pb-5">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e0f2fe] text-[20px] font-bold text-[#0284c7]">
            {getInitials(user?.hoTen, user?.email)}
            {(avatarPreview || user?.anhDaiDien) && (
              <img
                key={avatarPreview || user.anhDaiDien}
                src={avatarPreview || user.anhDaiDien}
                alt=""
                onError={(imageEvent) => { imageEvent.currentTarget.hidden = true; }}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={loading || profileLoading || avatarUploading || !user}
              aria-label="Thay đổi ảnh đại diện"
              className="absolute inset-0 flex items-end justify-end p-0.5 text-white disabled:cursor-not-allowed"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-[#0284c7] shadow-sm" aria-hidden="true">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
                </svg>
              </span>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              disabled={loading || profileLoading || avatarUploading || !user}
              className="sr-only"
              aria-label="Chọn ảnh đại diện"
            />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-[18px] font-bold">{user?.hoTen || user?.email || 'Thông tin tài khoản'}</h2>
            <p className="mt-1 text-[12px] text-[#64748b]">Thông tin hồ sơ của bạn.</p>
            <p className="mt-1 text-[11px] text-[#64748b]">JPEG, PNG hoặc WebP, tối đa 5 MB.</p>
          </div>
        </div>
        {avatarUploading && <p role="status" className="pt-4 text-[13px] text-[#64748b]">Đang tải ảnh đại diện...</p>}
        {avatarError && <p role="alert" className="pt-4 text-[13px] text-red-600">{avatarError}</p>}
        {avatarNotice && <p role="status" className="pt-4 text-[13px] text-green-700">{avatarNotice}</p>}
        {(loading || (user && profileLoading)) && <p role="status" className="pt-4 text-[13px] text-[#64748b]">Đang tải hồ sơ...</p>}
        {!loading && !user && <p role="status" className="pt-4 text-[13px] text-[#64748b]">Vui lòng đăng nhập để xem và chỉnh sửa hồ sơ.</p>}
        {profileError && <p role="alert" className="pt-4 text-[13px] text-red-600">{profileError} <button type="button" onClick={() => setRetry((value) => value + 1)} className="underline">Thử lại</button></p>}
        {notice && <p role="status" className="pt-4 text-[13px] text-green-700">{notice}</p>}
        <dl className="grid gap-x-8 gap-y-5 py-5 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-[12px] text-[#64748b]">{label}</dt>
              <dd className="mt-1 break-words text-[13px] font-semibold text-[#0f172a]">{value || 'Chưa có dữ liệu'}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end border-t border-[#e2e8f0] pt-4">
          <button type="button" onClick={() => { setNotice(''); setEditingUserId(user.id); }} disabled={loading || profileLoading || Boolean(profileError) || !user} className="rounded-[8px] border border-[#cbd5e1] px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50 disabled:opacity-50">
            Chỉnh sửa
          </button>
        </div>
      </section>
      <p className="mt-5 rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1]">
        Thông tin cá nhân chỉ được dùng để hỗ trợ đặt vé và chăm sóc khách hàng.
      </p>
      {editingUserId !== null && editingUserId === user?.id && <EditPersonalInfo user={user} onClose={closeEditor} onSave={handleSave} />}
    </AccountPageLayout>
  );
}
