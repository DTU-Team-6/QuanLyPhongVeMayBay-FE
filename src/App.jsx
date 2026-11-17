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

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}

