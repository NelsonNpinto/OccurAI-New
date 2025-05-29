// src/screens/auth/AuthLoadingScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { appStyles, colors } from '../../styles/styles';

const AuthLoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const AppContainer = ({ children }) => {
    return (
      <View style={[appStyles.container, { backgroundColor: '#000000' }]}>
        {/* Background with glow effects */}
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              top: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        <SafeAreaView
          style={[
            appStyles.safeArea,
            { paddingTop: StatusBar.currentHeight || 0 },
          ]}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {children}
        </SafeAreaView>
      </View>
    );
  };

  return (
    <AppContainer>
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* App Logo/Icon */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>🧠</Text>
          </View>
          
          <Text style={styles.appName}>Wellness</Text>
          <Text style={styles.tagline}>Your mindful journey begins</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Urbanist',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Urbanist',
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
  },
});

export default AuthLoadingScreen;