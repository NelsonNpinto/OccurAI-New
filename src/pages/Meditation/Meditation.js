import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import MeditationOptions from './MeditationOptions';
import JournalHeader from '../../components/JournalHeader';
import {appStyles} from '../../styles/styles';
import AppContainer from '../../components/AppContainer';

const Meditation = ({navigation}) => {
  return (
    <AppContainer>
      <SafeAreaView style={[appStyles.safeArea, {backgroundColor: 'transparent'}]}>
        <ScrollView
          style={{flex: 1, backgroundColor: 'transparent'}} 
          contentContainerStyle={appStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <JournalHeader
            title="Meditation"
            date=""
            onBackPress={() => navigation.goBack()}
            onCalendarPress={() => console.log('Calendar pressed')}
          />
          <MeditationOptions navigation={navigation} />
        </ScrollView>
      </SafeAreaView>

     
    </AppContainer>
  );
};

export default Meditation;
