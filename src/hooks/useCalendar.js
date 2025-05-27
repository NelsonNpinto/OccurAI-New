import { useState } from 'react';

const useCalendar = (initialDate = null) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [markedDates, setMarkedDates] = useState({});

  const showCalendar = () => {
    setIsCalendarVisible(true);
  };

  const hideCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    // Optionally close calendar after selection
    hideCalendar();
  };

  const markDate = (dateString, markingData) => {
    setMarkedDates(prev => ({
      ...prev,
      [dateString]: markingData
    }));
  };

  const markMultipleDates = (datesObject) => {
    setMarkedDates(prev => ({
      ...prev,
      ...datesObject
    }));
  };

  const clearMarkedDates = () => {
    setMarkedDates({});
  };

  // Helper function to mark health data dates
  const markHealthDataDates = (healthData) => {
    const healthMarkers = {};
    
    healthData.forEach(entry => {
      const { date, hasSteps, hasSleep, hasHeartRate, hasJournal, hasMeditation } = entry;
      const dots = [];
      
      if (hasSteps) dots.push({ color: '#4CAF50' }); // Green for steps
      if (hasSleep) dots.push({ color: '#2196F3' }); // Blue for sleep
      if (hasHeartRate) dots.push({ color: '#F44336' }); // Red for heart rate
      if (hasJournal) dots.push({ color: '#FF9800' }); // Orange for journal
      if (hasMeditation) dots.push({ color: '#9C27B0' }); // Purple for meditation
      
      if (dots.length > 0) {
        healthMarkers[date] = { dots };
      }
    });
    
    markMultipleDates(healthMarkers);
  };

  // Helper function to mark streak dates
  const markStreakDates = (streakDates, color = '#E4C67F') => {
    const streakMarkers = {};
    
    streakDates.forEach(date => {
      streakMarkers[date] = {
        selected: true,
        selectedColor: color,
        selectedTextColor: '#000000'
      };
    });
    
    markMultipleDates(streakMarkers);
  };

  // Format date for display
  const formatSelectedDate = (format = 'full') => {
    if (!selectedDate) return '';
    
    const date = new Date(selectedDate);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'medium':
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric' 
        });
      case 'full':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return selectedDate;
    }
  };

  return {
    // State
    isCalendarVisible,
    selectedDate,
    markedDates,
    
    // Actions
    showCalendar,
    hideCalendar,
    handleDateSelect,
    markDate,
    markMultipleDates,
    clearMarkedDates,
    
    // Health-specific helpers
    markHealthDataDates,
    markStreakDates,
    
    // Utilities
    formatSelectedDate,
  };
};

export default useCalendar;