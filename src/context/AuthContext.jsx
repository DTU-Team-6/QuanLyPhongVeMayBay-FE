import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const channelRef = useRef(null);
  const authCheckRef = useRef(0);

  useEffect(() => {
    const handleExpired = () => {
      if (user) {
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
        const currentUser = await checkAuth();
        if (currentUser) {
          window.dispatchEvent(new CustomEvent('auth-login-other-tab', { detail: currentUser }));
        }
      } else if (event.data === 'logout') {
        authCheckRef.current += 1;
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
    authCheckRef.current += 1;
    setUser(null);
    setLoading(false);
    channelRef.current?.postMessage('logout');
  }, []);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    authCheckRef.current += 1;
    setUser(authenticatedUser);
    setLoading(false);
    setSessionExpired(false);
    channelRef.current?.postMessage('login');
    return authenticatedUser;
  }, []);

  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  const value = {
    user,
    loading,
    sessionExpired,
    clearSessionExpired,
    isAuthenticated: !!user,
    checkAuth,
    login,
    logout,
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
