import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const JournalQuestions = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for all journal data matching backend structure
  const [journalData, setJournalData] = useState({
    feeling_now: '',
    feeling_most_of_day: [],
    triggered_by: [],
    expressed_to: [],
    body_reaction: [],
    note: '',
  });

  const totalPages = 3;

  // Page 1: Current feeling (emoji selection)
  const currentFeelingOptions = ['😭', '😞', '😐', '😊', '😎'];

  // Page 2: Day feelings and triggers
  const dayFeelingOptions = [
    'Calm', 'Anxious', 'Grateful', 'Tired', 'Peaceful', 
    'Overwhelmed', 'Distracted', 'Fulfilled', 'Other'
  ];

  const momentOptions = [
    'A memory', 'Meditation', 'Family time', 'Work pressure', 
    'A conversation', 'Unexpected news', 'Other'
  ];

  // Page 3: Expression and body reaction
  const expressionOptions = [
    'Yes, to a friend', 'Yes, in my journal', 'No, I kept it inside', 
    'I tried, but couldn\'t', 'Shared with family', 'Other'
  ];

  const reactionOptions = [
    'Relaxed', 'Tensed up', 'Heart racing', 'Tears', 
    'Fatigue', 'Light and free', 'Other'
  ];

  const handleSelection = (field, value, multiSelect = true) => {
    setJournalData(prev => {
      if (multiSelect) {
        const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [field]: newArray };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    // Prepare data for backend - convert arrays to strings as expected
    const submitData = {
      type: "triggered",
      prompt: "Daily Reflection",
      response: `Current feeling: ${journalData.feeling_now}, Day feelings: ${journalData.feeling_most_of_day.join(', ')}, Note: ${journalData.note}`,
      feeling_now: journalData.feeling_now,
      feeling_most_of_day: Array.isArray(journalData.feeling_most_of_day) 
        ? journalData.feeling_most_of_day.join(', ') 
        : journalData.feeling_most_of_day.toString(),
      triggered_by: Array.isArray(journalData.triggered_by) 
        ? journalData.triggered_by.join(', ') 
        : journalData.triggered_by.toString(),
      expressed_to: Array.isArray(journalData.expressed_to) 
        ? journalData.expressed_to.join(', ') 
        : journalData.expressed_to.toString(),
      body_reaction: Array.isArray(journalData.body_reaction) 
        ? journalData.body_reaction.join(', ') 
        : journalData.body_reaction.toString(),
      note: journalData.note || '',
      tags: ['daily-reflection', 'mood-tracking']
    };

    onComplete(submitData);
  };

  const ChipButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={
          isSelected 
            ? ['rgba(228, 198, 127, 0.3)', 'rgba(228, 198, 127, 0.1)']
            : ['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']
        }
        style={[
          styles.chip,
          isSelected && styles.selectedChip
        ]}
      >
        <Text style={[
          styles.chipText,
          isSelected && styles.selectedChipText
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((page) => (
        <View
          key={page}
          style={[
            styles.progressDot,
            currentPage === page && styles.progressDotActive,
            currentPage > page && styles.progressDotCompleted
          ]}
        />
      ))}
    </View>
  );

  const NavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentPage > 1 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrevious}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.spacer} />
      
      {currentPage < totalPages ? (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={styles.questionContainer}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.emoji}>🙂</Text>
                <Text style={styles.questionText}>How are you feeling right now?</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {currentFeelingOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelection('feeling_now', option, false)}
                    activeOpacity={0.7}
                    style={[
                      styles.emojiButton,
                      journalData.feeling_now === option && styles.emojiButtonSelected
                    ]}
                  >
                    <Text style={styles.emojiText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={[styles.questionContainer, { marginTop: 16 }]}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>How did you feel most of the day?</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {dayFeelingOptions.map((option, index) => (
                  <ChipButton
                    key={index}
                    title={option}
                    isSelected={journalData.feeling_most_of_day.includes(option)}
                    onPress={() => handleSelection('feeling_most_of_day', option, true)}
                  />
                ))}
              </View>
            </LinearGradient>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={styles.questionContainer}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>What moment triggered this feeling?</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {momentOptions.map((option, index) => (
                  <ChipButton
                    key={index}
                    title={option}
                    isSelected={journalData.triggered_by.includes(option)}
                    onPress={() => handleSelection('triggered_by', option, true)}
                  />
                ))}
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={[styles.questionContainer, { marginTop: 16 }]}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>Did you express this feeling to anyone?</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {expressionOptions.map((option, index) => (
                  <ChipButton
                    key={index}
                    title={option}
                    isSelected={journalData.expressed_to.includes(option)}
                    onPress={() => handleSelection('expressed_to', option, true)}
                  />
                ))}
              </View>
            </LinearGradient>
          </ScrollView>
        );

      case 3: 
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={styles.questionContainer}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>How did your body react to this feeling?</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {reactionOptions.map((option, index) => (
                  <ChipButton
                    key={index}
                    title={option}
                    isSelected={journalData.body_reaction.includes(option)}
                    onPress={() => handleSelection('body_reaction', option, true)}
                  />
                ))}
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={[styles.questionContainer, { marginTop: 16 }]}
            >
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>Any additional notes?</Text>
              </View>
              
              <TextInput
                style={styles.noteInput}
                value={journalData.note}
                onChangeText={(text) => setJournalData(prev => ({ ...prev, note: text }))}
                placeholder="Write any additional thoughts here..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </LinearGradient>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}>🧠</Text>
        <Text style={styles.headerTitle}>Reflect on Your Day</Text>
      </View>

      <ProgressIndicator />

      <View style={styles.contentContainer}>
        {renderPage()}
      </View>

      <NavigationButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#E4C67F',
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: '#E4C67F',
  },
  contentContainer: {
    flex: 1,
  },
  questionContainer: {
    padding: 12,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    gap: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  questionText: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: '#E4C67F',
    backgroundColor: 'rgba(228, 198, 127, 0.2)',
  },
  emojiText: {
    fontSize: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
  },
  selectedChip: {
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.5)',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 16,
  },
  selectedChipText: {
    color: '#E4C67F',
  },
  noteInput: {
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 16,
    padding: 16,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.2)',
    minHeight: 100,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.3)',
  },
  backButtonText: {
    color: '#E4C67F',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#E4C67F',
  },
  nextButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#E4C67F',
  },
  submitButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default JournalQuestions;