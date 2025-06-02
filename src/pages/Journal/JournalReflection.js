import React, { useState } from 'react';
import {
  Alert,
} from 'react-native';
import { journalService } from '../../services/api/journalService';
import JournalQuestions from './JournalQuestions';
import JournalSuccessModal from './JournalSuccessModal';
import JournalSummaryScreen from './JournalSummaryScreen';

const JournalReflection = ({ navigation }) => {
  // Add navigation safety check
  if (!navigation) {
    console.warn('Navigation prop is missing in JournalReflection');
  }

  const [currentScreen, setCurrentScreen] = useState('questions'); // 'questions', 'success', 'summary'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedJournalData, setSavedJournalData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleQuestionsComplete = async (journalData) => {
    try {
      setIsSubmitting(true);
      
      console.log('Submitting journal data:', journalData);
      await journalService.saveDetailedJournal(journalData);
      
      // Store the data in case user wants to edit
      setSavedJournalData(journalData);
      
      // Show success modal first
      setCurrentScreen('success');
    } catch (error) {
      console.error('Error submitting journal:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalDone = async () => {
    // Start loading summary when user clicks "Done" in success modal
    setCurrentScreen('summary');
    setIsLoadingSummary(true);
    
    try {
      const response = await journalService.getMonthlySummary();
      console.log('Monthly summary response:', response);
      setMonthlyData(response);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      // Set empty data to stop loading state
      setMonthlyData({ summary: 'Unable to generate insights at this time.', count: 0 });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleSuccessModalClose = () => {
    handleNavigateBack();
  };

  const handleSummaryClose = () => {
    handleNavigateBack();
  };

  const handleEditJournal = () => {
    setCurrentScreen('questions');
    // Reset data when editing
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

  // Render based on current screen - fullscreen without tab navigation
  switch (currentScreen) {
    case 'questions':
      return (
        <JournalQuestions 
          navigation={navigation}
          onComplete={handleQuestionsComplete}
          isSubmitting={isSubmitting}
         />
      );
      
    case 'success':
      return (
        <JournalSuccessModal
          visible={true}
          onDone={handleSuccessModalDone}
          onClose={handleSuccessModalClose}
        />
      );
      
    case 'summary':
      return (
        <JournalSummaryScreen
          visible={true}
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