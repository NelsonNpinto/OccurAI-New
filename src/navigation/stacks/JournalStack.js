import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Journal from '../../pages/Journal/Journal';
import JournalChatScreen from '../../components/JournalChatScreen';
import JournalReflection from '../../pages/Journal/JournalReflection';

const Stack = createNativeStackNavigator();

export default function JournalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        cardStyle: { backgroundColor: '#000000' },
        animationDuration: 0,
      }}
    >
      <Stack.Screen name="JournalMain" component={Journal} />
      <Stack.Screen name="JournalChat" component={JournalChatScreen} />
      <Stack.Screen name="JournalReflection" component={JournalReflection} />
    </Stack.Navigator>
  );
}