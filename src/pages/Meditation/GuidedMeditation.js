import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {appStyles} from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import AppContainer from '../../components/AppContainer';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const {width} = Dimensions.get('window');

const GuidedMeditation = ({navigation, route}) => {
  const {category} = route.params || {category: 'breathwork'};
  const [savedItems, setSavedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially

  // SOLUTION 1: Simplified focus effect without loading states
  useFocusEffect(
    useCallback(() => {
      // Reset saved items when screen focuses (optional)
      // setSavedItems(new Set());
      
      // No loading states to prevent glitches
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // SOLUTION 2: Alternative approach - use regular useEffect instead of useFocusEffect
  // useEffect(() => {
  //   // Component mounted, ready to display
  //   setIsLoading(false);
  // }, []);

  const meditationData = {
    breathwork: {
      title: 'Breathwork',
      subtitle: 'Breathing Techniques',
      sections: [
        {
          title: 'Recommended',
          items: [
            {
              id: 1,
              title: 'How to Meditate',
              author: 'by Andy Puddicombe',
              image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              duration: '10 min',
              tags: ['Meditation', 'Narrated'],
            },
            {
              id: 2,
              title: 'Breathing Technique',
              author: 'by Wim Hof',
              image:
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
              duration: '15 min',
              tags: ['Breathing', 'Meditation', 'Calm'],
            },
          ],
        },
        {
          title: 'Top Playlist',
          items: [
            {
              id: 3,
              title: 'Breathing Meditation',
              author: 'Various Artists',
              image:
                'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&h=300&fit=crop',
              duration: '8 min',
              tags: ['Meditation', 'Narrated', 'Breathing'],
            },
            {
              id: 4,
              title: 'Nature Meditation',
              author: 'Meditation Guide',
              image:
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
              duration: '12 min',
              tags: ['Meditation', 'Narrated', 'White Noise'],
            },
            {
              id: 5,
              title: "Ocean's Breeze",
              author: 'Nature Sounds',
              image:
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
              duration: '9 min',
              tags: ['Meditation', 'White Noise'],
            },
            {
              id: 6,
              title: "Nature's Bliss",
              author: 'Relaxation Music',
              image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              duration: '11 min',
              tags: ['Meditation', 'White Noise'],
            },
            {
              id: 7,
              title: 'Rainy Weather',
              author: 'Ambient Sounds',
              image:
                'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=300&fit=crop',
              duration: '6 min',
              tags: ['Meditation', 'White Noise'],
            },
            {
              id: 8,
              title: 'Quiet Night',
              author: 'Sleep Sounds',
              image:
                'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
              duration: '10 min',
              tags: ['Meditation', 'White Noise'],
            },
          ],
        },
      ],
    },
    sleep: {
      title: 'Sleep',
      subtitle: 'Sleep Meditations',
      sections: [
        {
          title: 'Recommended',
          items: [
            {
              id: 9,
              title: 'Deep Sleep Stories',
              author: 'by Sleep Guru',
              image:
                'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop',
              duration: '30 min',
              tags: ['Sleep', 'Narrated'],
            },
          ],
        },
      ],
    },
    focus: {
      title: 'Focus',
      subtitle: 'Focus Enhancement',
      sections: [
        {
          title: 'Recommended',
          items: [
            {
              id: 10,
              title: 'Focus Flow',
              author: 'by Concentration Master',
              image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              duration: '20 min',
              tags: ['Focus', 'Productivity'],
            },
          ],
        },
      ],
    },
    'calm-start': {
      title: 'Calm Start',
      subtitle: 'Morning Meditation',
      sections: [
        {
          title: 'Recommended',
          items: [
            {
              id: 11,
              title: 'Morning Calm',
              author: 'by Daily Zen',
              image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              duration: '15 min',
              tags: ['Morning', 'Energizing'],
            },
          ],
        },
      ],
    },
    'stress-relief': {
      title: 'Stress Relief',
      subtitle: 'Calming Sessions',
      sections: [
        {
          title: 'Recommended',
          items: [
            {
              id: 12,
              title: 'Stress Away',
              author: 'by Relaxation Expert',
              image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              duration: '25 min',
              tags: ['Stress Relief', 'Calming'],
            },
          ],
        },
      ],
    },
  };

  const currentData = meditationData[category] || meditationData.breathwork;

  // SOLUTION 3: Remove loading screen entirely to prevent glitches
  // if (isLoading) {
  //   return (
  //     <AppContainer>
  //       <SafeAreaView style={appStyles.safeArea}>
  //         <View style={styles.loadingContainer}>
  //           <ActivityIndicator size="large" color="#E4C67F" />
  //         </View>
  //       </SafeAreaView>
  //     </AppContainer>
  //   );
  // }

  const toggleSave = itemId => {
    const newSavedItems = new Set(savedItems);
    if (newSavedItems.has(itemId)) {
      newSavedItems.delete(itemId);
    } else {
      newSavedItems.add(itemId);
    }
    setSavedItems(newSavedItems);
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
        activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.image}} style={styles.meditationImage} />

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => toggleSave(item.id)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.bookmarkIcon,
                {color: isSaved ? '#E4C67F' : '#FFFFFF'},
              ]}>
              {isSaved ? '★' : '☆'}
            </Text>
          </TouchableOpacity>

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

  // SOLUTION 4: Add consistent background to prevent flashing
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

                {section.title === 'Recommended' ? (
                  <View style={styles.recommendedContainer}>
                    {section.items.map(item => renderMeditationCard(item, true))}
                  </View>
                ) : (
                  <View style={styles.playlistContainer}>
                    {section.items.map(item => renderMeditationCard(item, false))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </AppContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  // SOLUTION 5: Add screen container with consistent background
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000', // Match your app background exactly
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Consistent background
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
  recommendedContainer: {
    gap: 16,
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
  largeCard: {
    width: '100%',
  },
  smallCard: {
    width: (width - 48) / 2,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  meditationImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
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
  cardAuthor: {
    color: '#A3A3A3',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
  },
});

export default GuidedMeditation;