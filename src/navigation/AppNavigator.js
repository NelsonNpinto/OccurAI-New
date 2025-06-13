import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';

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

// Import JournalChatScreen from the paste content
import JournalChatScreen from '../components/JournalChatScreen'; // Your chat screen component
import HealthMetricDetailScreen from '../components/HealthMetricDetailScreen';

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();

// General Chatbot Component for the Chat tab (separate from journal flow)
const ChatbotScreen = ({ navigation }) => (
  <AppContainer>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
      }}>
      <Text style={{color: '#E4C67F', fontSize: 32, marginBottom: 16}}>🤖</Text>
      <Text style={{color: '#fff', fontSize: 24, fontWeight: '600', textAlign: 'center'}}>
        AI Chatbot
      </Text>
      <Text style={{color: '#aaa', fontSize: 16, marginTop: 8, textAlign: 'center'}}>
        Your personal AI assistant
      </Text>
      <Text style={{
        color: '#666', 
        fontSize: 14, 
        marginTop: 16, 
        textAlign: 'center', 
        lineHeight: 20
      }}>
        Chat with our AI assistant for general questions, advice, and support. 
        This is different from the journal chat which helps you reflect on your day.
      </Text>
      
      {/* You can add your general chatbot implementation here */}
      <View style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: 'rgba(228, 198, 127, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(228, 198, 127, 0.3)'
      }}>
        <Text style={{color: '#E4C67F', fontSize: 14, textAlign: 'center'}}>
          💡 Coming Soon: General AI Chat
        </Text>
      </View>
    </View>
  </AppContainer>
);

// Devices Screen placeholder
const DevicesScreen = ({ navigation }) => (
  <AppContainer>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      <Text style={{color: '#fff', fontSize: 24}}>⌚ Devices</Text>
      <Text style={{color: '#aaa', fontSize: 16, marginTop: 8}}>
        Device connections coming soon!
      </Text>
      <Text style={{color: '#666', fontSize: 14, marginTop: 16, textAlign: 'center', paddingHorizontal: 20}}>
        Connect your fitness trackers, smartwatches, and health devices here.
      </Text>
    </View>
  </AppContainer>
);

// Authentication Stack Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        animation: 'none',
        gestureEnabled: false,
        animationDuration: 0,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Custom Bottom Tab Navigator - Chat is now the general chatbot
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
        name="Journal" 
        component={Journal}
        options={{ tabBarLabel: 'Journal' }}
      />
      <Tab.Screen 
        name="Meditation" 
        component={Meditation}
        options={{ tabBarLabel: 'Meditation' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatbotScreen}
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
        animation: 'none',
        gestureEnabled: false,
        cardStyle: { 
          backgroundColor: '#000000',
        },
        presentation: 'card',
        cardOverlayEnabled: false,
        animationDuration: 0,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 0 } },
          close: { animation: 'timing', config: { duration: 0 } },
        },
      }}>
      
      {/* Main Tab Navigator - contains Home, Journal, Meditation, Chat (Chatbot), Profile, Devices */}
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
      
      <Stack.Screen
        name="HealthMetricDetail"
        component={HealthMetricDetailScreen} 
        options={{
          animation: 'none',
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

      {/* JournalChatScreen as a separate stack screen (part of journal flow, NO bottom nav) */}
      <Stack.Screen
        name="JournalChat"
        component={JournalChatScreen}
        options={{
          animation: 'none',
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
          animation: 'none',
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
          animation: 'none',
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
          animation: 'none',
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