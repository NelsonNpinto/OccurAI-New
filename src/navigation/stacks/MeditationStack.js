import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Meditation from '../../pages/Meditation/Meditation';
import GuidedMeditation from '../../pages/Meditation/GuidedMeditation';
import Breathing442Component from '../../pages/Meditation/GuidedMeditaion/Breathing442Component';
import Breathing444Component from '../../pages/Meditation/GuidedMeditaion/Breathing444Component';
import Breathing666Component from '../../pages/Meditation/GuidedMeditaion/Breathing666Component';
import Breathing4444Component from '../../pages/Meditation/GuidedMeditaion/Breathing4444Component';

const Stack = createNativeStackNavigator();
export default function MeditationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        cardStyle: { backgroundColor: '#000000' },
        animationDuration: 0,
      }}
    >
      <Stack.Screen 
        name="MeditationMain" 
        component={Meditation} 
      />
      <Stack.Screen 
        name="GuidedMeditation" 
        component={GuidedMeditation}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            // Hide tab bar when this screen is focused
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            // Show tab bar when leaving this screen
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          },
        })}
      />
      <Stack.Screen 
        name="Breathing442"
        component={Breathing442Component}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          },
        })}
      />
      <Stack.Screen 
        name="Breathing444"
        component={Breathing444Component}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          },
        })}
      />
      <Stack.Screen 
        name="Breathing666"
        component={Breathing666Component}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          },
        })}
      />
      <Stack.Screen 
        name="Breathing4444"
        component={Breathing4444Component}
        options={{
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'flex' }
            });
          },
        })}
      />
    </Stack.Navigator>
  );
}