import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import planeIcon from '../../assets/plane.svg';
import menuIcon from '../../assets/employees/menu.svg';
import bellIcon from '../../assets/employees/bell.svg';
import userIcon from '../../assets/employees/user.svg';
import usersIcon from '../../assets/employees/users.svg';
import chartIcon from '../../assets/employees/chart.svg';

/**
 * Khung giao diện khu vực Quản trị (Header tối + Sidebar KHÔNG GIAN QUẢN TRỊ / KHÔNG GIAN NHÂN VIÊN)
 * Dùng chung cho tất cả màn hình quản trị: Thông tin, Nhân viên, Bán vé, Chat, Thống kê báo cáo, Tin tức.
 */
export default function AdminShell({ user: propUser, activeKey = 'news', children }) {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const user = propUser ?? authUser;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const isAdmin = user?.vaiTro === 'ADMIN';
  const isStaff = user?.vaiTro === 'NHAN_VIEN';
  const isStaffOrAdmin = isAdmin || isStaff;
  const roleLabel = isAdmin ? 'Admin' : 'Nhân viên';
  const workspaceHome = '/quan-ly';

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      await logout();
      navigate('/dang-nhap', {
        replace: true,
        state: { message: 'Đăng xuất thành công. Vui lòng đăng nhập lại.' },
      });
    } catch (error) {
      setLogoutError(error?.message || 'Đăng xuất thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const adminNavItems = [
    {
      key: 'dashboard',
      to: '/quan-ly',
      label: 'Dashboard',
      icon: (
        <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      key: 'profile',
      to: '/quan-ly/thong-tin',
      label: isStaff ? 'Thông tin tài khoản' : 'Thông tin Admin',
      icon: <img src={userIcon} alt="" className="size-[18px] shrink-0" />,
    },
    {
      key: 'employees',
      to: '/quan-ly-nhan-vien',
      label: 'Quản lý nhân viên',
      icon: <img src={usersIcon} alt="" className="size-[18px] shrink-0" />,
    },
    {
      key: 'tickets',
      to: '/quan-ly-ban-ve',
      label: 'Quản lý bán vé',
      icon: <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10M7 13h6" /></svg>,
    },
    {
      key: 'chat',
      to: '/quan-ly-chat',
      label: 'Chat khách hàng',
      icon: <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l2-3.2A7.5 7.5 0 1 1 20 11.5Z" /></svg>,
    },
    {
      key: 'reports',
      to: '/quan-ly/bao-cao',
      label: 'Thống kê báo cáo doanh thu',
      icon: <img src={chartIcon} alt="" className="size-[18px] shrink-0" />,
    },
    {
      key: 'news',
      to: '/quan-ly-tin-tuc',
      label: 'Quản lý tin tức',
      icon: (
        <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
  ];

  // Nhân viên phòng vé không xem Quản lý nhân viên và Chat Admin; Admin luôn thấy đủ 6 mục quản trị.
  const navItems = isStaff
    ? adminNavItems.filter((item) => item.key !== 'employees' && item.key !== 'chat')
    : adminNavItems;

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter',sans-serif] text-[#172137]">
      <header className="flex h-16 items-center justify-between bg-[#101827] px-4 text-white lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-7">
          <Link to={workspaceHome} className="flex items-center gap-2.5" aria-label="Vân Việt - Không gian quản trị">
            <span className="flex size-9 items-center justify-center rounded-[9px] bg-[#0284c7]">
              <img src={planeIcon} alt="" className="size-[23px]" />
            </span>
            <span className="leading-tight">
              <strong className="block text-[20px]">Vân Việt</strong>
              <small className="block text-[9px] tracking-[1.5px] text-[#b5c2d4]">
                PHÒNG VÉ MÁY BAY
              </small>
            </span>
          </Link>
          <img src={menuIcon} alt="" className="hidden size-[18px] lg:block" />
          <span className="hidden text-xs tracking-wide text-[#c2cad6] lg:block">
            HỆ THỐNG QUẢN LÝ PHÒNG VÉ
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-[#aebcd0] xl:block">
            {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full' }).format(new Date())}
          </span>
          <Link
            to="/"
            className="hidden rounded-lg border border-[#334155] px-3 py-1.5 font-medium text-[#cbd5e1] transition hover:border-[#64748b] hover:text-white sm:inline-flex"
          >
            Trang bán hàng
          </Link>
          <img src={bellIcon} alt="" className="hidden size-[18px] md:block" />
          {isStaffOrAdmin ? (
            <>
              <Link
                to="/quan-ly/thong-tin"
                className="flex items-center gap-2 rounded-lg py-1 pr-1 transition hover:opacity-90"
              >
                <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dff3ff] font-semibold text-[#075b8b]">
                  {getInitials(user.hoTen, user.email)}
                  {user.anhDaiDien && (
                    <img
                      key={user.anhDaiDien}
                      src={user.anhDaiDien}
                      alt=""
                      onError={(imageEvent) => { imageEvent.currentTarget.hidden = true; }}
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </span>
                <span className="hidden font-semibold sm:block">
                  {user.hoTen || 'Quản trị viên'}
                </span>
                <span className="rounded-full bg-[#dff3ff] px-3 py-1 font-semibold text-[#075b8b]">
                  {roleLabel}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg border border-rose-400/40 px-3 py-1.5 font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingOut ? 'Đang xuất...' : 'Đăng xuất'}
              </button>
            </>
          ) : (
            <Link
              to="/dang-nhap"
              className="rounded-full border border-[#64748b] px-3 py-1 text-[#cbd5e1] hover:text-white"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </header>
      {logoutError && (
        <p role="alert" className="bg-red-50 px-6 py-2 text-sm text-red-700">
          {logoutError}
        </p>
      )}

      <div className="mx-auto flex max-w-[1440px] min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[250px] shrink-0 border-r border-[#dbe4ee] bg-white px-4 py-6 lg:block">
          <p className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#667895]">
            {isStaff ? 'KHÔNG GIAN NHÂN VIÊN' : 'KHÔNG GIAN QUẢN TRỊ'}
          </p>
          <nav className="space-y-1.5 text-sm">
            {navItems.map((item) => {
              const active = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition ${
                    active
                      ? 'bg-[#dff1fc] font-semibold text-[#0076b6]'
                      : 'text-[#3d4c63] hover:bg-[#edf7fe]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Thông tin chi nhánh & trạng thái hệ thống */}
          <div className="mt-6 border-t border-[#dbe4ee] pt-4 text-xs text-[#687b98]">
            <p>Chi nhánh Hồ Chí Minh</p>
            <p className="mt-3 text-[#07976e]">● &nbsp;Hệ thống hoạt động tốt</p>
            <p className="mt-3">Trợ giúp • Hướng dẫn sử dụng</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Thanh chuyển nhanh trên Mobile */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => {
              const active = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                    active
                      ? 'bg-[#dff1fc] border-[#bae6fd] text-[#0076b6] font-semibold'
                      : 'bg-white border-[#dbe4ee] text-[#3d4c63]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {children}

          <footer className="mt-10 flex flex-wrap justify-between gap-2 border-t border-[#e2e8f0] pt-4 text-[11px] text-[#72839c]">
            <span>© 2026 Vân Việt • Hệ thống quản lý phòng vé</span>
            <span>Phiên bản 2.6</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
