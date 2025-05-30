// src/services/api/journalService.js
import apiClient from './apiClient';

export const journalService = {
  // Save detailed journal entry - matches your backend RichJournalEntry model
  saveDetailedJournal: async (journalData) => {
    try {
      const response = await apiClient.post('/journal/journal/save-detailed', journalData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Save journal error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    try {
      const response = await apiClient.get('/journal/journal/summary/month');
      return response.data;
    } catch (error) {
      console.error('Get monthly summary error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get journals by specific day
  getJournalsByDay: async (date) => {
    try {
      const response = await apiClient.get(`/journal/journal/by-day?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Get journals by day error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update existing journal entry
  updateJournal: async (updateData) => {
    try {
      const response = await apiClient.patch('/journal/journal/update', updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update journal error:', error.response?.data || error.message);
      throw error;
    }
  },
};