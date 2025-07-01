import React, {useState, useRef, useEffect} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {journalService} from '../services/api/journalService';
import {useAuth} from '../context/AuthContext';
import ChatLayout from './ChatLayout';
import MainHeader from './MainHeader';
import AppContainer from './AppContainer';

const JournalChatScreen = ({
  onComplete,
  navigation, // Navigation prop for going back
  journalContext = null,
  route, // Add route prop to get navigation params
}) => {
  const {user} = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationCompleted, setConversationCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingJournalData, setExistingJournalData] = useState(null);
  const scrollViewRef = useRef();
  const inputRef = useRef(null);

  // Check if we're in edit mode (coming from summary screen)
  useEffect(() => {
    const editJournalData = route?.params?.editJournalData;
    const journalDate = route?.params?.journalDate;

    console.log('🔍 Route params:', route?.params);
    console.log('🔍 editJournalData:', editJournalData);
    console.log('🔍 journalDate:', journalDate);

    if (editJournalData && journalDate) {
      console.log('✅ Edit mode detected');
      setIsEditMode(true);
      setExistingJournalData(editJournalData);
      loadExistingConversation(journalDate);
    } else {
      console.log('✅ Normal mode - initializing new conversation');
      initializeConversation();
    }
  }, [route?.params]);

  const loadExistingConversation = async journalDate => {
    try {
      setIsLoading(true);

      // Debug logging
      console.log('🔍 Loading existing conversation for date:', journalDate);
      console.log('🔍 Edit journal data:', existingJournalData);

      // Add welcome message from Aarya for edit mode
      const welcomeMessage = {
        id: 1,
        text: `Hey Hi ${
          user?.username || 'there'
        }! 👋\n\nLet's review and edit your journal entry from ${formatDate(
          journalDate,
        )}.`,
        sender: 'ai',
        timestamp: generateTimestamp(),
      };

      setMessages([welcomeMessage]);

      // Try to load existing conversation from backend
      try {
        console.log('🔍 Calling getJournalByDate...');
        const response = await journalService.getJournalByDate(journalDate);
        console.log('🔍 getJournalByDate response:', response);

        if (response && response.messages) {
          console.log('🔍 Found messages:', response.messages.length);

          // Add existing messages to the conversation
          const existingMessages = response.messages.map((msg, index) => ({
            id: index + 2, // Start from 2 since welcome message is id 1
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp || generateTimestamp(),
            step: msg.step,
            questionId: msg.questionId,
          }));

          setMessages(prev => [...prev, ...existingMessages]);
          setConversationId(response.conversationId || null);
          setCurrentStep(response.currentStep || 0);
          // Don't set conversationCompleted to true in edit mode - we want to continue chatting
          setConversationCompleted(false);

          // Add edit instruction message and start new conversation
          const editInstructionMessage = {
            id: existingMessages.length + 2,
            text: "Great! I can see your previous responses above. Let's start a fresh conversation to update your journal.",
            sender: 'ai',
            timestamp: generateTimestamp(),
            isEditInstruction: true,
          };

          setMessages(prev => [...prev, editInstructionMessage]);

          // Start a new conversation session for editing
          console.log('✅ Starting new conversation for editing...');
          try {
            const newConversationResponse =
              await journalService.startConversation();

            if (newConversationResponse.question) {
              const newQuestionMessage = {
                id: existingMessages.length + 3,
                text: newConversationResponse.question,
                sender: 'ai',
                timestamp: generateTimestamp(),
                step: newConversationResponse.step || 0,
                questionId: newConversationResponse.questionId || null,
              };

              setMessages(prev => [...prev, newQuestionMessage]);
              setCurrentStep(newConversationResponse.step || 0);
              // Don't override the existing conversationId, we'll use it for updates
            }
          } catch (newConversationError) {
            console.log(
              'Failed to start new conversation for editing:',
              newConversationError,
            );

            // Fallback question
            const fallbackQuestionMessage = {
              id: existingMessages.length + 3,
              text: "Let's start fresh! How are you feeling today? 😄 😊 😐 😢 😡 🥱",
              sender: 'ai',
              timestamp: generateTimestamp(),
              step: 0,
              isFallback: true,
            };

            setMessages(prev => [...prev, fallbackQuestionMessage]);
            setCurrentStep(0);
          }

          console.log(
            '✅ Successfully loaded existing conversation and started edit mode',
          );
        } else {
          console.log('❌ No messages found in response');
        }
      } catch (editLoadError) {
        console.log('❌ Edit load error:', editLoadError);
        console.log('❌ Falling back to new conversation');

        // Don't fall back to new conversation, show error instead
        const errorMessage = {
          id: 2,
          text: "I couldn't load your previous conversation, but you can still continue chatting here!",
          sender: 'ai',
          timestamp: generateTimestamp(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      setConversationStarted(true);
    } catch (error) {
      console.error('❌ Failed to load existing conversation:', error);

      // Fallback to error message
      const errorMessage = {
        id: 2,
        text: "I couldn't load your previous conversation. Let's start fresh! How are you feeling today?",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setConversationStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConversation = async () => {
    try {
      setIsLoading(true);

      // Clear any existing conversation state
      setMessages([]);
      setConversationId(null);
      setCurrentStep(0);
      setConversationCompleted(false);
      setConversationStarted(false);

      // Add welcome message from Aarya
      const welcomeMessage = {
        id: 1,
        text: `Hey Hi ${
          user?.username || 'there'
        }! 👋\n\nI'm Aarya, your AI companion. I'll help you journal about your day through a friendly conversation.`,
        sender: 'ai',
        timestamp: generateTimestamp(),
      };

      setMessages([welcomeMessage]);

      // Start a fresh conversation with your backend
      const response = await journalService.startConversation();

      // Add the first question from backend
      if (response.question) {
        const questionMessage = {
          id: 2,
          text: response.question,
          sender: 'ai',
          timestamp: generateTimestamp(),
          step: response.step || 0,
          questionId: response.questionId || null, // Make optional
        };

        setMessages(prev => [...prev, questionMessage]);
        setCurrentStep(response.step || 0);
        setConversationId(response.conversationId || null); // Make optional
      }

      setConversationStarted(true);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);

      // Fallback if backend is unavailable
      const fallbackMessage = {
        id: 2,
        text: "Let's start with a simple question: How are you feeling today? 😄 😊 😐 😢 😡 🥱",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isFallback: true,
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setConversationStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackPress = () => {
    // Navigate back to previous screen
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || conversationCompleted) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: generateTimestamp(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');

    setIsLoading(true);
    setIsTyping(true);

    try {
      let response;

      if (isEditMode && conversationId) {
        // In edit mode, we treat it as a new conversation but will update the existing journal
        console.log(
          '🔄 Edit mode: Sending message to continue new conversation',
        );
        response = await journalService.sendMessage(messageToSend);
      } else {
        // Regular conversation flow
        response = await journalService.sendMessage(messageToSend);
      }

      // Simulate typing delay for better UX
      setTimeout(() => {
        if (response.message) {
          // Conversation completed
          const completionMessage = {
            id: messages.length + 2,
            text: response.message,
            sender: 'ai',
            timestamp: generateTimestamp(),
            isCompletion: true,
          };

          setMessages(prev => [...prev, completionMessage]);
          setConversationCompleted(true);
          setTimeout(() => {
            handleComplete();
          }, 3000);
        } else if (response.question) {
          // Next question in the conversation
          const questionMessage = {
            id: messages.length + 2,
            text: response.question,
            sender: 'ai',
            timestamp: generateTimestamp(),
            step: response.step || currentStep + 1,
            questionId: response.questionId,
          };

          setMessages(prev => [...prev, questionMessage]);
          setCurrentStep(response.step || currentStep + 1);
        }

        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble right now. Let me try a different approach. Could you tell me about your day?",
        sender: 'ai',
        timestamp: generateTimestamp(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      if (isEditMode && conversationId) {
        // In edit mode, update the existing journal entry
        console.log('🔄 Edit mode: Updating existing journal entry');

        // Extract new user responses (after the edit instruction message)
        const allMessages = messages;
        const editInstructionIndex = allMessages.findIndex(
          m => m.isEditInstruction,
        );
        const newMessages =
          editInstructionIndex >= 0
            ? allMessages.slice(editInstructionIndex + 1)
            : [];
        const newUserResponses = newMessages
          .filter(m => m.sender === 'user')
          .map(m => m.text);

        console.log('🔄 New user responses:', newUserResponses);

        // Prepare update data based on new responses
        const updateData = {
          journal_id: conversationId,
        };

        // Map responses to fields (this matches your backend structure)
        if (newUserResponses.length > 0) updateData.mood = newUserResponses[0]; // mood
        if (newUserResponses.length > 1)
          updateData.food_intake = newUserResponses[1];
        if (newUserResponses.length > 2)
          updateData.personal = newUserResponses[2];
        if (newUserResponses.length > 3)
          updateData.work_or_study = newUserResponses[3];
        if (newUserResponses.length > 4) updateData.sleep = newUserResponses[4];
        if (newUserResponses.length > 5)
          updateData.extra_note = newUserResponses.slice(5).join(' | ');

        try {
          await journalService.updateConversationJournal(updateData);
          console.log('✅ Journal entry updated successfully');
        } catch (updateError) {
          console.error('❌ Failed to update journal entry:', updateError);
        }

        // Prepare conversation data for navigation
        const conversationData = {
          conversationId,
          messages: messages,
          messageCount: messages.length,
          userResponses: allMessages
            .filter(m => m.sender === 'user')
            .map(m => m.text),
          conversationSummary: allMessages
            .filter(m => m.sender === 'user')
            .map(m => m.text)
            .join(' | '),
          journalContext: journalContext,
          completedAt: new Date().toISOString(),
          step: currentStep,
          isEditMode: true,
          existingJournalData,
        };

        // Navigate back with edit mode flag
        navigation.navigate('JournalReflection', {
          chatResults: conversationData,
        });
      } else {
        // Regular completion flow
        const conversationData = {
          conversationId,
          messages: messages,
          messageCount: messages.length,
          userResponses: messages
            .filter(m => m.sender === 'user')
            .map(m => m.text),
          conversationSummary: messages
            .filter(m => m.sender === 'user')
            .map(m => m.text)
            .join(' | '),
          journalContext: journalContext,
          completedAt: new Date().toISOString(),
          step: currentStep,
          isEditMode: false,
          existingJournalData,
        };

        // Navigate back to JournalReflection with chat results
        navigation.navigate('JournalReflection', {
          chatResults: conversationData,
        });
      }
    } catch (error) {
      console.error('Error completing conversation:', error);
      Alert.alert(
        'Error',
        'Failed to complete conversation. Please try again.',
      );
    }
  };



  // Handle menu actions for chat header
  const handleNewChat = () => {
    // Reset conversation and start fresh
    initializeConversation();
  };

  const handlePreviousChat = () => {
    // Navigate to chat history or previous conversations
    if (navigation) {
      navigation.navigate('ChatHistory'); // Adjust route name as needed
    }
  };

  return (
    <AppContainer>
      <View style={styles.container}>
        <MainHeader
          type="journal"
          onBackPress={handleBackPress}
          onNewChat={handleNewChat}
          onPreviousChat={handlePreviousChat}
          navigation={navigation}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default JournalChatScreen;