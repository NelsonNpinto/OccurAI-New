import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import chatbotService from '../../services/api/ChatbotService';
import ChatLayout from '../../components/ChatLayout';
import MainHeader from '../../components/MainHeader';
import AppContainer from '../../components/AppContainer';

export default function ChatbotScreen({navigation}) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showStarterQuestions, setShowStarterQuestions] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation history on component mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  // Load previous conversation history
  const loadConversationHistory = async () => {
    try {
      setIsLoading(true);
      const response = await chatbotService.getConversationHistory(10);

      if (response.success && response.data.history.length > 0) {
        // Convert backend history to frontend message format
        const formattedMessages = response.data.history.map((msg, index) => ({
          id: `${msg.role}_${index}_${Date.now()}`,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
          context: msg.role === 'user' ? 'user_query' : 'ai_response',
          tags:
            msg.role === 'user' ? ['general', 'user_input'] : ['ai_generated'],
          conversation_id: response.data._id,
          date: msg.timestamp || new Date().toISOString(),
        }));

        setMessages(formattedMessages);
        setConversationId(response.data._id);
        setHasStartedChat(true);
        setShowStarterQuestions(false);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const starterQuestions = [
    'What should I do to stay happy?',
    'How are my health vital these days?',
    'How should I take care of my health?',
    'What will help me to stay fit & happy?',
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      context: 'user_query',
      tags: ['general', 'user_input'],
      conversation_id: conversationId,
      date: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setShowStarterQuestions(false);
    setIsTyping(true);

    try {
      // Create chat request
      const chatRequest = chatbotService.createChatRequest(currentMessage, {
        conversation_id: conversationId,
        tags: ['general', 'user_input'],
        context: 'user_query',
      });

      console.log('Sending chat request:', chatRequest);

      // Send to backend
      const response = await chatbotService.sendMessage(chatRequest);

      if (response.success) {
        // Format and add AI response
        const formattedResponse = chatbotService.formatChatResponse(
          response,
          currentMessage,
        );

        if (formattedResponse.success) {
          setMessages(prev => [...prev, formattedResponse.message]);

          // Update conversation ID if this is the first message
          if (!conversationId && formattedResponse.conversation_id) {
            setConversationId(formattedResponse.conversation_id);
          }

          setHasStartedChat(true);
        } else {
          // Handle formatted error response
          setMessages(prev => [...prev, formattedResponse.message]);
        }
      } else {
        // Handle API error with fallback
        const fallbackResponse =
          chatbotService.generateFallbackResponse(currentMessage);
        const fallbackMessage = {
          id: `ai_fallback_${Date.now()}`,
          text: fallbackResponse.reply,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          context: 'fallback_response',
          tags: ['fallback', 'error'],
          conversation_id: conversationId,
          date: new Date().toISOString(),
          isFallback: true,
        };

        setMessages(prev => [...prev, fallbackMessage]);

        // Show error alert for network issues
        if (
          response.code === 'NETWORK_ERROR' ||
          response.code === 'SERVER_ERROR'
        ) {
          Alert.alert(
            'Connection Issue',
            'Having trouble connecting to the server. Your message was sent in offline mode.',
            [{text: 'OK'}],
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        context: 'error_response',
        tags: ['error'],
        conversation_id: conversationId,
        date: new Date().toISOString(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStarterQuestion = question => {
    setInputMessage(question);
    // Use setTimeout to ensure the input is set before sending
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Handle menu actions - Now passed to MainHeader
  const handleNewChat = () => {
    // Reset chat state
    setMessages([]);
    setConversationId(null);
    setHasStartedChat(false);
    setShowStarterQuestions(true);
    setInputMessage('');
  };

  const handlePreviousChat = () => {
    // Load conversation history
    loadConversationHistory();
  };

  const renderStarterQuestions = () => {
    if (!showStarterQuestions || messages.length > 0 || isLoading) return null;

    return (
      <View style={styles.starterContainer}>
        <Text style={styles.starterTitle}>To start with you can ask</Text>
        <View style={styles.questionsContainer}>
          {starterQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.questionButton}
              onPress={() => handleStarterQuestion(question)}
              activeOpacity={0.7}
              disabled={isTyping}>
              <Text style={styles.questionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  // Show empty chat screen with starter questions when no messages
  if (messages.length === 0) {
    return (
      <AppContainer>
        <View style={styles.container}>
          <MainHeader
            type="chat"
            title="Aarya AI"
            onBackPress={() => navigation.goBack()}
            onNewChat={handleNewChat}
            onPreviousChat={handlePreviousChat}
          />

          <ChatLayout
            messages={[]}
            isTyping={false}
            inputMessage={inputMessage}
            onChangeMessage={setInputMessage}
            onSendMessage={handleSendMessage}
          />

          {renderStarterQuestions()}
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <View style={styles.container}>
        <MainHeader
          type="chat"
          title="Aarya AI"
          onBackPress={() => navigation.goBack()}
          onNewChat={handleNewChat}
          onPreviousChat={handlePreviousChat}
        />

        <ChatLayout
          messages={messages}
          isTyping={isTyping}
          inputMessage={inputMessage}
          onChangeMessage={setInputMessage}
          onSendMessage={handleSendMessage}
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#E4C67F',
    fontSize: 16,
    fontFamily: 'Urbanist',
  },
  starterContainer: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  starterTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  questionButton: {
    backgroundColor: 'rgba(199, 27, 27, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: '48%',
    minWidth: '45%',
  },
  questionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontFamily: 'Urbanist',
    textAlign: 'center',
    lineHeight: 16,
  },
});
