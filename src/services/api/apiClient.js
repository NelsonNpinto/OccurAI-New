import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken = null;

export const setToken = (token) => {
  cachedToken = token;
  AsyncStorage.setItem('auth_token', token);
};

export const getToken = async () => {
  if (cachedToken) return cachedToken;
  const stored = await AsyncStorage.getItem('auth_token');
  cachedToken = stored;
  return stored;
};


// Base API URL - Updated with your computer's IP
const API_BASE_URL = 'http://192.168.0.202:8000/api/v1'; 

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored token
      await AsyncStorage.removeItem('auth_token');
      
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;