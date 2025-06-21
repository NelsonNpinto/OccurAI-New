import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
  withSpring
} from 'react-native-reanimated';
import AppContainer from '../../../components/AppContainer';
import MeditationHeader from '../MeditationHeader';
import MeditationFooter from '../MeditationFooter';

const Breathing444Component = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Breathe In');
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Reanimated shared values
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const phaseOpacity = useSharedValue(1);

  const breathingCycle = [
    { phase: 'Breathe In', duration: 4000, scales: [1.3, 1.4, 1.5] },
    { phase: 'Hold', duration: 4000, scales: [1.3, 1.4, 1.5] },
    { phase: 'Breathe Out', duration: 4000, scales: [1, 1, 1] },
  ];

  // Animation refs 
  const phaseTimeoutRef = useRef(null);

  const resetToInitialState = (callback = null) => {
    // Clear any pending timeouts
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    
    // Cancel all running animations
    cancelAnimation(scale1);
    cancelAnimation(scale2);
    cancelAnimation(scale3);
    cancelAnimation(phaseOpacity);

    // Reset to initial state with spring animation
    scale1.value = withSpring(1, { damping: 10, stiffness: 100 });
    scale2.value = withSpring(1, { damping: 10, stiffness: 100 });
    scale3.value = withSpring(1, { damping: 10, stiffness: 100 });

    setCurrentCycleIndex(0);
    setCurrentPhase('Breathe In');
    
    if (callback) {
      setTimeout(callback, 500); // Wait for spring animation to complete
    }
  };

  const startBreathingCycle = (cycleIndex = 0) => {
    if (!isPlaying) return;

    const { phase, duration, scales } = breathingCycle[cycleIndex];

    // Update phase text with fade effect
    phaseOpacity.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    setCurrentPhase(phase);

    // Start the scale animations
    scale1.value = withTiming(scales[0], {
      duration,
      easing: Easing.inOut(Easing.ease)
    });
    scale2.value = withTiming(scales[1], {
      duration,
      easing: Easing.inOut(Easing.ease)
    });
    scale3.value = withTiming(scales[2], {
      duration,
      easing: Easing.inOut(Easing.ease)
    });

    // Set timeout for next phase
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }

    phaseTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isResetting) {
        const nextIndex = (cycleIndex + 1) % breathingCycle.length;
        setCurrentCycleIndex(nextIndex);
      }
    }, duration);
  };

  useEffect(() => {
    if (isPlaying && !isResetting) {
      startBreathingCycle(currentCycleIndex);
    }

    return () => {
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, [isPlaying, currentCycleIndex, isResetting]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsResetting(false);
  };

  const handleStop = () => {
    setIsResetting(true);
    setIsPlaying(false);
    resetToInitialState();
  };

  const handleRestart = () => {
    setIsResetting(true);
    resetToInitialState(() => {
      setIsResetting(false);
      setIsPlaying(true);
    });
  };

  // Animated styles
  const circle1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }]
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }]
  }));

  const circle3Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }]
  }));

  const phaseTextStyle = useAnimatedStyle(() => ({
    opacity: phaseOpacity.value
  }));

  return (
    <View style={styles.screenContainer}>
      <AppContainer>
        <MeditationHeader title="Breathing 4-4-4" onBackPress={() => navigation.goBack()} />
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            <View style={styles.circleContainer}>
              <Animated.View style={[styles.circle, styles.circle3, circle3Style]} />
              <Animated.View style={[styles.circle, styles.circle2, circle2Style]} />
              <Animated.View style={[styles.circle, styles.circle1, circle1Style]}>
                <Animated.Text style={[styles.phaseText, phaseTextStyle]}>
                  {currentPhase}
                </Animated.Text>
              </Animated.View>
            </View>
          </View>
        </View>
        <MeditationFooter
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onRestart={handleRestart}
        />
      </AppContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 32,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 150,
    backgroundColor: 'rgba(228, 199, 130, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(228, 199, 130, 0.15)',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    width: 250,
    height: 250,
    zIndex: 2,
  },
  circle3: {
    width: 300,
    height: 300,
    zIndex: 1,
  },
  phaseText: {
    color: '#E4C782',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Breathing444Component;