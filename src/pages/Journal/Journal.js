import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { appStyles } from '../../styles/styles';
import JournalHeader from '../../components/JournalHeader';
import JournalReflection from './JournalReflection';
import AppContainer from '../../components/AppContainer'; 

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
          
          {/* Pass navigation prop to JournalReflection */}
          <JournalReflection navigation={navigation} />

        </ScrollView>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Journal;