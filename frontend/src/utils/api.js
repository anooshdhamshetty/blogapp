import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blogapp-1b3m.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
