import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getInitials } from '../../../utils/formatters';
import AccountPageLayout from '../components/AccountPageLayout';

const fieldClass = 'w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[13px] text-[#0f172a] focus:outline-none focus:border-[#0284c7]';

function EditPersonalInfo({ user, onClose }) {
  const dialogRef = useRef(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    dialog.showModal();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      dialog.close();
    };
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('Chưa hỗ trợ lưu thông tin. Các thay đổi sẽ không được lưu.');
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="edit-personal-info-title"
      className="m-auto w-[calc(100%-2rem)] max-w-[760px] max-h-[90vh] overflow-y-auto rounded-[14px] bg-white p-0 text-[#0f172a] shadow-xl backdrop:bg-[#0f172a]/50"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] px-5 py-5 sm:px-6">
          <div>
            <h2 id="edit-personal-info-title" className="text-[18px] font-bold">Chỉnh sửa thông tin cá nhân</h2>
            <p className="mt-1 text-[12px] text-[#64748b]">Thông tin chỉnh sửa chưa được lưu lên máy chủ.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded p-1 text-[#64748b] hover:bg-slate-100">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className="text-[12px] font-semibold text-[#334155]">
            Họ và tên
            <input name="hoTen" defaultValue={user?.hoTen || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Ngày sinh
            <input name="ngaySinh" type="date" defaultValue={user?.ngaySinh || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Giới tính
            <select name="gioiTinh" defaultValue={user?.gioiTinh || ''} className={`${fieldClass} mt-1.5`}>
              <option value="">Chưa có dữ liệu</option>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </select>
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Quốc tịch
            <input name="quocTich" defaultValue={user?.quocTich || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Email
            <input name="email" type="email" defaultValue={user?.email || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155]">
            Số điện thoại
            <input name="soDienThoai" type="tel" defaultValue={user?.soDienThoai || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <label className="text-[12px] font-semibold text-[#334155] sm:col-span-2">
            CMND/Hộ chiếu
            <input name="cmndPassport" defaultValue={user?.cmndPassport || ''} className={`${fieldClass} mt-1.5`} />
          </label>
          <p className="rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1] sm:col-span-2">
            Họ tên và ngày sinh cần trùng khớp với giấy tờ tùy thân.
          </p>
          {notice && <p role="status" className="text-[13px] text-[#b45309] sm:col-span-2">{notice}</p>}
        </div>
        <div className="flex justify-end gap-2 bg-[#f8fafc] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-[8px] border border-[#cbd5e1] bg-white px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50">Hủy</button>
          <button type="submit" className="rounded-[8px] bg-[#0284c7] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0369a1]">Lưu thay đổi</button>
        </div>
      </form>
    </dialog>
  );
}

export default function PersonalInfoPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const gender = { Nam: 'Nam', Nu: 'Nữ', Khac: 'Khác' }[user?.gioiTinh] || user?.gioiTinh;
  const dateOfBirth = user?.ngaySinh
    ? user.ngaySinh.split('-').reverse().join('/')
    : '';
  const fields = [
    ['Họ và tên', user?.hoTen],
    ['Ngày sinh', dateOfBirth],
    ['Giới tính', gender],
    ['Quốc tịch', user?.quocTich],
    ['Email', user?.email],
    ['Số điện thoại', user?.soDienThoai],
    ['CMND/Hộ chiếu', user?.cmndPassport],
  ];

  return (
    <AccountPageLayout title="Thông tin cá nhân" description="Quản lý thông tin để đặt vé nhanh hơn trong những lần tiếp theo.">
      <section className="rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.03)] sm:p-6">
        <div className="flex items-center gap-4 border-b border-[#e2e8f0] pb-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#e0f2fe] text-[20px] font-bold text-[#0284c7]">
            {getInitials(user?.hoTen, user?.email)}
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-[18px] font-bold">{user?.hoTen || user?.email || 'Thông tin tài khoản'}</h2>
            <p className="mt-1 text-[12px] text-[#64748b]">Thông tin hồ sơ chưa được kết nối.</p>
          </div>
        </div>
        <dl className="grid gap-x-8 gap-y-5 py-5 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-[12px] text-[#64748b]">{label}</dt>
              <dd className="mt-1 break-words text-[13px] font-semibold text-[#0f172a]">{value || 'Chưa có dữ liệu'}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end border-t border-[#e2e8f0] pt-4">
          <button type="button" onClick={() => setEditing(true)} className="rounded-[8px] border border-[#cbd5e1] px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-slate-50">
            Chỉnh sửa
          </button>
        </div>
      </section>
      <p className="mt-5 rounded-[8px] bg-[#e0f2fe] px-4 py-3 text-[12px] text-[#0369a1]">
        Thông tin cá nhân chỉ được dùng để hỗ trợ đặt vé và chăm sóc khách hàng.
      </p>
      {editing && <EditPersonalInfo user={user} onClose={() => setEditing(false)} />}
    </AccountPageLayout>
  );
}
