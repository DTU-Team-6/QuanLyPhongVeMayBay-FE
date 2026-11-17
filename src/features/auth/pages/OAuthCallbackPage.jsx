import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const errorMessages = {
  EMAIL_ALREADY_REGISTERED: 'Email này đã được đăng ký. Vui lòng sử dụng cách đăng nhập cũ.',
  OAUTH_PROFILE_INVALID: 'Không nhận được email hoặc thông tin hợp lệ từ nhà cung cấp.',
  ACCOUNT_INACTIVE: 'Tài khoản đã bị khóa hoặc chưa được kích hoạt.',
  OAUTH_FAILED: 'Đăng nhập với nhà cung cấp không thành công. Vui lòng thử lại.',
};

export default function OAuthCallbackPage() {
  const { finishOAuthLogin } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    let active = true;
    const complete = async () => {
      try {
        const error = new URLSearchParams(search).get('error');
        if (error) {
          sessionStorage.removeItem('oauth-login-next');
          navigate('/dang-nhap', {
            replace: true,
            state: { message: Object.hasOwn(errorMessages, error) ? errorMessages[error] : errorMessages.OAUTH_FAILED },
          });
          return;
        }
        const user = await finishOAuthLogin();
        if (!active) return;
        const next = sessionStorage.getItem('oauth-login-next');
        sessionStorage.removeItem('oauth-login-next');
        const safeNext = next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : null;
        navigate(safeNext || (user.vaiTro === 'KHACH_HANG' ? '/' : '/quan-ly-ban-ve'), { replace: true });
      } catch (error) {
        if (!active) return;
        navigate('/dang-nhap', {
          replace: true,
          state: { message: error.message || 'Không thể xác nhận đăng nhập. Vui lòng thử lại.' },
        });
      }
    };
    complete();
    return () => { active = false; };
  }, [finishOAuthLogin, navigate, search]);

  return <p role="status" className="p-8 text-center text-sm text-[#475569]">Đang xác nhận đăng nhập...</p>;
}
