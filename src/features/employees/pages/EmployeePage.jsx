import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import planeIcon from '../../../assets/plane.svg';
import employeeService from '../employeeService';
import { TIEU_CHI_TIM } from '../employeeTypes';
import EmployeeForm, { EmployeeFormInfo } from '../components/EmployeeForm';
import menuIcon from '../../../assets/employees/menu.svg';
import bellIcon from '../../../assets/employees/bell.svg';
import userIcon from '../../../assets/employees/user.svg';
import usersIcon from '../../../assets/employees/users.svg';
import chartIcon from '../../../assets/employees/chart.svg';
import plusIcon from '../../../assets/employees/plus.svg';
import searchIcon from '../../../assets/employees/search.svg';
import searchButtonIcon from '../../../assets/employees/searchButton.svg';
import EmployeeDeleteDialog from '../components/EmployeeDeleteDialog';

const PAGE_SIZE = 20;

function formatDate(date) {
  if (!date) return '—';
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}/${month}/${year}` : date;
}

function EmployeeShell({ children, user }) {
  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter',sans-serif] text-[#172137]">
      <header className="flex h-16 items-center justify-between bg-[#101827] px-4 text-white lg:px-6">
        <div className="flex items-center gap-7">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Vân Việt - Trang chủ">
            <span className="flex size-9 items-center justify-center rounded-[9px] bg-[#0284c7]"><img src={planeIcon} alt="" className="size-[23px]" /></span>
            <span className="leading-tight"><strong className="block text-[20px]">Vân Việt</strong><small className="block text-[9px] tracking-[1.5px] text-[#b5c2d4]">PHÒNG VÉ MÁY BAY</small></span>
          </Link>
          <img src={menuIcon} alt="" className="hidden size-[18px] lg:block" /><span className="hidden text-xs tracking-wide text-[#c2cad6] lg:block">HỆ THỐNG QUẢN LÝ PHÒNG VÉ</span>
        </div>
        <div className="flex items-center gap-3 text-xs"><span className="hidden text-[#aebcd0] md:block">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full' }).format(new Date())}</span><img src={bellIcon} alt="" className="hidden size-[18px] md:block" /><span className="flex size-9 items-center justify-center rounded-full bg-[#dff3ff] font-semibold text-[#075b8b]">{(user?.hoTen || 'A').slice(0, 1).toUpperCase()}</span><span className="hidden font-semibold sm:block">{user?.hoTen || 'Quản trị viên'}</span><span className="rounded-full bg-[#dff3ff] px-3 py-1 font-semibold text-[#075b8b]">Admin</span></div>
      </header>
      <div className="mx-auto flex max-w-[1440px] min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#dbe4ee] bg-white px-4 py-6 lg:block">
          <p className="mb-5 text-xs font-semibold text-[#667895]">KHÔNG GIAN QUẢN TRỊ</p>
          <nav className="space-y-2 text-sm">
            <Link to="/tai-khoan" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#3d4c63] hover:bg-[#edf7fe]"><img src={userIcon} alt="" className="size-[18px]" />Thông tin Admin</Link>
            <Link to="/quan-ly-nhan-vien" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#dff1fc] px-4 py-3 font-semibold text-[#0076b6]"><img src={usersIcon} alt="" className="size-[18px]" />Quản lý nhân viên</Link>
            <Link to="/bao-cao" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#3d4c63] hover:bg-[#edf7fe]"><img src={chartIcon} alt="" className="size-[18px]" />Thống kê báo cáo doanh thu</Link>
          </nav>
          <div className="mt-6 border-t border-[#dbe4ee] pt-4 text-xs text-[#687b98]"><p>Chi nhánh Hồ Chí Minh</p><p className="mt-3 text-[#07976e]">● &nbsp;Hệ thống hoạt động tốt</p><p className="mt-3">Trợ giúp • Hướng dẫn sử dụng</p></div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
          <footer className="mt-12 flex justify-between text-[11px] text-[#72839c]"><span>© 2026 Vân Việt • Hệ thống quản lý phòng vé</span><span>Phiên bản 2.6</span></footer>
        </main>
      </div>
    </div>
  );
}

export default function EmployeePage() {
  const { user, loading: authLoading } = useAuth();
  const [searchBy, setSearchBy] = useState('MA_NHAN_VIEN');
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState({ trang: 0, kichThuoc: PAGE_SIZE });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await employeeService.list(filter);
      setData(result);
    } catch (requestError) {
      setData(null);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authLoading && user?.vaiTro === 'ADMIN') load();
  }, [authLoading, user?.vaiTro, load]);

  if (authLoading) return <div className="p-8" role="status">Đang kiểm tra quyền truy cập...</div>;
  if (user?.vaiTro !== 'ADMIN') return <div className="p-8" role="alert">Bạn cần đăng nhập bằng tài khoản Admin để quản lý nhân viên.</div>;

  const employees = data?.nhanVien || [];
  const total = data?.tongSo || 0;
  const start = total ? filter.trang * PAGE_SIZE + 1 : 0;
  const end = Math.min((filter.trang + 1) * PAGE_SIZE, total);
  const backendPending = error?.status === 404 || error?.status === 405;

  function search(event) {
    event.preventDefault();
    setFilter({ tieuChi: searchBy, tuKhoa: keyword.trim(), trang: 0, kichThuoc: PAGE_SIZE });
  }

  function reset() {
    setSearchBy('MA_NHAN_VIEN');
    setKeyword('');
    setFilter({ trang: 0, kichThuoc: PAGE_SIZE });
  }

  async function saveEmployee(payload) {
    if (formMode === 'create') {
      await employeeService.create(payload);
      setNotice('Thêm nhân viên thành công.');
      setFormMode(null);
      load();
    } else if (formMode === 'edit' && selectedEmployee) {
      await employeeService.update(selectedEmployee.id, payload);
      setNotice(`Cập nhật nhân viên ${selectedEmployee.maNhanVien} thành công.`);
      setFormMode(null);
      setSelectedEmployee(null);
      load();
    }
  }

  async function deleteEmployee(employee) {
    await employeeService.remove(employee.id);
    setDeleteTarget(null);
    setNotice(`Xóa nhân viên ${employee.maNhanVien} - ${employee.hoTen} thành công.`);
    load();
  }

  if (formMode === 'create') return <EmployeeShell user={user}>
    <div className="mb-6 flex justify-between text-xs text-[#64748b]"><span>Quản trị / Quản lý nhân viên</span><span>Vân Việt • HCM</span></div>
    <div className="mb-6"><h1 className="text-2xl font-bold text-[#0f172a]">Thêm nhân viên</h1><p className="mt-1 text-sm text-[#64748b]">Tạo tài khoản mới và thiết lập quyền truy cập phù hợp.</p></div>
    <EmployeeForm mode="create" onCancel={() => setFormMode(null)} onSave={saveEmployee} />
    <EmployeeFormInfo mode="create" />
  </EmployeeShell>;

  if (formMode === 'edit' && selectedEmployee) return <EmployeeShell user={user}>
    <div className="mb-6 flex justify-between text-xs text-[#64748b]"><span>Quản trị / Quản lý nhân viên</span><span>Vân Việt • HCM</span></div>
    <div className="mb-6"><h1 className="text-2xl font-bold text-[#0f172a]">Sửa nhân viên</h1><p className="mt-1 text-sm text-[#64748b]">{selectedEmployee.maNhanVien} – {selectedEmployee.hoTen} • Cập nhật thông tin và quyền truy cập.</p></div>
    <EmployeeForm mode="edit" employee={selectedEmployee} onCancel={() => { setFormMode(null); setSelectedEmployee(null); }} onSave={saveEmployee} />
    <EmployeeFormInfo mode="edit" />
  </EmployeeShell>;

  return (
    <EmployeeShell user={user}>
      <div className="mb-7 flex items-center justify-between text-xs text-[#667895]"><span>Quản trị / Quản lý nhân viên</span><span>Vân Việt • HCM</span></div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-[24px] font-bold tracking-tight">Quản lý nhân viên</h1><p className="mt-1 text-sm text-[#667895]">{data ? `${total} tài khoản` : 'Tài khoản'} • Quản lý thông tin và phân quyền đội ngũ phòng vé.</p></div>
        <button type="button" onClick={() => { setNotice(''); setFormMode('create'); }} className="inline-flex items-center gap-2 rounded-lg bg-[#0284c7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0369a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"><img src={plusIcon} alt="" className="size-4" />Thêm nhân viên</button>
      </div>
      {notice && <div role="status" className="mb-6 rounded-lg border border-[#9be8c4] bg-[#eafbf3] px-4 py-3 text-sm font-semibold text-[#086b51]">{notice}</div>}
      <form onSubmit={search} className="mb-6 grid gap-4 rounded-xl border border-[#dce5ef] bg-white p-5 shadow-sm md:grid-cols-[240px_minmax(0,1fr)_auto_auto] md:items-end">
        <label className="block text-xs font-semibold text-[#33435e]">Tìm theo<select className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] bg-white px-3 text-sm font-normal text-[#23324a] focus:border-[#0284c7] focus:outline-none" value={searchBy} onChange={(event) => setSearchBy(event.target.value)}>{TIEU_CHI_TIM.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="block text-xs font-semibold text-[#33435e]">Từ khóa<div className="relative"><input className="mt-2 h-10 w-full rounded-lg border border-[#c9d7e7] px-3 pr-9 text-sm font-normal focus:border-[#0284c7] focus:outline-none" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Nhập mã nhân viên hoặc họ tên" maxLength={40} /><img src={searchIcon} alt="" className="absolute right-3 top-5 size-4" /></div></label>
        <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0284c7] px-5 text-sm font-semibold text-white hover:bg-[#0369a1]"><img src={searchButtonIcon} alt="" className="size-4" />Tìm</button>
        <button type="button" onClick={reset} className="h-10 rounded-lg border border-[#c9d7e7] px-5 text-sm font-semibold text-[#3e506c] hover:bg-[#f2f7fb]">Đặt lại</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-[#dce5ef] bg-white">
        <table className="w-full min-w-[1050px] border-collapse text-left text-[13px]">
          <thead className="bg-[#f0f4f8] text-xs font-semibold text-[#637692]"><tr>{['STT', 'Mã NV', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Email', 'SĐT', 'Phân quyền', 'Sửa / Xóa'].map((title) => <th key={title} scope="col" className="px-4 py-4">{title}</th>)}</tr></thead>
          <tbody>
            {employees.map((employee, index) => <tr key={employee.id} className="border-t border-[#e1e8f0] text-[#354660] hover:bg-[#f7fbfe]">
              <td className="px-4 py-4 text-[#72839c]">{start + index}</td>
              <td className="px-4 py-4">{employee.maNhanVien}</td>
              <td className="px-4 py-4 font-semibold">{employee.hoTen}</td>
              <td className="px-4 py-4">{formatDate(employee.ngaySinh)}</td>
              <td className="px-4 py-4">{{ Nam: 'Nam', Nu: 'Nữ', Khac: 'Khác' }[employee.gioiTinh] || employee.gioiTinh}</td>
              <td className="px-4 py-4">{employee.email}</td>
              <td className="px-4 py-4">{employee.soDienThoai}</td>
              <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${employee.vaiTro === 'ADMIN' ? 'bg-[#dff1fc] text-[#0076b6]' : 'bg-[#eef2f6] text-[#637692]'}`}>{employee.vaiTro === 'ADMIN' ? 'Admin' : 'Nhân viên'}</span></td>
              <td className="px-4 py-4"><button type="button" onClick={() => { setSelectedEmployee(employee); setFormMode('edit'); setNotice(''); }} className="mr-3 font-semibold text-[#0284c7] hover:underline">Sửa</button><button type="button" onClick={() => { setDeleteTarget(employee); setNotice(''); }} className="font-semibold text-red-600 hover:underline">Xóa</button></td>
            </tr>)}
          </tbody>
        </table>
        {loading && <div className="p-12 text-center text-sm text-[#667895]" role="status">Đang tải danh sách nhân viên...</div>}
        {!loading && error && <div className="p-12 text-center text-sm" role="alert"><p className="font-semibold text-[#172137]">{backendPending ? 'API danh sách nhân viên đang chờ Backend cập nhật' : 'Không tải được danh sách nhân viên'}</p><p className="mt-2 text-[#667895]">{backendPending ? 'Endpoint GET /api/v1/nhan-vien chưa có trên nhánh develop.' : error.message}</p><button type="button" onClick={load} className="mt-4 rounded-lg bg-[#0284c7] px-4 py-2 font-semibold text-white">Thử lại</button></div>}
        {!loading && !error && employees.length === 0 && <div className="p-12 text-center text-sm"><p className="font-semibold">{filter.tuKhoa ? 'Không có kết quả phù hợp' : 'Chưa có nhân viên'}</p><p className="mt-2 text-[#667895]">{filter.tuKhoa ? 'Thử thay đổi từ khóa hoặc tiêu chí tìm kiếm.' : 'Danh sách nhân viên sẽ hiển thị tại đây.'}</p></div>}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#667895]"><span>Hiển thị {start}–{end} trong {total} bản ghi</span><div className="flex items-center gap-2"><button type="button" disabled={filter.trang === 0 || loading} onClick={() => setFilter((current) => ({ ...current, trang: current.trang - 1 }))} className="rounded-lg border border-[#c9d7e7] px-4 py-2 disabled:opacity-50">Trước</button><span className="rounded-lg bg-[#0284c7] px-3 py-2 font-semibold text-white">{filter.trang + 1}</span><button type="button" disabled={!data || filter.trang >= data.tongTrang - 1 || loading} onClick={() => setFilter((current) => ({ ...current, trang: current.trang + 1 }))} className="rounded-lg border border-[#c9d7e7] px-4 py-2 disabled:opacity-50">Sau</button></div></div>
      {deleteTarget && <EmployeeDeleteDialog employee={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteEmployee} />}
    </EmployeeShell>
  );
}
