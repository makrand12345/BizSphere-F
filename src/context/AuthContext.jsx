import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, getToken, setToken, removeToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const { user } = await authAPI.getCurrentUser(token);
        setUser(user);
      } catch (error) {
        removeToken();
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};