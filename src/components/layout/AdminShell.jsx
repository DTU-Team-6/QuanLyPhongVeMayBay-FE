import { Link } from 'react-router-dom';
import planeIcon from '../../assets/plane.svg';
import menuIcon from '../../assets/employees/menu.svg';
import bellIcon from '../../assets/employees/bell.svg';
import userIcon from '../../assets/employees/user.svg';
import usersIcon from '../../assets/employees/users.svg';
import chartIcon from '../../assets/employees/chart.svg';

/**
 * Khung giao diện khu vực Quản trị (Header tối + Sidebar KHÔNG GIAN QUẢN TRỊ)
 * Dùng chung cho Quản lý nhân viên và Quản lý tin tức.
 */
export default function AdminShell({ user, activeKey = 'news', children }) {
  const isStaffOrAdmin = user?.vaiTro === 'ADMIN' || user?.vaiTro === 'NHAN_VIEN';
  const roleLabel = user?.vaiTro === 'ADMIN' ? 'Admin' : 'Nhân viên';

  const navItems = [
    {
      key: 'profile',
      to: '/tai-khoan',
      label: 'Thông tin Admin',
      icon: <img src={userIcon} alt="" className="size-[18px] shrink-0" />,
    },
    {
      key: 'employees',
      to: '/quan-ly-nhan-vien',
      label: 'Quản lý nhân viên',
      icon: <img src={usersIcon} alt="" className="size-[18px] shrink-0" />,
    },
    {
      key: 'reports',
      to: '/bao-cao',
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

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter',sans-serif] text-[#172137]">
      <header className="flex h-16 items-center justify-between bg-[#101827] px-4 text-white lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-7">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Vân Việt - Trang chủ">
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
          <span className="hidden text-[#aebcd0] md:block">
            {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full' }).format(new Date())}
          </span>
          <img src={bellIcon} alt="" className="hidden size-[18px] md:block" />
          {isStaffOrAdmin ? (
            <>
              <span className="flex size-9 items-center justify-center rounded-full bg-[#dff3ff] font-semibold text-[#075b8b]">
                {(user.hoTen || user.email || 'A').slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden font-semibold sm:block">
                {user.hoTen || 'Quản trị viên'}
              </span>
              <span className="rounded-full bg-[#dff3ff] px-3 py-1 font-semibold text-[#075b8b]">
                {roleLabel}
              </span>
            </>
          ) : (
            <span className="rounded-full border border-[#64748b] px-3 py-1 text-[#cbd5e1]">
              Xem giao diện
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[250px] shrink-0 border-r border-[#dbe4ee] bg-white px-4 py-6 lg:block">
          <p className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#667895]">
            KHÔNG GIAN QUẢN TRỊ
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

          {/* Menu di động nhanh ở sidebar desktop */}
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
