import React from 'react';
import { View, Text } from 'react-native';
import AppContainer from '../../components/AppContainer';

export default function ChatbotScreen({ navigation }) {
  return (
    <AppContainer>
      <View style={{
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
}