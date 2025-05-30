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

// Authentication Stack Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator with custom BottomNavBar
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Hide default tab bar since we use custom
        tabBarStyle: { display: 'none' },
      }}
      tabBar={props => <BottomNavBar {...props} />}>
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Journal" component={Journal} />
      <Tab.Screen name="Meditation" component={Meditation} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Authenticated Stack Navigator
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        gestureEnabled: false,
        cardStyle: { 
          backgroundColor: '#000000',
          opacity: 1
        },
        presentation: 'card',
        cardOverlayEnabled: false,
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
      
      {/* Journal Reflection as a separate screen */}
      <Stack.Screen
        name="JournalReflection"
        component={JournalReflection}
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          cardStyle: { 
            backgroundColor: '#000000',
            opacity: 1
          },
        }}
      />
      
      {/* GuidedMeditation Screen - Keep your existing config */}
      <Stack.Screen
        name="GuidedMeditation"
        component={GuidedMeditation}
        options={{
          animation: 'none',
          presentation: 'card',
          gestureEnabled: false,
          cardStyle: { 
            backgroundColor: '#000000',
            opacity: 1
          },
          cardOverlayEnabled: false,
          detachPreviousScreen: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator with Authentication Logic
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth state
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
        }}
      >
        {isAuthenticated ? (
          // User is authenticated - show main app
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{
              animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
            }}
          />
        ) : (
          // User is not authenticated - show auth screens
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{
              animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;