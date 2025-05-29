// src/services/api/authService.js
import apiClient from './apiClient';

export const authService = {
  // Login with username and password
  login: async (username, password) => {
    // Your backend expects FormData, not JSON
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Get user profile - FIXED ENDPOINT
  getProfile: async (token) => {
    const response = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update user profile - FIXED ENDPOINT
  updateProfile: async (updateData, token) => {
    const response = await apiClient.put('/auth/update-profile', updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};