import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { appStyles, colors } from './styles';

// Base Shimmer Animation Component
const ShimmerEffect = ({ width, height, style }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [width, translateX]);

  return (
    <View style={[{ width, height, overflow: 'hidden', backgroundColor: 'rgba(70, 70, 70, 0.2)' }, style]}>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
       
      </Animated.View>
    </View>
  );
};

// Shimmer version of HealthMetricCard
export const HealthMetricCardShimmer = ({ customStyles = {} }) => {
  return (
    <View
      style={[
        appStyles.card,
        {
          width: '48%',
          backgroundColor: colors.cardBg,
          borderRadius: 20,
          padding: 16,
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 32,
          borderWidth: 0,
          height: 180,
          justifyContent: 'space-between',
        },
        customStyles,
      ]}
    >
      {/* Top left icon + title + subtitle shimmer */}
      <View style={{ alignItems: 'flex-start' }}>
        <ShimmerEffect
          width={40}
          height={40}
          style={{ borderRadius: 40, marginBottom: 8 }}
        />
        <ShimmerEffect
          width={80}
          height={18}
          style={{ borderRadius: 4, marginBottom: 6 }}
        />
        <ShimmerEffect
          width={100}
          height={12}
          style={{ borderRadius: 4 }}
        />
      </View>

      {/* Bottom right value + unit shimmer */}
      <View style={{ alignSelf: 'flex-end', alignItems: 'flex-end' }}>
        <ShimmerEffect
          width={70}
          height={36}
          style={{ borderRadius: 4, marginBottom: 4 }}
        />
        <ShimmerEffect
          width={40}
          height={12}
          style={{ borderRadius: 4 }}
        />
      </View>
    </View>
  );
};

// Shimmer version of SleepCard
export const SleepCardShimmer = () => {
  return (
    <View
      style={[
        appStyles.card,
        {
          marginTop: 16,
          backgroundColor: colors.cardBg,
          borderRadius: 20,
          padding: 16,
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 32,
          borderWidth: 0,
        },
      ]}
    >
      {/* Top section with icon and title shimmer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <ShimmerEffect
          width={40}
          height={40}
          style={{ borderRadius: 20, marginRight: 10 }}
        />
        <View>
          <ShimmerEffect
            width={60}
            height={18}
            style={{ borderRadius: 4, marginBottom: 6 }}
          />
          <ShimmerEffect
            width={80}
            height={12}
            style={{ borderRadius: 4 }}
          />
        </View>
      </View>

      {/* Main sleep duration display shimmer */}
      <View style={{ alignSelf: 'flex-end', marginBottom: 12 }}>
        <ShimmerEffect
          width={100}
          height={36}
          style={{ borderRadius: 4 }}
        />
      </View>

      {/* Sleep sessions section shimmer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          paddingTop: 12,
        }}
      >
        <ShimmerEffect
          width={120}
          height={18}
          style={{ borderRadius: 4, marginBottom: 10 }}
        />
        
        {/* First session shimmer */}
        <ShimmerEffect
          width="100%"
          height={40}
          style={{ 
            borderRadius: 12, 
            marginBottom: 8,
            backgroundColor: 'rgba(70, 70, 70, 0.5)', // Match sessionCard
          }}
        />
        
        {/* Second session shimmer */}
        <ShimmerEffect
          width="100%"
          height={40}
          style={{ 
            borderRadius: 12,
            backgroundColor: 'rgba(70, 70, 70, 0.5)', // Match sessionCard
          }}
        />
      </View>
    </View>
  );
};

// Loading screen that uses the shimmer components
export const HealthMetricsLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <SleepCardShimmer />

      <View style={styles.metricsRow}>
        <HealthMetricCardShimmer />
        <HealthMetricCardShimmer />
      </View>
      <View style={styles.metricsRow}>
        <HealthMetricCardShimmer />
        <HealthMetricCardShimmer />
      </View>
      <SleepCardShimmer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default HealthMetricsLoadingScreen;