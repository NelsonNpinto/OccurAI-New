import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import your SVG icons
import Breathwork from '../../../utils/icons/breathwork.svg';
import Sleep from '../../../utils/icons/medsleep.svg';
import Focus from '../../../utils/icons/focus.svg';
import StressRelief from '../../../utils/icons/exercise.svg';
import Lightning from '../../../utils/icons/light.svg';

const MeditationOptions = ({navigation}) => {
  const meditationOptions = [
    {
      id: 'breathwork',
      title: 'Breathwork',
      description: 'You will be guided by a voice on how to meditate',
      icon: Breathwork,
    },
    {
      id: 'sleep',
      title: 'Sleep',
      description: 'Wind down your day with calming lo-fi music.',
      icon: Sleep,
    },
    {
      id: 'focus',
      title: 'Focus',
      description: 'Increase your focus with our lo-fi music',
      icon: Focus,
    },
    {
      id: 'calm-start',
      title: 'Calm Start',
      description: 'Start you day with soft beat music.',
      icon: Lightning,
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief',
      description: 'Calming & soothing ambience sound to calm you down.',
      icon: StressRelief,
    },
  ];

  const handleOptionPress = option => {
    console.log('Selected meditation option:', option.title);

    // Navigate to GuidedMeditation screen with parameters
    navigation.navigate(
      'GuidedMeditation',
      {
        category: option.id,
        title: option.title,
        description: option.description,
      },
      50,
    );
  };

  const MeditationCard = ({option}) => (
    <TouchableOpacity
      onPress={() => handleOptionPress(option)}
      activeOpacity={0.7}>
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <option.icon width={30} height={30} color="#E4C67F" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{option.title}</Text>
          <Text style={styles.description}>{option.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Choose you Meditation</Text>
      </View>

      <View style={styles.optionsContainer}>
        {meditationOptions.map(option => (
          <MeditationCard key={option.id} option={option} />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 32,
    gap: 16,
  },
  headerContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  cardContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(94.35, 94.35, 94.35, 0.18)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  iconContainer: {
    padding: 15,
    backgroundColor: 'rgba(94.35, 94.35, 94.35, 0.18)',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 20,
  },
  description: {
    color: '#A3A3A3',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default MeditationOptions;
