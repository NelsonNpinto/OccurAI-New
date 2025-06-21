import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, Dimensions, StyleSheet} from 'react-native';
import AppContainer from '../../../components/AppContainer';
import MeditationHeader from '../MeditationHeader';
import MeditationFooter from '../MeditationFooter';
import BreathingArc from '../BreathingArc';

const Breathing442Component = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Breathe In');
  const [pointerAngle, setPointerAngle] = useState(0);
  

  // Animation values
  const ballRotation = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const phaseOpacity = useRef(new Animated.Value(1)).current;

  // Breathing cycle: 4 seconds in, 4 seconds hold, 2 seconds out
  const breathingCycle = [
    {phase: 'Breathe In', duration: 4000, scale: 1},
    {phase: 'Hold', duration: 4000, scale: 1},
    {phase: 'Breathe Out', duration: 2000, scale: 1},
  ];

  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const phaseTimeoutRef = useRef(null);
  const currentAnimationRef = useRef(null);

  const startBreathingAnimation = () => {
    const runCycle = (cycleIndex = 0) => {
      const cycle = breathingCycle[cycleIndex];

      // Update phase text with fade effect
      Animated.sequence([
        Animated.timing(phaseOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(phaseOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentPhase(cycle.phase);

      // Calculate target rotation based on current phase
      let targetRotation;
      if (cycleIndex === 0) {
        // Breathe In: 0 to 144 degrees
        targetRotation = ballRotation._value + 144 / 360;
      } else if (cycleIndex === 1) {
        // Hold: 144 to 288 degrees
        targetRotation = ballRotation._value + 144 / 360;
      } else {
        // Breathe Out: 288 to 360 degrees (back to 0)
        targetRotation = ballRotation._value + 72 / 360;
      }

      // Ball movement animation along specific arc
      const ballAnimation = Animated.timing(ballRotation, {
        toValue: targetRotation,
        duration: cycle.duration,
        useNativeDriver: true,
      });

      // Circle breathing animation (keep static)
      const circleAnimation = Animated.timing(circleScale, {
        toValue: cycle.scale,
        duration: cycle.duration,
        useNativeDriver: true,
      });

      // Start both animations
      const parallelAnimation = Animated.parallel([
        ballAnimation,
        circleAnimation,
      ]);
      currentAnimationRef.current = parallelAnimation;
      parallelAnimation.start();

      // Schedule next phase
      phaseTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          const nextIndex = (cycleIndex + 1) % breathingCycle.length;
          setCurrentCycleIndex(nextIndex);
          runCycle(nextIndex);
        }
      }, cycle.duration);
    };

    if (isPlaying) {
      runCycle(currentCycleIndex);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startBreathingAnimation();
    } else {
      // Clear timeouts when paused
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    }

    return () => {
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, [isPlaying, currentCycleIndex]);

  useEffect(() => {
    const id = ballRotation.addListener(({value}) => {
      setPointerAngle(value * 360); // Convert from 0-1 to degrees
    });
    return () => ballRotation.removeListener(id);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      if (currentAnimationRef.current) {
        currentAnimationRef.current.stop();
      }
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);

    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
    }

    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }
    setCurrentCycleIndex(0);
    setCurrentPhase('Breathe In');
    ballRotation.setValue(0);
    circleScale.setValue(1);
  };

  const handleRestart = () => {
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
    }

    setIsPlaying(false);
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }

    setCurrentCycleIndex(0);
    setCurrentPhase('Breathe In');
    ballRotation.setValue(0);
    circleScale.setValue(1);

    // Start from beginning after a brief delay
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };



  return (
    <View style={styles.screenContainer}>
      <AppContainer>
        <MeditationHeader
          title="Breathing 4-4-2"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            {/* Main Breathing Circle */}
            <View style={styles.breathingContainer}>
              <Animated.View>
                {/* Curved segments covering the entire circle - 3 arcs based on 4-4-2 pattern */}
                <BreathingArc
                  size={250}
                  strokeWidth={15}
                  pointerAngle={pointerAngle}
                />

                {/* Inner circle with phase text */}
                <View style={styles.innerCircle}>
                  <Animated.Text
                    style={[styles.phaseText, {opacity: phaseOpacity}]}>
                    {currentPhase}
                  </Animated.Text>
                </View>
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
    shadowOffset: {width: 1, height: 1},
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
  breathingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  segmentContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  
  segmentBreathIn: {
    borderTopColor: 'rgba(228, 199, 130, 0.6)',
    borderRightColor: 'rgba(228, 199, 130, 0.6)',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{rotate: '0deg'}],
  },
  segmentHold: {
    borderTopColor: 'transparent',
    borderRightColor: 'rgba(228, 199, 130, 0.4)',
    borderBottomColor: 'rgba(228, 199, 130, 0.4)',
    borderLeftColor: 'transparent',
    transform: [{rotate: '144deg'}],
  },
  segmentBreathOut: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(228, 199, 130, 0.3)',
    borderLeftColor: 'rgba(228, 199, 130, 0.3)',
    transform: [{rotate: '288deg'}],
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(228, 199, 130, 0.3)',
  },
  phaseText: {
    color: '#E4C782',
    fontSize: 18,
    fontFamily: 'Urbanist',
    fontWeight: '500',
    textAlign: 'center',
  },
  ball: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E4C782',
    shadowColor: '#E4C782',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  timerText: {
    color: '#E4C782',
    fontSize: 24,
    fontFamily: 'Urbanist',
    fontWeight: '300',
    marginTop: 20,
  },
});

export default Breathing442Component;
