import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import AppContainer from '../../../components/AppContainer';
import MeditationHeader from '../MeditationHeader';
import MeditationFooter from '../MeditationFooter';

const BOX_SIZE = 270;
const POINTER_SIZE = 20;
const BORDER_RADIUS = 20;
const BORDER_WIDTH = 30;

const Breathing666Component = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Breathe In');
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const phaseOpacity = useSharedValue(1);
  const pointerProgress = useSharedValue(0); // 0 to 1 for complete cycle

  const breathingCycle = [
    { phase: 'Breathe In', duration: 2000 },
    { phase: 'Hold', duration: 2000 },
    { phase: 'Breathe Out', duration: 2000 },
    { phase: 'Hold', duration: 2000 },
  ];

  const phaseTimeoutRef = useRef(null);

  const resetToInitialState = (callback = null) => {
    // Clear any pending timeouts
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    
    // Cancel all running animations
    cancelAnimation(pointerProgress);
    cancelAnimation(phaseOpacity);

    // Reset to initial state
    pointerProgress.value = 0;
    phaseOpacity.value = 1;
    
    setCurrentPhase('Breathe In');
    setCurrentCycleIndex(0);
    setIsResetting(false);

    if (callback) {
      setTimeout(callback, 300);
    }
  };

  const startBreathingCycle = (cycleIndex = 0) => {
    if (!isPlaying || isResetting) return;

    const { phase, duration } = breathingCycle[cycleIndex];

    // Update phase immediately (no worklet issues)
    setCurrentPhase(phase);

    // Update phase text with fade effect
    phaseOpacity.value = withSequence(
      withTiming(0, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    // Calculate target progress for this phase
    // Each phase should move exactly 0.25 (one side of the square)
    const targetProgress = (cycleIndex + 1) * 0.25;
    
    // Animate pointer along the box border
    pointerProgress.value = withTiming(
      targetProgress,
      {
        duration,
        easing: Easing.linear,
      },
      (finished) => {
        // No state updates in animation callback to avoid worklet errors
      }
    );

    // Set timeout for next phase
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }

    phaseTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isResetting) {
        const nextIndex = (cycleIndex + 1) % breathingCycle.length;
        
        // When we complete a full cycle (after last Hold phase), reset everything
        if (nextIndex === 0) {
          // Reset progress to 0 and start fresh cycle
          pointerProgress.value = 0;
          setCurrentCycleIndex(0);
          // Start the next cycle immediately
          setTimeout(() => {
            if (isPlaying && !isResetting) {
              startBreathingCycle(0);
            }
          }, 50);
        } else {
          setCurrentCycleIndex(nextIndex);
        }
      }
    }, duration);
  };

  useEffect(() => {
    if (isPlaying && !isResetting) {
      startBreathingCycle(currentCycleIndex);
    } else {
      // Stop animations when paused
      cancelAnimation(pointerProgress);
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
        phaseTimeoutRef.current = null;
      }
    }

    return () => {
      cancelAnimation(pointerProgress);
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, [isPlaying, currentCycleIndex, isResetting]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setIsResetting(false);
  };

  const handleStop = () => {
    setIsResetting(true);
    setIsPlaying(false);
    resetToInitialState();
  };

   const handleRestart = () => {
    // Force stop everything first, regardless of current state
    setIsResetting(true);
    setIsPlaying(false);
    
    // Reset to initial state and then immediately start playing
    resetToInitialState(() => {
      setIsPlaying(true);
    });
  };

  const phaseTextStyle = useAnimatedStyle(() => ({
    opacity: phaseOpacity.value,
  }));

  const pointerStyle = useAnimatedStyle(() => {
    // Use the raw progress value, only apply modulo for position calculation
    const progress = pointerProgress.value;
    const normalizedProgress = progress % 1; // Only for position calculation
    const halfBorder = BORDER_WIDTH / 2;
    const halfPointer = POINTER_SIZE / 2;
    
    // Calculate the path dimensions (middle of the border)
    const pathWidth = BOX_SIZE - BORDER_WIDTH;
    const pathHeight = BOX_SIZE - BORDER_WIDTH;
    const totalPerimeter = (pathWidth + pathHeight) * 2;
    const distance = normalizedProgress * totalPerimeter;

    // ADJUSTABLE OFFSET VALUES - Change these to move the pointer position
    const POINTER_OFFSET_X = -30; // Positive = move right, Negative = move left
    const POINTER_OFFSET_Y = -29; // Positive = move down, Negative = move up
    
    // You can also adjust the pointer's distance from the border:
    const BORDER_OFFSET = 0; // Positive = move outward from border, Negative = move inward

    let left = 0;
    let top = 0;

    if (distance <= pathWidth) {
      // Top edge (left to right) - Breathe In (0 to 0.25)
      left = distance - halfPointer + halfBorder + POINTER_OFFSET_X;
      top = -halfPointer + halfBorder + POINTER_OFFSET_Y - BORDER_OFFSET;
    } else if (distance <= pathWidth + pathHeight) {
      // Right edge (top to bottom) - Hold (0.25 to 0.5)
      left = pathWidth - halfPointer + halfBorder + POINTER_OFFSET_X + BORDER_OFFSET;
      top = distance - pathWidth - halfPointer + halfBorder + POINTER_OFFSET_Y;
    } else if (distance <= pathWidth * 2 + pathHeight) {
      // Bottom edge (right to left) - Breathe Out (0.5 to 0.75)
      left = (pathWidth * 2 + pathHeight) - distance - halfPointer + halfBorder + POINTER_OFFSET_X;
      top = pathHeight - halfPointer + halfBorder + POINTER_OFFSET_Y + BORDER_OFFSET;
    } else {
      // Left edge (bottom to top) - Hold (0.75 to 1.0)
      left = -halfPointer + halfBorder + POINTER_OFFSET_X - BORDER_OFFSET;
      top = totalPerimeter - distance - halfPointer + halfBorder + POINTER_OFFSET_Y;
    }

    return {
      left,
      top,
    };
  });

  return (
    <View style={styles.screenContainer}>
      <AppContainer>
        <MeditationHeader title="Breathing 6-6-6" onBackPress={() => navigation.goBack()} />
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            <View style={styles.visualizationContainer}>
              <View style={styles.box}>
                <Animated.Text style={[styles.phaseText, phaseTextStyle]}>
                  {currentPhase}
                </Animated.Text>
                <Animated.View style={[styles.pointer, pointerStyle]} />
              </View>
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
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  visualizationContainer: {
    width: BOX_SIZE + POINTER_SIZE,
    height: BOX_SIZE + POINTER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: BORDER_WIDTH,
    borderColor: 'rgba(228, 199, 130, 0.3)',
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(228, 199, 130, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  phaseText: {
    color: '#E4C782',
    fontSize: 18,
    fontWeight: '600',
  },
  pointer: {
    position: 'absolute',
    width: POINTER_SIZE,
    height: POINTER_SIZE,
    borderRadius: POINTER_SIZE / 2,
    backgroundColor: '#E4C782',
    shadowColor: '#E4C782',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Breathing666Component;