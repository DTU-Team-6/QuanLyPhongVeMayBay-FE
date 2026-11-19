import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const channelRef = useRef(null);
  const authCheckRef = useRef(0);
  const sessionVersionRef = useRef(0);
  const userIdRef = useRef(null);

  useEffect(() => {
    const handleExpired = () => {
      if (user) {
        sessionVersionRef.current += 1;
        authCheckRef.current += 1;
        userIdRef.current = null;
        setUser(null);
        setSessionExpired(true);
      }
    };
    window.addEventListener('auth-session-expired', handleExpired);
    return () => window.removeEventListener('auth-session-expired', handleExpired);
  }, [user]);

  const checkAuth = useCallback(async () => {
    const check = ++authCheckRef.current;
    try {
      const currentUser = await authService.getCurrentUser();
      if (check === authCheckRef.current) {
        if (userIdRef.current !== (currentUser?.id ?? null)) {
          sessionVersionRef.current += 1;
          userIdRef.current = currentUser?.id ?? null;
        }
        setUser(currentUser);
        return currentUser;
      }
    } catch (error) {
      console.warn('Không thể kiểm tra phiên đăng nhập:', error);
    } finally {
      if (check === authCheckRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('auth-session');
    channelRef.current = channel;

    const handleMessage = async (event) => {
      if (event.data === 'login') {
        sessionVersionRef.current += 1;
        const currentUser = await checkAuth();
        if (currentUser) {
          window.dispatchEvent(new CustomEvent('auth-login-other-tab', { detail: currentUser }));
        }
      } else if (event.data === 'logout') {
        sessionVersionRef.current += 1;
        authCheckRef.current += 1;
        userIdRef.current = null;
        setUser(null);
        setLoading(false);
        setSessionExpired(false);
      }
    };
    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return;
      const currentUser = await checkAuth();
      if (currentUser) {
        window.dispatchEvent(new CustomEvent('auth-login-other-tab', { detail: currentUser }));
      }
    };
    if (channel) channel.addEventListener('message', handleMessage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        channel.removeEventListener('message', handleMessage);
        channel.close();
      }
      channelRef.current = null;
    };
  }, [checkAuth]);

  const logout = useCallback(async () => {
    await authService.logout();
    sessionVersionRef.current += 1;
    authCheckRef.current += 1;
    userIdRef.current = null;
    setUser(null);
    setLoading(false);
    channelRef.current?.postMessage('logout');
  }, []);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    sessionVersionRef.current += 1;
    authCheckRef.current += 1;
    userIdRef.current = authenticatedUser.id;
    setUser(authenticatedUser);
    setLoading(false);
    setSessionExpired(false);
    channelRef.current?.postMessage('login');
    return authenticatedUser;
  }, []);

  const finishOAuthLogin = useCallback(async () => {
    const authenticatedUser = await authService.getCurrentUser();
    if (!authenticatedUser) {
      throw new Error('Không xác nhận được phiên đăng nhập. Vui lòng thử lại.');
    }
    sessionVersionRef.current += 1;
    authCheckRef.current += 1;
    userIdRef.current = authenticatedUser.id;
    setUser(authenticatedUser);
    setLoading(false);
    setSessionExpired(false);
    channelRef.current?.postMessage('login');
    return authenticatedUser;
  }, []);

  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  const refreshPersonalInfo = useCallback(async () => {
    const version = sessionVersionRef.current;
    const profile = await authService.getPersonalInfo();
    if (version !== sessionVersionRef.current || profile.id !== userIdRef.current) {
      throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng tải lại hồ sơ.');
    }
    authCheckRef.current += 1;
    setUser(profile);
    return profile;
  }, []);

  const updatePersonalInfo = useCallback(async (profile) => {
    const version = sessionVersionRef.current;
    const updated = await authService.updatePersonalInfo(profile);
    if (version !== sessionVersionRef.current || updated.id !== userIdRef.current) {
      throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng tải lại hồ sơ.');
    }
    authCheckRef.current += 1;
    setUser(updated);
    return updated;
  }, []);

  const updateAvatar = useCallback(async (publicId) => {
    const version = sessionVersionRef.current;
    const result = await authService.updateAvatar(publicId);
    if (version !== sessionVersionRef.current || result.profile.id !== userIdRef.current) {
      throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng tải lại hồ sơ.');
    }
    authCheckRef.current += 1;
    setUser(result.profile);
    return result;
  }, []);

  const value = {
    user,
    loading,
    sessionExpired,
    clearSessionExpired,
    isAuthenticated: !!user,
    checkAuth,
    login,
    finishOAuthLogin,
    logout,
    refreshPersonalInfo,
    updatePersonalInfo,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
