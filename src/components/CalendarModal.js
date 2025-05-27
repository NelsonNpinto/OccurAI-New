import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {BlurView} from '@react-native-community/blur';

// Import your arrow icons
import RightArrow from '../../utils/icons/rightArrow.svg';
import LeftArrow from '../../utils/icons/leftArrow.svg';

const {width, height} = Dimensions.get('window');

const CalendarModal = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate = null,
  markedDates = {},
  minDate = null,
  maxDate = null,
}) => {
  // Always start with current month when calendar opens
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split('T')[0],
  );

  // Custom theme matching your design
  const calendarTheme = {
    backgroundColor: '#2A2A2A',
    calendarBackground: '#2A2A2A',
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
    textMonthFontSize: 20,
    textDayHeaderFontSize: 14,
  };

  // Reset to current month when modal opens
 React.useEffect(() => {
  if (visible) {
    setCurrentMonth(new Date().toISOString().split('T')[0]);
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
  const CustomHeader = ({month}) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
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
              width={20}
              height={20}
              stroke="#E4C67F"
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateMonth(1)}
            style={[styles.arrowButton ]}>
            <RightArrow
              width={20}
              height={20}
              stroke="#E4C67F"
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleDatePress = day => {
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
    // Close calendar after date selection
    onClose();
  };

  const handleMonthChange = month => {
    setCurrentMonth(month.dateString);
  };

  // Merge selected date with marked dates
  const combinedMarkedDates = {
    ...markedDates,
    ...(selectedDate && {
      [selectedDate]: {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: '#E4C67F',
        selectedTextColor: '#000000',
      },
    }),
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      {/* Backdrop with blur effect */}
      <BlurView style={styles.backdrop} blurType="dark" blurAmount={10}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}>
          {/* Calendar Container */}
          <View style={styles.calendarContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {/* Calendar */}
              <Calendar
                key={currentMonth}
                current={currentMonth}
                onDayPress={handleDatePress}
                onMonthChange={handleMonthChange}
                markedDates={combinedMarkedDates}
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
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  calendarContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  calendar: {
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2A2A2A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },

});

export default CalendarModal;
