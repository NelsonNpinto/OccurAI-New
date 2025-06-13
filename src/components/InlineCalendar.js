import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';

// Import your arrow icons
import RightArrow from '../../utils/icons/rightArrow.svg';
import LeftArrow from '../../utils/icons/leftArrow.svg';
import { journalService } from '../services/api/journalService';

const InlineCalendar = ({
  visible,
  onDateSelect,
  selectedDate = null,
  markedDates = {},
  minDate = null,
  maxDate = null,
  onClose,
  onJournalDataLoad, // New prop to pass journal data to parent
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split('T')[0],
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const calendarTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: '#8A8A8A',
    textSectionTitleDisabledColor: '#8A8A8A',
    selectedDayBackgroundColor: '#E4C67F',
    selectedDayTextColor: '#000000',
    todayTextColor: '#E4C67F',
    dayTextColor: '#E4C67F',
    textDisabledColor: '#5A5A5A',
    dotColor: '#E4C67F',
    selectedDotColor: '#000000',
    arrowColor: '#E4C67F',
    disabledArrowColor: '#5A5A5A',
    monthTextColor: '#FFFFFF',
    indicatorColor: '#E4C67F',
    textDayFontFamily: 'Urbanist',
    textMonthFontFamily: 'Urbanist',
    textDayHeaderFontFamily: 'Urbanist',
    textDayFontWeight: '400',
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '400',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 12,
  };

  // Reset to current month when calendar opens and clear selection
  React.useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date().toISOString().split('T')[0]);
      // Clear any previous selection when calendar opens
      if (onDateSelect) {
        onDateSelect(null);
      }
      // Clear any previous journal data
      if (onJournalDataLoad) {
        onJournalDataLoad(null);
      }
    }
  }, [visible]);

  // Function to navigate months
  const navigateMonth = direction => {
    const currentDate = new Date(currentMonth);
    currentDate.setMonth(currentDate.getMonth() + direction);
    const newDateString = currentDate.toISOString().split('T')[0];
    setCurrentMonth(newDateString);
  };

  // Custom header component - Month/Year left, Arrows right
  const CustomHeader = ({ month }) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const date = new Date(month);
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return (
      <View style={styles.headerContainer}>
        {/* Left side - Month and Year */}
        <Text style={styles.headerTitle}>
          {monthName} {year}
        </Text>

        {/* Right side - Navigation arrows */}
        <View style={styles.arrowsContainer}>
          <TouchableOpacity
            onPress={() => navigateMonth(-1)}
            style={styles.arrowButton}>
            <LeftArrow
              width={16}
              height={16}
              stroke="#E4C67F"
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateMonth(1)}
            style={styles.arrowButton}>
            <RightArrow
              width={16}
              height={16}
              stroke="#E4C67F"
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleDatePress = async (day) => {
    try {
      // Fetch journal data for the selected date if onJournalDataLoad is provided
      if (onJournalDataLoad) {
        const journalData = await journalService.getJournalsByDay(day.dateString);
        onJournalDataLoad(journalData);
      }
      
      // Call the original onDateSelect callback
      if (onDateSelect) {
        onDateSelect(day.dateString);
      }
    } catch (error) {
      console.error('Error fetching journal data:', error);
      // Still proceed with date selection even if journal fetch fails
      if (onDateSelect) {
        onDateSelect(day.dateString);
      }
      if (onJournalDataLoad) {
        onJournalDataLoad(null); // Clear any previous journal data
      }
    }
  };

  const handleMonthChange = month => {
    setCurrentMonth(month.dateString);
  };

  // Create comprehensive marked dates that includes:
  // 1. Today's date highlighted (full highlight if no selection, lighter if another date selected)
  // 2. Selected date highlighted with full golden background
  // 3. Any other marked dates passed as props (but without dots)
  const createMarkedDates = () => {
    const marked = { ...markedDates };

    // If no date is selected or today is selected, give today full highlight
    if (!selectedDate || selectedDate === today) {
      if (!marked[today]) {
        marked[today] = {};
      }
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: '#E4C67F',
        selectedTextColor: '#000000',
        marked: false,
        dotColor: undefined,
      };
    } else {
      // If another date is selected, give today a lighter highlight
      if (!marked[today]) {
        marked[today] = {};
      }
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: 'rgba(228, 198, 127, 0.4)', // Lighter/more transparent golden color
        selectedTextColor: '#E4C67F', // Golden text instead of black
        marked: false,
        dotColor: undefined,
      };

      // Mark the actually selected date with full golden background
      if (selectedDate) {
        if (!marked[selectedDate]) {
          marked[selectedDate] = {};
        }
        marked[selectedDate] = {
          ...marked[selectedDate],
          selected: true,
          selectedColor: '#E4C67F', // Full golden background
          selectedTextColor: '#000000', // Black text
          marked: false,
          dotColor: undefined,
        };
      }
    }

    // Remove dots from any other marked dates
    Object.keys(marked).forEach(date => {
      if (date !== today && date !== selectedDate) {
        marked[date] = {
          ...marked[date],
          marked: false,
          dotColor: undefined,
        };
      }
    });

    return marked;
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        key={currentMonth}
        current={currentMonth}
        onDayPress={handleDatePress}
        onMonthChange={handleMonthChange}
        markedDates={createMarkedDates()}
        theme={calendarTheme}
        minDate={minDate}
        maxDate={maxDate}
        enableSwipeMonths={true}
        hideExtraDays={true}
        firstDay={0} // Sunday as first day
        showWeekNumbers={false}
        disableMonthChange={false}
        hideArrows={true} // We'll use custom header
        renderHeader={date => <CustomHeader month={date} />}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arrowButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
  },
});

export default InlineCalendar;