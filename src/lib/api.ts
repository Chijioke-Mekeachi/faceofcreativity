import axios from 'axios';

export const API_BASE_URL = 'https://faceof-backend-ojfd.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foc_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Invalidate if token expired
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('foc_auth_token');
        localStorage.removeItem('foc_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
