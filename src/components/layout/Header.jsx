import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import planeIcon from '../../assets/plane.svg';

/**
 * Header Component dùng chung cho toàn hệ thống
 * Hiển thị Menu điều hướng và Trạng thái đăng nhập theo thiết kế Figma
 */
export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/tin-tuc', label: 'Tin tức' },
    { to: '/khuyen-mai', label: 'Tin khuyến mãi' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
    { to: '/quy-dinh-hanh-ly', label: 'Quy định hành lý' },
    { to: '/bao-cao', label: 'Thống kê báo cáo' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-[#e2e8f0] border-b sticky top-0 z-50 w-full shadow-xs">
      <div className="max-w-[1440px] mx-auto h-[72px] px-6 lg:px-[120px] flex items-center justify-between">
        {/* Thương hiệu Vân Việt */}
        <Link to="/" className="flex items-center gap-[10px] group focus:outline-hidden">
          <div className="bg-[#0284c7] flex items-center justify-center rounded-[10px] size-[36px] shrink-0 transition-transform group-hover:scale-105">
            <img src={planeIcon} alt="Vân Việt Logo" className="size-[23px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#0f172a] text-[20px] leading-tight tracking-tight">
              Vân Việt
            </span>
            <span className="font-medium text-[#64748b] text-[9px] tracking-[1.4px]">
              PHÒNG VÉ MÁY BAY
            </span>
          </div>
        </Link>

        {/* Liên kết điều hướng Desktop */}
        <nav className="hidden md:flex items-center gap-[24px] text-[14px]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors py-1 ${
                isActive(link.to)
                  ? 'text-[#0284c7] font-semibold'
                  : 'text-[#334155] font-normal hover:text-[#0284c7]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Khu vực trạng thái tài khoản */}
        <div className="hidden md:flex items-center gap-[16px]">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="size-8 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold text-sm flex items-center justify-center">
                  {(user.hoTen || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold text-[#0f172a] max-w-[120px] truncate">
                    {user.hoTen || user.email}
                  </span>
                  {user.vaiTro && user.vaiTro !== 'KHACH_HANG' && (
                    <span className="text-[10px] font-medium text-[#0284c7]">
                      {user.vaiTro}
                    </span>
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50">
                  <div className="px-4 py-2 border-b border-[#f1f5f9]">
                    <p className="text-xs text-[#64748b]">Đăng nhập với</p>
                    <p className="text-xs font-semibold text-[#0f172a] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/tai-khoan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc]"
                  >
                    Tài khoản cá nhân
                  </Link>
                  <Link
                    to="/tai-khoan/thanh-toan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc]"
                  >
                    Thanh toán vé
                  </Link>
                  <Link
                    to="/tai-khoan/lich-su-giao-dich"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc]"
                  >
                    Lịch sử giao dịch
                  </Link>
                  <Link
                    to="/bao-cao"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#0284c7] font-medium hover:bg-[#f8fafc]"
                  >
                    Thống kê báo cáo
                  </Link>
                  {(user.vaiTro === 'ADMIN' || user.vaiTro === 'NHAN_VIEN') && (
                    <Link
                      to="/quan-ly-tin-tuc"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-[13px] text-[#0284c7] font-medium hover:bg-[#f8fafc]"
                    >
                      Quản lý tin tức
                    </Link>
                  )}
                  {user.vaiTro === 'ADMIN' && (
                    <Link
                      to="/quan-ly-nhan-vien"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-[13px] text-[#0284c7] font-medium hover:bg-[#f8fafc]"
                    >
                      Quản lý nhân viên
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 border-t border-[#f1f5f9] cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-[16px]">
              <Link
                to="/dang-ky"
                className="font-semibold text-[#0284c7] text-[14px] hover:underline"
              >
                Đăng ký
              </Link>
              <Link
                to="/dang-nhap"
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-[14px] h-[40px] px-[16px] rounded-[8px] flex items-center justify-center transition"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>

        {/* Nút bật/tắt Menu Mobile */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#334155] hover:text-[#0284c7] focus:outline-hidden"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu thả xuống Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2e8f0] bg-white px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 text-[15px] ${
                isActive(link.to) ? 'text-[#0284c7] font-semibold' : 'text-[#334155]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#f1f5f9] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 py-1 text-sm font-semibold text-[#0f172a]">
                  <span>Chào, {user.hoTen || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left text-sm text-red-600 py-1"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/dang-ky"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-[#0284c7] border border-[#0284c7] rounded-lg"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/dang-nhap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-white bg-[#0284c7] rounded-lg"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
