import React, {useRef, useEffect} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Send from '../../utils/icons/send.svg';

const ChatLayout = ({
  messages,
  isTyping,
  inputMessage,
  onChangeMessage,
  onSendMessage,
}) => {
  const scrollViewRef = useRef();

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const generateTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMoodOptions = () => {
    const moods = ['😄', '😊', '😐', '😢', '😡', '🥱'];

    return (
      <View style={styles.moodOptionsContainer}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodButton}
            onPress={() => {
              onChangeMessage(mood);
              // Auto send after selection
              setTimeout(() => {
                onSendMessage();
              }, 100);
            }}
            activeOpacity={0.7}>
            <Text style={styles.moodEmoji}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMessage = message => {
    const isUser = message.sender === 'user';
    const showMoodOptions =
      message.text.includes('😄 😊 😐 😢 😡 🥱') && !isUser;

    return (
      <View key={message.id} style={styles.messageContainer}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.aiMessage,
            message.isError && styles.errorMessage,
            message.isFallback && styles.fallbackMessage,
            message.isCompletion && styles.completionMessage,
            message.isEditInstruction && styles.editInstructionMessage,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}>
            {message.text}
          </Text>

          {message.isFallback && (
            <Text style={styles.fallbackIndicator}>Offline mode</Text>
          )}

          {message.isCompletion && (
            <Text style={styles.completionIndicator}>
              ✅ Journal saved.
            </Text>
          )}

          {message.isEditInstruction && (
            <Text style={styles.editIndicator}>📝 Edit mode</Text>
          )}
        </View>

        <Text
          style={[
            styles.messageTime,
            isUser ? styles.userMessageTime : styles.aiMessageTime,
          ]}>
          {message.timestamp}
        </Text>

        {/* Show mood options for mood question */}
        {showMoodOptions && renderMoodOptions()}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.messageContainer}>
        <View
          style={[styles.messageBubble, styles.aiMessage, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, {animationDelay: '0.2s'}]} />
            <View style={[styles.typingDot, {animationDelay: '0.4s'}]} />
          </View>
          <Text style={styles.typingText}>Aarya is thinking...</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 35}>

      {/* Chat Messages */}
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.chatMessagesContainer}
        contentContainerStyle={styles.chatMessagesContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
      </KeyboardAwareScrollView>

      {/* Chat Input */}
      <View style={styles.chatInputContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.chatInput}
              value={inputMessage}
              onChangeText={onChangeMessage}
              placeholder="Type your message here"
              placeholderTextColor="rgba(228, 198, 127, 0.40)"
              multiline
              maxLength={500}
              returnKeyType="default"
              blurOnSubmit={false}
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={onSendMessage}
            disabled={!inputMessage.trim()}
            activeOpacity={0.7}>
            <Send />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Messages Styles
  chatMessagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatMessagesContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(94, 94, 94, 0.3)',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E4C67F',
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  fallbackMessage: {
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  completionMessage: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  editInstructionMessage: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    lineHeight: 20,
  },
  aiMessageText: {
    color: 'white',
  },
  userMessageText: {
    color: '#000000',
  },
  fallbackIndicator: {
    fontSize: 10,
    color: 'rgba(255, 193, 7, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  completionIndicator: {
    fontSize: 10,
    color: 'rgba(76, 175, 80, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  editIndicator: {
    fontSize: 10,
    color: 'rgba(138, 43, 226, 0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Urbanist',
    opacity: 0.7,
  },
  aiMessageTime: {
    color: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-start',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },

  // Mood Options
  moodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.3)',
  },
  moodEmoji: {
    fontSize: 24,
  },

  // Typing Indicator
  typingBubble: {
    paddingVertical: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  typingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
  },

  // Input Styles
  chatInputContainer: {
    padding: 16,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 0,
  },
  textInputContainer: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
  chatInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 24,
    paddingVertical: 0,
  },
  sendButton: {
    width: 48,
    height: 50,
    backgroundColor: '#765A19',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
});

export default ChatLayout;