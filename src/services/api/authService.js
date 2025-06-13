import apiClient from "./apiClient";

const AUTH_PREFIX = '/auth/auth'; // Not just /auth

export const authService = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post(`${AUTH_PREFIX}/token`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post(`${AUTH_PREFIX}/register`, userData);
    return response.data;
  },

  getProfile: async (token) => {
    const response = await apiClient.get(`${AUTH_PREFIX}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateProfile: async (updateData, token) => {
    const response = await apiClient.put(`${AUTH_PREFIX}/update-profile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
