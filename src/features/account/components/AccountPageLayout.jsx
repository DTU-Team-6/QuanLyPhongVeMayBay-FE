import { Link } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';

export default function AccountPageLayout({ title, description, children }) {
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
