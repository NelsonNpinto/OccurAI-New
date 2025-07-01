import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken = null;

export const setToken = token => {
  cachedToken = token;
  AsyncStorage.setItem('auth_token', token);
};

export const getToken = async () => {
  if (cachedToken) return cachedToken;
  const stored = await AsyncStorage.getItem('auth_token');
  cachedToken = stored;
  return stored;
};

export const clearToken = async () => {
  cachedToken = null;
  await AsyncStorage.removeItem('auth_token');
};

const LOCAL_IP = '192.168.0.202:8000'; // your PC's IP with FastAPI port
const PROD_URL = 'https://occurai.onrender.com';

const API_BASE_URL = __DEV__ ? `http://${LOCAL_IP}` : PROD_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// List of endpoints that should NOT have auth tokens
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

const normalizeUrl = url => {
  const qIndex = url.indexOf('?');
  return qIndex !== -1 ? url.slice(0, qIndex) : url;
};

// Updated endpoint checker
const isPublicEndpoint = url => {
  const cleanUrl = normalizeUrl(url);
  return PUBLIC_ENDPOINTS.includes(cleanUrl);
};

// Request interceptor to add auth token (but NOT for auth endpoints)
apiClient.interceptors.request.use(
  async config => {
    // Don't add token to public endpoints
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    // Add token for protected endpoints
    const token = await getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle 401 unauthorized errors (but not for login attempts)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      console.log('401 error detected, clearing token');

      // Clear stored token
      await clearToken();

      return Promise.reject(error);
    }

    // Handle network errors with more descriptive messages
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message =
          'Request timeout. Please check your connection and try again.';
      } else if (
        error.code === 'NETWORK_ERROR' ||
        error.message === 'Network Error'
      ) {
        error.message = 'Network error. Please check your connection.';
      } else {
        error.message = 'Unable to connect to server. Please try again.';
      }
    }

    // Log errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default apiClient;
