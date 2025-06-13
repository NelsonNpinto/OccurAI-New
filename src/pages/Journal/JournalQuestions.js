import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const JournalQuestions = ({onComplete, navigation}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // State for journal data from first screen
  const [journalData, setJournalData] = useState({
    feeling_now: '',
    feeling_most_of_day: "",
  });

  const totalPages = 2; // Questions + Chat

  // Day feelings options
  const dayFeelingOptions = [
    'Calm',
    'Anxious',
    'Grateful',
    'Tired',
    'Peaceful',
    'Overwhelmed',
    'Distracted',
    'Fulfilled',
    'Other',
  ];

  const handleSelection = (field, value, multiSelect = true) => {
    setJournalData(prev => {
      if (multiSelect) {
        const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return {...prev, [field]: newArray};
      } else {
        return {...prev, [field]: value};
      }
    });
  };

const handleNext = () => {
  if (currentPage < totalPages) {
    // Navigate to the JournalChat screen (part of journal flow)
    navigation.navigate('JournalChat', {
      journalContext: journalData,
      showBottomNavBar: false, // No bottom nav for journal chat
    });
  }
};



  const ChipButton = ({title, isSelected, onPress}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={
          isSelected
            ? ['rgba(228, 198, 127, 0.3)', 'rgba(228, 198, 127, 0.1)']
            : ['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']
        }
        style={[styles.chip, isSelected && styles.selectedChip]}>
        <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {[1, 2].map(page => (
        <View
          key={page}
          style={[
            styles.progressDot,
            currentPage === page && styles.progressDotActive,
            currentPage > page && styles.progressDotCompleted,
          ]}
        />
      ))}
    </View>
  );

  const NavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.7}>
        <Text style={styles.nextButtonText}>Continue to Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestionsPage = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
        style={[styles.questionContainer, {marginTop: 16}]}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionText}>
            How did you feel most of the day?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {dayFeelingOptions.map((option, index) => (
            <ChipButton
              key={index}
              title={option}
              isSelected={journalData.feeling_most_of_day.includes(option)}
              onPress={() =>
                handleSelection('feeling_most_of_day', option, true)
              }
            />
          ))}
        </View>
      </LinearGradient>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ProgressIndicator />

      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}></Text>
        <Text style={styles.headerTitle}>Reflect on Your Day</Text>
      </View>

      <View style={styles.contentContainer}>{renderQuestionsPage()}</View>

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
  scrollContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    padding: 12,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
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

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
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

  // Navigation Styles
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
    backgroundColor: '#E4C67F',
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default JournalQuestions;
