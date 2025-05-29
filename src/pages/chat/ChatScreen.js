// src/screens/chat/ChatScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { appStyles, colors } from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import BottomNavBar from '../../components/BottomNavBar';

const ChatScreen = ({ navigation }) => {
  const AppContainer = ({ children }) => {
    return (
      <View style={[appStyles.container, { backgroundColor: '#000000' }]}>
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              top: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        <SafeAreaView
          style={[
            appStyles.safeArea,
            { paddingTop: StatusBar.currentHeight || 0 },
          ]}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {children}
        </SafeAreaView>
      </View>
    );
  };

  return (
    <AppContainer>
      <SafeAreaView style={appStyles.safeArea}>
        <View style={{ flex: 1, padding: 16 }}>
          <JournalHeader 
            title="Chat"
            date=""
            onBackPress={() => navigation.goBack()}
            onCalendarPress={() => console.log('Calendar pressed')}
          />
          
          <View style={styles.container}>
            <Text style={styles.title}>💬 AI Chat</Text>
            <Text style={styles.subtitle}>Chat feature coming soon!</Text>
            <Text style={styles.description}>
              Your AI wellness companion will be available here to help with meditation guidance, mood tracking, and wellness tips.
            </Text>
          </View>
        </View>
      </SafeAreaView>

     
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Urbanist',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Urbanist',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Urbanist',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ChatScreen;