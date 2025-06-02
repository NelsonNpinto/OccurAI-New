import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

// Import authentication context and screens
import { useAuth } from '../context/AuthContext';

// Import your custom BottomNavBar
import BottomNavBar from '../components/BottomNavBar';

// Import your existing screen components
import Dashboard from '../pages/Dashboard';
import Journal from '../pages/Journal/Journal';
import JournalReflection from '../pages/Journal/JournalReflection';
import Meditation from '../pages/Meditation/Meditation';
import GuidedMeditation from '../pages/Meditation/GuidedMeditation';
import LoginScreen from '../pages/auth/LoginScreen';
import RegisterScreen from '../pages/auth/RegisterScreen';
import ProfileScreen from '../pages/Profile/ProfileScreen';
import AuthLoadingScreen from '../pages/auth/AuthLoadingScreen';
import HealthMetricsLoadingScreen from '../styles/HealthMetricCardShimmer';
import AppContainer from '../components/AppContainer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Updated Chat Screen with proper styling
const ChatScreen = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
    <Text style={{color: '#fff', fontSize: 24}}>💬 AI Chat</Text>
    <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
      Chat feature coming soon!
    </Text>
    <Text style={{color: '#666', fontSize: 14, marginTop: 16, textAlign: 'center', paddingHorizontal: 20}}>
      Your AI wellness companion will be available here to help with meditation guidance, mood tracking, and wellness tips.
    </Text>
  </View>
);

// Devices Screen placeholder
const DevicesScreen = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
    <Text style={{color: '#fff', fontSize: 24}}>⌚ Devices</Text>
    <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
      Device connections coming soon!
    </Text>
    <Text style={{color: '#666', fontSize: 14, marginTop: 16, textAlign: 'center', paddingHorizontal: 20}}>
      Connect your fitness trackers, smartwatches, and health devices here.
    </Text>
  </View>
);

// Authentication Stack Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        animation: 'none', // No animation
        gestureEnabled: false,
        animationDuration: 0,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Custom Bottom Tab Navigator (Journal NOT included here)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Meditation" 
        component={Meditation}
        options={{ tabBarLabel: 'Meditation' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{ tabBarLabel: 'Devices' }}
      />
    </Tab.Navigator>
  );
}

// Main Authenticated Stack Navigator
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none', // Completely disable animations
        gestureEnabled: false,
        cardStyle: { 
          backgroundColor: '#000000',
        },
        presentation: 'card',
        cardOverlayEnabled: false,
        animationDuration: 0, // Set duration to 0
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 0 } },
          close: { animation: 'timing', config: { duration: 0 } },
        },
      }}>
      
      {/* Main Tab Navigator - contains Home, Meditation, Chat, Profile, Devices */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{
          cardStyle: { backgroundColor: '#000000' },
          gestureEnabled: false,
          animation: 'none',
          animationDuration: 0,
        }}
      />
      
      {/* Journal as a separate stack screen (NO bottom nav) */}
      <Stack.Screen
        name="Journal"
        component={Journal}
        options={{
          animation: 'none', // No animation
          presentation: 'card',
          gestureEnabled: false,
          cardStyle: { 
            backgroundColor: '#000000',
          },
          animationDuration: 0,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0 } },
            close: { animation: 'timing', config: { duration: 0 } },
          },
        }}
      />
      
      {/* Journal Reflection as a separate screen (NO bottom nav) */}
      <Stack.Screen
        name="JournalReflection"
        component={JournalReflection}
        options={{
          animation: 'none', // No animation
          presentation: 'card',
          gestureEnabled: false,
          cardStyle: { 
            backgroundColor: '#000000',
          },
          animationDuration: 0,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0 } },
            close: { animation: 'timing', config: { duration: 0 } },
          },
        }}
      />
      
      {/* GuidedMeditation Screen (NO bottom nav) */}
      <Stack.Screen
        name="GuidedMeditation"
        component={GuidedMeditation}
        options={{
          animation: 'none', // No animation
          presentation: 'card',
          gestureEnabled: false,
          cardStyle: { 
            backgroundColor: '#000000',
          },
          cardOverlayEnabled: false,
          detachPreviousScreen: false,
          animationDuration: 0,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0 } },
            close: { animation: 'timing', config: { duration: 0 } },
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator with Authentication Logic
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AppContainer>
        <HealthMetricsLoadingScreen />
      </AppContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
          gestureEnabled: false,
          animation: 'none', // No animation
          animationDuration: 0,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{
              animationTypeForReplace: 'push',
              animation: 'none',
            }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
              animation: 'none',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;