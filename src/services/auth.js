import { apiRequest } from './api';

// Auth functions using the apiRequest utility
export const authAPI = {
  // Register user
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  getCurrentUser: async (token) => {
    return await apiRequest('/auth/me', {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  }
};

// Token management
export const setToken = (token) => {
  localStorage.setItem('bizsphere_token', token);
};

export const getToken = () => {
  return localStorage.getItem('bizsphere_token');
};

export const removeToken = () => {
  localStorage.removeItem('bizsphere_token');
};