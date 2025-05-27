import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

// Import your custom BottomNavBar
import BottomNavBar from '../components/BottomNavBar';

// Import your screen components
import Dashboard from '../pages/Dashboard';
import Journal from '../pages/Journal/Journal';
import Meditation from '../pages/Meditation/Meditation';
import GuidedMeditation from '../pages/Meditation/GuidedMeditation';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder components for Chat and Devices
const ChatScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
    <Text style={{color: '#fff', fontSize: 24}}>Chat Screen</Text>
    <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
      Coming Soon!
    </Text>
  </View>
);

const DevicesScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
    <Text style={{color: '#fff', fontSize: 24}}>Devices Screen</Text>
    <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
      Coming Soon!
    </Text>
  </View>
);

// Bottom Tab Navigator with custom BottomNavBar
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Disable tab bar animations to prevent glitches
        tabBarStyle: { display: 'none' }, // Hide default since we use custom
      }}
      tabBar={props => <BottomNavBar {...props} />}>
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Journal" component={Journal} />
      <Tab.Screen name="Meditation" component={Meditation} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator - FIXED VERSION
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // SOLUTION 1: Disable animations completely
          animation: 'none',
          // OR use simple fade animation instead
          // animation: 'fade',
          
          // SOLUTION 2: Ensure proper screen management
          gestureEnabled: false, // Disable gesture to prevent conflicts
          
          // SOLUTION 3: Proper card styling
          cardStyle: { 
            backgroundColor: '#000000', // Match your app background
            opacity: 1 // Ensure full opacity
          },
          
          // SOLUTION 4: Prevent screen overlay issues
          presentation: 'card',
          cardOverlayEnabled: false, // Disable overlay
          
          // SOLUTION 5: Screen replacement behavior
          replaceAnimation: 'push',
        }}>
        
        {/* Main Tab Navigator */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{
            cardStyle: { backgroundColor: '#000000' }
          }}
        />
        
        {/* GuidedMeditation Screen - FIXED */}
        <Stack.Screen
          name="GuidedMeditation"
          component={GuidedMeditation}
          options={{
            // Remove all animations that might cause glitches
            animation: 'none', // or 'fade' for simple transition
            presentation: 'card',
            gestureEnabled: false,
            
            // Ensure proper screen styling
            cardStyle: { 
              backgroundColor: '#000000',
              opacity: 1
            },
            
            // Prevent overlay issues
            cardOverlayEnabled: false,
            detachPreviousScreen: false, // Keep previous screen in memory
            
            // Alternative: Use modal presentation (uncomment if needed)
            // presentation: 'modal',
            // animationTypeForReplace: 'push',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;