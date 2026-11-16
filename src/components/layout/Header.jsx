import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import planeIcon from '../../assets/plane.svg';

/** Header dùng chung, điều hướng và phiên đăng nhập giống nhau trên mọi kích thước. */
export default function Header() {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const canManage = user?.vaiTro === 'ADMIN' || user?.vaiTro === 'NHAN_VIEN';
  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/tin-tuc', label: 'Tin tức' },
    { to: '/khuyen-mai', label: 'Tin khuyến mãi' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
    { to: '/quy-dinh-hanh-ly', label: 'Quy định hành lý' },
  ];
  const accountLinks = [
    { to: '/tai-khoan', label: 'Tài khoản cá nhân' },
    { to: '/tai-khoan/thanh-toan', label: 'Thanh toán vé' },
    { to: '/tai-khoan/lich-su-giao-dich', label: 'Lịch sử giao dịch' },
    ...(canManage ? [{ to: '/bao-cao', label: 'Thống kê báo cáo' }, { to: '/quan-ly-tin-tuc', label: 'Quản lý tin tức' }] : []),
    ...(user?.vaiTro === 'ADMIN' ? [{ to: '/quan-ly-nhan-vien', label: 'Quản lý nhân viên' }] : []),
  ];
  useEffect(() => { setMobileOpen(false); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    const onEscape = (event) => { if (event.key === 'Escape') { setMobileOpen(false); setAccountOpen(false); } };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);
  async function handleLogout() {
    setLogoutPending(true);
    setLogoutError('');
    try { await logout(); setAccountOpen(false); setMobileOpen(false); }
    catch { setLogoutError('Chưa thể đăng xuất. Vui lòng thử lại.'); }
    finally { setLogoutPending(false); }
  }
  const active = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);
  const accountContent = <>
    <p className="px-4 py-2 text-xs text-slate-500 break-all">{user?.email}</p>
    {accountLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => { setAccountOpen(false); setMobileOpen(false); }} className="block px-4 py-2 text-sm hover:bg-slate-50">{link.label}</Link>)}
    <button type="button" disabled={logoutPending} onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 border-t border-slate-100 disabled:opacity-50">{logoutPending ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
  </>;
  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50 w-full shadow-xs">
      <div className="max-w-[1440px] mx-auto min-h-[72px] px-6 xl:px-[80px] flex items-center justify-between gap-6">
        <Link to="/" aria-label="Vân Việt — Trang chủ" className="flex shrink-0 items-center gap-2.5">
          <span className="bg-[#0284c7] flex items-center justify-center rounded-[10px] size-9"><img src={planeIcon} alt="" className="size-[23px]" /></span>
          <span><strong className="block text-xl text-[#0f172a] leading-tight">Vân Việt</strong><small className="text-[9px] font-medium tracking-[1.4px] text-[#64748b]">PHÒNG VÉ MÁY BAY</small></span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden xl:flex items-center gap-5 text-sm">
          {navLinks.map((link) => <Link key={link.to} to={link.to} aria-current={active(link.to) ? 'page' : undefined} className={`py-2 whitespace-nowrap ${active(link.to) ? 'text-[#0284c7] font-semibold' : 'text-[#334155] hover:text-[#0284c7]'}`}>{link.label}</Link>)}
        </nav>
        <div className="hidden xl:block shrink-0">
          {loading ? <span role="status" className="text-sm text-slate-500">Đang kiểm tra phiên…</span> : user ? (
            <div className="relative">
              <button type="button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-controls="account-menu" className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold">{(user.hoTen || user.email || 'U').charAt(0).toUpperCase()}</span>
                <span className="max-w-[120px] truncate">{user.hoTen || user.email}</span>
              </button>
              {accountOpen && <div id="account-menu" className="absolute right-0 mt-2 w-60 rounded-lg bg-white shadow-lg border border-slate-200 py-1">{accountContent}</div>}
            </div>
          ) : <div className="flex items-center gap-4 text-sm font-semibold"><Link to="/dang-ky" className="text-[#0284c7]">Đăng ký</Link><Link to="/dang-nhap" className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2.5 rounded-lg">Đăng nhập</Link></div>}
        </div>
        <button type="button" aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 text-[#334155]">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
        </button>
      </div>
      {mobileOpen && <div id="mobile-menu" className="xl:hidden border-t border-slate-200 bg-white px-6 py-4 max-h-[calc(100dvh-72px)] overflow-y-auto">
        <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">{navLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} aria-current={active(link.to) ? 'page' : undefined} className={`py-2 text-sm ${active(link.to) ? 'font-semibold text-sky-600' : 'text-slate-700'}`}>{link.label}</Link>)}</nav>
        <div className="mt-3 pt-3 border-t border-slate-100">{loading ? <p role="status" className="text-sm text-slate-500">Đang kiểm tra phiên…</p> : user ? <><p className="px-4 text-sm font-semibold">Chào, {user.hoTen || user.email}</p>{accountContent}</> : <div className="flex gap-3"><Link to="/dang-ky" className="flex-1 text-center py-2 border border-sky-600 text-sky-600 rounded-lg">Đăng ký</Link><Link to="/dang-nhap" className="flex-1 text-center py-2 bg-sky-600 text-white rounded-lg">Đăng nhập</Link></div>}</div>
      </div>}
      {logoutError && <p role="alert" className="px-6 py-2 bg-red-50 text-red-700 text-sm">{logoutError}</p>}
    </header>
  );
}
