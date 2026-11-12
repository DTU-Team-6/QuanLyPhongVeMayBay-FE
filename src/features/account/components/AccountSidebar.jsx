import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * Lấy chữ cái viết tắt từ họ tên (VD: "Nguyễn Minh Anh" -> "NA" hoặc "MA")
 */
function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (email || 'KH').slice(0, 2).toUpperCase();
}

const MENU_ITEMS = [
  {
    to: '/tai-khoan',
    label: 'Thông tin cá nhân',
    matchPaths: ['/tai-khoan'],
    exact: true,
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    to: '/tai-khoan/thanh-toan',
    label: 'Thanh toán vé',
    matchPaths: ['/tai-khoan/thanh-toan', '/dat-ve/thanh-toan'],
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    to: '/tai-khoan/lich-su-giao-dich',
    label: 'Lịch sử giao dịch',
    matchPaths: ['/tai-khoan/lich-su-giao-dich'],
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/tai-khoan/doi-mat-khau',
    label: 'Đổi mật khẩu',
    matchPaths: ['/tai-khoan/doi-mat-khau'],
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

/**
 * Sidebar điều hướng khu vực Tài khoản (dùng chung cho 6.4.3 Thanh toán và 6.4.4 Lịch sử giao dịch)
 */
export default function AccountSidebar() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const displayName = user?.hoTen || user?.email || 'Khách hàng';
  const initials = getInitials(user?.hoTen, user?.email);
  const roleLabel =
    user?.vaiTro === 'ADMIN'
      ? 'Quản trị viên'
      : user?.vaiTro === 'NHAN_VIEN'
        ? 'Nhân viên phòng vé'
        : isAuthenticated
          ? 'Thành viên'
          : 'Chưa đăng nhập';

  const isMenuActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return item.matchPaths.some((p) => location.pathname.startsWith(p));
  };

  return (
    <aside className="w-full lg:w-[230px] shrink-0 flex flex-col gap-3">
      {/* Thẻ hồ sơ + menu */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-4 shadow-[0px_2px_8px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#f1f5f9]">
          <div className="size-16 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[20px] font-bold flex items-center justify-center">
            {initials}
          </div>
          <p className="mt-3 text-[14px] font-bold text-[#0f172a] leading-snug break-words max-w-full">
            {displayName}
          </p>
          <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef3c7] text-[#d97706]">
            {roleLabel}
          </span>
        </div>

        <nav className="mt-3 flex flex-col gap-1">
          {MENU_ITEMS.map((item) => {
            const active = isMenuActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[13px] transition-colors ${
                  active
                    ? 'bg-[#e0f2fe] text-[#0284c7] font-semibold'
                    : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Thẻ hỗ trợ */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-[12px] p-3.5 flex items-start gap-2.5">
        <div className="size-5 rounded-full bg-[#0284c7] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          i
        </div>
        <div className="text-[12px] leading-relaxed">
          <p className="text-[#0369a1]">Hỗ trợ đặt vé và thanh toán:</p>
          <p className="font-bold text-[#0284c7] text-[13px]">1900 6868</p>
        </div>
      </div>
    </aside>
  );
}
