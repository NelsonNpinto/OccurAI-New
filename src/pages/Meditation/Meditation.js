import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import MeditationOptions from './MeditationOptions';
import JournalHeader from '../../components/JournalHeader';
import InlineCalendar from '../../components/InlineCalendar'; // Import the new component
import { appStyles } from '../../styles/styles';
import AppContainer from '../../components/AppContainer';

const Meditation = ({ navigation }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Calendar handlers
  const handleCalendarPress = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    console.log('Selected meditation date:', dateString);
    // You can add logic here to load meditation sessions for the selected date
  };

  const handleCalendarClose = () => {
    setIsCalendarVisible(false);
  };

  // Create marked dates for meditation sessions
  const getMarkedDates = () => {
    const marked = {};
    
    // Mark today
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      marked: true,
      dotColor: '#E4C67F',
      selectedColor: '#E4C67F',
    };

    // Example: Mark dates with meditation sessions
    // You can replace this with actual data from your backend
    const meditationDates = [
      '2025-06-01',
      '2025-05-31',
      '2025-05-30',
      '2025-05-28',
      '2025-05-27',
    ];

    meditationDates.forEach(date => {
      marked[date] = {
        ...marked[date],
        marked: true,
        dotColor: '#9C27B0', // Purple for meditation sessions
      };
    });

    return marked;
  };

  return (
    <AppContainer>
      <SafeAreaView style={[appStyles.safeArea, { backgroundColor: 'transparent' }]}>
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }} 
          contentContainerStyle={appStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Meditation Header with Calendar Toggle */}
          <JournalHeader
            title="Meditation"
            date={selectedDate}
            onBackPress={() => navigation.goBack()}
            onCalendarPress={handleCalendarPress}
            onDateChange={handleDateSelect}
            markedDates={getMarkedDates()}
            isCalendarVisible={isCalendarVisible}
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
          
          {/* Selected Date Display */}
          {selectedDate && (
            <View style={{
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: 'rgba(156, 39, 176, 0.3)',
            }}>
              <Text style={{
                color: '#9C27B0',
                fontSize: 14,
                fontFamily: 'Urbanist',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                Meditation for: {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
          
          <MeditationOptions navigation={navigation} selectedDate={selectedDate} />
        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Meditation;