import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {appStyles} from '../../styles/styles';
import InlineCalendar from '../../components/InlineCalendar'; // Import the new component
import JournalReflection from './JournalReflection';
import AppContainer from '../../components/AppContainer';
import {journalService} from '../../services/api/journalService';
import MainHeader from '../../components/MainHeader';

const Journal = ({navigation}) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [readOnlyJournalData, setReadOnlyJournalData] = useState(null);

  // Calendar handlers
  const handleCalendarPress = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateSelect = async dateString => {
    setSelectedDate(dateString);

    const today = new Date().toISOString().split('T')[0];
    const isToday = dateString === today;

    if (isToday) {
      setReadOnlyJournalData(null); // Always editable for today
      return;
    }

    try {
      const data = await journalService.getJournalsByDay(dateString);
      if (data && data.length > 0) {
        setReadOnlyJournalData(data[0]); // Show read-only past journal
      } else {
        setReadOnlyJournalData(null); // No journal: show empty, but disable edit
      }
    } catch (err) {
      console.error('Failed to fetch journal for date', err);
      setReadOnlyJournalData(null);
    }
  };

  const handleCalendarClose = () => {
    setIsCalendarVisible(false);
  };

  // Create marked dates for journal entries
  const getMarkedDates = () => {
    const marked = {};

    // Mark today
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      marked: true,
      dotColor: '#E4C67F',
      selectedColor: '#E4C67F',
    };

    // Example: Mark dates with existing journal entries
    // You can replace this with actual data from your backend
    const journalDates = [
      '2025-06-01',
      '2025-05-31',
      '2025-05-30',
      '2025-05-29',
    ];

    journalDates.forEach(date => {
      marked[date] = {
        ...marked[date],
        marked: true,
        dotColor: '#4CAF50', // Green for days with journal entries
      };
    });

    return marked;
  };

  const handleContinue = () => {
    console.log('Continue pressed');
    // Add your continue logic here
  };

  return (
    <AppContainer>
      <SafeAreaView style={[appStyles.safeArea, {flex: 1}]}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={[
              appStyles.scrollContent,
              {paddingBottom: 100},
            ]}
            showsVerticalScrollIndicator={false}>
            {/* Journal Header with Calendar Toggle */}
            <MainHeader
            type='journal'
              onBackPress={() => navigation.goBack()}
              onCalendarPress={handleCalendarPress}
              date={selectedDate} // Pass selected date to header
              onDateChange={handleDateSelect} // Handle date changes from header
              markedDates={getMarkedDates()} // Pass marked dates
            />

            {/* Inline Calendar - Shows when calendar icon is pressed */}
            {isCalendarVisible && (
              <InlineCalendar
                visible={isCalendarVisible}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                markedDates={getMarkedDates()}
                onClose={handleCalendarClose}
              />
            )}

            {/* Pass navigation prop to JournalReflection */}
            <JournalReflection
              navigation={navigation}
              selectedDate={selectedDate}
              readOnlyJournalData={readOnlyJournalData}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </AppContainer>
  );
}; 

const styles = StyleSheet.create({
  // Button Container
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Continue Button
  continueButton: {
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 15,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },

  // Selected Date Display
  selectedDateContainer: {
    backgroundColor: 'rgba(228, 198, 127, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.3)',
  },
  selectedDateText: {
    color: '#E4C67F',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Journal;
