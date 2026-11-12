import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout Component dùng chung cho toàn hệ thống
 * Đảm bảo Header và Footer hiển thị ổn định, cố định vị trí trên mọi trang
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      <Header />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
