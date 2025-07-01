import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '../MainTabNavigator';
import HealthMetricDetailScreen from '../../components/HealthMetricDetailScreen';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
        animation: 'none',
        cardStyle: { backgroundColor: '#000000' },
        animationDuration: 0,
         gestureEnabled: true,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="HealthMetricDetail" component={HealthMetricDetailScreen} />
    </Stack.Navigator>
  );
}