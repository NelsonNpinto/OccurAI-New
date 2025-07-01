import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {journalService} from '../../services/api/journalService';
import JournalQuestions from './JournalQuestions';
import JournalSummaryScreen from './JournalSummaryScreen';

const JournalReflection = ({navigation, selectedDate, readOnlyJournalData}) => {
  if (!navigation) {
    console.warn('Navigation prop is missing in JournalReflection');
  }

  const [currentScreen, setCurrentScreen] = useState('questions'); // 'questions', 'summary'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedJournalData, setSavedJournalData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchTodayJournal = async () => {
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate === today) {
        try {
          const data = await journalService.getJournalsByDay(today);
          if (data && data.length > 0) {
            setSavedJournalData(data[0]); // latest today's journal
          }
        } catch (err) {
          console.error('Failed to fetch today journal:', err);
        }
      }
    };

    fetchTodayJournal();
  }, [selectedDate]);

  useEffect(() => {
    // Check if returning from chat with results
   const unsubscribe = navigation.addListener('focus', () => {
  const route = navigation.getState()?.routes?.find(r => r.name === 'JournalReflection');
  if (route?.params?.chatResults) {
    const chatResults = route.params.chatResults;
    handleChatComplete(chatResults);
    navigation.setParams({ chatResults: undefined }); // clear
  }
});

    return unsubscribe;
  }, [navigation]);

  const handleQuestionsComplete = async journalData => {
    try {
      setIsSubmitting(true);

      console.log('Submitting journal data:', journalData);
      await journalService.saveDetailedJournal(journalData);

      // Store the data in case user wants to edit
      setSavedJournalData(journalData);

      // Skip success modal and go directly to summary screen
      goToSummaryScreen();
    } catch (error) {
      console.error('Error submitting journal:', error);
      Alert.alert(
        'Error',
        'Failed to save your journal entry. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatComplete = (chatResults) => {
    // Handle chat completion and proceed directly to summary screen
    const journalData = {
      type: 'conversation',
      prompt: 'Conversational Journal with Aarya AI',
      response: chatResults.conversationSummary || 'Chat completed',
      feeling_now: '',
      feeling_most_of_day: chatResults.journalContext?.feeling_most_of_day?.join(', ') || '',
      triggered_by: '',
      expressed_to: '',
      body_reaction: '',
      note: 'Journal saved via conversational chat',
      chat_data: chatResults,
      tags: ['daily-reflection', 'mood-tracking', 'ai-chat', 'conversation'],
      backend_saved: true,
    };

    setSavedJournalData(journalData);
    goToSummaryScreen();
  };

  const goToSummaryScreen = async () => {
    // Set the screen to summary and start loading data
    setCurrentScreen('summary');
    setIsLoadingSummary(true);

    try {
      const response = await journalService.getMonthlySummary();
      console.log('Monthly summary response:', response);
      setMonthlyData(response);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      // Set empty data to stop loading state
      setMonthlyData({
        summary: 'Unable to generate insights at this time.',
        count: 0,
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleSummaryClose = () => {
    handleNavigateBack();
  };

  const handleEditJournal = () => {
    setCurrentScreen('questions');
    setMonthlyData(null);
  };

  const handleNavigateBack = () => {
    // Navigate back safely
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Home');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;
  const isReadOnly = !isToday && !!readOnlyJournalData;
  const editableAnswers = isToday ? savedJournalData : null;
  const readOnlyAnswers = !isToday ? readOnlyJournalData : null;

  switch (currentScreen) {
    case 'questions':
      return (
        <JournalQuestions
          navigation={navigation}
          onComplete={handleQuestionsComplete}
          isSubmitting={isSubmitting}
          defaultAnswers={isReadOnly ? readOnlyAnswers : editableAnswers}
          readOnly={isReadOnly}
        />
      );

    case 'summary':
      return (
        <JournalSummaryScreen
          visible={true}
           navigation={navigation}
          onEditJournal={handleEditJournal}
          onClose={handleSummaryClose}
          journalData={savedJournalData}
          monthlyData={monthlyData}
          isLoading={isLoadingSummary}
        />
      );

    default:
      return (
        <JournalQuestions
          navigation={navigation}
          onComplete={handleQuestionsComplete}
          isSubmitting={isSubmitting}
        />
      );
  }
};

export default JournalReflection;