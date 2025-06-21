import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {appStyles} from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import AppContainer from '../../components/AppContainer';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const {width} = Dimensions.get('window');

const GuidedMeditation = ({navigation, route}) => {
  const {category} = route.params || {category: 'breathwork'};
  const [savedItems, setSavedItems] = useState(new Set());

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, []),
  );

  const meditationData = {
    breathwork: {
      title: 'Breathwork',
      subtitle: 'Breathing Techniques',
      sections: [
        {
          title: 'Guided Breathwork',
          items: [
            {
              id: 'breathing-442',
              title: 'Breathing 4-4-2',
              gradient: ['#f7797d', '#FBD786', '#C6FFDD'],
              duration: '10 min',
              tags: ['Breathing', 'Meditation', 'Calm'],
              isBreathingExercise: true,
              breathingType: '442',
            },
            {
              id: 'breathing-444',
              title: 'Breathing 4-4-4',
              gradient: ['#f7797d', '#FBD786', '#C6FFDD'],
              duration: '12 min',
              tags: ['Breathing', 'Meditation'],
              isBreathingExercise: true,
              breathingType: '444',
            },
            {
              id: 'breathing-666',
              title: 'Breathing 6-6-6',
              gradient: ['#f7797d', '#FBD786', '#C6FFDD'],
              duration: '18 min',
              tags: ['Breathing', 'Meditation', 'Deep'],
              isBreathingExercise: true,
              breathingType: '666',
            },
            {
              id: 'breathing-4444',
              title: 'Breathing 4-4-4-4',
              gradient: ['#f7797d', '#FBD786', '#C6FFDD'],
              duration: '16 min',
              tags: ['Breathing', 'Meditation', 'Focus'],
              isBreathingExercise: true,
              breathingType: '4444',
            },
          ],
        },
      ],
    },
  }; 

  const currentData = meditationData[category] || meditationData.breathwork;

  const handleItemPress = item => {
    if (item.isBreathingExercise) {
      if (item.breathingType === '442') {
        navigation.navigate('Breathing442', {item});
      } else if (item.breathingType === '444') {
        navigation.navigate('Breathing444', {item});
      } else if (item.breathingType === '666') {
        navigation.navigate('Breathing666', {item});
      } else if (item.breathingType === '4444') {
        navigation.navigate('Breathing4444', {item});
      }
    }
  };

  const renderMeditationCard = (item, isLarge = false) => {
    const isSaved = savedItems.has(item.id);

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.meditationCard,
          isLarge ? styles.largeCard : styles.smallCard,
        ]}
        activeOpacity={0.8}
        onPress={() => handleItemPress(item)}>
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={item.gradient}
            style={styles.gradientBackground}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          />

          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardAuthor}>{item.author}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <AppContainer>
        <SafeAreaView style={appStyles.safeArea}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={appStyles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <JournalHeader
              title={currentData.title}
              onBackPress={() => navigation.goBack()}
            />

            {currentData.sections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>

                <View style={styles.playlistContainer}>
                  {section.items.map(item => renderMeditationCard(item, false))}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </AppContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    marginBottom: 16,
  },
  playlistContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  meditationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  smallCard: {
    width: (width - 48) / 2,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: 'rgba(228, 198, 127, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: '#E4C67F',
    fontSize: 10,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default GuidedMeditation;
