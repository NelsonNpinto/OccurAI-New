import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const JournalReflection = () => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [selectedExpressions, setSelectedExpressions] = useState([]);
  const [selectedReactions, setSelectedReactions] = useState([]);

  const moodOptions = [
    'Calm', 'Anxious', 'Grateful', 'Tired', 'Peaceful', 
    'Overwhelmed', 'Distracted', 'Fulfilled', 'Other'
  ];

  const momentOptions = [
    'A memory', 'Meditation', 'Family time', 'Work pressure', 
    'A conversation', 'Unexpected news', 'Other'
  ];

  const expressionOptions = [
    'Yes, to a friend', 'Yes, in my journal', 'No, I kept it inside', 
    'I tried, but couldn\'t', 'Shared with family', 'Other'
  ];

  const reactionOptions = [
    'Relaxed', 'Tensed up', 'Heart racing', 'Tears', 
    'Fatigue', 'Light and free', 'Other'
  ];

  const handleSelection = (item, selectedItems, setSelectedItems, multiSelect = true) => {
    if (multiSelect) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter(selected => selected !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems(selectedItems.includes(item) ? [] : [item]);
    }
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

  const QuestionSection = ({ 
    emoji, 
    question, 
    options, 
    selectedItems, 
    setSelectedItems, 
    multiSelect = true 
  }) => (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
      style={styles.questionContainer}
    >
      <View style={styles.questionHeader}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.questionText}>{question}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <ChipButton
            key={index}
            title={option}
            isSelected={selectedItems.includes(option)}
            onPress={() => handleSelection(option, selectedItems, setSelectedItems, multiSelect)}
          />
        ))}
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}>🧠</Text>
        <Text style={styles.headerTitle}>Reflect on Your Day</Text>
      </View>

      <QuestionSection
        emoji="🙂"
        question="How are you feeling right now?"
        options={['😭', '😞', '😐', '😊', '😎']}
        selectedItems={selectedMoods}
        setSelectedItems={setSelectedMoods}
        multiSelect={false}
      />

      <QuestionSection
        emoji=""
        question="How did you feel most of the day?"
        options={moodOptions}
        selectedItems={selectedMoods}
        setSelectedItems={setSelectedMoods}
      />

      <QuestionSection
        emoji=""
        question="What moment triggered this feeling?"
        options={momentOptions}
        selectedItems={selectedMoments}
        setSelectedItems={setSelectedMoments}
      />

      <QuestionSection
        emoji=""
        question="Did you express this feeling to anyone?"
        options={expressionOptions}
        selectedItems={selectedExpressions}
        setSelectedItems={setSelectedExpressions}
      />

      <QuestionSection
        emoji=""
        question="How did your body react to this feeling?"
        options={reactionOptions}
        selectedItems={selectedReactions}
        setSelectedItems={setSelectedReactions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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
});

export default JournalReflection;