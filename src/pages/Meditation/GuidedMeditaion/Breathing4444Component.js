import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import AppContainer from '../../../components/AppContainer';
import MeditationHeader from '../MeditationHeader';
import MeditationFooter from '../MeditationFooter';

const Breathing4444Component = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Breathe In');
  const [cycleCount, setCycleCount] = useState(0);
  const currentIndex = useRef(0);

  const topTilt = useSharedValue(0);
  const middleTilt = useSharedValue(0);

  const breathingCycle = [
    {phase: 'Breathe In', duration: 2000},
    {phase: 'Hold', duration: 2000},
    {phase: 'Breathe Out', duration: 2000},
    {phase: 'Hold', duration: 2000},
  ];

  const topFaceStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${topTilt.value}deg`}],
  }));

  const middleFaceStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${middleTilt.value}deg`}],
  }));

  const updatePhase = phase => {
    setCurrentPhase(phase);
    if (phase === 'Breathe In') {
      topTilt.value = withTiming(-10, {duration: 2000});
      middleTilt.value = withTiming(10, {duration: 2000});
    } else if (phase === 'Breathe Out') {
      topTilt.value = withTiming(0, {duration: 2000});
      middleTilt.value = withTiming(0, {duration: 2000});
    }
    // Hold keeps the last state
  };

  useEffect(() => {
    let timer;

    const runCycle = () => {
      if (!isPlaying) return;
      const {phase, duration} = breathingCycle[currentIndex.current];
      runOnJS(updatePhase)(phase);
      timer = setTimeout(() => {
        currentIndex.current =
          (currentIndex.current + 1) % breathingCycle.length;
        if (currentIndex.current === 0)
          runOnJS(setCycleCount)(prev => prev + 1);
        runCycle();
      }, duration);
    };

    if (isPlaying) runCycle();
    return () => clearTimeout(timer);
  }, [isPlaying]);

  return (
    <View style={styles.screenContainer}>
      <AppContainer>
        <MeditationHeader
          title="Breathing 4-4-4-4"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            <View style={styles.stackContainer}>
              {/* Top face with face SVG */}
              <Animated.View style={[styles.bubble, topFaceStyle]}>
                <Svg
                  width="100"
                  height="60"
                  viewBox="0 10 100 60"
                  style={styles.faceSvg}>
                  <Path
                    d="M20 30 q10 -10 20 0 M60 30 q10 -10 20 0 M35 45 q15 10 30 0"
                    stroke="#E4C782"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>

              {/* Middle face */}
              <Animated.View style={[styles.bubble, middleFaceStyle]} />

              {/* Bottom face (static) */}
              <View style={styles.bubble} />
            </View>

            <Text style={styles.phaseText}>{currentPhase}</Text>
          </View>
        </View>
        <MeditationFooter
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(prev => !prev)}
          onStop={() => {
            setIsPlaying(false);
            currentIndex.current = 0;
            setCycleCount(0);
            topTilt.value = 0;
            middleTilt.value = 0;
            setCurrentPhase('Breathe In');
          }}
          onRestart={() => {
            setIsPlaying(false); // pause first

            setTimeout(() => {
              currentIndex.current = 0;
              setCycleCount(0);
              topTilt.value = 0;
              middleTilt.value = 0;
              setCurrentPhase('Breathe In');

              // force restart cycle with breathe in
              setIsPlaying(true);
            }, 50); // slight delay ensures state flush
          }}
        />
      </AppContainer>
    </View>
  );
};

// Updated styles
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
  },
  stackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bubble: {
    width: 150,
    height: 90,
    borderRadius: 39,
    backgroundColor: ' rgba(184, 150, 70, 0.57)',
    alignItems: 'center',
    marginBottom: -17,
    justifyContent: 'center',
  },
  faceSvg: {
    marginTop: 8,
  },
  phaseText: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 30,
    color: '#E4C782',
  },
});

export default Breathing4444Component; 
