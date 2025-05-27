import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, appStyles } from '../styles/styles';
import CalendarModal from './CalendarModal';

// Import your SVG icons
import Calendar from '../../utils/icons/CalenderIcon.svg';
import ArrowLeft from '../../utils/icons/leftArrow.svg';

const JournalHeader = ({ 
  title = 'Journal',
  date = null,
  onBackPress,
  onDateChange, // New prop to handle date changes
  markedDates = {} // Health data markings
}) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  // Format the current date if no date is provided
  const getFormattedDate = () => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      
      const formatted = dateObj.toLocaleDateString('en-GB', options);
      
      // Add ordinal suffix to day
      const day = dateObj.getDate();
      let suffix = 'th';
      if (day % 10 === 1 && day !== 11) suffix = 'st';
      else if (day % 10 === 2 && day !== 12) suffix = 'nd';
      else if (day % 10 === 3 && day !== 13) suffix = 'rd';
      
      return formatted.replace(/^\d+/, day + suffix);
    }
    
    if (date) return date;
    
    const now = new Date();
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    // Format as "1st April 2025"
    const formatted = now.toLocaleDateString('en-GB', options);
    
    // Add ordinal suffix to day
    const day = now.getDate();
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    return formatted.replace(/^\d+/, day + suffix);
  };

  const handleCalendarPress = () => {
    setIsCalendarVisible(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarVisible(false);
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setIsCalendarVisible(false);
    
    // Notify parent component about date change
    if (onDateChange) {
      onDateChange(dateString);
    }
  };

  const displayDate = getFormattedDate();

  return (
    <>
      <View style={styles.headerContainer}>
        {/* Left side - Back button and title */}
        <View style={styles.leftContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <ArrowLeft 
              width={20} 
              height={20} 
              stroke={colors.primary} 
              strokeWidth={2} 
              fill="none" 
            />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{displayDate}</Text>
          </View>
        </View>

        {/* Right side - Calendar icon */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleCalendarPress}
          activeOpacity={0.7}
        >
          <Calendar 
            width={20} 
            height={20} 
            stroke={colors.primary} 
            strokeWidth={2} 
            fill="none" 
          />
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <CalendarModal
        visible={isCalendarVisible}
        onClose={handleCalendarClose}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        markedDates={markedDates}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 2,
    width: '100%',
    gap: 10,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 12,
    backgroundColor: 'rgba(127.50, 127.50, 127.50, 0.30)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.primary, // #E4C67F
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'left',
  },
  subtitle: {
    color: 'rgba(228, 198, 127, 0.56)', // colors.primary with 56% opacity
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },
});

export default JournalHeader;