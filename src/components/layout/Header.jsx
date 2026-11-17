import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import planeIcon from '../../assets/plane.svg';
import { getInitials } from '../../utils/formatters';

/**
 * Header Component dùng chung cho toàn hệ thống
 * Hiển thị Menu điều hướng và Trạng thái đăng nhập theo thiết kế Figma
 */
export default function Header() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const isAuthPage = ['/dang-ky', '/dang-nhap'].includes(location.pathname);

  useEffect(() => {
    if (!userDropdownOpen && !mobileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (userDropdownOpen && !userDropdownRef.current?.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (mobileMenuOpen && !headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen, mobileMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      await logout();
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
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

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/tin-tuc', label: 'Tin tức' },
    { to: '/khuyen-mai', label: 'Tin khuyến mãi' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
    { to: '/quy-dinh-hanh-ly', label: 'Quy định hành lý' },
    { to: '/bao-cao', label: 'Thống kê báo cáo' },
  ];
  const visibleNavLinks = isAuthPage
    ? navLinks.filter((link) => ['/', '/khuyen-mai', '/gioi-thieu', '/quy-dinh-hanh-ly'].includes(link.to))
    : navLinks;

  const isActive = (path) => {
    if (isAuthPage && path === '/') return true;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header ref={headerRef} className="bg-white border-[#e2e8f0] border-b sticky top-0 z-50 w-full shadow-xs">
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
          {visibleNavLinks.map((link) => (
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
          {loading ? (
            <div role="status" className="flex items-center gap-2 animate-pulse">
              <span className="sr-only">Đang kiểm tra phiên đăng nhập</span>
              <span className="size-9 rounded-full bg-[#e0f2fe]" aria-hidden="true" />
              <span className="flex flex-col gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-24 rounded bg-slate-200" />
                <span className="h-2 w-14 rounded bg-slate-100" />
              </span>
            </div>
          ) : isAuthenticated && user ? (
            <div ref={userDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-lg py-1.5 hover:bg-slate-50 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0284c7]"
              >
                <div className="size-9 shrink-0 rounded-full bg-[#e0f2fe] text-[#0369a1] font-bold text-sm flex items-center justify-center">
                  {getInitials(user.hoTen, user.email)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold text-[#0f172a] max-w-[120px] truncate">
                    {user.hoTen || user.email}
                  </span>
                  <span className="text-[10px] text-[#64748b]">
                    {user.vaiTro === 'ADMIN' ? 'Quản trị viên' : user.vaiTro === 'NHAN_VIEN' ? 'Nhân viên phòng vé' : 'Thành viên'}
                  </span>
                </div>
                <svg className={`size-4 text-[#64748b] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50">
                  <Link
                    to="/tai-khoan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#334155] hover:bg-[#f8fafc]"
                  >
                    Thông tin cá nhân
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 border-t border-[#f1f5f9] cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
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
          {!loading && !isAuthenticated && (
            <Link
              to="/dang-nhap"
              className="mr-3 text-[14px] font-semibold text-[#0284c7]"
            >
              Đăng nhập
            </Link>
          )}
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
          {visibleNavLinks.map((link) => (
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
            {loading ? (
              <p role="status" className="text-sm text-[#64748b]">Đang kiểm tra phiên đăng nhập...</p>
            ) : isAuthenticated && user ? (
              <>
                <Link
                  to="/tai-khoan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-[#334155] py-1"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-left text-sm text-red-600 py-1 disabled:opacity-50"
                >
                  {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
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
      {logoutError && (
        <p role="alert" className="bg-red-50 px-6 py-2 text-sm text-red-700">
          {logoutError}
        </p>
      )}
    </header>
  );
}
