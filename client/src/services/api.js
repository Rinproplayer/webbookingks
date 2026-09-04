import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor: add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostay_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear invalid session
      if (localStorage.getItem('hostay_token')) {
        localStorage.removeItem('hostay_token');
        localStorage.removeItem('hostay_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
