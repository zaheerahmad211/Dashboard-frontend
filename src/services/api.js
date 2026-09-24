import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API URL
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/invalid token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error status is 401 (Unauthorized), it means the token is invalid or expired
    if (error.response && error.response.status === 401) {
      // Clear token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optionally redirect to login page if we are not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
