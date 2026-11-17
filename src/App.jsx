import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import router from './app/routes';

function AuthRouter() {
  const { sessionExpired, clearSessionExpired } = useAuth();

  useEffect(() => {
    if (sessionExpired) {
      clearSessionExpired();
      router.navigate('/dang-nhap', {
        replace: true,
        state: { message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' },
      });
    }
  }, [sessionExpired, clearSessionExpired]);

  useEffect(() => {
    const handleLoginOtherTab = (event) => {
      if (!['/dang-nhap', '/dang-ky'].includes(router.state.location.pathname)) return;
      const next = new URLSearchParams(router.state.location.search).get('next');
      router.navigate(next?.startsWith('/') && !next.startsWith('//')
        ? next
        : event.detail.vaiTro === 'KHACH_HANG' ? '/' : '/quan-ly-ban-ve', { replace: true });
    };
    window.addEventListener('auth-login-other-tab', handleLoginOtherTab);
    return () => window.removeEventListener('auth-login-other-tab', handleLoginOtherTab);
  }, []);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}

