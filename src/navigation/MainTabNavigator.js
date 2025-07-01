import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../pages/Dashboard';
import ProfileScreen from '../pages/Profile/ProfileScreen';
import BottomNavBar from '../components/BottomNavBar';
import JournalStack from './stacks/JournalStack';
import MeditationStack from './stacks/MeditationStack';
import ChatbotScreen from '../pages/ChatBot/ChatbotScreen';
import DevicesScreen from '../pages/devices/DevicesScreen';

const Tab = createBottomTabNavigator();
 
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      <Tab.Screen name="Home" component={Dashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Journal" component={JournalStack} options={{ tabBarLabel: 'Journal' }} />
      <Tab.Screen name="Meditation" component={MeditationStack} options={{ tabBarLabel: 'Meditation', }} />
      <Tab.Screen name="Chat" component={ChatbotScreen} options={{ tabBarLabel: 'Chat' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
      <Tab.Screen name="Devices" component={DevicesScreen} options={{ tabBarLabel: 'Devices' }} />
    </Tab.Navigator>
  );
}