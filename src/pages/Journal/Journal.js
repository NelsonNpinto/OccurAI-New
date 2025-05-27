import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { appStyles } from '../../styles/styles';
import BottomNavBar from '../../components/BottomNavBar';
import JournalHeader from '../../components/JournalHeader';
import JournalReflection from './JournalReflection';
import AppContainer from '../../components/AppContainer'; // Import the shared component

const Journal = ({ navigation }) => {
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

      {/* <View>
        <BottomNavBar navigation={navigation} currentScreen="Journal" />
      </View> */}
    </AppContainer>
  );
};

export default Journal;