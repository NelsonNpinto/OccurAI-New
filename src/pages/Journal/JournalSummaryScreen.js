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
import AppContainer from '../../components/AppContainer';

const JournalSummaryScreen = ({
  navigation,
  visible,
  onEditJournal,
  onClose,
  journalData,
  monthlyData: propMonthlyData,
  isLoading: propIsLoading,
  isToday = true,
}) => {
  // Local state for monthly data and loading
  const [monthlyData, setMonthlyData] = useState(propMonthlyData || null);
  const [isLoading, setIsLoading] = useState(propIsLoading || false);
  const [error, setError] = useState(null);

  // Animation for loading glow effect
  const glowAnimation = useRef(new Animated.Value(0)).current;
  // Animation for blinking continue button
  const blinkAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible && !monthlyData) {
      fetchMonthlySummary();
    }
  }, [visible]);

  // Update local state when props change
  useEffect(() => {
    if (propMonthlyData !== undefined) {
      setMonthlyData(propMonthlyData);
    }
  }, [propMonthlyData]);

  useEffect(() => {
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propIsLoading]);

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

      // Start blinking animation for continue button when loading
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnimation, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // Stop animations when not loading
      glowAnimation.stopAnimation();
      blinkAnimation.stopAnimation();
      // Reset blink animation to full opacity
      blinkAnimation.setValue(1);
    }
  }, [isLoading, glowAnimation, blinkAnimation]);

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
      // Set fallback data to stop loading state
      setMonthlyData({
        summary: 'Unable to generate insights at this time.',
        count: 0,
      });
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

  // Function to render formatted text with headings and paragraphs
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Split text by double newlines to separate paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Check if it's a heading (starts with # or is in ALL CAPS or ends with :)
      const isHeading = trimmedParagraph.match(/^#+\s/) || 
                       trimmedParagraph === trimmedParagraph.toUpperCase() || 
                       trimmedParagraph.endsWith(':');
      
      if (isHeading) {
        // Remove markdown heading symbols
        const headingText = trimmedParagraph.replace(/^#+\s*/, '');
        return (
          <Text key={index} style={styles.headingText}>
            {headingText}
          </Text>
        );
      } else {
        // Handle bold text within paragraphs
        const parts = trimmedParagraph.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={index} style={styles.paragraphText}>
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                return (
                  <Text key={partIndex} style={styles.boldText}>
                    {part.replace(/\*\*/g, '')}
                  </Text>
                );
              }
              return part;
            })}
          </Text>
        );
      }
    });
  };

  return (
    <AppContainer>
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
                  {isToday
                    ? 'Great Work! You completed your journal'
                    : 'Journal Entry'}
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
              style={[styles.editButton, isLoading && styles.editButtonDisabled]}
              onPress={() => {
                // Navigate to chat screen with edit mode parameters
                navigation.navigate('JournalChat', {
                  editJournalData: journalData,
                  journalDate: new Date().toISOString().split('T')[0],
                });
              }}
              disabled={isLoading}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.editButtonText,
                  isLoading && styles.editButtonTextDisabled,
                ]}>
                {isLoading ? 'Loading...' : 'Edit Journal'}
              </Text>
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
                  <View style={styles.summaryContainer}>
                    <Text style={styles.quoteText}>"</Text>
                    <View style={styles.formattedTextContainer}>
                      {renderFormattedText(monthlyData?.summary) || (
                        <Text style={styles.summaryText}>
                          No insights available at the moment.
                        </Text>
                      )}
                    </View>
                    <Text style={styles.quoteText}>"</Text>
                  </View>

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

        {/* Continue button - only show for today's entry */}
        {isToday && (
          <View style={styles.buttonContainer}>
            <Animated.View style={[{opacity: blinkAnimation}]}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isLoading && styles.continueButtonDisabled
                ]}
                onPress={onClose}
                disabled={isLoading}
                activeOpacity={0.7}>
                <Text style={[
                  styles.continueButtonText,
                  isLoading && styles.continueButtonTextDisabled
                ]}>
                  {isLoading ? 'Loading Insights...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </AppContainer>
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
  editButtonDisabled: {
    opacity: 0.6,
  },
  editButtonTextDisabled: {
    color: 'rgba(228, 198, 127, 0.6)',
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
  summaryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formattedTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  insightText: {
    textAlign: 'center',
  },
  quoteText: {
    color: '#E4C67F',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '700',
    lineHeight: 21,
    marginVertical: 4,
  },
  headingText: {
    color: '#E4C67F',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  paragraphText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '600',
    color: '#E4C67F',
    fontStyle: 'normal',
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

  // Button Container
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(228, 198, 127, 0.5)',
  },
  continueButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(26, 26, 26, 0.6)',
  },
});

export default JournalSummaryScreen;