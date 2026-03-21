import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setStore(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api('/api/auth/me');
      setUser(data.user);
      setStore(data.store);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email, password) => {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setStore(data.store);
      return data;
    },
    []
  );

  const register = useCallback(
    async (payload) => {
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setStore(data.store);
      return data;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setStore(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      store,
      loading,
      login,
      register,
      logout,
      refresh,
      setStore,
    }),
    [user, store, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
