import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminShell from '../../../components/layout/AdminShell';
import AccountSidebar from './AccountSidebar';

export default function AccountPageLayout({ title, description, inAdminShell = false, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (inAdminShell) {
    const adminTabs = [
      { to: '/quan-ly/thong-tin', label: 'Thông tin cá nhân' },
      { to: '/quan-ly/doi-mat-khau', label: 'Đổi mật khẩu' },
    ];
    return (
      <AdminShell user={user} activeKey="profile">
        <div className="mb-6 flex flex-wrap justify-between gap-2 text-xs text-[#667895]">
          <span>{user?.vaiTro === 'NHAN_VIEN' ? 'Nhân viên' : 'Quản trị'} / {title}</span>
          <span>Vân Việt • HCM</span>
        </div>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-[#0f172a]">{title}</h1>
            <p className="mt-1 text-sm text-[#64748b]">{description}</p>
          </div>
          <nav aria-label="Mục tài khoản quản trị" className="flex gap-2">
            {adminTabs.map((tab) => {
              const active = location.pathname === tab.to;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#0284c7] text-white'
                      : 'border border-[#cbd5e1] bg-white text-[#334155] hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="max-w-[920px]">{children}</div>
      </AdminShell>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-72px)] py-6 px-4 lg:px-8">
      <div className="max-w-[1140px] mx-auto">
        <nav aria-label="Đường dẫn" className="text-[12px] text-[#64748b] mb-5 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0284c7]">Trang chủ</Link>
          <span>/</span>
          <Link to="/tai-khoan" className="hover:text-[#0284c7]">Tài khoản</Link>
          <span>/</span>
          <span className="text-[#0f172a] font-medium" aria-current="page">{title}</span>
        </nav>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <AccountSidebar />
          <div className="flex-1 min-w-0 w-full">
            <div className="mb-5">
              <h1 className="text-[24px] font-bold text-[#0f172a]">{title}</h1>
              <p className="text-[13px] text-[#64748b] mt-1">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
