import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { appStyles } from '../../styles/styles';
import { BlurView } from '@react-native-community/blur';
import BottomNavBar from '../../components/BottomNavBar';
import JournalHeader from '../../components/JournalHeader';
import JournalReflection from './JournalReflection';

const Journal = ({ navigation }) => {
  const AppContainer = ({ children }) => {
    return (
      <View style={[appStyles.container, { backgroundColor: '#000000' }]}>
        {/* Black background with absolute positioned elements */}
        <View style={StyleSheet.absoluteFill}>
          {/* TOP CIRCLE: Main container for top glow effect */}
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
            {/* TOP INNER: Bright core circle in center */}
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
                backgroundColor: '#FFDF9E', // Brighter center
              }}
            />

            {/* TOP MIDDLE: Medium glow circle with shadow */}
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
                backgroundColor: '#E4C67F99', // Semi-transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />

            {/* TOP OUTER: Large diffuse glow with extensive shadow radius */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33', // Very transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          {/* BOTTOM CIRCLE: Main container for bottom glow effect */}
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
            {/* BOTTOM INNER: Bright core circle in center */}
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
                backgroundColor: '#FFDF9E', // Brighter center
              }}
            />

            {/* BOTTOM MIDDLE: Medium glow circle with shadow */}
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
                backgroundColor: '#E4C67F99', // Semi-transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />

            {/* BOTTOM OUTER: Large diffuse glow with extensive shadow radius */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33', // Very transparent gold
                shadowColor: '#E4C67F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          {/* BLUR LAYER: Applies blur effect over the entire background */}
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        {/* CONTENT CONTAINER: SafeAreaView for app content */}
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={appStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <JournalHeader 
            onBackPress={() => navigation.goBack()}
            onCalendarPress={() => console.log('Calendar pressed')}
          />
          
          <JournalReflection />

        </ScrollView>
      </SafeAreaView>

      <View>
        <BottomNavBar navigation={navigation} currentScreen="Journal" />
      </View>
    </AppContainer>
  );
};

export default Journal;