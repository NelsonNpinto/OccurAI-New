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

  const handleQuestionsComplete = async (journalData) => {
    try {
      setIsSubmitting(true);
      
      console.log('Submitting journal data:', journalData);
      await journalService.saveDetailedJournal(journalData);
      
      // Show success modal first
      setCurrentScreen('success');
    } catch (error) {
      console.error('Error submitting journal:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalDone = () => {
    setCurrentScreen('summary');
  };

  const handleSuccessModalClose = () => {
    // Navigate back directly if user closes modal
    handleNavigateBack();
  };

  const handleSummaryClose = () => {
    handleNavigateBack();
  };

  const handleEditJournal = () => {
    // Go back to questions screen to edit
    setCurrentScreen('questions');
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
        />
      );
    
    case 'success':
      return (
        <>
          <JournalQuestions 
            navigation={navigation}
            onComplete={handleQuestionsComplete} 
          />
          <JournalSuccessModal
            visible={true}
            onDone={handleSuccessModalDone}
            onClose={handleSuccessModalClose}
          />
        </>
      );
    
    case 'summary':
      return (
        <JournalSummaryScreen
          visible={true}
          onEditJournal={handleEditJournal}
          onClose={handleSummaryClose}
        />
      );
    
    default:
      return (
        <JournalQuestions 
          navigation={navigation}
          onComplete={handleQuestionsComplete} 
        />
      );
  }
};

export default JournalReflection;