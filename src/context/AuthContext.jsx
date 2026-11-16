import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const revision = useRef(0);
  const checkAuth = useCallback(async () => {
    const requestRevision = ++revision.current;
    try {
      const currentUser = await authService.getCurrentUser();
      if (requestRevision === revision.current) setUser(currentUser);
      return currentUser;
    } catch {
      if (requestRevision === revision.current) setUser(null);
      return null;
    } finally {
      if (requestRevision === revision.current) setLoading(false);
    }
  }, []);
  useEffect(() => { checkAuth(); }, [checkAuth]);
  const login = useCallback(async (credentials) => {
    const currentUser = await authService.login(credentials);
    revision.current += 1;
    setUser(currentUser);
    setLoading(false);
    return currentUser;
  }, []);
  const logout = useCallback(async () => {
    await authService.logout();
    revision.current += 1;
    setUser(null);
    setLoading(false);
  }, []);
  return <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, checkAuth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  return context;
}
