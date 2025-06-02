import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {journalService} from '../../services/api/journalService';
import SuccessLogo from '../../../utils/icons/SuccessLogo.svg';
import Light from '../../../utils/icons/light.svg';
import Aarya from '../../../utils/icons/Aarya.svg';

const JournalSummaryScreen = ({
  visible,
  onEditJournal,
  onClose,
  journalData,
}) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation for loading glow effect
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fetchMonthlySummary();
    }
  }, [visible]);

  useEffect(() => {
    if (isLoading) {
      // Start glow animation when loading
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      // Stop animation when not loading
      glowAnimation.stopAnimation();
    }
  }, [isLoading, glowAnimation]);

  const fetchMonthlySummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the monthly summary endpoint
      const response = await journalService.getMonthlySummary();
      console.log('Monthly summary response:', response);

      setMonthlyData(response);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError('Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  // Animated glow opacity
  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Success Card */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
          style={styles.outerContainer}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <View style={styles.checkmarkContainer}>
                <SuccessLogo width={35} height={35} />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.successTitle}>
                Great Work! You completed your journal
              </Text>
              <View style={styles.streakContainer}>
                <Text style={styles.successSubtitle}>
                  You're on a roll with your{' '}
                  <Text style={styles.streakNumber}>19 day</Text> streak{' '}
                </Text>
                <Light width={16} height={16} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditJournal}
            activeOpacity={0.7}>
            <Text style={styles.editButtonText}>Edit Journal</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Aarya's Insight Card */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
          style={styles.outerContainer}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>
              <Text style={styles.insightTitleItalic}>Aarya's </Text>
              Insight
            </Text>

            <View style={styles.orbContainer}>
              {isLoading ? (
                <Animated.View
                  style={[styles.loadingOrb, {opacity: glowOpacity}]}>
                  <LinearGradient
                    colors={['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4']}
                    style={styles.gradientOrb}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}>
                    <View style={styles.innerGlow} />
                  </LinearGradient>
                </Animated.View>
              ) : (
                <View style={styles.staticOrb}>
                  <LinearGradient
                    colors={['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4']}
                    style={styles.gradientOrb}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}>
                    <View style={styles.innerGlow} />
                  </LinearGradient>
                </View>
              )}
            </View>
          </View>

          <View style={styles.insightTextContainer}>
            {error ? (
              <Text style={styles.errorText}>"{error}"</Text>
            ) : (
              <>
                <Text style={styles.insightText}>
                  "
                  {monthlyData?.summary ||
                    'No insights available at the moment.'}
                  "
                </Text>

                {monthlyData?.count && !isLoading && (
                  <Text style={styles.journalCountText}>
                    Based on {monthlyData.count} journal{' '}
                    {monthlyData.count === 1 ? 'entry' : 'entries'} this month
                  </Text>
                )}
              </>
            )}
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Continue button fixed at bottom */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={onClose}
        activeOpacity={isLoading ? 1 : 0.8}
        disabled={isLoading}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 8,
    paddingBottom: 100, // Add space for fixed button
  },
  outerContainer: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 32,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },

  // Success Card Styles
  successCard: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(94.35, 94.35, 94.35, 0.18)',
    borderRadius: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    position: 'relative',
    backgroundColor: '#615100',
    borderRadius: 40,
    borderWidth: 5.66,
    borderColor: '#E4C67F',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#E4C67F',
    fontSize: 32,
    fontWeight: 'bold',
  },
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 4,
  },
  successTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  successSubtitle: {
    textAlign: 'center',
    color: '#A3A3A3',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    lineHeight: 16,
  },
  streakNumber: {
    fontWeight: '600',
    color: '#A3A3A3',
  },
  editButton: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E4C67F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    textAlign: 'center',
    color: '#E4C67F',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 24,
  },

  // Insight Card Styles
  insightHeader: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
  },
  insightTitle: {
    textAlign: 'center',
    color: '#E4C67F',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    lineHeight: 18,
  },
  insightTitleItalic: {
    fontStyle: 'italic',
  },

  // Orb Styles
  orbContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOrb: {
    width: 160,
    height: 160,
    padding: 7.27,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E4C67F',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  staticOrb: {
    width: 160,
    height: 160,
    padding: 7.27,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOrb: {
    width: 145.45,
    height: 145.45,
    borderRadius: 72.72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Text Content
  insightTextContainer: {
    alignSelf: 'stretch',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
  },
  errorText: {
    color: 'rgba(255, 100, 100, 0.8)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
  },
  journalCountText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // Continue Button
  continueButton: {
    backgroundColor: '#E4C67F',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 15,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  continueButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default JournalSummaryScreen;