import { Link, useLocation } from 'react-router-dom';
import AdminShell from '../../../components/layout/AdminShell';
import Loading from '../../../components/common/Loading';
import { useAuth } from '../../../context/AuthContext';

/** Chỉ mount màn hình và gọi API quản lý sau khi xác nhận vai trò. */
export default function DestinationWorkspace({ children }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const permitted = ['ADMIN', 'NHAN_VIEN'].includes(user?.vaiTro);
  return (
    <AdminShell user={user} activeKey="destinations">
      {loading ? <Loading message="Đang kiểm tra quyền truy cập…" /> : permitted ? (
        <div key={user.id}>{children}</div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold">Quản lý điểm đến</h1>
          <p className="mt-3 text-sm text-slate-600">Chức năng dành cho nhân viên và quản trị viên.</p>
          <Link to="/dang-nhap" state={{ from: pathname }} className="inline-block mt-4 text-sky-700 underline">Đăng nhập bằng tài khoản được cấp quyền</Link>
        </div>
      )}
    </AdminShell>
  );
}
